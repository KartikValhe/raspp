import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from app.models import models
from datetime import datetime, timedelta

def calculate_improvement_rate(marks):
    if not marks or len(marks) < 2:
        return 0.0
    # Simple slope calculation or difference between last and first
    # Assuming marks are sorted by date
    return (marks[-1] - marks[0]) / len(marks)

def engineer_features(student_id: str, db: Session):
    """
    Fetch raw data for a student and generate features for the ML model.
    Returns a pandas DataFrame with a single row.
    """
    
    # 1. Fetch Data
    student = db.query(models.Student).filter(models.Student.student_id == student_id).first()
    if not student:
        raise ValueError(f"Student {student_id} not found")

    marks_data = db.query(models.Mark).filter(models.Mark.student_id == student_id).all()
    attendance_data = db.query(models.Attendance).filter(models.Attendance.student_id == student_id).all()
    
    # 2. Process Marks
    marks_values = [m.marks_obtained for m in marks_data]
    max_marks_values = [m.max_marks for m in marks_data]
    if marks_values:
        total_obtained = sum(marks_values)
        total_max = sum(max_marks_values)
        avg_score = (total_obtained / total_max) * 100 if total_max > 0 else 0
        std_dev = np.std(marks_values)
    else:
        avg_score = 0
        std_dev = 0
        
    # 3. Process Attendance
    total_days = len(attendance_data)
    present_days = len([a for a in attendance_data if a.status == 'Present'])
    attendance_rate = (present_days / total_days * 100) if total_days > 0 else 0
    
    absent_records = [a for a in attendance_data if a.status == 'Absent']
    # consecutive absences could be calculated here (simplified for now)
    cnt_absent = len(absent_records)

    # 4. Construct Feature Dictionary
    features = {
        # Academic Performance
        'avg_score': avg_score,
        'marks_std_dev': std_dev,
        'subject_count': len(marks_data),
        
        # Attendance & Engagement
        'attendance_rate': attendance_rate,
        'total_absences': cnt_absent,
        
        # Derived/Temporal Features (Placeholders for more complex logic)
        'improvement_rate': calculate_improvement_rate(marks_values),
        'consistency_score': 100 - std_dev, # Higher is better
        
        # Static/Demographic (if available)
        'current_semester': student.current_semester,
    }
    
    # Convert to DataFrame
    return pd.DataFrame([features])
