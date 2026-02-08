import joblib
import pandas as pd
import numpy as np

MODEL_PATH = "app/ml/models/ensemble_model.joblib"

def inspect_model():
    try:
        model = joblib.load(MODEL_PATH)
        print("Model Loaded Successfully.")
        print(f"Model Type: {type(model)}")
        
        if hasattr(model, 'estimators_'):
            print(f"Voting Classifier with {len(model.estimators_)} estimators.")
            
            feature_names = [
                'avg_score',
                'marks_std_dev',
                'subject_count',
                'attendance_rate',
                'total_absences',
                'improvement_rate',
                'consistency_score',
                'current_semester'
            ]
            
            total_importances = np.zeros(len(feature_names))
            valid_estimators = 0
            
            for i, est in enumerate(model.estimators_):
                print(f"\nEstimator {i}: {type(est)}")
                if hasattr(est, 'feature_importances_'):
                    imps = est.feature_importances_
                    print(f"  Importances found: {imps}")
                    if len(imps) == len(feature_names):
                        total_importances += imps
                        valid_estimators += 1
                else:
                    print("  No feature_importances_ found.")
            
            if valid_estimators > 0:
                avg_importances = total_importances / valid_estimators
                # Create a DataFrame for nice printing
                df = pd.DataFrame({'feature': feature_names, 'weightage': avg_importances * 100}) # Convert to percentage
                df = df.sort_values(by='weightage', ascending=False)
                
                output_str = "\n=== Final Aggregated Feature Weights (%) ===\n" + df.round(2).to_string()
                print(output_str)
                with open("weights.txt", "w") as f:
                    f.write(output_str)
            else:
                print("Could not extract importances from any estimator.")

        elif hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            # ... (rest of simple model logic)

            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_model()
