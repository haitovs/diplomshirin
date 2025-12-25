@echo off
title Shirin Portfolio Builder + Archive
color 0A

echo.
echo  ============================================
echo   📚 SHIRIN PORTFOLIO BUILDER + ARCHIVE
echo  ============================================
echo.

cd /d "%~dp0"

echo  [1/2] Starting Backend API...
cd backend
start "Backend API" cmd /c "npm install && npm start"
cd ..

echo  [2/2] Starting Frontend...
timeout /t 3 /nobreak >nul
start "Frontend" cmd /c "npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo  ============================================
echo   ✅ Applications Starting!
echo  ============================================
echo.
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:3001
echo.
echo   Routes:
echo     /          - Home
echo     /archive   - Diploma Archive
echo     /submit    - Submit Work
echo     /builder   - Portfolio Builder
echo.
echo  ============================================
echo.

start http://localhost:5173

pause
