from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.api import deps
from app.core.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Student])
def read_students(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    semester: int = None,
    branch_id: int = None,
    section: str = None,
    search: str = None,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve students with optional filtering.
    Optimized with eager loading to prevent N+1 queries.
    """
    # Use joinedload to eagerly load the branch relationship
    query = db.query(models.Student).options(joinedload(models.Student.branch))
    
    if semester:
        query = query.filter(models.Student.current_semester == semester)

    if branch_id:
        query = query.filter(models.Student.branch_id == branch_id)

    if section:
        query = query.filter(models.Student.section == section)
        
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (models.Student.full_name.ilike(search_term)) | 
            (models.Student.student_id.ilike(search_term))
        )
        
    students = query.offset(skip).limit(limit).all()
    return students

@router.get("/me", response_model=schemas.Student)
def read_student_me(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current logged-in student.
    """
    student = db.query(models.Student).options(joinedload(models.Student.branch)).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found for this user")
    return student

@router.get("/next_id", response_model=str)
def get_next_student_id(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get the next available Student ID (e.g. STU026).
    """
    # Find max ID that matches pattern STU%
    last_student = db.query(models.Student)\
        .filter(models.Student.student_id.like("STU%"))\
        .order_by(models.Student.student_id.desc())\
        .first()

    if not last_student:
        return "STU001"
    
    try:
        # Extract number part
        last_id = last_student.student_id
        num_part = int(last_id.replace("STU", ""))
        return f"STU{num_part + 1:03d}"
    except ValueError:
        # Fallback if ID format is weird
        return "STU001"

@router.post("/", response_model=schemas.Student)
def create_student(
    *,
    db: Session = Depends(get_db),
    student_in: schemas.StudentCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new student.
    """
    # 1. Create User if needed
    user_id = student_in.user_id
    if not user_id and student_in.email and student_in.password:
        from app.core.security import get_password_hash
        # Check if user exists
        existing_user = db.query(models.User).filter(models.User.email == student_in.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")
            
        new_user = models.User(
            email=student_in.email,
            hashed_password=get_password_hash(student_in.password),
            role="student"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user_id = new_user.id
    
    if not user_id:
         # Fallback or error if no user_id and no credentials
         # For now, if no credentials, maybe just create student without user? Or error?
         # Assuming user creation is desired.
         pass 

    student = models.Student(
        student_id=student_in.student_id,
        full_name=student_in.full_name,
        current_semester=student_in.current_semester,
        section=student_in.section,
        branch_id=student_in.branch_id,
        user_id=user_id,
        email=student_in.email # Save email to student table too
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

@router.get("/{id}", response_model=schemas.Student)
def read_student(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get student by ID.
    """
    student = db.query(models.Student).filter(models.Student.id == id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{id}", response_model=schemas.Student)
def update_student(
    *,
    db: Session = Depends(get_db),
    id: int,
    student_in: schemas.StudentUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a student.
    """
    student = db.query(models.Student).filter(models.Student.id == id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Update fields
    if student_in.student_id is not None:
        student.student_id = student_in.student_id
    if student_in.full_name is not None:
        student.full_name = student_in.full_name
    if student_in.current_semester is not None:
        student.current_semester = student_in.current_semester
    if student_in.section is not None:
        student.section = student_in.section
    if student_in.branch_id is not None:
        student.branch_id = student_in.branch_id
    if student_in.email is not None:
        student.email = student_in.email
        # Sync to User
        if student.user_id:
            user = db.query(models.User).filter(models.User.id == student.user_id).first()
            if user:
                user.email = student_in.email
    
    db.commit()
    db.refresh(student)
    return student

@router.delete("/{id}")
def delete_student(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a student and their associated records.
    """
    student = db.query(models.Student).filter(models.Student.id == id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Delete associated marks (cascade should handle this, but being explicit)
    db.query(models.Mark).filter(models.Mark.student_id == student.student_id).delete()
    
    # Delete associated attendance
    db.query(models.Attendance).filter(models.Attendance.student_id == student.student_id).delete()
    
    # Delete associated predictions
    db.query(models.Prediction).filter(models.Prediction.student_id == student.student_id).delete()
    
    # Delete the student
    db.delete(student)
    
    # Optional: Also delete associated user account
    if student.user_id:
        user = db.query(models.User).filter(models.User.id == student.user_id).first()
        if user:
            db.delete(user)
    
    db.commit()
    return {"message": "Student deleted successfully"}

