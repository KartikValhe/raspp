from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import models
from app.core import security
import sys

def verify_login(email, password):
    db: Session = SessionLocal()
    try:
        print(f"--- Verifying Login for: {email} ---")
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            print("User not found.")
            return

        print(f"User found. ID: {user.id}, Role: {user.role}, Active: {user.is_active}")
        print(f"Stored Hash (prefix): {user.hashed_password[:20]}...")
        
        is_valid = security.verify_password(password, user.hashed_password)
        print(f"Checking password '{password}': {'VALID' if is_valid else 'INVALID'}")
        
        if not is_valid:
            print("Attempting to re-hash and compare manually to see if context changed...")
            new_hash = security.get_password_hash(password)
            print(f"New Hash (prefix): {new_hash[:20]}...")
            print("Note: Hashes will be different due to salt, but verify should work if schemes match.")
            
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python verify_login.py <email> <password>")
    else:
        verify_login(sys.argv[1], sys.argv[2])
