@echo off
echo ========================================
echo FPsOS Website - Quick Start
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install

echo.
echo [2/3] Starting development server...
echo.
echo Your website will open at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

start http://localhost:3000

call npm run dev

pause
