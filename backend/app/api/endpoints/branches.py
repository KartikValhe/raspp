from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.core.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Branch])
def read_branches(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve all branches.
    """
    branches = db.query(models.Branch).offset(skip).limit(limit).all()
    return branches

@router.post("/", response_model=schemas.Branch)
def create_branch(
    *,
    db: Session = Depends(get_db),
    branch_in: schemas.BranchCreate,
    current_user: models.User = Depends(deps.get_current_admin), # Admin only
) -> Any:
    """
    Create new branch.
    """
    branch = models.Branch(
        name=branch_in.name,
        code=branch_in.code
    )
    db.add(branch)
    db.commit()
    db.refresh(branch)
    return branch

@router.delete("/{id}", response_model=schemas.Branch)
def delete_branch(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_admin), # Admin only
) -> Any:
    """
    Delete a branch.
    """
    branch = db.query(models.Branch).filter(models.Branch.id == id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    
    try:
        db.delete(branch)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Cannot delete branch because it has assigned students.")
    
    return branch
