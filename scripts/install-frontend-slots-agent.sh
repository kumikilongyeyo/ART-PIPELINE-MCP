#!/usr/bin/env bash
# Install or update the FRONTEND Slots agent for Claude Code (macOS / Linux).
#
# One line, no clone needed (run it again any time to update):
#   curl -fsSL https://raw.githubusercontent.com/kumikilongyeyo/ART-PIPELINE-MCP/main/scripts/install-frontend-slots-agent.sh | bash
#
# From a clone of this repo it pulls the latest commit first, then installs:
#   ./scripts/install-frontend-slots-agent.sh
#
# Options:
#   --local       install from this clone as-is (no git pull, no download)
#   --uninstall   remove the installed agent and its docs
#
# What it writes (user-level, so the agent shows in EVERY project):
#   ~/.claude/agents/frontend-slots-agent.md
#   ~/.claude/agent-docs/frontend-slots-agent/   (playbooks the agent reads)
# The agent's playbook links are rewritten to that docs folder, so they
# resolve no matter which project Claude Code is opened in.
set -euo pipefail

REPO="kumikilongyeyo/ART-PIPELINE-MCP"
BRANCH="main"
NAME="frontend-slots-agent"
CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
AGENT_DEST="$CLAUDE_DIR/agents/$NAME.md"
DOCS_DEST="$CLAUDE_DIR/agent-docs/$NAME"

mode="auto"
for arg in "$@"; do
  case "$arg" in
    --local) mode="local" ;;
    --uninstall) mode="uninstall" ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

if [ "$mode" = "uninstall" ]; then
  rm -f "$AGENT_DEST"
  rm -rf "$DOCS_DEST"
  echo "Removed $NAME. Restart Claude Code to drop it from the agent list."
  exit 0
fi

# Find a source: this clone when the script runs from one, otherwise GitHub.
src=""
script_path="${BASH_SOURCE[0]:-}"
if [ -n "$script_path" ] && [ -f "$script_path" ]; then
  repo_root="$(cd "$(dirname "$script_path")/.." && pwd)"
  if [ -f "$repo_root/.claude/agents/$NAME.md" ]; then
    src="$repo_root"
    if [ "$mode" != "local" ] && [ -d "$repo_root/.git" ] && command -v git >/dev/null; then
      echo "Updating clone at $repo_root ..."
      git -C "$repo_root" pull --ff-only --quiet \
        || echo "  git pull failed (local changes?). Installing the clone as it is."
    fi
  fi
fi

tmp=""
cleanup() { [ -n "$tmp" ] && rm -rf "$tmp"; }
trap cleanup EXIT

if [ -z "$src" ]; then
  [ "$mode" = "local" ] && { echo "--local needs a clone of $REPO" >&2; exit 1; }
  tmp="$(mktemp -d)"
  echo "Downloading latest $REPO ($BRANCH) ..."
  curl -fsSL "https://github.com/$REPO/archive/refs/heads/$BRANCH.tar.gz" | tar -xz -C "$tmp"
  src="$(find "$tmp" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
fi

[ -f "$src/.claude/agents/$NAME.md" ] || { echo "Agent file missing in $src" >&2; exit 1; }
[ -d "$src/docs/agents/$NAME" ] || { echo "Agent docs missing in $src" >&2; exit 1; }

version="unknown"
if [ -d "$src/.git" ] && command -v git >/dev/null; then
  version="$(git -C "$src" rev-parse --short HEAD 2>/dev/null || echo unknown)"
else
  version="$(curl -fsSL "https://api.github.com/repos/$REPO/commits/$BRANCH" 2>/dev/null \
    | sed -n 's/^  "sha": "\([0-9a-f]\{7\}\).*/\1/p' | head -n 1)"
  [ -n "$version" ] || version="unknown"
fi

mkdir -p "$CLAUDE_DIR/agents"
rm -rf "$DOCS_DEST"
mkdir -p "$DOCS_DEST"
cp -R "$src/docs/agents/$NAME/." "$DOCS_DEST/"
printf '%s\n' "$version" > "$DOCS_DEST/VERSION"

# Point the playbook links at the installed docs (absolute, so they work anywhere).
sed "s#docs/agents/$NAME/#$DOCS_DEST/#g" "$src/.claude/agents/$NAME.md" > "$AGENT_DEST.tmp"
mv "$AGENT_DEST.tmp" "$AGENT_DEST"

echo
echo "Installed $NAME ($version)"
echo "  agent: $AGENT_DEST"
echo "  docs:  $DOCS_DEST"
echo
echo "Start a NEW Claude Code session (agents load at startup), then ask:"
echo "  \"use the frontend-slots-agent to ...\"   or type  @agent-$NAME"
echo "Run this script again any time to update."
