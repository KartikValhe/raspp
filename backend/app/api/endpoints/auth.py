from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core import security
from app.core.config import settings
from app.core.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.post("/login", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    # Use ilike for case-insensitive comparison and strip whitespace
    clean_email = form_data.username.strip()
    user = db.query(models.User).filter(models.User.email.ilike(clean_email)).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.get("/branches", response_model=Any)
def read_public_branches(db: Session = Depends(get_db)) -> Any:
    """
    Public branches list for registration dropdown.
    """
    return db.query(models.Branch).all()

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

