from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional
from datetime import datetime

# Nested schemas for resume sections
class EducationEntry(BaseModel):
    degree: str
    institution: str
    location: str
    startDate: str  # YYYY-MM format
    endDate: Optional[str] = None  # YYYY-MM or "Present"
    cgpa: Optional[str] = None
    description: Optional[str] = None

class ExperienceEntry(BaseModel):
    company: str
    role: str
    location: str
    startDate: str
    endDate: Optional[str] = None
    description: str
    techStack: Optional[List[str]] = []

class ProjectEntry(BaseModel):
    title: str
    techStack: List[str]
    description: str
    link: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None

class CertificationEntry(BaseModel):
    name: str
    issuer: str
    date: str
    credentialId: Optional[str] = None
    link: Optional[str] = None

class AchievementEntry(BaseModel):
    title: str
    description: str
    date: Optional[str] = None

# Main Resume Schemas
class ResumeBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    summary: Optional[str] = None
    education: List[EducationEntry] = []
    skills: List[str] = []
    experience: List[ExperienceEntry] = []
    projects: List[ProjectEntry] = []
    certifications: Optional[List[CertificationEntry]] = []
    achievements: Optional[List[AchievementEntry]] = []

class ResumeCreate(ResumeBase):
    student_id: int

class ResumeUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    summary: Optional[str] = None
    education: Optional[List[EducationEntry]] = None
    skills: Optional[List[str]] = None
    experience: Optional[List[ExperienceEntry]] = None
    projects: Optional[List[ProjectEntry]] = None
    certifications: Optional[List[CertificationEntry]] = None
    achievements: Optional[List[AchievementEntry]] = None

class ResumeResponse(ResumeBase):
    id: int
    student_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
