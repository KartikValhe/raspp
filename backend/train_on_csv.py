import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import warnings
warnings.filterwarnings('ignore')

def generate_labels(row):
    avg_score = row.get('avg_score', 0)
    attendance = row.get('attendance_rate', 0)
    if avg_score >= 80 and attendance >= 85:
        return 3 # Excellent
    elif avg_score >= 65:
        return 2 # Good
    elif avg_score >= 40 and attendance >= 60:
        return 1 # Average
    else:
        return 0 # At Risk

def run_training():
    print("Loading dataset from C:\\raspp\\docs\\RASPP_10000_Students_Synthetic.csv...")
    df = pd.read_csv(r"C:\raspp\docs\RASPP_10000_Students_Synthetic.csv")
    
    print(f"Dataset loaded. Total records: {len(df)}")
    
    # Generate Labels
    df['target'] = df.apply(generate_labels, axis=1)
    
    # Select numeric features
    feature_cols = [
        'current_semester', 'avg_score', 'attendance_rate', 
        'marks_std_dev', 'total_absences', 'subject_count', 
        'consistency_score', 'improvement_rate'
    ]
    
    X = df[feature_cols].fillna(0)
    y = df['target']
    
    print(f"\nClass Distribution:\n{y.value_counts().sort_index()}")
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("\n--- Training Random Forest ---")
    rf = RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42)
    rf.fit(X_train, y_train)
    rf_preds = rf.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_preds)
    print(f"Random Forest Accuracy: {rf_acc:.4f}")
    
    print("\n--- Training XGBoost ---")
    xgb = XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    xgb.fit(X_train, y_train)
    xgb_preds = xgb.predict(X_test)
    xgb_acc = accuracy_score(y_test, xgb_preds)
    print(f"XGBoost Accuracy: {xgb_acc:.4f}")
    
    print("\n--- Training Final Ensemble (Soft Voting) ---")
    ensemble = VotingClassifier(
        estimators=[('rf', rf), ('xgb', xgb)],
        voting='soft'
    )
    ensemble.fit(X_train, y_train)
    ensemble_preds = ensemble.predict(X_test)
    ensemble_acc = accuracy_score(y_test, ensemble_preds)
    print(f"Ensemble Accuracy: {ensemble_acc:.4f}")
    
    print("\n--- Final Ensemble Classification Report ---")
    print(classification_report(y_test, ensemble_preds, target_names=['At Risk', 'Average', 'Good', 'Excellent']))
    
    # Save Model
    model_path = r"C:\raspp\backend\app\ml\models\ensemble_csv_model.joblib"
    joblib.dump(ensemble, model_path)
    print(f"\nModel successfully saved to {model_path}")

if __name__ == '__main__':
    run_training()
