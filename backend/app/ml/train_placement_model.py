"""
Placement Prediction ML Model Training Script
Trains a model to predict student placement outcomes
"""

import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import numpy as np
import os

# Load the training data
data_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'docs', 'placement_prediction_training_data.csv')
df = pd.read_csv(data_path)

print("Dataset shape:", df.shape)
print("\nFirst few rows:")
print(df.head())
print("\nColumn names:")
print(df.columns.tolist())
print("\nTarget variable distribution:")
print(df['placed'].value_counts())

# Select key features for prediction
# Using a combination of academic performance, technical skills, and experience
features = [
    'cgpa', 'tenth_percentage', 'twelfth_percentage',
    'backlogs', 'java_skill', 'python_skill', 'dsa_level',
    'web_dev', 'db_knowledge', 'projects_count',
    'internship_count', 'aptitude_score', 'coding_score',
    'communication_skill', 'hackathons_count', 'certifications_count',
    'mock_interviews', 'placement_training_attended'
]

X = df[features]
y = df['placed']  # 0 = Not Placed, 1 = Placed

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\nTraining models...")

# Train multiple models
models = {
    'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42, max_depth=5)
}

results = {}
for name, model in models.items():
    print(f"\nTraining {name}...")
    model.fit(X_train_scaled, y_train)
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    results[name] = accuracy
    print(f"{name} Accuracy: {accuracy:.4f}")
    print(f"Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Not Placed', 'Placed']))

# Select best model
best_model_name = max(results, key=results.get)
best_model = models[best_model_name]
print(f"\nBest model: {best_model_name} with accuracy: {results[best_model_name]:.4f}")

# Feature importance (for tree-based models)
if hasattr(best_model, 'feature_importances_'):
    feature_importance = pd.DataFrame({
        'feature': features,
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False)
    print("\nFeature Importance:")
    print(feature_importance.head(10))

# Save the model and scaler
models_dir = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(models_dir, exist_ok=True)

model_path = os.path.join(models_dir, 'placement_model.joblib')
scaler_path = os.path.join(models_dir, 'placement_scaler.joblib')
features_path = os.path.join(models_dir, 'placement_features.joblib')

joblib.dump(best_model, model_path)
joblib.dump(scaler, scaler_path)
joblib.dump(features, features_path)  # Save feature names for consistency

print(f"\nModel saved to: {model_path}")
print(f"Scaler saved to: {scaler_path}")
print(f"Feature list saved to: {features_path}")

# Test prediction
sample_student = X_test.iloc[0:1]
sample_student_scaled = scaler.transform(sample_student)
prediction = best_model.predict(sample_student_scaled)
prediction_proba = best_model.predict_proba(sample_student_scaled)

print("\nSample Prediction:")
print(f"Student data: {sample_student.to_dict('records')[0]}")
print(f"Prediction: {'Placed' if prediction[0] == 1 else 'Not Placed'}")
print(f"Confidence: {prediction_proba[0][prediction[0]]:.2%}")

print("\nTraining completed successfully!")
print(f"Features used ({len(features)}): {features}")
