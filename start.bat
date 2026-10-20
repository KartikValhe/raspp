@echo off
setlocal enabledelayedexpansion

echo =====================================================================
echo  RASPP - Result Analysis ^& Student Performance Predictor
echo =====================================================================
echo.

cd /d "%~dp0"

:: 1. Backend venv and dependencies
if not exist "backend\venv" (
    echo [*] Creating Python virtual environment in backend\venv...
    python -m venv backend\venv
)

echo [*] Activating virtual environment...
call backend\venv\Scripts\activate.bat

echo [*] Installing backend dependencies...
pip install -r backend\requirements.txt --quiet

:: 2. Frontend dependencies
if not exist "frontend\node_modules" (
    echo [*] Installing frontend npm packages...
    cd frontend && call npm install --silent && cd ..
)

echo.
echo =====================================================================
echo  Starting Backend (http://127.0.0.1:8000) and Frontend (http://127.0.0.1:5173)...
echo =====================================================================
echo.

:: Launch Backend in separate window
start "RASPP Backend API" cmd /k "cd /d "%~dp0backend" && call venv\Scripts\activate.bat && python run.py"

:: Launch Frontend in separate window
start "RASPP Frontend UI" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo [*] RASPP is starting!
echo [*] API:  http://127.0.0.1:8000 (Swagger docs: http://127.0.0.1:8000/docs)
echo [*] Web:  http://127.0.0.1:5173
echo.
pause
