from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core import security
from app.core.config import settings
from app.core.database import get_db
from app.models import models
from app.schemas import schemas

from app.core.redis import redis_cache

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    # Check Redis cache first to avoid 100ms TiDB round-trip on EVERY request
    cache_key = f"auth:user:{token_data.email}"
    cached_user = redis_cache.get(cache_key)
    if cached_user:
        user = models.User(
            id=cached_user["id"],
            email=cached_user["email"],
            role=cached_user["role"],
            is_active=cached_user["is_active"],
            can_modify=cached_user.get("can_modify", True),
        )
        return user

    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception

    # Cache user for 10 minutes (600s)
    redis_cache.set(cache_key, {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
        "can_modify": bool(getattr(user, "can_modify", True) if getattr(user, "can_modify", None) is not None else True),
    }, ttl=600)
    return user

def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def check_write_permission(
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
    """Blocks any user in Demo/View-Only mode (can_modify=False) from creating, updating, or deleting."""
    if not getattr(current_user, "can_modify", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Demo / View-Only Mode: Modification permissions are restricted. You cannot create, update, or delete records in demo mode.",
        )
    return current_user

def get_current_admin(
    current_user: models.User = Depends(get_current_active_user),
    ) -> models.User:
    if current_user.role not in ("admin", "superadmin"):
        raise HTTPException(
            status_code=401, detail="The user doesn't have enough privileges"
        )
    return current_user

def get_current_superadmin(
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
    """Only superadmin role is allowed."""
    if current_user.role != "superadmin":
        raise HTTPException(
            status_code=403, detail="Superadmin privileges required"
        )
    return current_user
