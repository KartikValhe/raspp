Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " RASPP - Result Analysis & Student Performance Predictor" -ForegroundColor Cyan
Write-Host "=====================================================================`n"

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $rootDir

# 1. Backend venv and dependencies
if (-not (Test-Path "$rootDir\backend\venv")) {
    Write-Host "[*] Creating Python virtual environment in backend\venv..." -ForegroundColor Yellow
    python -m venv "$rootDir\backend\venv"
}

Write-Host "[*] Activating virtual environment & installing backend dependencies..." -ForegroundColor Yellow
& "$rootDir\backend\venv\Scripts\pip.exe" install -r "$rootDir\backend\requirements.txt" --quiet

# 2. Frontend dependencies
if (-not (Test-Path "$rootDir\frontend\node_modules")) {
    Write-Host "[*] Installing frontend npm packages..." -ForegroundColor Yellow
    Set-Location "$rootDir\frontend"
    npm install --silent
    Set-Location $rootDir
}

Write-Host "`n[*] Starting Backend (http://127.0.0.1:8000) and Frontend (http://127.0.0.1:5173)...`n" -ForegroundColor Green

# Launch Backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend'; .\venv\Scripts\Activate.ps1; python run.py"

# Launch Frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\frontend'; npm run dev"

Write-Host "[*] RASPP is starting!" -ForegroundColor Green
Write-Host "[*] API: http://127.0.0.1:8000 (Swagger docs: http://127.0.0.1:8000/docs)" -ForegroundColor Cyan
Write-Host "[*] Web: http://127.0.0.1:5173`n" -ForegroundColor Cyan
