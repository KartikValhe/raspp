from typing import Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.api import deps
from app.core.database import get_db
from app.schemas import schemas
from app.models import models
from app.ml.prediction.predictor import predictor
from app.ml.explainability.shap_explainer import shap_explainer

router = APIRouter()

@router.post("/predict/{student_id}", response_model=schemas.Prediction)
def predict_student_performance(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Make a prediction for a student using the ML model.
    """
    # 1. Verify student exists
    student = db.query(models.Student).filter(models.Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    try:
        # 2. Call Predictor (It handles feature engineering internally)
        result = predictor.predict(student_id, db)
        
        # 3. Save Prediction to DB
        db_prediction = models.Prediction(
            student_id=student_id,
            predicted_category=result['prediction'],
            confidence_score=result['confidence_score'],
            shap_values={"risk_factors": result['risk_factors']} # Store risks in JSON column for now
        )
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)
        
        # Attach risk_factors to response object manually or let Pydantic handle if we map it
        # Since our Schema expects risk_factors as top level, but Model doesn't have it, 
        # we need to be careful. Pydantic from_attributes might fail if attribute doesn't exist on Model.
        # So we explicitly set it on the object instance before returning.
        setattr(db_prediction, "risk_factors", result['risk_factors'])

        return db_prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/explain/{student_id}")
def explain_prediction(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Explain the prediction for a student using SHAP values.
    """
    from app.ml.training.feature_engineering import engineer_features
    
    try:
        # 1. Re-calculate features
        features_df = engineer_features(student_id, db)
        
        # 2. Get Explanation
        explanation = shap_explainer.explain_prediction(features_df)
        
        return {
            "student_id": student_id, 
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/bulk-predict")
async def bulk_predict_from_csv(
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Upload CSV file with student data and get batch predictions.
    CSV must contain columns: student_id, name, branch, avg_score, attendance_rate,
    marks_std_dev, total_absences, subject_count, consistency_score, improvement_rate, current_semester
    """
    import pandas as pd
    import io
    
    # Validate file type
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    try:
        # Read CSV file
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Required columns
        required_columns = [
            'student_id', 'name', 'branch', 'avg_score', 'attendance_rate',
            'marks_std_dev', 'total_absences', 'subject_count',
            'consistency_score', 'improvement_rate', 'current_semester'
        ]
        
        # Validate columns
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {', '.join(missing_columns)}"
            )
        
        # Feature columns for ML model
        feature_columns = [
            'avg_score', 'marks_std_dev', 'subject_count',
            'attendance_rate', 'total_absences',
            'improvement_rate', 'consistency_score', 'current_semester'
        ]
        
        # Load ML model
        import joblib
        import os
        MODEL_PATH = "app/ml/models/ensemble_model.joblib"
        if not os.path.exists(MODEL_PATH):
            raise HTTPException(status_code=500, detail="ML model not found")
        
        model = joblib.load(MODEL_PATH)
        
        # Prepare predictions
        predictions = []
        class_labels = ['At Risk', 'Average', 'Good', 'Excellent']
        
        for idx, row in df.iterrows():
            # Extract features
            features_dict = row[feature_columns].to_dict()
            features_df = pd.DataFrame([features_dict])
            
            # Make prediction
            predicted_class = model.predict(features_df)[0]
            confidence_scores = model.predict_proba(features_df)[0]
            confidence = float(confidence_scores[predicted_class])
            
            prediction_result = {
                "student_id": str(row['student_id']),
                "name": str(row['name']),
                "branch": str(row['branch']),
                "predicted_class": int(predicted_class),
                "predicted_label": class_labels[predicted_class],
                "confidence": round(confidence, 3),
                "features": {
                    "avg_score": float(row['avg_score']),
                    "attendance_rate": float(row['attendance_rate']),
                    "marks_std_dev": float(row['marks_std_dev']),
                    "total_absences": int(row['total_absences']),
                    "consistency_score": float(row['consistency_score']),
                    "improvement_rate": float(row['improvement_rate']),
                }
            }
            predictions.append(prediction_result)
        
        return {
            "total_students": len(predictions),
            "predictions": predictions,
            "summary": {
                "at_risk": sum(1 for p in predictions if p['predicted_class'] == 0),
                "average": sum(1 for p in predictions if p['predicted_class'] == 1),
                "good": sum(1 for p in predictions if p['predicted_class'] == 2),
                "excellent": sum(1 for p in predictions if p['predicted_class'] == 3),
            }
        }
        
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="CSV file is empty")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")
