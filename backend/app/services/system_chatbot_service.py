import logging
from typing import List, Dict, Optional
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are the "RASPP System Assistant", an intelligent, friendly, and helpful AI assistant embedded in the RASPP (Result Analysis & Student Placement Predictor) platform.

Your primary mission is to guide users (Students, Teachers, Admins, and Placement Coordinators) in understanding the platform, exploring features, understanding how the Machine Learning placement prediction works, and navigating the system effortlessly.

### RASPP PLATFORM KNOWLEDGE BASE:

1. **System Overview**:
   - **Name**: RASPP (Result Analysis & Student Placement Predictor).
   - **Core Purpose**: Modern academic analytics and ML-driven placement prediction for universities.
   - **Supported Portals**: Student Portal, Teacher Portal, Admin Portal, Placement Coordinator Portal.

2. **Machine Learning & AI Predictions**:
   - **Model**: Ensemble model (Random Forest Classifier, Logistic Regression, XGBoost) with 95% accuracy.
   - **Factors Considered**: Overall CGPA, live backlogs, technical skillset (DSA, Python, Web Dev, Cloud), number of completed internships, certified projects, and aptitude scores.
   - **Explainable AI (XAI)**: Uses SHAP (SHapley Additive exPlanations) to identify key positive factors (e.g. high CGPA, strong projects) and risk factors (e.g. low internship count or backlogs).
   - **Where to Access**:
     - Students: [Placement Prediction](/student/placement/prediction)
     - Teachers: [AI Predictions](/teacher/predictions) and [Bulk Predictions](/teacher/bulk-prediction)
     - Coordinators: [Bulk Prediction Tool](/placement/bulk-prediction)

3. **Student Portal Features**:
   - **[Dashboard](/student/dashboard)**: Academic summary, current CGPA, attendance summary, quick announcements.
   - **[Performance](/student/results)**: Detailed subject-wise scores, internal marks, and SGPA trends across semesters.
   - **[Official Transcript](/student/transcript)**: Verified academic record with credit totals, SGPA/CGPA, and print-ready format.
   - **[Resume Builder](/student/resume)**: ATS-optimized interactive resume builder with real-time feedback.
   - **[Placement Portal](/student/placement)**: Central placement hub with quick stats and drive updates.
   - **[Job Listings](/student/placement/jobs)**: Active campus recruitment drives, eligibility criteria, packages, and deadlines.
   - **[My Prediction](/student/placement/prediction)**: 95% accurate placement probability calculator with AI Career Advisor action plans.
   - **[Placement Stats](/student/placement/stats)**: Departmental placement rates, average packages, and top hiring companies.
   - **[My Profile](/student/profile)**: Student demographic data, contact info, and academic history.

4. **Teacher Portal Features**:
   - **[Grading Hub](/teacher/marks)**: Select class and subject to enter/edit internal, mid-semester, and end-term marks.
   - **[My Students](/teacher/students)**: Class directory with student PRN search and deep performance records.
   - **[Merit List](/teacher/merit)**: View semester toppers, rank lists, and distinction distributions.
   - **[Class Analytics](/teacher/analytics)**: Visual charts for pass percentages, grade bell curves, and subject difficulty.
   - **[AI Predictions](/teacher/predictions)**: Identify academically at-risk students before final evaluations.
   - **[Bulk Predictions](/teacher/bulk-prediction)**: Upload class CSV files for batch placement probability assessments.
   - **[Take Attendance](/teacher/attendance)**: Record and track daily lecture and lab attendance.

5. **Admin Portal Features**:
   - **[Students](/students)**: Add, edit, or deactivate student accounts.
   - **[Teachers](/teachers)**: Manage faculty accounts and department assignments.
   - **[Manage Branches](/branches)**: Add or configure academic branches (CSE, IT, ECE, Mechanical, etc.).
   - **[Subjects](/subjects)**: Configure subject codes, syllabus credits, and passing criteria.
   - **[Results & Merit](/results)**: Publish semester results and institutional merit lists.
   - **[Analytics](/analytics)**: Campus-wide performance indicators and placement trends.

6. **Placement Coordinator Features**:
   - **[Job Management](/placement/jobs)**: Create and broadcast upcoming corporate recruitment drives.
   - **[Batch Prediction](/placement/bulk-prediction)**: Filter candidates meeting company eligibility criteria using AI predictions.
   - **[Placement Records](/placement/records)**: Maintain official records of placed candidates and package stats.

### RESPONSE GUIDELINES:
- **Format**: Use clean GitHub-flavored markdown with bullet points, bold key terms, and markdown links like `[Feature Name](/path)`.
- **Tone**: Helpful, concise, motivating, and polite.
- **Accuracy**: Always provide exact route links so the user can click them to navigate directly.
- **Context Awareness**: Tailor your guidance to the user's current role if known.
"""

FALLBACK_KNOWLEDGE = [
    {
        "keywords": ["placement", "probability", "predict", "prediction", "ml", "model", "chance"],
        "answer": """### Placement Probability Prediction in RASPP
Our system calculates your placement chances using an **Ensemble Machine Learning model** (predominantly **Random Forest Classifier with 95% accuracy**).

**How it works:**
* Analyzes your **cumulative CGPA**, backlogs, and semester trends.
* Evaluates your **technical skillset** (DSA, Web Dev, Python, Cloud), certifications, and completed **internships**.
* Uses **Explainable AI (SHAP)** to break down your highest-impact strengths and areas needing improvement.

**Where to check your score:**
* Head over to [My Prediction](/student/placement/prediction) to analyze your profile and receive an automated 3-step action plan!"""
    },
    {
        "keywords": ["transcript", "marksheet", "certificate", "sgpa", "cgpa", "grade"],
        "answer": """### Accessing Your Academic Transcript & Results
* **Official Transcript**: Visit [Official Transcript](/student/transcript) to view your verified academic records, credits completed, and cumulative SGPA/CGPA.
* **Semester Results**: Check [Performance](/student/results) for a subject-by-subject breakdown of internal and external scores.
* **Teacher Marks Entry**: Faculty can enter marks through the [Grading Hub](/teacher/marks)."""
    },
    {
        "keywords": ["resume", "cv", "ats", "builder"],
        "answer": """### ATS-Friendly Resume Builder
RASPP includes a built-in **Resume Builder** tailored for campus placements:
* Generates an **ATS-optimized** resume format preferred by recruiters.
* Highlights your key projects, technical certifications, and university CGPA.
* Access it anytime at [Resume Builder](/student/resume)."""
    },
    {
        "keywords": ["job", "jobs", "company", "companies", "drive", "recruitment", "hiring", "package"],
        "answer": """### Campus Placement Drives & Job Listings
* **View Job Openings**: Visit [Job Listings](/student/placement/jobs) to view active campus recruitment drives, required tech stacks, package CTC, and application deadlines.
* **Placement Overview**: Visit [Placement Portal](/student/placement) for general stats and upcoming company visits."""
    },
    {
        "keywords": ["teacher", "grading", "marks", "attendance", "merit"],
        "answer": """### Teacher & Faculty Features
Teachers have access to dedicated management tools:
* **[Grading Hub](/teacher/marks)**: Enter and update internal and end-sem marks.
* **[My Students](/teacher/students)**: View student list and inspect individual progress.
* **[Take Attendance](/teacher/attendance)**: Record daily lecture attendance.
* **[Merit List](/teacher/merit)**: View branch-wise toppers and rank distributions.
* **[AI Predictions](/teacher/predictions)**: Discover at-risk students who need extra academic mentoring."""
    },
    {
        "keywords": ["admin", "branch", "subject", "user", "create"],
        "answer": """### Administrator Tools
Administrators manage system configuration:
* **[Students Directory](/students)** & **[Teachers Directory](/teachers)**: Manage user accounts.
* **[Manage Branches](/branches)**: Add or edit departments.
* **[Subjects](/subjects)**: Configure subject codes, evaluation weights, and credits.
* **[Results & Merit](/results)**: Publish verified examination results."""
    }
]

class SystemChatbotService:
    def __init__(self):
        self.is_configured = False
        self.model = None

        if settings.GEMINI_API_KEY:
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                # Try 1.5 flash, fallback to pro or flash-latest
                try:
                    self.model = genai.GenerativeModel(
                        model_name="gemini-1.5-flash",
                        system_instruction=SYSTEM_PROMPT
                    )
                except Exception:
                    self.model = genai.GenerativeModel(model_name="gemini-flash-latest")
                self.is_configured = True
                logger.info("SystemChatbotService successfully configured with Gemini API")
            except Exception as e:
                logger.warning(f"Could not initialize Gemini model: {e}")
                self.is_configured = False

    def generate_response(self, messages: List[Dict[str, str]], user_role: Optional[str] = "student") -> str:
        """
        Generates a chatbot response either via Gemini GenAI or via the built-in intelligent fallback.
        """
        user_query = ""
        for m in reversed(messages):
            if m.get("role") == "user":
                user_query = m.get("content", "").strip()
                break

        if not user_query:
            return "Hello! I am your RASPP Assistant. How can I help you navigate the system or understand your predictions today?"

        # 1. Try Gemini GenAI if configured
        if self.is_configured and self.model:
            try:
                # Format conversation history for Gemini
                gemini_contents = []
                for m in messages:
                    role = "user" if m.get("role") == "user" else "model"
                    gemini_contents.append({
                        "role": role,
                        "parts": [m.get("content", "")]
                    })

                # Append context cue if role is known
                if user_role and user_role != "guest":
                    cue = f"[User Role: {user_role}]\n"
                    if gemini_contents and gemini_contents[-1]["role"] == "user":
                        gemini_contents[-1]["parts"][0] = cue + gemini_contents[-1]["parts"][0]

                chat_response = self.model.generate_content(gemini_contents)
                if chat_response and chat_response.text:
                    return chat_response.text.strip()
            except Exception as e:
                logger.warning(f"Gemini API request failed, falling back to internal knowledge base: {e}")

        # 2. Intelligent Knowledge-Base Fallback (Always reliable, zero downtime)
        lower_q = user_query.lower()
        for item in FALLBACK_KNOWLEDGE:
            if any(kw in lower_q for kw in item["keywords"]):
                return item["answer"]

        # Default helpful guide
        return (
            f"Hello! I am your **RASPP Assistant**.\n\n"
            f"I can help you with:\n"
            f"* **Placement Predictions**: How our 95% accurate Random Forest model evaluates your profile ([My Prediction](/student/placement/prediction)).\n"
            f"* **Academic Results & Transcripts**: Viewing SGPA/CGPA records ([Official Transcript](/student/transcript)).\n"
            f"* **Resume Builder**: Creating an ATS-friendly resume for campus recruitment ([Resume Builder](/student/resume)).\n"
            f"* **Portal Navigation**: Guiding you through Student, Teacher, Coordinator, and Admin workflows.\n\n"
            f"Please let me know what specific feature or page you'd like to explore!"
        )

chatbot_service = SystemChatbotService()
