import joblib
import os
import pandas as pd
from app.ml.training.feature_engineering import engineer_features
from app.core.database import SessionLocal
from app.models import models

MODEL_PATH = "app/ml/models/ensemble_model.joblib"

class StudentPerformancePredictor:
    def __init__(self):
        self.model = None
        self._load_model()
        
    def _load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                print(f"Model loaded successfully from {MODEL_PATH}")
            except Exception as e:
                print(f"ERROR: Failed to load model from {MODEL_PATH}: {e}")
                self.model = None
        else:
            print(f"Warning: Model not found at {MODEL_PATH}. Predictions will fail.")
    
    def predict(self, student_id: str, db: SessionLocal):
        if not self.model:
            self._load_model()
            if not self.model:
                raise Exception("Model not trained yet.")
                
        # 1. Engineer Features
        features_df = engineer_features(student_id, db)
        
        # 2. Predict
        # The model expects specific feature columns order. 
        # Ensure engineer_features always produces consistent columns.
        # Multi-Class Prediction
        # 0: At Risk, 1: Average, 2: Good, 3: Excellent
        predicted_class = self.model.predict(features_df)[0]
        prediction_probs = self.model.predict_proba(features_df)[0]
        
        category_map = {
            3: "Excellent",
            2: "Good",
            1: "Average",
            0: "At Risk"
        }
        
        predicted_category = category_map.get(predicted_class, "Average")
        confidence_score = float(prediction_probs[predicted_class])
        
        return {
            "prediction": predicted_category,
            "confidence_score": confidence_score,
            "features": features_df.to_dict(orient='records')[0],
            "risk_factors": self._generate_risk_factors(features_df.iloc[0], predicted_category)
        }

    def _generate_risk_factors(self, features, category):
        """
        Generate dynamic risk factors based on student features.
        Ensures at least 2 factors are returned for diversity.
        """
        risks = []
        
        # 1. Analyze specific metrics
        if features['attendance_rate'] < 75:
            risks.append("Critical Warning: Low Attendance (<75%)")
        elif features['attendance_rate'] < 85:
            risks.append("Declining Attendance Trend")
            
        if features['avg_score'] < 50:
            risks.append("Critical: Low Aggregate Marks")
        elif features['avg_score'] < 65:
            risks.append("Below Average Academic Performance")
            
        if features['improvement_rate'] < 0:
            risks.append("Negative Performance Trajectory")
            
        if features['consistency_score'] < 80:
            risks.append("High Volatility in Grades")

        # 2. Add Category-specific context
        if category == "At Risk":
            if not risks:
                risks.append("Overall Performance indicates Examination Risk")

        # 3. Ensure Diversity (Minimum 2 factors)
        # If we don't have enough "real" risks (e.g. good student), add positive or neutral observations formatted as factors
        # or hypothetical risks for improvement.
        import random
        potential_fillers = [
            "Consistency could be improved",
            "Subject complexity may increase next semester",
            "Monitor elective subject performance",
            "Focus on practical lab evaluations",
            "Maintain current momentum",
            "Review internal assessment strategy"
        ]
        
        while len(risks) < 2:
            filler = random.choice(potential_fillers)
            if filler not in risks:
                risks.append(filler)
                
        return risks[:5] # Limit to 5 max

predictor = StudentPerformancePredictor()
