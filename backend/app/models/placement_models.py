from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, JSON, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class JobPosting(Base):
    """Job opportunities posted by placement coordinator"""
    __tablename__ = "job_postings"
    
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(200), nullable=False)
    job_role = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    requirements = Column(Text, nullable=True)
    package_range = Column(String(100), nullable=True)  # e.g., "5-7 LPA"
    eligibility_criteria = Column(JSON, nullable=True)  # {"min_cgpa": 7.0, "max_backlogs": 2}
    deadline = Column(DateTime, nullable=True)
    posted_by = Column(Integer, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    posted_by_user = relationship("User", foreign_keys=[posted_by])

class PlacementRecord(Base):
    """Track placement outcomes for students"""
    __tablename__ = "placement_records"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    company_name = Column(String(200), nullable=False)
    job_role = Column(String(200), nullable=False)
    package = Column(Float, nullable=True)  # LPA
    placed_date = Column(DateTime, nullable=True)
    status = Column(String(50), default="pending")  # 'placed', 'pending', 'not_placed'
    offer_letter_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    student = relationship("Student", foreign_keys=[student_id])

class PlacementPrediction(Base):
    """Store placement predictions for students"""
    __tablename__ = "placement_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    prediction = Column(String(50), nullable=False)  # 'Placed', 'Not Placed'
    confidence = Column(Float, nullable=False)
    features = Column(JSON, nullable=True)  # Store input features used for prediction
    predicted_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    student = relationship("Student", foreign_keys=[student_id])
