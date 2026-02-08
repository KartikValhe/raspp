from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_user
import app.models.models as models
from app.models.placement_models import JobPosting, PlacementRecord, PlacementPrediction
from app.schemas.placement import (
    JobPostingCreate, JobPostingUpdate, JobPostingResponse,
    PlacementRecordCreate, PlacementRecordUpdate, PlacementRecordResponse,
    PlacementPredictionResponse, PlacementStatistics, BulkPredictionStudent
)
import pandas as pd
import joblib
import os
from datetime import datetime
import io

router = APIRouter(prefix="/api/v1/placement", tags=["placement"])

# Load ML model
ML_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'ml', 'models')
model = joblib.load(os.path.join(ML_DIR, 'placement_model.joblib'))
scaler = joblib.load(os.path.join(ML_DIR, 'placement_scaler.joblib'))
feature_names = joblib.load(os.path.join(ML_DIR, 'placement_features.joblib'))

# ==================== JOB POSTINGS ====================

@router.post("/jobs", response_model=JobPostingResponse, status_code=status.HTTP_201_CREATED)
def create_job_posting(
    job_data: JobPostingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Create a new job posting (Placement Coordinator only)"""
    if current_user.role != "placement_coordinator":
        raise HTTPException(status_code=403, detail="Only placement coordinators can create job postings")
    
    db_job = JobPosting(**job_data.dict(), posted_by=current_user.id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/jobs", response_model=List[JobPostingResponse])
def get_job_postings(
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get all job postings"""
    query = db.query(JobPosting)
    if active_only:
        query = query.filter(JobPosting.is_active == True)
    return query.order_by(JobPosting.created_at.desc()).all()

@router.put("/jobs/{job_id}", response_model=JobPostingResponse)
def update_job_posting(
    job_id: int,
    job_update: JobPostingUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Update a job posting (Placement Coordinator only)"""
    if current_user.role != "placement_coordinator":
        raise HTTPException(status_code=403, detail="Only placement coordinators can update job postings")
    
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
    
    for key, value in job_update.dict(exclude_unset=True).items():
        setattr(job, key, value)
    
    db.commit()
    db.refresh(job)
    return job

@router.delete("/jobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job_posting(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Delete a job posting (Placement Coordinator only)"""
    if current_user.role != "placement_coordinator":
        raise HTTPException(status_code=403, detail="Only placement coordinators can delete job postings")
    
    job = db.query(JobPosting).filter(JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
    
    db.delete(job)
    db.commit()
    return None

# ==================== PLACEMENT RECORDS ====================

@router.post("/records", response_model=PlacementRecordResponse, status_code=status.HTTP_201_CREATED)
def create_placement_record(
    record_data: PlacementRecordCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Create a placement record (Placement Coordinator only)"""
    if current_user.role != "placement_coordinator":
        raise HTTPException(status_code=403, detail="Only placement coordinators can create placement records")
    
    db_record = PlacementRecord(**record_data.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.get("/records", response_model=List[PlacementRecordResponse])
def get_placement_records(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get all placement records"""
    return db.query(PlacementRecord).order_by(PlacementRecord.placed_date.desc()).all()

# ==================== PREDICTIONS ====================

@router.get("/my-prediction", response_model=PlacementPredictionResponse)
def get_my_prediction(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get placement prediction for current student"""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can check their predictions")
    
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    # Get latest prediction for this student
    prediction = db.query(PlacementPrediction).filter(
        PlacementPrediction.student_id == student.id
    ).order_by(PlacementPrediction.predicted_at.desc()).first()
    
    if not prediction:
        raise HTTPException(status_code=404, detail="No prediction found. Please contact placement coordinator.")
    
    return prediction

@router.post("/upload-csv")
async def upload_csv_for_predictions(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Upload CSV file for bulk placement predictions (Placement Coordinator only)"""
    if current_user.role != "placement_coordinator":
        raise HTTPException(status_code=403, detail="Only placement coordinators can upload CSV")
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Validate required columns
        required_cols = ['student_id'] + feature_names
        missing_cols = set(required_cols) - set(df.columns)
        if missing_cols:
            raise HTTPException(
                status_code=400,
                detail=f"Missing columns: {missing_cols}. Required: {required_cols}"
            )
        
        # Make predictions
        X = df[feature_names]
        X_scaled = scaler.transform(X)
        predictions = model.predict(X_scaled)
        probabilities = model.predict_proba(X_scaled)
        
        # Store predictions in database
        results = []
        for idx, row in df.iterrows():
            student_id_str = str(row['student_id'])
            pred = predictions[idx]
            conf = float(probabilities[idx][pred])
            
            # Find student in database
            student = db.query(models.Student).filter(
                models.Student.student_id == student_id_str
            ).first()
            
            if student:
                # Create prediction record
                db_pred = PlacementPrediction(
                    student_id=student.id,
                    prediction="Placed" if pred == 1 else "Not Placed",
                    confidence=conf,
                    features=row[feature_names].to_dict()
                )
                db.add(db_pred)
                
                results.append({
                    "student_id": student_id_str,
                    "name": student.full_name,
                    "prediction": "Placed" if pred == 1 else "Not Placed",
                    "confidence": conf
                })
        
        db.commit()
        
        return {
            "message": f"Processed {len(results)} students",
            "predictions": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV: {str(e)}")

# ==================== STATISTICS ====================

@router.get("/statistics", response_model=PlacementStatistics)
def get_placement_statistics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get overall placement statistics"""
    total_students = db.query(models.Student).count()
    placed_records = db.query(PlacementRecord).filter(PlacementRecord.status == "placed").all()
    total_placed = len(placed_records)
    
    placement_percentage = (total_placed / total_students * 100) if total_students > 0 else 0
    
    packages = [r.package for r in placed_records if r.package]
    average_package = sum(packages) / len(packages) if packages else 0
    highest_package = max(packages) if packages else 0
    
    total_companies = db.query(PlacementRecord.company_name).distinct().count()
    active_jobs = db.query(JobPosting).filter(JobPosting.is_active == True).count()
    
    return PlacementStatistics(
        total_students=total_students,
        total_placed=total_placed,
        placement_percentage=placement_percentage,
        average_package=average_package,
        highest_package=highest_package,
        total_companies=total_companies,
        active_jobs=active_jobs
    )
