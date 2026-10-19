# RASPP Enhancement Roadmap

This document outlines the three-phase development plan to enhance the Result Analysis & Student Performance Predictor (RASPP) platform, focusing on AI integrations, Placement Portal enhancements, and ML pipeline automation.

---

## 🏆 Phase 1: The "AI Career Advisor" (GenAI + Explainable AI)
**Goal:** Bridge the gap between raw Machine Learning predictions and actionable student advice by combining Explainable AI (XAI) with Generative AI.

*   **Explainable AI (XAI) Integration:**
    *   Utilize `shap` or `lime` libraries to interpret the outputs of the existing Placement Probability and Academic Performance models.
    *   Extract feature importances for individual students to understand exactly *why* they received a specific prediction (e.g., "High CGPA, but low DSA score").
*   **Generative AI Assistant:**
    *   Feed the XAI insights into a GenAI model (e.g., Gemini or OpenAI).
    *   Generate a personalized, conversational action plan for the student.
    *   *Example Output:* "Your CGPA is great, but to improve your placement chances by 20%, focus on completing one internship and practicing Graph algorithms."
*   **Deliverables:**
    *   FastAPI backend endpoint to orchestrate ML inference, XAI extraction, and GenAI prompting.
    *   A sleek, conversational UI component in the Student Portal for interacting with the AI advisor.

---

## 🏢 Phase 2: Placement Portal Analytics & Mock Interviews
**Goal:** Expand the Placement Portal to provide deeper insights for coordinators and interactive preparation tools for students.

*   **Coordinator Analytics:**
    *   Build dashboards for Placement Coordinators showing predictive hiring trends.
    *   Map student profiles to historical company hiring patterns (e.g., identifying which companies are most likely to hire students with specific tech stacks).
*   **AI Mock Interviews:**
    *   Build an interactive, text-based (or voice-based) mock interview module in the Student Portal.
    *   The GenAI system dynamically generates technical and HR questions based on the skills and projects listed in the student's integrated ATS-resume.
    *   Provide instant feedback and scoring on the student's answers.
*   **Deliverables:**
    *   New analytical charts for the Coordinator Dashboard.
    *   Mock interview chat interface and backend grading logic.

---

## ⚙️ Phase 3: Automated ML Pipeline
**Goal:** Ensure the Machine Learning models remain accurate and up-to-date without manual intervention.

*   **Automated Retraining:**
    *   Set up a background task scheduler (using Celery, APScheduler, or a simple cron job).
    *   Automatically trigger retraining of the Random Forest and XGBoost models at the end of every academic semester.
    *   Incorporate new student grades, attendance records, and actual placement results into the training dataset.
*   **Model Versioning:**
    *   Implement basic model versioning (saving as `model_v1.joblib`, `model_v2.joblib`) to allow rollbacks if a newly trained model underperforms.
*   **Deliverables:**
    *   Automated retraining script in the `backend/app/ml/` directory.
    *   Scheduler configuration in FastAPI.
    *   Admin dashboard widget showing the date of the last model training and its accuracy metrics.
