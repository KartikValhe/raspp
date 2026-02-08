from fastapi import APIRouter
from app.api.endpoints import auth, users, students, teachers, analytics, ml, resume

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["teachers"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(ml.router, prefix="/ml", tags=["ml"])
api_router.include_router(resume.router, prefix="/resume", tags=["resume"])
from app.api.endpoints import branches
api_router.include_router(branches.router, prefix="/branches", tags=["branches"])

# Add subjects router
from app.api.endpoints import subjects
api_router.include_router(subjects.router, prefix="/subjects", tags=["subjects"])

# Add marks router
from app.api.endpoints import marks
api_router.include_router(marks.router, prefix="/marks", tags=["marks"])

# Add results router
from app.api.endpoints import results
api_router.include_router(results.router, prefix="/results", tags=["results"])

# Add placement router  
from app.api.endpoints import placement
api_router.include_router(placement.router)
