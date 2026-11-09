from datetime import timedelta
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core import security
from app.core.config import settings
from app.core.database import get_db
from app.core.redis import redis_cache
from app.models import models
from app.schemas import schemas

router = APIRouter()

# Demo credentials dictionary for zero-latency instant bypass
DEMO_CREDENTIALS = {
    "student@example.com": {
        "password": "student123",
        "role": "student",
        "full_name": "Demo Student",
        "user_id": 9991,
    },
    "teacher@example.com": {
        "password": "teacher123",
        "role": "teacher",
        "full_name": "Demo Faculty",
        "user_id": 9992,
    },
    "coordinator@example.com": {
        "password": "coordinator123",
        "role": "placement_coordinator",
        "full_name": "Demo Placement Coordinator",
        "user_id": 9993,
    },
    "admin@example.com": {
        "password": "admin123",
        "role": "admin",
        "full_name": "Demo Administrator",
        "user_id": 9994,
    },
}

@router.post("/login", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login — returns access token, role, and email.
    Full user data is included in the response so the frontend does not need
    a separate /users/me call before navigating (eliminates one round-trip).
    """
    clean_email = form_data.username.strip().lower()

    # Fast-path bypass for demo accounts: no DB query, no bcrypt hashing overhead (<1ms)
    if clean_email in DEMO_CREDENTIALS and form_data.password == DEMO_CREDENTIALS[clean_email]["password"]:
        demo_info = DEMO_CREDENTIALS[clean_email]
        access_token_expires = timedelta(days=30)
        token = security.create_access_token(
            data={"sub": clean_email, "role": demo_info["role"], "can_modify": False, "is_demo": True},
            expires_delta=access_token_expires
        )
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": demo_info["role"],
            "email": clean_email,
            "full_name": demo_info["full_name"],
            "can_modify": False,
        }

    # Fast index lookup first (O(1)), with case-insensitive fallback if needed
    user = db.query(models.User).filter(models.User.email == clean_email).first()
    if not user:
        user = db.query(models.User).filter(models.User.email.ilike(clean_email)).first()

    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # Only query student/teacher profile based on role to avoid unnecessary remote DB roundtrips
    full_name = None
    if user.role == "student" and hasattr(user, 'student_profile') and user.student_profile:
        full_name = user.student_profile.full_name
    elif user.role == "teacher" and hasattr(user, 'teacher_profile') and user.teacher_profile:
        full_name = user.teacher_profile.full_name

    can_modify = bool(getattr(user, 'can_modify', True) if getattr(user, 'can_modify', None) is not None else True)

    # Cache user for zero-latency subsequent API authorizations
    redis_cache.set(f"auth:user:{user.email}", {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
        "can_modify": can_modify,
    }, ttl=600)

    return {
        "access_token": security.create_access_token(
            data={"sub": user.email, "role": user.role, "can_modify": can_modify},
            expires_delta=access_token_expires
        ),
        "token_type": "bearer",
        "role": user.role,
        "email": user.email,
        "full_name": full_name,
        "can_modify": can_modify,
    }

@router.get("/branches", response_model=List[schemas.Branch])
def read_public_branches(db: Session = Depends(get_db)) -> Any:
    """
    Public branches list for registration dropdown.
    """
    branches = db.query(models.Branch).all()
    return [{"id": b.id, "name": b.name, "code": b.code} for b in branches]

@router.post("/register-student", response_model=schemas.Student)
def register_student(
    *,
    db: Session = Depends(get_db),
    student_in: schemas.StudentCreate,
) -> Any:
    """
    Public student self-registration endpoint.
    Creates User and Student profile.
    """
    clean_email = student_in.email.strip().lower() if student_in.email else None
    if not clean_email or not student_in.password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    existing_user = db.query(models.User).filter(models.User.email.ilike(clean_email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Check student_id uniqueness
    clean_student_id = student_in.student_id.strip()
    existing_student = db.query(models.Student).filter(models.Student.student_id == clean_student_id).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Student with this ID already exists")

    # Create User
    new_user = models.User(
        email=clean_email,
        hashed_password=security.get_password_hash(student_in.password),
        role="student",
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create Student
    student = models.Student(
        student_id=clean_student_id,
        full_name=student_in.full_name.strip(),
        current_semester=student_in.current_semester,
        section=student_in.section or "A",
        branch_id=student_in.branch_id,
        user_id=new_user.id,
        email=clean_email
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

