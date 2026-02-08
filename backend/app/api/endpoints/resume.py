from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import models
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeResponse
from app.api.deps import get_current_user
import io

router = APIRouter()

@router.get("/{student_id}", response_model=ResumeResponse)
def get_student_resume(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get resume for a specific student"""
    resume = db.query(models.Resume).filter(models.Resume.student_id == student_id).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found for this student"
        )
    
    return resume

@router.post("/", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
def create_resume(
    resume_data: ResumeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Create a new resume"""
    # Check if resume already exists
    existing = db.query(models.Resume).filter(
        models.Resume.student_id == resume_data.student_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume already exists for this student. Use PUT to update."
        )
    
    # Convert Pydantic models to dicts for JSON storage
    resume_dict = resume_data.dict()
    resume_dict['education'] = [edu.dict() for edu in resume_data.education]
    resume_dict['experience'] = [exp.dict() for exp in resume_data.experience]
    resume_dict['projects'] = [proj.dict() for proj in resume_data.projects]
    if resume_data.certifications:
        resume_dict['certifications'] = [cert.dict() for cert in resume_data.certifications]
    if resume_data.achievements:
        resume_dict['achievements'] = [ach.dict() for ach in resume_data.achievements]
    
    db_resume = models.Resume(**resume_dict)
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    
    return db_resume

@router.put("/{resume_id}", response_model=ResumeResponse)
def update_resume(
    resume_id: int,
    resume_update: ResumeUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Update an existing resume"""
    db_resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    
    if not db_resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Update only provided fields
    update_data = resume_update.dict(exclude_unset=True)
    
    # Convert Pydantic models to dicts if present
    if 'education' in update_data and update_data['education'] is not None:
        update_data['education'] = [edu.dict() if hasattr(edu, 'dict') else edu for edu in update_data['education']]
    if 'experience' in update_data and update_data['experience'] is not None:
        update_data['experience'] = [exp.dict() if hasattr(exp, 'dict') else exp for exp in update_data['experience']]
    if 'projects' in update_data and update_data['projects'] is not None:
        update_data['projects'] = [proj.dict() if hasattr(proj, 'dict') else proj for proj in update_data['projects']]
    if 'certifications' in update_data and update_data['certifications'] is not None:
        update_data['certifications'] = [cert.dict() if hasattr(cert, 'dict') else cert for cert in update_data['certifications']]
    if 'achievements' in update_data and update_data['achievements'] is not None:
        update_data['achievements'] = [ach.dict() if hasattr(ach, 'dict') else ach for ach in update_data['achievements']]
    
    for key, value in update_data.items():
        setattr(db_resume, key, value)
    
    db.commit()
    db.refresh(db_resume)
    
    return db_resume

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Delete a resume"""
    db_resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    
    if not db_resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    db.delete(db_resume)
    db.commit()
    
    return None

@router.get("/{resume_id}/pdf")
def download_resume_pdf(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Generate and download resume as PDF"""
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Generate PDF (placeholder - will implement with reportlab)
    pdf_content = generate_resume_pdf(resume)
    
    return StreamingResponse(
        io.BytesIO(pdf_content),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={resume.full_name.replace(' ', '_')}_Resume.pdf"
        }
    )

def generate_resume_pdf(resume: models.Resume) -> bytes:
    """Generate PDF from resume data (placeholder)"""
    # TODO: Implement with reportlab
    return b"PDF placeholder"
