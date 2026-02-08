from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api import deps
from app.core.database import get_db
from app.models import models

router = APIRouter()

@router.get("/admin-dashboard")
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get statistics for Admin Dashboard.
    """
    student_count = db.query(models.Student).count()
    teacher_count = db.query(models.Teacher).count()
    user_count = db.query(models.User).count()
    
    # PhD Count (Approximation)
    phd_count = db.query(models.Teacher).filter(models.Teacher.full_name.like("Dr.%")).count()
    
    return {
        "student_count": student_count,
        "teacher_count": teacher_count,
        "user_count": user_count,
        "phd_count": phd_count,
        "system_health": "Active", # Mock for now
        "ml_service": "Active"
    }

@router.get("/faculty-distribution")
def get_faculty_distribution(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get faculty counts by department.
    """
    results = db.query(models.Teacher.department, func.count(models.Teacher.id))\
        .group_by(models.Teacher.department).all()
    
    
    distribution = [{"name": r[0], "count": r[1]} for r in results if r[0]]
    return distribution

@router.get("/dashboard/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get detailed statistics for Analytics Dashboard.
    """
    total_students = db.query(models.Student).count()
    total_teachers = db.query(models.Teacher).count()
    
    # Mock data for now until Attendance/Alerts are fully implemented
    avg_attendance = 87.5
    active_alerts = 5
    
    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "avg_attendance": avg_attendance,
        "active_alerts": active_alerts
    }
