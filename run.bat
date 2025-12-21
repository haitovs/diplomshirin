@echo off
echo ======================================
echo    Portfolio Builder - Starting...
echo ======================================
echo.

cd /d "%~dp0"

echo Installing dependencies if needed...
@REM call npm install

echo.
echo Starting development server...
echo.
echo Once started, open your browser to:
echo    http://localhost:5173
echo.
echo Press Ctrl+C to stop the server.
echo ======================================
echo.

npm run dev
