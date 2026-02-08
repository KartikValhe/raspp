import joblib
import pandas as pd
import numpy as np

# Load the trained model
MODEL_PATH = "app/ml/models/ensemble_model.joblib"
print("=" * 60)
print("RASPP ML Model Details")
print("=" * 60)

try:
    model = joblib.load(MODEL_PATH)
    
    print("\n[1] MODEL ARCHITECTURE")
    print("-" * 60)
    print(f"Model Type: {type(model).__name__}")
    print(f"Voting Strategy: {model.voting}")
    print(f"Number of Base Estimators: {len(model.estimators_)}")
    
    print("\n[2] BASE ESTIMATORS")
    print("-" * 60)
    for name, estimator in model.named_estimators_.items():
        print(f"\n{name.upper()}:")
        print(f"  - Type: {type(estimator).__name__}")
        if hasattr(estimator, 'n_estimators'):
            print(f"  - Number of trees: {estimator.n_estimators}")
        if hasattr(estimator, 'max_depth'):
            print(f"  - Max depth: {estimator.max_depth}")
        if hasattr(estimator, 'random_state'):
            print(f"  - Random state: {estimator.random_state}")
    
    print("\n[3] FEATURE INFORMATION")
    print("-" * 60)
    features = ['avg_score', 'marks_std_dev', 'subject_count',
                'attendance_rate', 'total_absences',
                'improvement_rate', 'consistency_score', 'current_semester']
    print(f"Number of Features: {len(features)}")
    print("Features:")
    for i, feature in enumerate(features, 1):
        print(f"  {i}. {feature}")
    
    print("\n[4] FEATURE IMPORTANCE (Random Forest)")
    print("-" * 60)
    rf_model = model.named_estimators_['rf']
    if hasattr(rf_model, 'feature_importances_'):
        importances = rf_model.feature_importances_
        importance_df = pd.DataFrame({
            'Feature': features,
            'Importance': importances,
            'Percentage': importances * 100
        }).sort_values('Importance', ascending=False)
        
        for idx, row in importance_df.iterrows():
            print(f"  {row['Feature']:20s} : {row['Percentage']:5.2f}%")
    
    print("\n[5] PREDICTION CLASSES")
    print("-" * 60)
    print("Class 0: At Risk       (avg_score < 40 OR attendance < 60%)")
    print("Class 1: Average       (40 ≤ avg_score < 65 AND attendance ≥ 60%)")
    print("Class 2: Good          (65 ≤ avg_score < 80)")
    print("Class 3: Excellent     (avg_score ≥ 80 AND attendance ≥ 85%)")
    
    if hasattr(model, 'classes_'):
        print(f"\nActual Classes in Model: {model.classes_}")
    
    print("\n[6] MODEL METADATA")
    print("-" * 60)
    import os
    import time
    
    if os.path.exists(MODEL_PATH):
        file_size = os.path.getsize(MODEL_PATH)
        mod_time = os.path.getmtime(MODEL_PATH)
        mod_time_str = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(mod_time))
        
        print(f"File Path: {MODEL_PATH}")
        print(f"File Size: {file_size:,} bytes ({file_size/1024:.2f} KB)")
        print(f"Last Modified: {mod_time_str}")
    
    print("\n[7] SAMPLE PREDICTION")
    print("-" * 60)
    # Create a sample student profile
    sample_data = pd.DataFrame({
        'avg_score': [75.0],
        'marks_std_dev': [8.5],
        'subject_count': [6],
        'attendance_rate': [82.0],
        'total_absences': [15],
        'improvement_rate': [2.5],
        'consistency_score': [91.5],
        'current_semester': [4]
    })
    
    prediction = model.predict(sample_data)[0]
    probabilities = model.predict_proba(sample_data)[0]
    
    class_names = ['At Risk', 'Average', 'Good', 'Excellent']
    
    print("Sample Student Profile:")
    print(f"  - Average Score: {sample_data['avg_score'].iloc[0]}")
    print(f"  - Attendance Rate: {sample_data['attendance_rate'].iloc[0]}%")
    print(f"  - Marks Std Dev: {sample_data['marks_std_dev'].iloc[0]}")
    
    print(f"\nPredicted Class: {prediction} ({class_names[prediction]})")
    print("\nClass Probabilities:")
    for i, prob in enumerate(probabilities):
        print(f"  Class {i} ({class_names[i]:10s}): {prob*100:5.2f}%")
    
    print("\n" + "=" * 60)
    print("Model Details Retrieved Successfully!")
    print("=" * 60)
    
except Exception as e:
    print(f"\n❌ Error loading model: {e}")
    import traceback
    traceback.print_exc()
