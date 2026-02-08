from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, JSON, Text, Index
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(String(50))  # admin, teacher, student, placement_coordinator
    is_active = Column(Boolean, default=True)

    student_profile = relationship("Student", back_populates="user", uselist=False)
    teacher_profile = relationship("Teacher", back_populates="user", uselist=False)

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    student_id = Column(String(50), unique=True, index=True) # Official Roll No
    full_name = Column(String(100))
    current_semester = Column(Integer)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True) # Linked to Branch
    section = Column(String(10), nullable=True) # A, B, C (Now referred to as Division in UI)
    email = Column(String(255), nullable=True) # Synced from User table
    
    user = relationship("User", back_populates="student_profile")
    marks = relationship("Mark", back_populates="student")
    attendance = relationship("Attendance", back_populates="student")
    predictions = relationship("Prediction", back_populates="student")
    branch = relationship("Branch", back_populates="students")

class Branch(Base):
    __tablename__ = "branches"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True) # e.g. Computer Science
    code = Column(String(10), unique=True, index=True) # e.g. CSE
    
    students = relationship("Student", back_populates="branch")
    teachers = relationship("Teacher", back_populates="branch")
    subjects = relationship("Subject", back_populates="branch")

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    full_name = Column(String(100))
    department = Column(String(100))
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)  # Branch assignment
    email = Column(String(255), nullable=True) # Synced from User table
    
    user = relationship("User", back_populates="teacher_profile")
    branch = relationship("Branch", back_populates="teachers")
    subject_assignments = relationship("TeacherSubjectAssignment", back_populates="teacher")
    marks_entered = relationship("Mark", back_populates="teacher")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, nullable=False, index=True)  # e.g., "CS301"
    name = Column(String(200), nullable=False)  # e.g., "Data Structures and Algorithms"
    semester = Column(Integer, nullable=False, index=True)  # Which semester (1-8)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)  # Null = common for all branches
    credits = Column(Integer, default=3)  # For weighted merit calculations
    max_marks = Column(Float, default=100.0)  # Maximum marks for this subject
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    branch = relationship("Branch", back_populates="subjects")
    marks = relationship("Mark", back_populates="subject_rel", cascade="all, delete-orphan", foreign_keys="[Mark.subject_id]")
    teacher_assignments = relationship("TeacherSubjectAssignment", back_populates="subject")

class TeacherSubjectAssignment(Base):
    """Maps which teachers teach which subjects"""
    __tablename__ = "teacher_subject_assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    semester = Column(Integer, nullable=False)
    academic_year = Column(String(20), nullable=True)  # e.g., "2024-25"
    section = Column(String(1), nullable=True)  # Optional: A, B, C, D
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    teacher = relationship("Teacher", back_populates="subject_assignments")
    subject = relationship("Subject", back_populates="teacher_assignments")
    
    # Composite index for unique assignment
    __table_args__ = (
        Index('idx_unique_assignment', 'teacher_id', 'subject_id', 'semester', 'section', unique=True),
    )

class Mark(Base):
    __tablename__ = "marks"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("students.student_id"), index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True, index=True)  # New: Foreign key to subjects
    subject = Column(String(100), nullable=True)  # Keep for backward compatibility, will be deprecated
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=True)
    marks_obtained = Column(Integer)
    max_marks = Column(Integer, default=100)
    exam_type = Column(String(50)) # Mid-Term, End-Term, Quiz1, Assignment1, etc.
    semester = Column(Integer, nullable=True)
    academic_year = Column(String(20), nullable=True)
    remarks = Column(Text, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    student = relationship("Student", back_populates="marks")
    subject_rel = relationship("Subject", back_populates="marks", foreign_keys=[subject_id])
    teacher = relationship("Teacher", back_populates="marks_entered")
    
    # Composite indexes for performance
    __table_args__ = (
        Index('idx_student_subject', 'student_id', 'subject_id', 'semester'),
        Index('idx_teacher_marks', 'teacher_id', 'semester', 'subject_id'),
    )

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("students.student_id"))
    date = Column(DateTime)
    status = Column(String(20)) # present, absent, late
    
    student = relationship("Student", back_populates="attendance")

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("students.student_id"))
    prediction_date = Column(DateTime, default=datetime.utcnow)
    predicted_category = Column(String(50))
    confidence_score = Column(Float)
    shap_values = Column(JSON)
    
    student = relationship("Student", back_populates="predictions")

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    
    # Personal Info
    full_name = Column(String(100))
    email = Column(String(255))
    phone = Column(String(20), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    github_url = Column(String(255), nullable=True)
    portfolio_url = Column(String(255), nullable=True)
    
    # Resume Sections (JSON for flexibility)
    summary = Column(Text, nullable=True)  # Professional summary/objective
    education = Column(JSON, default=list)  # List of education entries
    skills = Column(JSON, default=list)  # List of skills
    experience = Column(JSON, default=list)  # Work/internship experience
    projects = Column(JSON, default=list)  # Academic/personal projects
    certifications = Column(JSON, default=list, nullable=True)  # Certifications
    achievements = Column(JSON, default=list, nullable=True)  # Awards/achievements
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    student = relationship("Student", backref="resume")
