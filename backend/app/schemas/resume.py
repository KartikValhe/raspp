from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional
from datetime import datetime

# Nested schemas for resume sections
class EducationEntry(BaseModel):
    degree: Optional[str] = "Bachelor of Technology"
    institution: Optional[str] = "Institute of Technology"
    location: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    cgpa: Optional[str] = None
    description: Optional[str] = None
    year: Optional[str] = None

    class Config:
        extra = "allow"

class ExperienceEntry(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    description: Optional[str] = None
    techStack: Optional[List[str]] = []

    class Config:
        extra = "allow"

class ProjectEntry(BaseModel):
    title: Optional[str] = None
    techStack: Optional[List[str]] = []
    description: Optional[str] = None
    link: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None

    class Config:
        extra = "allow"

class CertificationEntry(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    date: Optional[str] = None
    credentialId: Optional[str] = None
    link: Optional[str] = None

    class Config:
        extra = "allow"

class AchievementEntry(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None

    class Config:
        extra = "allow"

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
