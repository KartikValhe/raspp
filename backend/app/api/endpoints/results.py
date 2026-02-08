from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.api import deps
from app.core.database import get_db
from app.models import models
from pydantic import BaseModel

router = APIRouter()

class MeritListItem(BaseModel):
    rank: int
    student_id: str
    student_name: str
    branch: str
    semester: int
    total_marks: float
    percentage: float
    status: str

    class Config:
        from_attributes = True

class ResultSummary(BaseModel):
    total_students: int
    pass_count: int
    fail_count: int
    average_percentage: float

@router.get("/merit-list", response_model=List[MeritListItem])
def get_merit_list(
    db: Session = Depends(get_db),
    semester: Optional[int] = None,
    branch_id: Optional[int] = None,
    academic_year: Optional[str] = '2024-25',
    limit: int = 50
) -> Any:
    """
    Get merit list sorted by total marks percentage
    """
    # Base query for students
    query = db.query(
        models.Student,
        func.sum(models.Mark.marks_obtained).label('total_obtained'),
        func.sum(models.Mark.max_marks).label('total_max')
    ).join(models.Mark, models.Student.student_id == models.Mark.student_id)

    # Apply filters
    if semester:
        query = query.filter(models.Student.current_semester == semester)
        # Also filter marks by semester to ensure relevant results
        query = query.filter(models.Mark.semester == semester)
        
    if branch_id:
        query = query.filter(models.Student.branch_id == branch_id)
        
    if academic_year:
        query = query.filter(models.Mark.academic_year == academic_year)

    # Group by student and order by percentage
    query = query.group_by(models.Student.student_id)
    
    # Execute query
    results = query.all()
    
    # Process results into MeritListItem format
    merit_list = []
    
    # In-memory sorting (simpler for calculated percentage)
    processed_results = []
    for student, total_obtained, total_max in results:
        percentage = (total_obtained / total_max * 100) if total_max else 0
        status = "Pass" if percentage >= 40 else "Fail" # Simple pass criteria
        
        processed_results.append({
            "student": student,
            "total_obtained": total_obtained,
            "percentage": percentage,
            "status": status
        })
        
    # Sort by percentage desc
    processed_results.sort(key=lambda x: x['percentage'], reverse=True)
    
    # Add Rank and format
    for idx, item in enumerate(processed_results[:limit]):
        student = item['student']
        merit_list.append(MeritListItem(
            rank=idx + 1,
            student_id=student.student_id,
            student_name=student.full_name,
            branch=student.branch.name if student.branch else "N/A",
            semester=student.current_semester,
            total_marks=item['total_obtained'],
            percentage=round(item['percentage'], 2),
            status=item['status']
        ))
        
    return merit_list
