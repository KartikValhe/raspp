"""
Root launcher for RASPP Backend.
Allows running `python run.py` from the repository root.
"""
import os
import sys
import subprocess

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
BACKEND_RUN = os.path.join(BACKEND_DIR, "run.py")

if __name__ == "__main__":
    if not os.path.exists(BACKEND_RUN):
        print(f"[ERROR] Could not find backend runner at {BACKEND_RUN}")
        sys.exit(1)
        
    try:
        exit_code = subprocess.call([sys.executable, BACKEND_RUN] + sys.argv[1:], cwd=BACKEND_DIR)
        sys.exit(exit_code)
    except KeyboardInterrupt:
        sys.exit(0)
