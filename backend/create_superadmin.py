#!/usr/bin/env python3
"""
create_superadmin.py
====================
Run once to bootstrap the superadmin account.

Usage:
    cd backend
    python create_superadmin.py

The script reads SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD from environment
variables (or .env). If not set, it uses the defaults below.
You can override at runtime:
    SUPERADMIN_EMAIL=boss@raspp.in SUPERADMIN_PASSWORD=S3cur3! python create_superadmin.py
"""

import os
import sys

# Make sure the project root is on the path
sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import SessionLocal
from app.core import security
from app.models import models

# ── defaults (override via env) ──────────────────────────────────────────────
SUPERADMIN_EMAIL    = os.getenv("SUPERADMIN_EMAIL",    "superadmin@raspp.in")
SUPERADMIN_PASSWORD = os.getenv("SUPERADMIN_PASSWORD", "SuperAdmin@RASPP#2025!")


def create_superadmin():
    db = SessionLocal()
    try:
        existing = db.query(models.User).filter(
            models.User.email.ilike(SUPERADMIN_EMAIL)
        ).first()

        if existing:
            if existing.role != "superadmin":
                existing.role = "superadmin"
                existing.is_active = True
                db.commit()
                print(f"✅ Existing user '{SUPERADMIN_EMAIL}' promoted to superadmin.")
            else:
                print(f"ℹ️  Superadmin '{SUPERADMIN_EMAIL}' already exists. No changes made.")
            return

        superadmin = models.User(
            email=SUPERADMIN_EMAIL.strip().lower(),
            hashed_password=security.get_password_hash(SUPERADMIN_PASSWORD),
            role="superadmin",
            is_active=True,
        )
        db.add(superadmin)
        db.commit()
        db.refresh(superadmin)

        print("=" * 60)
        print("✅  Superadmin created successfully!")
        print(f"   Email    : {SUPERADMIN_EMAIL}")
        print(f"   Password : {SUPERADMIN_PASSWORD}")
        print("=" * 60)
        print("⚠️  IMPORTANT:")
        print("   1. Change the password immediately after first login.")
        print("   2. Set SUPERADMIN_SECRET_TOKEN in your .env file.")
        print("   3. Never share the portal URL with anyone.")
        print("=" * 60)

    finally:
        db.close()


if __name__ == "__main__":
    create_superadmin()
