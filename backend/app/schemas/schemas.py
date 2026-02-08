from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    role: str = "student"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True

# Branch Schemas
class BranchBase(BaseModel):
    name: str
    code: str

class BranchCreate(BranchBase):
    pass

class Branch(BranchBase):
    id: int
    class Config:
        from_attributes = True

# Student Schemas
class StudentBase(BaseModel):
    student_id: str
    full_name: str
    current_semester: int
    section: Optional[str] = None
    branch_id: Optional[int] = None
    email: Optional[str] = None # Added Email

class StudentCreate(StudentBase):
    user_id: Optional[int] = None # Optional because we might create user
    password: Optional[str] = None # For creating user

class StudentUpdate(StudentBase):
    password: Optional[str] = None

class Student(StudentBase):
    id: int
    branch: Optional[Branch] = None
    class Config:
        from_attributes = True

# Teacher Schemas
class TeacherBase(BaseModel):
    full_name: str
    department: str
    branch_id: Optional[int] = None
    email: Optional[str] = None

class TeacherCreate(TeacherBase):
    password: str
    email: str

class Teacher(TeacherBase):
    id: int
    branch: Optional[Branch] = None
    stats: Optional[dict] = None
    
    class Config:
        from_attributes = True

# Prediction Schemas
class PredictionBase(BaseModel):
    predicted_category: str
    confidence_score: float
    shap_values: Optional[dict] = None
    risk_factors: Optional[List[str]] = []

class PredictionCreate(PredictionBase):
    student_id: str

class Prediction(PredictionBase):
    id: int
    prediction_date: datetime
    
    class Config:
        from_attributes = True

# Marks Schemas
# Marks Schemas
class MarkBase(BaseModel):
    student_id: str
    subject_id: Optional[int] = None
    subject: Optional[str] = None  # Deprecated, use subject_id
    marks_obtained: int
    max_marks: Optional[int] = 100
    exam_type: str  # internal, external, assignment
    semester: Optional[int] = None
    academic_year: Optional[str] = None

class MarkCreate(MarkBase):
    pass

class Mark(MarkBase):
    id: int
    date: datetime
    
    class Config:
        from_attributes = True

# Merit List Schema
class MeritListItem(BaseModel):
    rank: int
    student_id: str
    full_name: str
    branch_code: Optional[str]
    semester: int
    average_marks: float
    percentage: float
    
    class Config:
        from_attributes = True

# Subject Schemas
class SubjectBase(BaseModel):
    code: str
    name: str
    semester: int
    branch_id: Optional[int] = None  # None means common for all branches
    credits: int = 3
    max_marks: float = 100.0
    description: Optional[str] = None
    is_active: bool = True

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    semester: Optional[int] = None
    branch_id: Optional[int] = None
    credits: Optional[int] = None
    max_marks: Optional[float] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class Subject(SubjectBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Teacher Subject Assignment Schemas
class TeacherSubjectAssignmentBase(BaseModel):
    teacher_id: int
    subject_id: int
    semester: int
    section: str
    academic_year: str

class TeacherSubjectAssignmentCreate(TeacherSubjectAssignmentBase):
    pass

class TeacherSubjectAssignment(TeacherSubjectAssignmentBase):
    id: int
    assigned_at: datetime
    
    class Config:
        from_attributes = True
