import logging
import re
from typing import List, Dict, Optional, Tuple, Any
from google import genai
from google.genai import types
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

### RESPONSE GUIDELINES & DYNAMIC FOLLOW-UPS:
- **Format**: Use clean GitHub-flavored markdown with bullet points, bold key terms, and markdown links like `[Feature Name](/path)`.
- **Tone**: Helpful, concise, motivating, and polite.
- **Accuracy**: Always provide exact route links so the user can click them to navigate directly.
- **Context Awareness**: Tailor your guidance to the user's current role if known.
- **CRITICAL REQUIREMENT FOR DYNAMIC RESPONSIVENESS**:
  At the very end of every single response, provide exactly 3 relevant, highly specific follow-up questions that the user might want to ask next based on your answer.
  Use this exact format at the very end:
  
  FOLLOW_UPS:
  - First follow-up question?
  - Second follow-up question?
  - Third follow-up question?
"""

FALLBACK_KNOWLEDGE = [
    {
        "topic": "placement",
        "keywords": ["placement", "probability", "predict", "prediction", "ml", "model", "chance", "package"],
        "answer": """### Placement Probability Prediction in RASPP
Our system calculates your placement chances using an **Ensemble Machine Learning model** (predominantly **Random Forest Classifier with 95% accuracy**).

**How it works:**
* Analyzes your **cumulative CGPA**, backlogs, and semester trends.
* Evaluates your **technical skillset** (DSA, Web Dev, Python, Cloud), certifications, and completed **internships**.
* Uses **Explainable AI (SHAP)** to break down your highest-impact strengths and areas needing improvement.

**Where to check your score:**
* Head over to [My Prediction](/student/placement/prediction) to analyze your profile and receive an automated 3-step action plan!""",
        "follow_ups": [
            "How can I improve my placement probability score?",
            "What technical skills have the highest weight?",
            "Where can I view active campus job listings?"
        ]
    },
    {
        "topic": "academic",
        "keywords": ["transcript", "marksheet", "certificate", "sgpa", "cgpa", "grade", "results", "marks"],
        "answer": """### Accessing Your Academic Transcript & Results
* **Official Transcript**: Visit [Official Transcript](/student/transcript) to view your verified academic records, credits completed, and cumulative SGPA/CGPA.
* **Semester Results**: Check [Performance](/student/results) for a subject-by-subject breakdown of internal and external scores.
* **Teacher Marks Entry**: Faculty can enter marks through the [Grading Hub](/teacher/marks).""",
        "follow_ups": [
            "How is SGPA calculated from credits and grades?",
            "How do I print or download my official transcript?",
            "Where do I see subject-wise attendance?"
        ]
    },
    {
        "topic": "resume",
        "keywords": ["resume", "cv", "ats", "builder"],
        "answer": """### ATS-Friendly Resume Builder
RASPP includes a built-in **Resume Builder** tailored for campus placements:
* Generates an **ATS-optimized** resume format preferred by recruiters.
* Highlights your key projects, technical certifications, and university CGPA.
* Access it anytime at [Resume Builder](/student/resume).""",
        "follow_ups": [
            "What makes a resume score high in ATS?",
            "What projects should I highlight in my resume?",
            "Can I download my resume directly as a PDF?"
        ]
    },
    {
        "topic": "jobs",
        "keywords": ["job", "jobs", "company", "companies", "drive", "recruitment", "hiring"],
        "answer": """### Campus Placement Drives & Job Listings
* **View Job Openings**: Visit [Job Listings](/student/placement/jobs) to view active campus recruitment drives, required tech stacks, package CTC, and application deadlines.
* **Placement Overview**: Visit [Placement Portal](/student/placement) for general stats and upcoming company visits.""",
        "follow_ups": [
            "How do I check if I am eligible for a company drive?",
            "Where can I see department placement statistics?",
            "How do I calculate my placement probability before applying?"
        ]
    },
    {
        "topic": "teacher",
        "keywords": ["teacher", "grading", "attendance", "merit", "faculty"],
        "answer": """### Teacher & Faculty Features
Teachers have access to dedicated management tools:
* **[Grading Hub](/teacher/marks)**: Enter and update internal and end-sem marks.
* **[My Students](/teacher/students)**: View student list and inspect individual progress.
* **[Take Attendance](/teacher/attendance)**: Record daily lecture attendance.
* **[Merit List](/teacher/merit)**: View branch-wise toppers and rank distributions.
* **[AI Predictions](/teacher/predictions)**: Discover at-risk students who need extra academic mentoring.""",
        "follow_ups": [
            "How do I enter internal vs mid-sem marks in Grading Hub?",
            "How do I record and export daily attendance?",
            "Where can I view the branch merit list?"
        ]
    },
    {
        "topic": "admin",
        "keywords": ["admin", "branch", "subject", "user", "create", "manage"],
        "answer": """### Administrator Tools
Administrators manage system configuration:
* **[Students Directory](/students)** & **[Teachers Directory](/teachers)**: Manage user accounts.
* **[Manage Branches](/branches)**: Add or edit departments.
* **[Subjects](/subjects)**: Configure subject codes, evaluation weights, and credits.
* **[Results & Merit](/results)**: Publish verified examination results.""",
        "follow_ups": [
            "How do I add a new branch or department?",
            "How do I configure subjects and credit schemes?",
            "Where can I view college-wide analytics?"
        ]
    }
]

DEFAULT_FOLLOW_UPS = [
    "How does the 95% accurate Random Forest model work?",
    "Where can I check my semester results and transcript?",
    "How do I build an ATS-friendly resume in RASPP?",
    "What features are available for teachers in the portal?"
]

class SystemChatbotService:
    def __init__(self):
        self.client = None
        self.is_configured = False
        self.model_name = "gemini-3.8-flash"

        if settings.GEMINI_API_KEY:
            try:
                self.client = genai.Client(
                    api_key=settings.GEMINI_API_KEY
                )
                self.is_configured = True
                logger.info("SystemChatbotService initialized successfully with Google GenAI SDK (gemini-3.8-flash)")
            except Exception:
                logger.exception("Failed to initialize Gemini client")

    def _extract_follow_ups(
        self,
        text: str,
        default_follow_ups: List[str]
    ) -> Tuple[str, List[str]]:
        """Extract suggested follow-up questions from the response."""
        if "FOLLOW_UPS:" in text:
            parts = text.split("FOLLOW_UPS:", 1)
            main_reply = parts[0].strip()
            follow_ups = []

            for line in parts[1].strip().splitlines():
                cleaned = line.strip().lstrip("-*123456789. ")
                if cleaned and len(cleaned) > 5:
                    follow_ups.append(cleaned)

            if follow_ups:
                return main_reply, follow_ups[:4]

        return text.strip(), default_follow_ups

    def generate_response(
        self,
        messages: List[Dict[str, str]],
        user_role: Optional[str] = "student",
        current_page: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate an answer with suggested follow-up questions."""
        user_query = ""
        for message in reversed(messages):
            if message.get("role") == "user":
                user_query = message.get("content", "").strip()
                break

        if not user_query:
            return {
                "reply": (
                    "Hello! I am your **RASPP Assistant**. "
                    "How can I help you navigate the system "
                    "or understand your predictions today?"
                ),
                "suggested_questions": DEFAULT_FOLLOW_UPS,
                "topic": "general"
            }

        # 1. Try Gemini using the Google Gen AI SDK
        if self.is_configured and self.client:
            try:
                context_cue = (
                    f"User Role: {user_role or 'guest'}\n"
                    f"Current Page: {current_page or '/'}"
                )

                conversation_parts = []
                for message in messages:
                    role = message.get("role", "user")
                    content = message.get("content", "").strip()
                    if not content:
                        continue

                    role_label = "Assistant" if role == "assistant" else "User"
                    conversation_parts.append(f"{role_label}: {content}")

                if conversation_parts:
                    for index in range(len(conversation_parts) - 1, -1, -1):
                        if conversation_parts[index].startswith("User:"):
                            conversation_parts[index] = (
                                f"[Context: {context_cue}]\n"
                                f"{conversation_parts[index]}"
                            )
                            break

                conversation_prompt = "\n\n".join(conversation_parts)

                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=conversation_prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_PROMPT,
                        temperature=0.7
                    )
                )

                if response and response.text:
                    reply_text, follow_ups = self._extract_follow_ups(
                        response.text,
                        DEFAULT_FOLLOW_UPS
                    )
                    return {
                        "reply": reply_text,
                        "suggested_questions": follow_ups,
                        "topic": "genai"
                    }

                logger.warning("Gemini returned an empty response")
            except Exception:
                logger.exception("Gemini request failed; falling back to internal knowledge base")

        # 2. Internal knowledge-base fallback
        lower_query = user_query.lower()
        for item in FALLBACK_KNOWLEDGE:
            if any(keyword in lower_query for keyword in item["keywords"]):
                return {
                    "reply": item["answer"],
                    "suggested_questions": item["follow_ups"],
                    "topic": item["topic"]
                }

        # 3. General fallback when no topic matches
        return {
            "reply": (
                "Hello! I am your **RASPP Assistant**.\n\n"
                "I can help you with:\n"
                "* **Placement Predictions**: Learn how your profile is evaluated "
                "([My Prediction](/student/placement/prediction)).\n"
                "* **Academic Results & Transcripts**: View SGPA/CGPA records "
                "([Official Transcript](/student/transcript)).\n"
                "* **Resume Builder**: Create an ATS-friendly resume ([Resume Builder](/student/resume)).\n"
                "* **Portal Navigation**: Explore Student, Teacher, Coordinator, and Admin features.\n\n"
                "What would you like to explore?"
            ),
            "suggested_questions": DEFAULT_FOLLOW_UPS,
            "topic": "general"
        }

chatbot_service = SystemChatbotService()
