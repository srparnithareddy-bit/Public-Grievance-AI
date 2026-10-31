@echo off
title Cloudflare Tunnel Launcher
color 0a

echo ========================================================
echo   Launching Cloudflare High-Speed Live Public Tunnel
echo ========================================================
echo.

cd /d "%~dp0"
.\cloudflared.exe tunnel --url http://127.0.0.1:5000

pause
