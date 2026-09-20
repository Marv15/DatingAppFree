@echo off
title Dating App Free Local Server
cls
echo =============================================================
echo        Dating App Free - Local Offline PWA Launcher
echo =============================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js detected. Launching local server...
    node server.js
    goto end
)

:: Fallback to Python if Node is not found
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [Notice] Node.js not found, falling back to Python HTTP server...
    echo.
    echo Open on this computer:  http://localhost:8080
    echo Check your local IP with ipconfig for your iPhone!
    start http://localhost:8080
    python -m http.server 8080
    goto end
)

echo [ERROR] Neither Node.js nor Python was found on your PC.
echo Please install Node.js from https://nodejs.org or Python to run this local app.
pause

:end
