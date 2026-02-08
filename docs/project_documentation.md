# Academic Project Documentation

## 1. Project Folder Structure

### Frontend (`frontend/`)
- `src/components/`: Reusable UI components (Sidebar, Charts, Tables)
- `src/pages/`: Main application pages (Student, Teacher, Admin portals)
- `src/context/`: State management (Auth, Theme)
- `src/services/`: API integration and services
- `src/assets/`: Static assets and images
- `config files`: `vite.config.ts`, `tailwind.config.js`

### Backend (`backend/`)
- `app/api/`: API route controllers (endpoints)
- `app/core/`: Core configuration (Database, Security)
- `app/models/`: Database schema definitions (SQLAlchemy)
- `app/schemas/`: Pydantic data validation schemas
- `app/services/`: Business logic layer
- `root`: `main.py` entry point, `requirements.txt`

### Machine Learning (`backend/app/ml/`)
- `training/`: Training pipelines and feature engineering scripts (`train_pipeline.py`)
- `models/`: Serialized model files (`.joblib`)
- `prediction/`: Inference logic and explanation generation

---

## 2. Technologies Used

- **Frontend**: React (TypeScript), Vite, Tailwind CSS
- **Backend**: Python, FastAPI
- **Database**: MySQL (via SQLAlchemy ORM)
- **Machine Learning**: Scikit-Learn, XGBoost

---

## 3. Machine Learning Algorithm Used

- **Ensemble Voting Classifier** combining:
  1. **Random Forest Classifier** (Bagging)
  2. **XGBoost Classifier** (Gradient Boosting)

---

## 4. Frameworks & Libraries Used

### Frontend
- **Framework**: top-level `React 19`
- **Routing**: `react-router-dom`
- **Styling**: `Tailwind CSS`, `clsx`, `tailwind-merge`
- **Animations**: `Framer Motion`
- **Charts**: `Recharts`
- **Icons**: `Lucide React`
- **HTTP Client**: `Axios`

### Backend
- **Framework**: `FastAPI` (ASGI)
- **Server**: `Uvicorn`
- **ORM**: `SQLAlchemy`
- **Validation**: `Pydantic`
- **Auth**: `python-jose` (JWT), `Passlib` (Bcrypt)

### Machine Learning
- **Core**: `Scikit-Learn`, `XGBoost`
- **Data Processing**: `Pandas`, `NumPy`
- **Explainability**: `SHAP`, `LIME`
- **Serialization**: `Joblib`

---

## 5. Project Details

**RASPP (Result Analysis and Student Performance Prediction)** is a comprehensive full-stack academic platform designed to manage and analyze student performance. It features distinct portals for Students, Teachers, and Administrators, providing real-time result checking, attendance tracking, and detailed scorecards. The core innovation lies in its **AI-driven predictive analytics module**, which uses an ensemble Machine Learning model to forecast student success probabilities and identify at-risk students early, enabling proactive academic intervention.
