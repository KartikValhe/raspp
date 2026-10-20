import os
import sys
import subprocess

# Ensure the backend root directory is in sys.path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Auto-detect local project virtualenv
VENV_PYTHON_WIN = os.path.join(BACKEND_DIR, "venv", "Scripts", "python.exe")
VENV_PYTHON_NIX = os.path.join(BACKEND_DIR, "venv", "bin", "python")
VENV_PYTHON = VENV_PYTHON_WIN if os.path.exists(VENV_PYTHON_WIN) else (VENV_PYTHON_NIX if os.path.exists(VENV_PYTHON_NIX) else None)

# If invoked with an external Python (e.g. conda base or global python) and venv exists,
# transparently re-launch using the project's virtualenv interpreter
if VENV_PYTHON and os.path.abspath(sys.executable).lower() != os.path.abspath(VENV_PYTHON).lower():
    print(f"[*] Detected virtual environment. Launching backend with: {VENV_PYTHON}")
    try:
        exit_code = subprocess.call([VENV_PYTHON, os.path.abspath(__file__)] + sys.argv[1:], cwd=BACKEND_DIR)
        sys.exit(exit_code)
    except KeyboardInterrupt:
        sys.exit(0)

# Import uvicorn inside the environment where dependencies are installed
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    
    # Enable reload by default in local development unless specified otherwise
    reload = os.environ.get("RELOAD", "true").lower() in ("true", "1", "yes")
    if "--no-reload" in sys.argv:
        reload = False
    elif "--reload" in sys.argv:
        reload = True

    print(f"[*] Starting RASPP Backend at http://{host}:{port} (reload={reload})...")
    uvicorn.run("app.main:app", host=host, port=port, reload=reload)
