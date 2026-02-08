from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Job Posting Schemas
class JobPostingBase(BaseModel):
    company_name: str
    job_role: str
    description: Optional[str] = None
    requirements: Optional[str] = None
    package_range: Optional[str] = None
    eligibility_criteria: Optional[dict] = None
    deadline: Optional[datetime] = None
    is_active: bool = True

class JobPostingCreate(JobPostingBase):
    pass

class JobPostingUpdate(BaseModel):
    company_name: Optional[str] = None
    job_role: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    package_range: Optional[str] = None
    eligibility_criteria: Optional[dict] = None
    deadline: Optional[datetime] = None
    is_active: Optional[bool] = None

class JobPostingResponse(JobPostingBase):
    id: int
    posted_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Placement Record Schemas
class PlacementRecordBase(BaseModel):
    student_id: int
    company_name: str
    job_role: str
    package: Optional[float] = None
    placed_date: Optional[datetime] = None
    status: str = "pending"
    offer_letter_url: Optional[str] = None

class PlacementRecordCreate(PlacementRecordBase):
    pass

class PlacementRecordUpdate(BaseModel):
    company_name: Optional[str] = None
    job_role: Optional[str] = None
    package: Optional[float] = None
    placed_date: Optional[datetime] = None
    status: Optional[str] = None
    offer_letter_url: Optional[str] = None

class PlacementRecordResponse(PlacementRecordBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Placement Prediction Schemas
class PlacementPredictionResponse(BaseModel):
    id: int
    student_id: int
    prediction: str
    confidence: float
    features: Optional[dict] = None
    predicted_at: datetime

    class Config:
        from_attributes = True

# Bulk Prediction Request
class BulkPredictionStudent(BaseModel):
    student_id: str
    name: str
    cgpa: float
    tenth_percentage: float
    twelfth_percentage: float
    technical_skills: int
    soft_skills: int
    internships: int
    projects: int
    certifications: int
    backlogs: int
    communication_skills: int

# Statistics Response
class PlacementStatistics(BaseModel):
    total_students: int
    total_placed: int
    placement_percentage: float
    average_package: float
    highest_package: float
    total_companies: int
    active_jobs: int
