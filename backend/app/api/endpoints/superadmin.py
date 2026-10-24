"""
Superadmin API Endpoints
========================
All routes here require superadmin role (role == "superadmin").
The superadmin is the only entity that can:
  - Create / update / delete Admin accounts
  - Create / update / delete Teacher accounts
  - Grant or revoke access (is_active flag) for any user
  - View all system users (admins, teachers, students, placement coordinators)
  - Hard-delete any user from the database

These endpoints are intentionally NOT linked anywhere in the public UI.
Access is only possible via the secret superadmin portal.
"""

from typing import Any, List, Optional
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api import deps
from app.core import security
from app.core.config import settings
from app.core.database import get_db
from app.models import models
from app.schemas import schemas
from pydantic import BaseModel, EmailStr

router = APIRouter()


# ─────────────────────────────────────────────────────────────────────────────
# Pydantic schemas local to this module
# ─────────────────────────────────────────────────────────────────────────────

class SuperAdminLogin(BaseModel):
    email: EmailStr
    password: str
    secret_token: str  # must match SUPERADMIN_SECRET_TOKEN in env


class CreateAdminRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    can_modify: bool = True  # True = Full Access (Write), False = Demo / View-Only


class CreateTeacherRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    department: str
    branch_id: Optional[int] = None
    can_modify: bool = True  # True = Full Access (Write), False = Demo / View-Only


class UpdateUserAccessRequest(BaseModel):
    can_modify: Optional[bool] = None  # Toggle write/modify permissions
    is_active: Optional[bool] = None   # Account active state


class UpdatePasswordRequest(BaseModel):
    new_password: str


class UserSummary(BaseModel):
    id: int
    email: str
    role: str
    is_active: bool
    can_modify: bool = True
    full_name: Optional[str] = None

    class Config:
        from_attributes = True


class SystemStats(BaseModel):
    total_users: int
    total_admins: int
    total_teachers: int
    total_students: int
    total_placement_coordinators: int
    active_users: int
    inactive_users: int
    demo_users: int = 0


# ─────────────────────────────────────────────────────────────────────────────
# Dependency: get_current_superadmin
# ─────────────────────────────────────────────────────────────────────────────

def get_current_superadmin(
    current_user: models.User = Depends(deps.get_current_active_user),
) -> models.User:
    """Only superadmin role is allowed."""
    if current_user.role != "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Superadmin privileges required",
        )
    return current_user


# ─────────────────────────────────────────────────────────────────────────────
# Superadmin Auth — separate login that validates a secret token
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/login")
def superadmin_login(
    payload: SuperAdminLogin,
    db: Session = Depends(get_db),
) -> Any:
    """
    Special login for superadmin.
    Requires email + password + secret_token (configured in .env).
    If the secret_token does not match, the request is rejected even before
    checking credentials — random users cannot even attempt guessing.
    """
    # 1. Validate secret token first (deny before touching DB)
    expected_token = getattr(settings, "SUPERADMIN_SECRET_TOKEN", None)
    if not expected_token or payload.secret_token != expected_token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied — invalid portal token",
        )

    # 2. Validate credentials
    user = db.query(models.User).filter(
        models.User.email.ilike(payload.email.strip())
    ).first()

    if not user or not security.verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if user.role != "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account does not have superadmin privileges",
        )

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is inactive")

    access_token = security.create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "email": user.email,
    }


# ─────────────────────────────────────────────────────────────────────────────
# System Stats
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/stats", response_model=SystemStats)
def get_system_stats(
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_superadmin),
) -> Any:
    """Dashboard statistics — single GROUP BY query including demo users."""
    from sqlalchemy import case

    # One query: count per role + active/inactive + demo accounts
    rows = db.query(
        models.User.role,
        func.count(models.User.id).label('total'),
        func.sum(case((models.User.is_active == True, 1), else_=0)).label('active'),
        func.sum(case((models.User.can_modify == False, 1), else_=0)).label('demo'),
    ).group_by(models.User.role).all()

    role_totals: dict = {}
    role_active: dict = {}
    role_demo: dict = {}
    for row in rows:
        role_totals[row.role] = row.total
        role_active[row.role] = int(row.active or 0)
        role_demo[row.role] = int(row.demo or 0)

    grand_total   = sum(role_totals.values())
    grand_active  = sum(role_active.values())
    grand_inactive = grand_total - grand_active
    grand_demo = sum(role_demo.values())

    return SystemStats(
        total_users=grand_total,
        total_admins=role_totals.get('admin', 0),
        total_teachers=role_totals.get('teacher', 0),
        total_students=role_totals.get('student', 0),
        total_placement_coordinators=role_totals.get('placement_coordinator', 0),
        active_users=grand_active,
        inactive_users=grand_inactive,
        demo_users=grand_demo,
    )


# ─────────────────────────────────────────────────────────────────────────────
# List all users (with optional role filter)
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/users", response_model=List[UserSummary])
def list_all_users(
    role: Optional[str] = Query(None, description="Filter by role: admin|teacher|student|placement_coordinator"),
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_superadmin),
) -> Any:
    """
    Return all users (or filtered by role).
    Uses projection and coalesce for maximum query speed.
    """
    from sqlalchemy import func

    rows = (
        db.query(
            models.User.id,
            models.User.email,
            models.User.role,
            models.User.is_active,
            func.coalesce(models.User.can_modify, True).label("can_modify"),
            func.coalesce(models.Teacher.full_name, models.Student.full_name).label("full_name"),
        )
        .outerjoin(models.Teacher, models.Teacher.user_id == models.User.id)
        .outerjoin(models.Student, models.Student.user_id == models.User.id)
    )
    if role:
        rows = rows.filter(models.User.role == role)

    # Order by primary key descending using index
    users = rows.order_by(models.User.id.desc()).all()

    return [
        UserSummary(
            id=u.id,
            email=u.email,
            role=u.role,
            is_active=u.is_active,
            can_modify=bool(u.can_modify),
            full_name=u.full_name,
        )
        for u in users
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Create Admin
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/admins", response_model=UserSummary)
def create_admin(
    payload: CreateAdminRequest,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_superadmin),
) -> Any:
    """Create a new admin account (full write or demo view-only)."""
    existing = db.query(models.User).filter(
        models.User.email.ilike(payload.email.strip())
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        email=payload.email.strip().lower(),
        hashed_password=security.get_password_hash(payload.password),
        role="admin",
        is_active=True,
        can_modify=payload.can_modify,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserSummary(id=user.id, email=user.email, role=user.role,
                       is_active=user.is_active, can_modify=bool(user.can_modify),
                       full_name=payload.full_name)


# ─────────────────────────────────────────────────────────────────────────────
# Create Teacher (with Teacher profile)
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/teachers", response_model=UserSummary)
def create_teacher(
    payload: CreateTeacherRequest,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_superadmin),
) -> Any:
    """Create a new teacher account (full write or demo view-only)."""
    existing = db.query(models.User).filter(
        models.User.email.ilike(payload.email.strip())
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        email=payload.email.strip().lower(),
        hashed_password=security.get_password_hash(payload.password),
        role="teacher",
        is_active=True,
        can_modify=payload.can_modify,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    teacher = models.Teacher(
        user_id=user.id,
        full_name=payload.full_name,
        department=payload.department,
        branch_id=payload.branch_id,
        email=payload.email.strip().lower(),
    )
    db.add(teacher)
    db.commit()

    return UserSummary(id=user.id, email=user.email, role=user.role,
                       is_active=user.is_active, can_modify=bool(user.can_modify),
                       full_name=payload.full_name)


# ─────────────────────────────────────────────────────────────────────────────
# Grant / Revoke Access (toggle can_modify or is_active)
# ─────────────────────────────────────────────────────────────────────────────

@router.patch("/users/{user_id}/access", response_model=UserSummary)
def update_user_access(
    user_id: int,
    payload: UpdateUserAccessRequest,
    db: Session = Depends(get_db),
    current_superadmin: models.User = Depends(get_current_superadmin),
) -> Any:
    """
    Grant or revoke a user's write permissions (can_modify) or active status.
    Users with can_modify=False remain active and can log in, but are restricted from modifying data.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Guard: cannot modify another superadmin account
    if user.role == "superadmin" and user.id != current_superadmin.id:
        raise HTTPException(status_code=403, detail="Cannot modify another superadmin account")

    if payload.can_modify is not None:
        user.can_modify = payload.can_modify
    if payload.is_active is not None:
        user.is_active = payload.is_active

    db.commit()
    db.refresh(user)

    # Invalidate cached user in Redis so new permission applies immediately
    try:
        from app.core.redis import redis_cache
        redis_cache.delete(f"auth:user:{user.email}")
    except Exception:
        pass

    full_name = None
    if user.teacher_profile:
        full_name = user.teacher_profile.full_name
    elif user.student_profile:
        full_name = user.student_profile.full_name

    return UserSummary(id=user.id, email=user.email, role=user.role,
                       is_active=user.is_active, can_modify=bool(user.can_modify),
                       full_name=full_name)


# ─────────────────────────────────────────────────────────────────────────────
# Update user password
# ─────────────────────────────────────────────────────────────────────────────

@router.patch("/users/{user_id}/password")
def reset_user_password(
    user_id: int,
    payload: UpdatePasswordRequest,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_superadmin),
) -> Any:
    """Reset any user's password."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = security.get_password_hash(payload.new_password)
    db.commit()
    return {"message": f"Password updated for {user.email}"}


# ─────────────────────────────────────────────────────────────────────────────
# Delete user (hard delete)
# ─────────────────────────────────────────────────────────────────────────────

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_superadmin: models.User = Depends(get_current_superadmin),
) -> Any:
    """
    Permanently delete a user.
    - Cannot delete another superadmin
    - Cannot delete yourself
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role == "superadmin":
        raise HTTPException(status_code=403, detail="Cannot delete a superadmin account")

    if user.id == current_superadmin.id:
        raise HTTPException(status_code=403, detail="Cannot delete your own account")

    # Delete linked teacher profile if exists
    teacher = db.query(models.Teacher).filter(models.Teacher.user_id == user.id).first()
    if teacher:
        db.delete(teacher)
        db.flush()

    # Delete linked student profile if exists
    student = db.query(models.Student).filter(models.Student.user_id == user.id).first()
    if student:
        db.delete(student)
        db.flush()

    db.delete(user)
    db.commit()
    return {"message": f"User {user.email} deleted successfully"}


# ─────────────────────────────────────────────────────────────────────────────
# Promote / Demote user role (admin ↔ teacher, etc.)
# ─────────────────────────────────────────────────────────────────────────────

class ChangeRoleRequest(BaseModel):
    new_role: str  # admin | teacher | student | placement_coordinator


@router.patch("/users/{user_id}/role", response_model=UserSummary)
def change_user_role(
    user_id: int,
    payload: ChangeRoleRequest,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_superadmin),
) -> Any:
    """Change a user's role. Cannot promote to or from superadmin."""
    allowed_roles = {"admin", "teacher", "student", "placement_coordinator"}
    if payload.new_role not in allowed_roles:
        raise HTTPException(status_code=400, detail=f"Role must be one of: {allowed_roles}")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role == "superadmin":
        raise HTTPException(status_code=403, detail="Cannot change a superadmin's role")

    user.role = payload.new_role
    db.commit()
    db.refresh(user)

    full_name = None
    if user.teacher_profile:
        full_name = user.teacher_profile.full_name
    elif user.student_profile:
        full_name = user.student_profile.full_name

    return UserSummary(id=user.id, email=user.email, role=user.role,
                       is_active=user.is_active, full_name=full_name)
