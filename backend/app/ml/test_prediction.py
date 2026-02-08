import joblib
import pandas as pd
import os
import sys

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    # Load model artifacts
    base_path = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_path, 'models', 'placement_model.joblib')
    scaler_path = os.path.join(base_path, 'models', 'placement_scaler.joblib')
    features_path = os.path.join(base_path, 'models', 'placement_features.joblib')

    print(f"Loading model from {model_path}")
    model = joblib.load(model_path)
    print("Model loaded")

    print(f"Loading scaler from {scaler_path}")
    scaler = joblib.load(scaler_path)
    print("Scaler loaded")

    print(f"Loading features from {features_path}")
    feature_names = joblib.load(features_path)
    print(f"Features: {feature_names}")

    # Create dummy data
    data = {
        'cgpa': [8.5],
        'tenth_percentage': [90],
        'twelfth_percentage': [88],
        'backlogs': [0],
        'java_skill': [4],
        'python_skill': [3],
        'dsa_level': [2],
        'web_dev': [1],
        'db_knowledge': [1],
        'projects_count': [2],
        'internship_count': [1],
        'aptitude_score': [75],
        'coding_score': [80],
        'communication_skill': [4],
        'hackathons_count': [1],
        'certifications_count': [2],
        'mock_interviews': [5],
        'placement_training_attended': [1]
    }
    
    df = pd.DataFrame(data)
    
    # Check for missing features
    missing_cols = set(feature_names) - set(df.columns)
    if missing_cols:
        print(f"Missing columns: {missing_cols}")
    else:
        print("All features present")
        
    # Scale and predict
    X = df[feature_names]
    X_scaled = scaler.transform(X)
    print("Data scaled")
    
    prediction = model.predict(X_scaled)
    print(f"Prediction: {prediction}")
    
    proba = model.predict_proba(X_scaled)
    print(f"Probability: {proba}")

except Exception as e:
    print(f"Error: {e}")
