# Result Analysis & Student Performance Predictor (RASPP)

Phase 1 (Academic Analytics) + Phase 2 (Placement Intelligence) — desktop research demonstration portal.

Clone this repository, run one command, and open the web portal on your PC. This is not a hosted cloud product.

---

## Clone & start (one command)

```bash
git clone https://github.com/KartikValhe/deploy.git raspp
cd raspp
```

### Windows

```bash
start.bat
```

or:

```powershell
.\start.ps1
```

### macOS / Linux

```bash
chmod +x start.sh
./start.sh
```

That command will:

1. Create a Python `.venv` and install `requirements.txt`
2. Install the React app under `frontend/`
3. Prepare ML model artifacts and database configuration
4. Start the API on `http://127.0.0.1:8000`
5. Start the UI on `http://127.0.0.1:5173` (or `:3000` if 5173 is busy)

---

## Login

Change these before a public GitHub repository.

| User | Password | Role |
| :--- | :--- | :--- |
| `admin@example.com` | `admin123` | Administrator (System, Curriculum & RBAC) |
| `teacher@example.com` | `teacher123` | Faculty / Evaluator (Marks & Risk Alerts) |
| `student@example.com` | `student123` | Student Portal (Results, Resume & Transcripts) |
| `coordinator@example.com` | `coordinator123` | Placement Cell (Drives & AI Placement) |

Open `http://127.0.0.1:5173`

---

## Prerequisites

- **Python 3.10+** (3.10 or 3.11 recommended)
- **Node.js 18+** and npm
- **MySQL Server** or **TiDB Cloud** (or Docker)
- ~2 GB free disk for first-run packages + sample ML data

---

## Features & Portals

### 🎓 Student Portal
- **Dashboard**: Real-time overview of attendance, current SGPA, and cumulative CGPA.
- **Result Analysis**: Visual breakdown of semester-wise performance (marks, trends, subject grades).
- **Resume Builder**: Integrated tool to build ATS-friendly, recruiter-ready resumes.
- **Placement Cell**: View campus job openings, eligibility criteria, and placement predictions.
- **Transcript**: View and download official academic transcripts in high-fidelity A4 PDF format.

### 👩‍🏫 Teacher Portal
- **Marks Entry**: Streamlined interface for entering student grades with automatic calculations.
- **Bulk Prediction**: Upload CSV spreadsheets to predict performance for entire batches using ML.
- **Analytics**: Class-wise performance reports, pass/fail ratios, and grade distribution charts.
- **Attendance Management**: Track and update section-wise student attendance status with risk threshold alerts.

### 💼 Placement Portal
- **Coordinator Dashboard**: Track key metrics including Placement Rate, Average Package, and Highest CTC.
- **Job Management**: Post and manage recruitment listings for prospective student applicants.
- **AI Predictions**: Predict student placement probability using a specialized Random Forest model (~95% accuracy).
- **Records**: Archive and manage verified student placement records and offer letters.

### 🛠️ Admin Portal
- **User Management**: Manage Students, Teachers, and Placement Coordinators.
- **System Configuration**: Manage academic branches, semesters, subjects, and credits.
- **Predictive Analytics**: System-wide performance overview, risk distribution, and department health.

### 🤖 RASPP Assistant (AI Chatbot)
- **Google Gemini 2.5 Integration**: Interactive chatbot assisting with academic queries, grading rubrics, and portal navigation.
- **Zero-Downtime Offline Fallback**: Embedded educational knowledge base serves queries even if external API limits are exceeded.

---

## Machine Learning Models

The platform powers two core predictive models:

### 1. Academic Performance Predictor
- **Goal**: Identify "At Risk" students early before final examinations.
- **Algorithm**: Ensemble Voting Classifier (Random Forest + XGBoost).
- **Features Used**: Attendance Rate, Marks Consistency, and Internal Assessment Scores.

### 2. Placement Probability Predictor
- **Goal**: Estimate the likelihood of securing campus placements.
- **Algorithm**: Random Forest Classifier (~95% Accuracy).
- **Features Used**: CGPA, DSA Skills, Projects, and Internship Count.
- **Explainable AI (XAI)**: Integrated SHAP and LIME feature attribution to ensure transparent predictions.

---

## Project Structure

```
raspp/
├── backend/            # FastAPI Application
│   ├── app/
│   │   ├── api/        # REST Endpoints (Auth, Students, Marks, Chatbot, etc.)
│   │   ├── core/       # Configuration, Security & JWT Utilities
│   │   ├── ml/         # Machine Learning Inference & Pipelines
│   │   │   └── models/ # Serialized .joblib Model Binaries
│   │   ├── models/     # SQLAlchemy Database Schemas
│   │   └── schemas/    # Pydantic Validation Schemas
│   ├── requirements.txt# Python Dependencies
│   └── run.py          # Backend Launcher
├── frontend/           # React 19 + TypeScript + Vite Application
│   ├── src/
│   │   ├── components/ # Reusable UI (Navbar, Sidebar, DataTable, Chatbot)
│   │   ├── pages/      # Portal Pages (Admin, Teacher, Student, Placement)
│   │   ├── layouts/    # Role-Based Layouts & Navigation
│   │   └── services/   # Axios API Client
│   └── package.json    # Frontend Dependencies
├── docker-compose.yml  # Multi-Container Orchestration (FastAPI + Redis + React)
├── render.yaml         # Cloud Deployment Blueprint (Render)
├── start.bat           # 1-Click Startup for Windows CMD
├── start.ps1           # 1-Click Startup for PowerShell
└── start.sh            # 1-Click Startup for Linux / macOS
```

---

## Alternative: Manual Step-by-Step Setup

If you prefer launching components manually in separate terminals:

### 1. Database Setup
Create a MySQL database named `rasppdb` (or configure your connection in `backend/.env`):
```sql
CREATE DATABASE rasppdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
> Server runs at `http://127.0.0.1:8000` (Interactive API docs at `/docs`)

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
> Client runs at `http://127.0.0.1:5173`

---

## Docker Deployment

To launch all services (FastAPI Backend, Redis Cache, and React Frontend) with Docker:

```bash
docker-compose up --build -d
```

---

## License

Distributed under the **MIT License**.