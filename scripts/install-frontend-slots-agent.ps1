# Install or update the FRONTEND Slots agent for Claude Code (Windows).
#
# One line in PowerShell, no clone needed (run it again any time to update):
#   irm https://raw.githubusercontent.com/kumikilongyeyo/ART-PIPELINE-MCP/main/scripts/install-frontend-slots-agent.ps1 | iex
#
# Or double-click scripts\install-frontend-slots-agent.cmd in a clone of this repo
# (it pulls the latest commit first, then installs).
#
# Options (when running the .ps1 directly):
#   -Local       install from this clone as-is (no git pull, no download)
#   -Uninstall   remove the installed agent and its docs
# Uninstall from the one-liner:
#   & ([scriptblock]::Create((irm https://raw.githubusercontent.com/kumikilongyeyo/ART-PIPELINE-MCP/main/scripts/install-frontend-slots-agent.ps1))) -Uninstall
#
# What it writes (user-level, so the agent shows in EVERY project):
#   %USERPROFILE%\.claude\agents\frontend-slots-agent.md
#   %USERPROFILE%\.claude\agent-docs\frontend-slots-agent\   (playbooks the agent reads)
# The agent's playbook links are rewritten to that docs folder, so they
# resolve no matter which project Claude Code is opened in.
param(
    [switch]$Local,
    [switch]$Uninstall
)
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'   # Invoke-WebRequest is very slow with the progress bar on PS 5.1
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

$Repo = 'kumikilongyeyo/ART-PIPELINE-MCP'
$Branch = 'main'
$Name = 'frontend-slots-agent'
$ClaudeDir = if ($env:CLAUDE_CONFIG_DIR) { $env:CLAUDE_CONFIG_DIR } else { Join-Path $HOME '.claude' }
$AgentDest = Join-Path $ClaudeDir "agents\$Name.md"
$DocsDest = Join-Path $ClaudeDir "agent-docs\$Name"

if ($Uninstall) {
    Remove-Item -LiteralPath $AgentDest -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $DocsDest -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Removed $Name. Restart Claude Code to drop it from the agent list."
    return
}

# Find a source: this clone when the script runs from one, otherwise GitHub.
$src = $null
$scriptPath = $MyInvocation.MyCommand.Path
if ($scriptPath) {
    $repoRoot = Split-Path -Parent (Split-Path -Parent $scriptPath)
    if (Test-Path -LiteralPath (Join-Path $repoRoot ".claude\agents\$Name.md")) {
        $src = $repoRoot
        if (-not $Local -and (Test-Path -LiteralPath (Join-Path $repoRoot '.git')) -and (Get-Command git -ErrorAction SilentlyContinue)) {
            Write-Host "Updating clone at $repoRoot ..."
            # 'Continue' so git's stderr chatter can't abort the script on Windows PowerShell 5.1.
            $ErrorActionPreference = 'Continue'
            git -C $repoRoot pull --ff-only --quiet 2>&1 | Out-Host
            $ErrorActionPreference = 'Stop'
            if ($LASTEXITCODE -ne 0) { Write-Host '  git pull failed (local changes?). Installing the clone as it is.' }
        }
    }
}

$tmp = $null
try {
    if (-not $src) {
        if ($Local) { throw "-Local needs a clone of $Repo" }
        $tmp = Join-Path ([IO.Path]::GetTempPath()) ("$Name-" + [Guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tmp | Out-Null
        $zip = Join-Path $tmp 'repo.zip'
        Write-Host "Downloading latest $Repo ($Branch) ..."
        Invoke-WebRequest -UseBasicParsing -Uri "https://github.com/$Repo/archive/refs/heads/$Branch.zip" -OutFile $zip
        Expand-Archive -LiteralPath $zip -DestinationPath $tmp -Force
        $src = (Get-ChildItem -LiteralPath $tmp -Directory | Select-Object -First 1).FullName
    }

    $agentSrc = Join-Path $src ".claude\agents\$Name.md"
    $docsSrc = Join-Path $src "docs\agents\$Name"
    if (-not (Test-Path -LiteralPath $agentSrc)) { throw "Agent file missing in $src" }
    if (-not (Test-Path -LiteralPath $docsSrc)) { throw "Agent docs missing in $src" }

    $version = 'unknown'
    if ((Test-Path -LiteralPath (Join-Path $src '.git')) -and (Get-Command git -ErrorAction SilentlyContinue)) {
        $ErrorActionPreference = 'Continue'
        $v = git -C $src rev-parse --short HEAD 2>$null
        $ErrorActionPreference = 'Stop'
        if ($LASTEXITCODE -eq 0 -and $v) { $version = $v }
    } else {
        try { $version = (Invoke-RestMethod -UseBasicParsing "https://api.github.com/repos/$Repo/commits/$Branch").sha.Substring(0, 7) } catch { }
    }

    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $AgentDest) | Out-Null
    Remove-Item -LiteralPath $DocsDest -Recurse -Force -ErrorAction SilentlyContinue
    New-Item -ItemType Directory -Force -Path $DocsDest | Out-Null
    Copy-Item -Path (Join-Path $docsSrc '*') -Destination $DocsDest -Recurse -Force

    # UTF-8 without BOM: a BOM in front of the --- frontmatter stops Claude Code reading the agent.
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [IO.File]::WriteAllText((Join-Path $DocsDest 'VERSION'), "$version`n", $utf8)

    # Point the playbook links at the installed docs (absolute, forward slashes, so they work anywhere).
    $docsForLinks = ($DocsDest -replace '\\', '/') + '/'
    $text = [IO.File]::ReadAllText($agentSrc, $utf8)
    $text = $text.Replace("docs/agents/$Name/", $docsForLinks)
    [IO.File]::WriteAllText($AgentDest, $text, $utf8)
}
finally {
    if ($tmp) { Remove-Item -LiteralPath $tmp -Recurse -Force -ErrorAction SilentlyContinue }
}

Write-Host ''
Write-Host "Installed $Name ($version)"
Write-Host "  agent: $AgentDest"
Write-Host "  docs:  $DocsDest"
Write-Host ''
Write-Host 'Start a NEW Claude Code session (agents load at startup), then ask:'
Write-Host "  `"use the frontend-slots-agent to ...`"   or type  @agent-$Name"
Write-Host 'Run this script again any time to update.'
