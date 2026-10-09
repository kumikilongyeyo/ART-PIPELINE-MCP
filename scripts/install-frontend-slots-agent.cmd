@echo off
rem Double-click to install or update the FRONTEND Slots agent for Claude Code on Windows.
rem Runs install-frontend-slots-agent.ps1 next to this file without changing your PowerShell policy.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-frontend-slots-agent.ps1" %*
echo.
pause
