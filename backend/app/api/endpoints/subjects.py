from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter()

# Subject CRUD endpoints
@router.get("/", response_model=List[schemas.Subject])
def get_subjects(
    skip: int = 0,
    limit: int = 100,
    semester: Optional[int] = None,
    branch_id: Optional[int] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get list of subjects with optional filters"""
    query = db.query(models.Subject)
    
    if semester is not None:
        query = query.filter(models.Subject.semester == semester)
    if branch_id is not None:
        query = query.filter(
            (models.Subject.branch_id == branch_id) | 
            (models.Subject.branch_id == None)  # Include common subjects
        )
    if is_active is not None:
        query = query.filter(models.Subject.is_active == is_active)
    
    return query.offset(skip).limit(limit).all()

@router.get("/{subject_id}", response_model=schemas.Subject)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    """Get a specific subject by ID"""
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

@router.post("/", response_model=schemas.Subject)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    """Create a new subject (Admin only)"""
    # Check if subject code already exists
    existing = db.query(models.Subject).filter(models.Subject.code == subject.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Subject code already exists")
    
    db_subject = models.Subject(**subject.model_dump())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.put("/{subject_id}", response_model=schemas.Subject)
def update_subject(
    subject_id: int,
    subject_update: schemas.SubjectUpdate,
    db: Session = Depends(get_db)
):
    """Update a subject (Admin only)"""
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Check if code is being changed and if it conflicts
    if subject_update.code and subject_update.code != db_subject.code:
        existing = db.query(models.Subject).filter(models.Subject.code == subject_update.code).first()
        if existing:
            raise HTTPException(status_code=400, detail="Subject code already exists")
    
    # Update only provided fields
    update_data = subject_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_subject, field, value)
    
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.delete("/{subject_id}")
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    """Delete a subject (Admin only)"""
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    db.delete(db_subject)
    db.commit()
    return {"message": "Subject deleted successfully"}

# Teacher Subject Assignment endpoints
@router.get("/assignments/", response_model=List[schemas.TeacherSubjectAssignment])
def get_teacher_assignments(
    teacher_id: Optional[int] = None,
    subject_id: Optional[int] = None,
    semester: Optional[int] = None,
    academic_year: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get teacher-subject assignments with optional filters"""
    query = db.query(models.TeacherSubjectAssignment)
    
    if teacher_id:
        query = query.filter(models.TeacherSubjectAssignment.teacher_id == teacher_id)
    if subject_id:
        query = query.filter(models.TeacherSubjectAssignment.subject_id == subject_id)
    if semester:
        query = query.filter(models.TeacherSubjectAssignment.semester == semester)
    if academic_year:
        query = query.filter(models.TeacherSubjectAssignment.academic_year == academic_year)
    
    return query.all()

@router.post("/assignments/", response_model=schemas.TeacherSubjectAssignment)
def create_assignment(
    assignment: schemas.TeacherSubjectAssignmentCreate,
    db: Session = Depends(get_db)
):
    """Create a new teacher-subject assignment (Admin only)"""
    # Check if teacher exists
    teacher = db.query(models.Teacher).filter(models.Teacher.id == assignment.teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    # Check if subject exists
    subject = db.query(models.Subject).filter(models.Subject.id == assignment.subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Check for duplicate assignment
    existing = db.query(models.TeacherSubjectAssignment).filter(
        models.TeacherSubjectAssignment.teacher_id == assignment.teacher_id,
        models.TeacherSubjectAssignment.subject_id == assignment.subject_id,
        models.TeacherSubjectAssignment.semester == assignment.semester,
        models.TeacherSubjectAssignment.section == assignment.section,
        models.TeacherSubjectAssignment.academic_year == assignment.academic_year
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Assignment already exists")
    
    db_assignment = models.TeacherSubjectAssignment(**assignment.model_dump())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

@router.delete("/assignments/{assignment_id}")
def delete_assignment(assignment_id: int, db: Session = Depends(get_db)):
    """Delete a teacher-subject assignment (Admin only)"""
    assignment = db.query(models.TeacherSubjectAssignment).filter(
        models.TeacherSubjectAssignment.id == assignment_id
    ).first()
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    db.delete(assignment)
    db.commit()
    return {"message": "Assignment deleted successfully"}
