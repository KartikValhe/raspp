import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split

MODEL_DIR = "app/ml/models"
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "ensemble_model.joblib")
CSV_PATH = "d:/raspp - Copy/docs/student_data.csv"

def generate_labels(avg_score, attendance_rate):
    """
    Generate synthetic labels based on avg_score and attendance_rate.
    3: Excellent, 2: Good, 1: Average, 0: At Risk
    """
    if avg_score >= 80 and attendance_rate >= 85:
        return 3
    elif avg_score >= 65:
        return 2
    elif avg_score >= 40 and attendance_rate >= 60:
        return 1
    else:
        return 0

def load_training_data_from_csv():
    """
    Load data from CSV and generate labels for training.
    """
    print(f"Loading data from {CSV_PATH}...")
    df = pd.read_csv(CSV_PATH)
    
    print(f"Loaded {len(df)} records")
    
    # Select features (must match what the model expects)
    feature_columns = [
        'avg_score', 'marks_std_dev', 'subject_count',
        'attendance_rate', 'total_absences',
        'improvement_rate', 'consistency_score', 'current_semester'
    ]
    
    X = df[feature_columns]
    
    # Generate labels
    y = df.apply(lambda row: generate_labels(row['avg_score'], row['attendance_rate']), axis=1)
    
    print(f"Feature shape: {X.shape}")
    print(f"Label distribution: {y.value_counts().sort_index().to_dict()}")
    
    return X, y

def train_and_save_model():
    print("=" * 50)
    print("Starting Model Training from CSV...")
    print("=" * 50)
    
    try:
        X, y = load_training_data_from_csv()
        
        if X.empty:
            print("No data available for training.")
            return
            
        # Ensure y is proper type
        y = y.astype(int)
        print(f"Unique labels in dataset: {sorted(y.unique())}")

        # Split Data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        print(f"Training set: {len(X_train)} samples")
        print(f"Test set: {len(X_test)} samples")
        
        # 1. Random Forest
        print("\nTraining Random Forest...")
        rf = RandomForestClassifier(n_estimators=100, random_state=42)
        
        # 2. XGBoost
        print("Training XGBoost...")
        xgb = XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
        
        # 3. Ensemble (Voting)
        print("Creating Voting Ensemble...")
        ensemble = VotingClassifier(
            estimators=[('rf', rf), ('xgb', xgb)],
            voting='soft'
        )
        
        # Train
        print("\nFitting ensemble model...")
        ensemble.fit(X_train, y_train)
        
        # Evaluate
        print("\nEvaluating model...")
        train_accuracy = ensemble.score(X_train, y_train)
        test_accuracy = ensemble.score(X_test, y_test)
        
        print(f"Training Accuracy: {train_accuracy:.2%}")
        print(f"Test Accuracy: {test_accuracy:.2%}")
        
        # Save
        print(f"\nSaving model to {MODEL_PATH}...")
        joblib.dump(ensemble, MODEL_PATH)
        print("✓ Model saved successfully!")
        
        print("=" * 50)
        print("Model Training Complete!")
        print("=" * 50)
        
    except Exception as e:
        print(f"Training failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    train_and_save_model()
