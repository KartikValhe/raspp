from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import models
from app.core import security

def debug_user(email: str):
    db: Session = SessionLocal()
    try:
        print(f"--- Debugging User: {email} ---")
        
        # 1. Search by ILIKE to see all variants
        users = db.query(models.User).filter(models.User.email.ilike(email)).all()
        print(f"Found {len(users)} users matching '{email}' (case-insensitive):")
        
        for u in users:
            print(f"\n[User ID: {u.id}]")
            print(f"  Email (Raw): '{u.email}'")
            print(f"  Role: {u.role}")
            print(f"  Active: {u.is_active}")
            
            # Check password
            is_valid = security.verify_password("password123", u.hashed_password)
            print(f"  Password 'password123' valid? {is_valid}")
            
    finally:
        db.close()

if __name__ == "__main__":
    debug_user("kartik.valhe@gmail.com")
