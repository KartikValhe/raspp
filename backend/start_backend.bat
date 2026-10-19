@echo off
echo Starting RASPP Backend...

cd /d "%~dp0"

if exist "venv\Scripts\python.exe" (
    echo Using project venv Python...
    "venv\Scripts\python.exe" run.py
    pause
    exit /b
)

where python >nul 2>&1
if %errorlevel% equ 0 (
    echo Using system Python...
    python run.py
    pause
    exit /b
)

echo [ERROR] Python environment not found. Please ensure venv exists or Python is in PATH.
pause

