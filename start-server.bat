@echo off
title Public Grievance AI Assistant - Full-Stack Production Server
color 0b

echo ========================================================
echo   Public Grievance AI Assistant (Problem ID: HACK-P438)
echo ========================================================
echo.
echo Starting unified full-stack server on port 5000...
echo Both React Frontend and Express Backend will be served!
echo.

cd /d "%~dp0"
node backend/server.js

pause
