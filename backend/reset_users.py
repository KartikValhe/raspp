from app.core.database import SessionLocal
from app.models.models import User, Student, Teacher
from sqlalchemy import delete

db = SessionLocal()
try:
    # Delete problematic users or just all users for a clean start if this is dev
    print("Deleting all existing users for a clean start...")
    db.execute(delete(Student))
    db.execute(delete(Teacher))
    db.execute(delete(User))
    db.commit()
    print("All users deleted.")
finally:
    db.close()
