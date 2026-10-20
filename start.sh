#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

echo "====================================================================="
echo " RASPP - Result Analysis & Student Performance Predictor"
echo "====================================================================="
echo ""

# 1. Backend venv and dependencies
if [ ! -d "backend/venv" ]; then
    echo "[*] Creating Python virtual environment in backend/venv..."
    python3 -m venv backend/venv
fi

echo "[*] Activating virtual environment & installing backend dependencies..."
source backend/venv/bin/activate
pip install -r backend/requirements.txt --quiet

# 2. Frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "[*] Installing frontend npm packages..."
    (cd frontend && npm install --silent)
fi

echo ""
echo "[*] Starting Backend (http://127.0.0.1:8000) and Frontend (http://127.0.0.1:5173)..."
echo ""

# Trap to kill background jobs on CTRL+C
trap 'kill $(jobs -p) 2>/dev/null' EXIT

(cd backend && source venv/bin/activate && python run.py) &
(cd frontend && npm run dev) &

wait
