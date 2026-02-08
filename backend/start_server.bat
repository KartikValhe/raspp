@echo off
echo Starting RASPP Backend Server...
set PYTHON_CMD=""

echo Searching for Anaconda Python...

if exist "C:\ProgramData\Anaconda3\python.exe" (
    set PYTHON_CMD="C:\ProgramData\Anaconda3\python.exe"
    goto :FOUND
)

if exist "%USERPROFILE%\anaconda3\python.exe" (
    set PYTHON_CMD="%USERPROFILE%\anaconda3\python.exe"
    goto :FOUND
)

if exist "%LOCALAPPDATA%\anaconda3\python.exe" (
    set PYTHON_CMD="%LOCALAPPDATA%\anaconda3\python.exe"
    goto :FOUND
)

if exist "%USERPROFILE%\AppData\Local\Continuum\anaconda3\python.exe" (
    set PYTHON_CMD="%USERPROFILE%\AppData\Local\Continuum\anaconda3\python.exe"
    goto :FOUND
)

echo Anaconda not found in standard locations. Checking PATH...
where python >nul 2>&1
if %errorlevel% equ 0 (
    echo Python found in PATH.
    set PYTHON_CMD=python
    goto :FOUND
)

echo.
echo [ERROR] Python not found. Please ensure Python is installed and in your PATH.
pause
exit /b

:FOUND
echo Using Python at: %PYTHON_CMD%
echo Starting Uvicorn Server...
%PYTHON_CMD% -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
