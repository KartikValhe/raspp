from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.core.database import get_db
from app.core import security
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Teacher])
def read_teachers(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve teachers with branch information.
    """
    teachers = db.query(models.Teacher).offset(skip).limit(limit).all()
    return teachers

@router.get("/me", response_model=schemas.Teacher)
def read_teacher_me(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current teacher's profile.
    """
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Eager load branch to ensure it's available
    from sqlalchemy.orm import joinedload
    teacher = db.query(models.Teacher).options(joinedload(models.Teacher.branch)).filter(models.Teacher.user_id == current_user.id).first()
    
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher profile not found")
    
    # Calculate Stats
    stats = {
        "students_count": 0,
        "average_score": 0.0,
        "subjects_count": 0
    }

    if teacher.branch_id:
        # 1. Count students in branch
        student_count = db.query(models.Student).filter(models.Student.branch_id == teacher.branch_id).count()
        stats["students_count"] = student_count

        # 2. Avg score (using Marks table)
        from sqlalchemy import func
        avg_score = db.query(func.avg(models.Mark.marks_obtained)).join(models.Student).filter(
            models.Student.branch_id == teacher.branch_id
        ).scalar()
        
        if avg_score:
             stats["average_score"] = round(avg_score, 1)

    # 3. Subjects assigned count
    assignment_count = db.query(models.TeacherSubjectAssignment).filter(
        models.TeacherSubjectAssignment.teacher_id == teacher.id
    ).count()
    stats["subjects_count"] = assignment_count

    # Construct response dictionary manually to avoid lazy loading issues
    teacher_data = {
        "id": teacher.id,
        "full_name": teacher.full_name,
        "department": teacher.department,
        "branch_id": teacher.branch_id,
        "email": current_user.email, # Explicitly use user email
        "branch": teacher.branch, # SQLAlchemy model, Pydantic should handle if loaded
        "stats": stats
    }
    
    print(f"DEBUG: Returning Teacher Data: {teacher_data}")
    return teacher_data

@router.post("/", response_model=schemas.Teacher)
def create_teacher(
    *,
    db: Session = Depends(get_db),
    teacher_in: schemas.TeacherCreate,
    current_user: models.User = Depends(deps.get_current_admin),
) -> Any:
    """
    Create new teacher (Admin only).
    """
    # Check if user with email already exists
    existing_user = db.query(models.User).filter(models.User.email == teacher_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = models.User(
        email=teacher_in.email,
        hashed_password=security.get_password_hash(teacher_in.password),
        role="teacher",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    teacher = models.Teacher(
        full_name=teacher_in.full_name,
        department=teacher_in.department,
        branch_id=teacher_in.branch_id,
        user_id=user.id
    )
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    
    return teacher

@router.put("/{teacher_id}", response_model=schemas.Teacher)
def update_teacher(
    *,
    db: Session = Depends(get_db),
    teacher_id: int,
    teacher_in: schemas.TeacherBase,
    current_user: models.User = Depends(deps.get_current_admin),
) -> Any:
    """
    Update teacher information (Admin only).
    """
    teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    teacher.full_name = teacher_in.full_name
    teacher.department = teacher_in.department
    teacher.branch_id = teacher_in.branch_id
    
    db.commit()
    db.refresh(teacher)
    return teacher

@router.put("/me/password")
def update_password(
    *,
    db: Session = Depends(get_db),
    current_password: str,
    new_password: str,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update teacher's own password.
    """
    if not security.verify_password(current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    current_user.hashed_password = security.get_password_hash(new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}
