import sys
import os

# Add the current directory to sys.path to make imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.models import User
from app.core.security import get_password_hash

def create_placement_coordinator():
    db = SessionLocal()
    try:
        user_email = "coordinator@example.com"
        password = "coordinator123"
        hashed_password = get_password_hash(password)

        # Check if user exists
        existing_user = db.query(User).filter(User.email == user_email).first()
        
        if existing_user:
            print(f"User {user_email} already exists. Updating password...")
            existing_user.hashed_password = hashed_password
            existing_user.role = "placement_coordinator"
            existing_user.is_active = True
            db.commit()
            print("Password updated successfully!")
        else:
            print(f"Creating new user {user_email}...")
            coordinator = User(
                email=user_email,
                hashed_password=hashed_password,
                role="placement_coordinator",
                is_active=True
            )
            db.add(coordinator)
            db.commit()
            db.refresh(coordinator)
            print("User created successfully!")
        
        print(f"Email: {user_email}")
        print(f"Password: {password}")
        
    except Exception as e:
        print(f"Error creating placement coordinator: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_placement_coordinator()
