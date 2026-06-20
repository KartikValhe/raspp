from app.core.database import SessionLocal
from app.models.models import User

db = SessionLocal()
try:
    users = db.query(User).all()
    print("--- User List ---")
    for u in users:
        print(f"Email: {u.email} | Role: {u.role} | Active: {u.is_active}")
finally:
    db.close()
