#!/usr/bin/env python3
"""
create_superadmin_api.py
========================
Creates the superadmin account by calling the RUNNING backend API.
The backend must be started first (it handles SSL to TiDB).

Usage:
    cd backend
    python create_superadmin_api.py [--url http://localhost:8000]
"""

import os
import sys
import argparse
import requests

SUPERADMIN_EMAIL    = os.getenv("SUPERADMIN_EMAIL",    "superadmin@raspp.in")
SUPERADMIN_PASSWORD = os.getenv("SUPERADMIN_PASSWORD", "SuperAdmin@RASPP#2025!")
BASE_URL            = os.getenv("BACKEND_URL",          "http://localhost:8000")


def create_superadmin(base_url: str):
    print(f"Creating superadmin via backend at: {base_url}")
    url = f"{base_url}/api/v1/users/"
    payload = {
        "email": SUPERADMIN_EMAIL,
        "password": SUPERADMIN_PASSWORD,
        "role": "superadmin",
    }
    try:
        resp = requests.post(url, json=payload, timeout=15)
        if resp.status_code in (200, 201):
            print("=" * 60)
            print("[OK] Superadmin created successfully!")
            print(f"   Email    : {SUPERADMIN_EMAIL}")
            print(f"   Password : {SUPERADMIN_PASSWORD}")
            print(f"   Portal   : http://localhost:5173/superadmin-portal")
            print("=" * 60)
            print("[!] IMPORTANT: Change the password on first login!")
        elif resp.status_code == 400 and "already exists" in resp.text:
            print(f"[i] User '{SUPERADMIN_EMAIL}' already exists in the database.")
            print("    --> If this user does not have role=superadmin, update it manually.")
        else:
            print(f"[ERROR] Failed: {resp.status_code} -- {resp.text}")
    except requests.exceptions.ConnectionError:
        print(f"[ERROR] Could not connect to backend at {base_url}")
        print("   --> Make sure the backend server is running first.")
        print("   --> Run: start.bat  or  uvicorn app.main:app --reload --port 8000")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default=BASE_URL, help="Backend base URL")
    args = parser.parse_args()
    create_superadmin(args.url)
