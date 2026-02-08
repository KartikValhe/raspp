import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from app.ml.training.feature_engineering import engineer_features
from app.core.database import SessionLocal
from app.models import models

MODEL_DIR = "app/ml/models"
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "ensemble_model.joblib")

def load_training_data(db):
    """
    Load data for all students and generate labels for training.
    In a real system, labels would come from historical records (e.g. final grades).
    Here we generate synthetic labels based on a rule for demonstration.
    """
    students = db.query(models.Student).all()
    X_list = []
    y_list = []
    
    for student in students:
        # Get Features
        features_df = engineer_features(student.student_id, db)
        X_list.append(features_df)
        
        # Generate Synthetic Label (Pass/Fail) based on avg_score
        # Real-world: This would be the actual final Exam Result
        avg_score = features_df['avg_score'].iloc[0]
        attendance = features_df['attendance_rate'].iloc[0]
        
        # Simple logic for "Ground Truth" to train the model
        # Ground Truth Logic for Training (Multi-Class)
        # 3: Excellent, 2: Good, 1: Average, 0: At Risk
        if avg_score >= 80 and attendance >= 85:
            label = 3
        elif avg_score >= 65: # Relaxed attendance for Good if score is decent
            label = 2
        elif avg_score >= 40 and attendance >= 60:
            label = 1
        else:
            label = 0
            
        y_list.append(label)
        
    if not X_list:
        return pd.DataFrame(), pd.Series()
        
    X = pd.concat(X_list, ignore_index=True)
    y = pd.Series(y_list)
    return X, y

def train_and_save_model():
    print("Starting Model Training...")
    db = SessionLocal()
    try:
        X, y = load_training_data(db)
        
        if X.empty:
            print("No data available for training.")
            return
            
        # Ensure y is proper type
        y = y.astype(int)
        print(f"Unique labels in dataset: {y.unique()}")

        # Split Data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # 1. Random Forest
        rf = RandomForestClassifier(n_estimators=100, random_state=42)
        
        # 2. XGBoost
        xgb = XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
        
        # 3. Ensemble (Voting)
        ensemble = VotingClassifier(
            estimators=[('rf', rf), ('xgb', xgb)],
            voting='soft'
        )
        
        # Train
        ensemble.fit(X_train, y_train)
        
        # Evaluate
        accuracy = ensemble.score(X_test, y_test) if len(X_test) > 0 else 1.0
        print(f"Model Training Complete. Accuracy: {accuracy:.2%}")
        
        # Save
        joblib.dump(ensemble, MODEL_PATH)
        print(f"Model saved to {MODEL_PATH}")
        
    except Exception as e:
        print(f"Training failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    train_and_save_model()
