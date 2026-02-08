import shap
import joblib
import os
import pandas as pd
import numpy as np

MODEL_PATH = "app/ml/models/ensemble_model.joblib"

class SHAPExplainer:
    def __init__(self):
        self.explainer = None
        self.model = None
        self._load_resources()
        
    def _load_resources(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
            except Exception as e:
                print(f"ERROR: Failed to load model for SHAP: {e}")
                self.model = None
                return

            # For Ensemble/VotingClassifier, shap.TreeExplainer might be tricky directly.
            # We usually explain the underlying estimators or use KernelExplainer (slower).
            # For speed/demo, if Voting is soft, we might pick the strongest estimator (e.g. XGB) to explain,
            # or use KernelExplainer on the whole pipeline (slow).
            
            # Let's try to grab the XGBoost estimator from the ensemble for TreeExplainer (fast)
            # Assuming 'xgb' is one of the estimators
            try:
                estimator = self.model.named_estimators_['xgb']
                self.explainer = shap.TreeExplainer(estimator)
            except:
                # Fallback to KernelExplainer (needs background data, simplified here)
                pass 

    def explain_prediction(self, features_df):
        if not self.explainer:
             # Try refreshing in case model was just trained
            self._load_resources()
            if not self.explainer:
                 return {"error": "Explainer not initialized"}

        # Calculate SHAP values
        shap_values = self.explainer.shap_values(features_df)
        
        # Handle different SHAP return shapes (binary vs multiclass)
        if isinstance(shap_values, list):
            # For binary classification, index 1 is usually the positive class
            sv = shap_values[1] if len(shap_values) > 1 else shap_values[0]
        else:
            sv = shap_values

        # Create mapping of feature -> impact
        feature_names = features_df.columns
        explanation = []
        
        # sv is (n_samples, n_features), features_df is (1, n_features)
        # Flatten
        impacts = sv[0] if len(sv.shape) > 1 else sv
        
        for i, feat in enumerate(feature_names):
            explanation.append({
                "feature": feat,
                "impact": float(impacts[i]),
                "value": float(features_df.iloc[0, i])
            })
            
        # Sort by absolute impact
        explanation.sort(key=lambda x: abs(x['impact']), reverse=True)
        
        return {
            "top_contributors": explanation[:5], # Top 5 factors
            "base_value": float(self.explainer.expected_value) if hasattr(self.explainer, 'expected_value') else 0
        }

shap_explainer = SHAPExplainer()
