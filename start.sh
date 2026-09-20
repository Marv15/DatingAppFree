#!/bin/bash
echo "============================================================="
echo "       Dating App Free - Local Offline PWA Launcher"
echo "============================================================="
echo ""

if command -v node >/dev/null 2>&1; then
    echo "[OK] Node.js detected. Launching local server..."
    node server.js
    exit 0
fi

if command -v python3 >/dev/null 2>&1; then
    echo "[Notice] Node.js not found, falling back to Python 3 HTTP server..."
    open "http://localhost:8080" 2>/dev/null || xdg-open "http://localhost:8080" 2>/dev/null &
    python3 -m http.server 8080
    exit 0
fi

echo "[ERROR] Neither Node.js nor Python 3 was found on your system."
echo "Please install Node.js (https://nodejs.org) or Python 3 to run this local app."
