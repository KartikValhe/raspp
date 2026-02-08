from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import models
from app.core import security

def debug_user(email: str):
    db: Session = SessionLocal()
    try:
        print(f"--- Debugging User: {email} ---")
        
        # 1. Exact Match
        user = db.query(models.User).filter(models.User.email == email).first()
        if user:
            print(f"Found EXACT match for '{email}'")
        else:
            print(f"No EXACT match for '{email}'")
            
            # 2. Case-insensitive Search
            print("Searching case-insensitive...")
            users = db.query(models.User).filter(models.User.email.ilike(email)).all()
            if users:
                print(f"Found {len(users)} Case-insensitive matches:")
                for u in users:
                    print(f" - ID: {u.id}, Email: '{u.email}', Role: {u.role}, Active: {u.is_active}")
                    user = u # Pick the first one for password check
            else:
                print("No user found even with case-insensitive search.")
                return

        # 3. Check Password
        print(f"\nChecking password for user ID {user.id} ({user.email})...")
        test_pass = "password123"
        is_valid = security.verify_password(test_pass, user.hashed_password)
        print(f"Password '{test_pass}' valid? {is_valid}")
        
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    email = sys.argv[1] if len(sys.argv) > 1 else "admin@test.com"
    debug_user(email)
