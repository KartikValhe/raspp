import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import shap
from datetime import datetime

class MLService:
    def __init__(self):
        self.model_path = "app/ml/models/student_performance_model.joblib"
        self.model = None
        self.explainer = None
        self.feature_names = [
            'attendance_rate', 'study_hours_per_week', 'prev_semester_gpa', 
            'assignment_completion_rate', 'quiz_avg_score', 'lab_performance'
        ]
        self._load_model()

    def _load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                # Initialize SHAP explainer for tree models
                # Note: fast execution; for larger models use TreeExplainer optimized
                self.explainer = shap.TreeExplainer(self.model)
                print("Model loaded successfully.")
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = None

    def train_model(self, data: pd.DataFrame):
        """
        Train a Random Forest model on student data.
        """
        # Prepare Features and Target
        X = data[self.feature_names]
        # Assuming 'target' col exists: 0=Fail, 1=Pass, 2=Excellent (simplified)
        # For this MVP we'll do Binary: 0=At Risk, 1=Safe
        y = data['is_successful']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
        clf.fit(X_train, y_train)

        # Evaluate
        accuracy = clf.score(X_test, y_test)
        print(f"Model trained. Accuracy: {accuracy:.2f}")

        # Save
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(clf, self.model_path)
        
        self.model = clf
        self.explainer = shap.TreeExplainer(self.model)
        return accuracy

    def predict(self, student_features: dict):
        """
        Make a prediction for a single student.
        """
        if not self.model:
            # Fallback or initialization if model doesn't exist
            # Create a dummy model for MVP flow if no data trained yet
            return self._mock_prediction(student_features)

        # Convert dict to DataFrame (1 row)
        df = pd.DataFrame([student_features], columns=self.feature_names)
        
        # Predict
        prediction_class = self.model.predict(df)[0]
        probabilities = self.model.predict_proba(df)[0]
        confidence = max(probabilities)

        # Map class to label
        label = "Excellent" if prediction_class == 1 else "At Risk" 
        # (Simplified logic, real logic would map classes 0..N)
        
        return {
            "prediction": label,
            "confidence": float(confidence),
            "raw_class": int(prediction_class)
        }

    def explain(self, student_features: dict):
        """
        Generate SHAP feature importance for a prediction.
        """
        if not self.explainer or not self.model:
             return self._mock_explanation(student_features)

        df = pd.DataFrame([student_features], columns=self.feature_names)
        
        shap_values = self.explainer.shap_values(df)
        
        # For binary classification, shap_values is a list of arrays [class0, class1]
        # We process class 1 (Positive/Success) usually
        values = shap_values[1][0] if isinstance(shap_values, list) else shap_values[0]

        # Structure explanation
        explanation = []
        for feat, val in zip(self.feature_names, values):
            explanation.append({
                "feature": feat,
                "importance": float(val),
                "impact": "positive" if val > 0 else "negative"
            })
        
        # Sort by absolute importance
        explanation.sort(key=lambda x: abs(x['importance']), reverse=True)
        return explanation

    def _mock_prediction(self, features):
        # Fallback logic based on rule-based (MVP requirement)
        score = (features.get('prev_semester_gpa', 0) * 10 + features.get('attendance_rate', 0))/2
        if score > 75:
            return {"prediction": "Excellent", "confidence": 0.90}
        elif score > 45:
             return {"prediction": "Good", "confidence": 0.80}
        else:
             return {"prediction": "At Risk", "confidence": 0.85}

    def _mock_explanation(self, features):
        return [
            {"feature": "prev_semester_gpa", "importance": 0.45, "impact": "positive"},
            {"feature": "attendance_rate", "importance": 0.35, "impact": "negative"}
        ]

ml_service = MLService()
