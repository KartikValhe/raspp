# RASPP — Result Analysis & Student Performance Prediction
## Project Overview, Architecture & Technology Stack

---

### 1. Executive Summary: What Was Developed

**RASPP (Result Analysis and Student Performance Prediction)** is an enterprise-grade academic management, AI predictive analytics, and placement intelligence platform. It bridges the gap between traditional educational record management and proactive, machine learning-driven student intervention.

#### Core Modules & Capabilities Developed:

1. **Superadmin Portal & Demo Governance (Security & Access Control)**:
   - Centralized management to create, monitor, activate, and deactivate Administrators and Faculty.
   - **Granular Permission Model (`can_modify` vs `is_active`)**: Allows the creation of read-only "Demo Accounts" (e.g., Demo Admin, Demo Teacher). Live visitors can explore all screens, but unauthorized insertions, updates, or deletions are strictly rejected with HTTP 403 Forbidden.
   - Live system metrics, permission audit logs, and cache purging capabilities.

2. **Administrator Portal**:
   - Institutional performance dashboards and visual score distribution charts.
   - Automated merit list generation across semesters and departments.
   - Comprehensive CRUD management for students, faculty, academic branches, and subjects.

3. **Teacher / Faculty Portal**:
   - Streamlined, high-speed bulk marks and grade entry.
   - Attendance tracking with threshold alerts.
   - Batch and individual student AI performance prediction to detect *At-Risk* students early in the semester.

4. **Placement Coordinator Portal**:
   - Campus recruitment drive and job opening management.
   - Automated eligibility screening filtering students based on CGPA, skills, and backlogs.
   - Placement statistics tracking, company offer management, and annual recruitment reporting.

5. **Student Portal & Career Acceleration**:
   - Transparent access to semester-wise results, CGPA trends, and historical records.
   - One-click official academic transcript generation in formatted PDF.
   - **Interactive ATS Resume Builder**: Dynamically compiles projects, skills, and coursework into professional resumes.
   - Placement eligibility analyzer with personalized skill-gap recommendations.

6. **Interactive User Guide (`/guide`)**:
   - A dedicated, non-technical guide designed for non-IT users across all 5 roles.
   - Real-time search, expandable step-by-step guides, safety tips, and print-to-PDF export.

7. **Modern Landing Page & Public Showcase**:
   - Fully mobile-responsive landing page with dark/light theme support.
   - **Live AI Simulator**: Allows visitors to slide academic parameters and watch probability gauges compute outcomes in real-time.
   - 1-Click instant demo login launcher for prospective evaluators.

---

### 2. Comprehensive Technology Stack

| Layer | Technology / Library | Purpose & Implementation Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** + **TypeScript** | Type-safe, high-performance component architecture. |
| **Build Tool & Bundler** | **Vite 7** | Ultra-fast Hot Module Replacement (HMR) and optimized rollup production bundling. |
| **Styling & Design System** | **Tailwind CSS** + Vanilla CSS | Modern responsive design, CSS variables, dark/light theme tokens, and glassmorphism. |
| **UI Motion & Transitions** | **Framer Motion** | Micro-interactions, page entrance transitions, and modal drawer animations. |
| **Data Visualization** | **Recharts** | Interactive academic graphs, radar skill charts, bar charts, and attendance heatmaps. |
| **Icons** | **Lucide React** | Lightweight, clean vector icon suite. |
| **HTTP & API Client** | **Axios** | Interceptor-driven HTTP requests, automatic JWT bearer attachment, and graceful 403 handling. |
| **Export & Sanitization** | **jsPDF** + **DOMPurify** | Client-side transcript and resume PDF export with XSS protection. |
| **Backend Framework** | **Python 3.11+** + **FastAPI** | High-throughput asynchronous REST API backend with native OpenAPI / Swagger documentation. |
| **ASGI Web Server** | **Uvicorn** | High-concurrency production ASGI server with auto-reload development support. |
| **Database ORM** | **SQLAlchemy** | Object Relational Mapping, declarative models, connection pooling, and transactional integrity. |
| **Data Validation** | **Pydantic v2** | Strict schema validation, request/response serialization, and data sanitization. |
| **Authentication & Security** | **JWT (python-jose)** + **Passlib (Bcrypt)** | Stateless JSON Web Tokens, cryptographically salted password hashing, and role-based middleware guards. |
| **Primary Database** | **TiDB Cloud** (Distributed SQL) / **MySQL** | Serverless, highly available distributed SQL database fully wire-compatible with MySQL. |
| **In-Memory Caching** | **Redis 5.0+** (`redis-py`) | Caches user authentication lookups, analytics calculations, merit lists, and branch listings (sub-5ms latency). |
| **Cache Resilience** | **Zero-Latency In-Memory Fallback** | Automatic fallback cache that seamlessly ensures 100% uptime if Redis is temporarily unreachable. |
| **Machine Learning Core** | **Scikit-Learn** + **Joblib** | Supervised learning pipeline, multi-class performance classification, and model serialization. |
| **Ensemble Algorithms** | **Random Forest** + **XGBoost** + **Voting Classifier** | Hybrid ensemble combining bagging and gradient boosting for robust accuracy and low variance. |
| **Explainable AI (XAI)** | **SHAP** (SHapley Additive exPlanations) | Transparent feature attribution explaining why a student was classified as *At-Risk* or *Placement-Ready*. |
| **Generative AI Chatbot** | **Google Gemini API** (`google-genai` SDK) | Context-aware AI assistant with instant knowledge-base fast paths for common academic inquiries. |
| **DevOps & Execution** | **Windows Shell / Batch (`start.bat`)** | Single-click orchestration initializing both backend and frontend development servers. |

---

### 3. Machine Learning Architecture

```
Student Academic Records (CGPA, Attendance, Backlogs, Test Scores)
                         │
                         ▼
             Feature Engineering Pipeline
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
Academic Risk Classifier          Placement Probability Engine
(Random Forest + XGBoost)         (Ensemble Voting Classifier)
        │                                 │
        ▼                                 ▼
[At-Risk / Average / Good / Exec]   [0% to 100% Placement Probability]
        │                                 │
        └────────────────┬────────────────┘
                         ▼
        Explainable AI (SHAP Reasoning)
                         │
                         ▼
   Student & Teacher Real-Time Actionable Insights
```

---

### 4. Key Performance & Security Highlights

- **Sub-5ms Cache Response Time**: Frequently queried endpoints (merit lists, dashboard stats, user validation) are cached via Redis with automated cache invalidation on write events.
- **Fail-Safe Mutation Guard**: Accounts designated with `can_modify = 0` are permitted full read access across portals, but all state-altering API methods (`POST`, `PUT`, `DELETE`, `PATCH`) are automatically blocked at the middleware layer.
- **Responsive Mobile First UX**: Tailored layouts tested down to 360px mobile viewports, featuring mobile drawer menus, horizontal swipeable tabs, and accessible touch targets (44px+).
- **Zero Data Loss**: Robust relational schemas with foreign key integrity and automated fallback mechanisms.
