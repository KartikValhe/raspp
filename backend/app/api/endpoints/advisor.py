from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api import deps
from app.models import models
from app.services.gemini_service import advisor_service
from app.services.ml_service import ml_service

router = APIRouter()

class CareerAdviceResponse(BaseModel):
    advice: str

@router.get("/generate/{student_id}", response_model=CareerAdviceResponse)
def get_career_advice(
    student_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    # Fetch the student from the database
    student = db.query(models.Student).filter(models.Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # In a real scenario, you'd fetch all their marks, attendance, and resume details here.
    # We will build a simplified profile dictionary for the AI.
    student_profile = {
        "student_id": student.student_id,
        "full_name": student.full_name,
        "current_semester": student.current_semester,
        # Mocking some metrics for the demonstration
        "attendance_rate": 85, 
        "prev_semester_gpa": 7.8,
        "internships": 0
    }

    # Get ML Prediction and SHAP explanation
    prediction = ml_service.predict(student_profile)
    explanation = ml_service.explain(student_profile)

    # Generate Advice via Gemini
    advice_text = advisor_service.generate_career_advice(
        student_profile=student_profile,
        ml_prediction=prediction,
        shap_explanation=explanation
    )

    return CareerAdviceResponse(advice=advice_text)
