try:
    print("Importing predictor...")
    from app.ml.prediction.predictor import predictor
    print("Predictor imported successfully.")
    
    print("Importing shap_explainer...")
    from app.ml.explainability.shap_explainer import shap_explainer
    print("SHAP Explainer imported successfully.")
    
    print("Importing main app...")
    from app.main import app
    print("Main app imported successfully.")
    
except Exception as e:
    print(f"CRITICAL ERROR during import: {e}")
    exit(1)
