from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models import models
from app.schemas import schemas
from app.api import deps

router = APIRouter()

@router.post("/bulk", response_model=List[schemas.Mark])
def create_bulk_marks(
    marks: List[schemas.MarkCreate],
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Create or update multiple marks at once.
    """
    saved_marks = []
    
    # Check permissions - only teachers and admins can enter marks
    if current_user.role not in ["teacher", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to enter marks"
        )

    for mark_data in marks:
        # Check if mark already exists
        query = db.query(models.Mark).filter(
            models.Mark.student_id == mark_data.student_id,
            models.Mark.exam_type == mark_data.exam_type
        )
        
        # Check by subject_id (preferred) or subject (legacy)
        if mark_data.subject_id:
             query = query.filter(models.Mark.subject_id == mark_data.subject_id)
        elif mark_data.subject:
             query = query.filter(models.Mark.subject == mark_data.subject)
             
        # Also match semester if provided
        if mark_data.semester:
             query = query.filter(models.Mark.semester == mark_data.semester)
             
        existing_mark = query.first()
        
        if existing_mark:
            # Update existing mark
            existing_mark.marks_obtained = mark_data.marks_obtained
            existing_mark.updated_at = datetime.utcnow()
            
            # Update other fields if provided
            if mark_data.subject_id:
                existing_mark.subject_id = mark_data.subject_id
            if mark_data.semester:
                existing_mark.semester = mark_data.semester
            if mark_data.academic_year:
                existing_mark.academic_year = mark_data.academic_year
                
            saved_marks.append(existing_mark)
        else:
            # Create new mark
            new_mark = models.Mark(**mark_data.model_dump())
            # Ensure teacher_id is set if it's a teacher
            if current_user.role == "teacher":
                teacher = db.query(models.Teacher).filter(models.Teacher.user_id == current_user.id).first()
                if teacher:
                    new_mark.teacher_id = teacher.id
            
            db.add(new_mark)
            saved_marks.append(new_mark)
            
    db.commit()
    for mark in saved_marks:
        db.refresh(mark)
        
    return saved_marks

@router.get("/", response_model=List[schemas.Mark])
def get_marks(
    student_id: Optional[str] = None,
    semester: Optional[int] = None,
    subject_id: Optional[int] = None,
    exam_type: Optional[str] = None,
    academic_year: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Get marks with advanced filtering.
    """
    query = db.query(models.Mark)
    
    if student_id:
        query = query.filter(models.Mark.student_id == student_id)
    if semester:
        query = query.filter(models.Mark.semester == semester)
    if subject_id:
        query = query.filter(models.Mark.subject_id == subject_id)
    if exam_type:
        query = query.filter(models.Mark.exam_type == exam_type)
    if academic_year:
        query = query.filter(models.Mark.academic_year == academic_year)
        
    return query.all()
