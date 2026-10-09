#!/bin/bash
# Double-click in Finder to install or update the FRONTEND Slots agent for Claude Code.
cd "$(dirname "$0")" && ./install-frontend-slots-agent.sh
echo
read -n 1 -s -r -p "Press any key to close"
