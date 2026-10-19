from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api import deps
from app.core.database import get_db
from app.models import models

from app.core.redis import redis_cache

router = APIRouter()

@router.get("/admin-dashboard")
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get statistics for Admin Dashboard (cached with Redis).
    """
    cache_key = "analytics:admin_dashboard"
    cached_data = redis_cache.get(cache_key)
    if cached_data is not None:
        return cached_data

    student_count = db.query(models.Student).count()
    teacher_count = db.query(models.Teacher).count()
    user_count = db.query(models.User).count()
    
    # PhD Count (Approximation)
    phd_count = db.query(models.Teacher).filter(models.Teacher.full_name.like("Dr.%")).count()
    
    response = {
        "student_count": student_count,
        "teacher_count": teacher_count,
        "user_count": user_count,
        "phd_count": phd_count,
        "system_health": "Active",
        "ml_service": "Active"
    }
    # Cache for 3 minutes (180s)
    redis_cache.set(cache_key, response, ttl=180)
    return response

@router.get("/faculty-distribution")
def get_faculty_distribution(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get faculty counts by department (cached with Redis).
    """
    cache_key = "analytics:faculty_distribution"
    cached_data = redis_cache.get(cache_key)
    if cached_data is not None:
        return cached_data

    results = db.query(models.Teacher.department, func.count(models.Teacher.id))\
        .group_by(models.Teacher.department).all()
    
    distribution = [{"name": r[0], "count": r[1]} for r in results if r[0]]
    # Cache for 5 minutes (300s)
    redis_cache.set(cache_key, distribution, ttl=300)
    return distribution

@router.get("/dashboard/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get detailed statistics for Analytics Dashboard (cached with Redis).
    """
    cache_key = "analytics:dashboard_stats"
    cached_data = redis_cache.get(cache_key)
    if cached_data is not None:
        return cached_data

    total_students = db.query(models.Student).count()
    total_teachers = db.query(models.Teacher).count()
    
    avg_attendance = 87.5
    active_alerts = 5
    
    response = {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "avg_attendance": avg_attendance,
        "active_alerts": active_alerts
    }
    # Cache for 3 minutes (180s)
    redis_cache.set(cache_key, response, ttl=180)
    return response
