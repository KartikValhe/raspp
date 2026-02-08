from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import models
from app.core.security import get_password_hash
from app.models.models import User, Student, Teacher, Branch

def create_test_users():
    db = SessionLocal()
    try:
        print("--- Creating Test Users ---")

        # 1. Ensure Branch Exists
        branch = db.query(Branch).filter(Branch.name == "Computer Science").first()
        if not branch:
            print("Creating 'Computer Science' branch...")
            branch = Branch(name="Computer Science", code="CSE")
            db.add(branch)
            db.commit()
            db.refresh(branch)
        else:
            print(f"Branch 'Computer Science' already exists (ID: {branch.id}).")

        # Helper to create user
        def create_user_if_not_exists(email, password, role, name, student_id=None):
            user = db.query(User).filter(User.email == email).first()
            if not user:
                print(f"Creating user: {email} ({role})")
                user = User(
                    email=email,
                    hashed_password=get_password_hash(password),
                    role=role,
                    is_active=True
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                
                if role == "student":
                    student = Student(
                        user_id=user.id,
                        student_id=student_id,
                        full_name=name,
                        current_semester=5,
                        branch_id=branch.id,
                        section="A",
                        email=email
                    )
                    db.add(student)
                elif role == "teacher":
                    teacher = Teacher(
                        user_id=user.id,
                        full_name=name,
                        department="CSE",
                        branch_id=branch.id,
                        email=email
                    )
                    db.add(teacher)
                
                db.commit()
                print(f"User {email} created successfully.")
            else:
                print(f"User {email} already exists. Updating password...")
                user.hashed_password = get_password_hash(password)
                db.commit()
                print(f"Password updated for {email}.")

        # 2. Create Admin
        create_user_if_not_exists("admin@test.com", "admin123", "admin", "Admin User")

        # 3. Create Teacher
        create_user_if_not_exists("teacher@test.com", "teacher123", "teacher", "Test Teacher")

        # 4. Create Student
        create_user_if_not_exists("student@test.com", "student123", "student", "Test Student", student_id="CSE21001")

    except Exception as e:
        print(f"Error creating users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_test_users()
