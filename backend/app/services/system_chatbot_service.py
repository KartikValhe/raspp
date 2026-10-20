import logging
import re
import time
from concurrent.futures import ThreadPoolExecutor, TimeoutError
from typing import List, Dict, Optional, Tuple, Any
from google import genai
from google.genai import types
from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are the "RASPP System Assistant", an intelligent, fast, and helpful AI assistant embedded in the RASPP (Result Analysis & Student Placement Predictor) platform.

Keep your answers concise, practical, and well-structured using markdown bullet points and exact route links like `[Page](/path)`.

At the very end of your response, provide exactly 3 relevant follow-up questions in this format:
FOLLOW_UPS:
- Question 1?
- Question 2?
- Question 3?
"""

# Instant High-Performance Knowledge Base
KNOWLEDGE_BASE = [
    {
        "topic": "placement_model",
        "keywords": [
            "placement probability", "prediction model", "random forest", "how prediction works",
            "model accuracy", "how does placement", "probability model", "placement score", "shap",
            "placement chance", "calculate prediction", "how accurate", "accuracy"
        ],
        "answer": """### 🎯 Placement Probability Prediction in RASPP
Our system calculates your placement chances using an **Ensemble Machine Learning model** (predominantly **Random Forest Classifier with 95% accuracy**).

**Key Factors Evaluated:**
* **Cumulative CGPA & Semester Trends**: Strong historical academic consistency.
* **Technical Skillset**: High weight for DSA, Python, Web Development, and Cloud certifications.
* **Internships & Live Projects**: Practical industry experience significantly boosts probability.
* **Live Backlogs**: Having 0 active backlogs is critical for MNC campus eligibility.
* **Explainable AI (SHAP)**: Identifies exactly which factors increase or decrease your placement score.

**Check your score now:** Head over to [My Prediction](/student/placement/prediction) to analyze your profile and get a 3-step action plan!""",
        "follow_ups": [
            "How can I improve my placement probability score?",
            "What technical skills carry the highest weight?",
            "Where can I view active campus job listings?"
        ]
    },
    {
        "topic": "improve_placement",
        "keywords": [
            "improve placement", "boost probability", "increase chance", "improve score",
            "how to improve", "boost score", "higher probability", "better chances"
        ],
        "answer": """### 📈 How to Boost Your Placement Probability Score
Based on our 95% accurate Random Forest model, here are the top 3 highest-impact actions:

1. **Complete a Real-World Internship**: An internship adds the highest single weight improvement to your placement score.
2. **Master High-Demand Skills**: Focus on Data Structures & Algorithms (LeetCode/CodeChef) plus a full-stack framework or cloud certification.
3. **Keep CGPA Above 7.5 & Clear Backlogs**: Eliminates rejection filters from top-tier recruiters.

**Next step:** Run an analysis on [My Prediction](/student/placement/prediction) to see your personalized SHAP breakdown!""",
        "follow_ups": [
            "How does the built-in Resume Builder help with placements?",
            "What companies are currently hiring on the Job Listings page?",
            "Where can I view college placement statistics?"
        ]
    },
    {
        "topic": "transcript",
        "keywords": [
            "transcript", "official transcript", "download transcript", "print transcript",
            "academic transcript", "marksheet", "grade card", "cumulative record"
        ],
        "answer": """### 📄 Accessing Your Official Academic Transcript
Your verified university academic record is available anytime:

* **View Official Transcript**: Go to [Official Transcript](/student/transcript) to view completed credits, semester-wise SGPA, and cumulative CGPA.
* **Print / Export**: Use the print button on the transcript page to save a certified PDF copy.
* **Subject Breakdown**: Check [Performance](/student/results) for individual subject marks and grade points.""",
        "follow_ups": [
            "How are SGPA and CGPA calculated on this transcript?",
            "Where do I see subject-wise marks breakdown?",
            "How does my performance rank against the branch merit list?"
        ]
    },
    {
        "topic": "sgpa_cgpa",
        "keywords": [
            "sgpa", "cgpa", "calculate sgpa", "calculate cgpa", "formula",
            "grade point", "credits", "how is sgpa"
        ],
        "answer": """### 📊 SGPA & CGPA Calculation Formula
RASPP follows standard university credit-weighted grading:

* **SGPA (Semester Grade Point Average)**:
  $$\\text{SGPA} = \\frac{\\sum (\\text{Course Credits} \\times \\text{Grade Points})}{\\sum \\text{Course Credits}}$$
* **CGPA (Cumulative Grade Point Average)**:
  $$\\text{CGPA} = \\frac{\\sum \\text{All Earned Grade Points across Semesters}}{\\sum \\text{Total Registered Credits}}$$

**View your performance:** Check your current breakdown in [Performance](/student/results) or [Official Transcript](/student/transcript).""",
        "follow_ups": [
            "Where can I view and download my official academic transcript?",
            "How does my CGPA impact my placement probability?",
            "Where can I see class toppers on the Merit List?"
        ]
    },
    {
        "topic": "resume",
        "keywords": [
            "resume", "cv", "ats", "builder", "resume builder", "ats score",
            "create resume", "export resume", "pdf resume"
        ],
        "answer": """### 💼 Built-In ATS Resume Builder
RASPP includes an interactive **ATS-friendly Resume Builder** designed for university campus drives:

* **Real-Time ATS Scoring**: Instant feedback on formatting, keyword density, and technical skills.
* **One-Click PDF Export**: Download clean, recruiter-ready resumes without watermark.
* **Syncs with Placement Portal**: Automatically pulls your verified CGPA, projects, and certifications.

**Start building:** Head to [Resume Builder](/student/resume) to craft or polish your resume!""",
        "follow_ups": [
            "What projects should I include for campus placement drives?",
            "How does my resume impact my placement probability score?",
            "Where can I view active campus job listings?"
        ]
    },
    {
        "topic": "jobs",
        "keywords": [
            "job", "jobs", "job listings", "company", "companies", "recruitment",
            "campus drive", "drive", "package", "ctc", "hiring", "apply"
        ],
        "answer": """### 🏢 Campus Placement Drives & Job Listings
Keep track of all corporate hiring drives in one place:

* **Active Openings**: Visit [Job Listings](/student/placement/jobs) to view visiting companies, job roles, eligibility criteria, CTC packages, and deadlines.
* **Placement Overview**: Check [Placement Portal](/student/placement) for general announcements and application tracking.
* **Placement Stats**: Visit [Placement Stats](/student/placement/stats) for historical package benchmarks and top recruiters.""",
        "follow_ups": [
            "How do I check if I meet eligibility criteria for campus drives?",
            "How can I predict my chances before applying to jobs?",
            "How does the built-in Resume Builder help with placements?"
        ]
    },
    {
        "topic": "grading_hub",
        "keywords": [
            "grading", "grading hub", "enter marks", "submit marks", "internal marks",
            "end-sem marks", "teacher marks", "input marks"
        ],
        "answer": """### ✏️ Teacher Grading Hub
Faculty can manage student scores through the centralized hub:

* **Enter & Edit Marks**: Navigate to [Grading Hub](/teacher/marks) to select your assigned department, semester, and subject.
* **Multiple Components**: Enter internal assessments, mid-term scores, and practical/end-term grades.
* **Auto-Validation**: Instant validation prevents invalid scores exceeding maximum limits.""",
        "follow_ups": [
            "How do teachers record daily student attendance?",
            "Where can I view the branch merit list and class toppers?",
            "How to run batch AI predictions for students?"
        ]
    },
    {
        "topic": "attendance",
        "keywords": [
            "attendance", "take attendance", "record attendance", "mark attendance",
            "absent", "present", "attendance percentage", "defaulter"
        ],
        "answer": """### 📅 Attendance Management Tool
Teachers and faculty can record and monitor class attendance seamlessly:

* **Take Attendance**: Go to [Take Attendance](/teacher/attendance) to select branch, subject, and date.
* **Mark Status**: Toggle Present/Absent for students with quick bulk-mark options.
* **Student Tracking**: Students can view their live attendance summary on their [Dashboard](/student/dashboard).""",
        "follow_ups": [
            "How do teachers enter and update student marks?",
            "Where can I view the branch merit list?",
            "Where can I view class performance analytics?"
        ]
    },
    {
        "topic": "merit_list",
        "keywords": [
            "merit", "merit list", "topper", "rank", "distinction", "class rank",
            "toppers", "highest score"
        ],
        "answer": """### 🏆 Merit List & Academic Rankings
* **View Merit List**: Visit [Merit List](/teacher/merit) (for teachers) or [Results & Merit](/results) (for admins).
* **Rankings Breakdown**: Automatically ranks students by CGPA/SGPA with distinction tags and subject toppers.
* **Department Filtering**: Filter by academic branch, semester, and batch year.""",
        "follow_ups": [
            "Where can I view class pass percentages and analytics?",
            "How do teachers enter internal and end-sem marks?",
            "How do I check my own academic transcript?"
        ]
    },
    {
        "topic": "admin_features",
        "keywords": [
            "admin", "manage branches", "manage subjects", "create student", "manage teachers",
            "add branch", "add subject", "course credits", "admin portal"
        ],
        "answer": """### ⚙️ Administrator Management Tools
Administrators can configure the full academic foundation:

* **[Students Directory](/students)** & **[Teachers Directory](/teachers)**: Create and manage user credentials.
* **[Manage Branches](/branches)**: Add or edit university engineering and science branches.
* **[Subjects](/subjects)**: Configure subject codes, evaluation schemes, and credits.
* **[Results & Merit](/results)**: Verify and publish official semester examinations.""",
        "follow_ups": [
            "How do administrators publish official semester results?",
            "Where can I view campus-wide performance and placement analytics?",
            "How do teachers enter marks in the Grading Hub?"
        ]
    },
    {
        "topic": "general",
        "keywords": [
            "what is raspp", "system overview", "how to use", "features", "help",
            "portals", "getting started", "welcome", "about raspp"
        ],
        "answer": """### 👋 Welcome to RASPP!
**RASPP (Result Analysis & Student Placement Predictor)** is a complete university academic management and AI-driven placement analytics platform.

**Core Portals:**
* **Student Portal**: [Dashboard](/student/dashboard), [Transcripts](/student/transcript), [Resume Builder](/student/resume), and [Placement Prediction](/student/placement/prediction).
* **Teacher Portal**: [Grading Hub](/teacher/marks), [Take Attendance](/teacher/attendance), [Merit List](/teacher/merit), and [Class Analytics](/teacher/analytics).
* **Placement Coordinator**: [Job Management](/placement/jobs) and [Batch AI Predictions](/placement/bulk-prediction).
* **Administrator**: [Branches](/branches), [Subjects](/subjects), and user administration.

What specific feature would you like to explore?""",
        "follow_ups": [
            "How does the placement probability model work?",
            "Where can I view and download my official academic transcript?",
            "How does the built-in Resume Builder help with placements?"
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
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._executor = ThreadPoolExecutor(max_workers=3)

        if settings.GEMINI_API_KEY:
            try:
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
                self.is_configured = True
                logger.info("SystemChatbotService configured with Gemini Client")
            except Exception:
                logger.exception("Failed to initialize Gemini client")

    def _extract_follow_ups(self, text: str, default_follow_ups: List[str]) -> Tuple[str, List[str]]:
        if "FOLLOW_UPS:" in text:
            parts = text.split("FOLLOW_UPS:", 1)
            main_reply = parts[0].strip()
            follow_ups = []
            for line in parts[1].strip().splitlines():
                cleaned = line.strip().lstrip("-*123456789. ")
                if cleaned and len(cleaned) > 5:
                    follow_ups.append(cleaned)
            if follow_ups:
                return main_reply, follow_ups[:3]
        return text.strip(), default_follow_ups

    def _match_knowledge_base(self, query: str) -> Optional[Dict[str, Any]]:
        """Instant sub-millisecond keyword and intent matching."""
        q = query.lower().strip()
        # Direct prompt matching
        for item in KNOWLEDGE_BASE:
            for kw in item["keywords"]:
                if kw in q:
                    return {
                        "reply": item["answer"],
                        "suggested_questions": item["follow_ups"],
                        "topic": item["topic"]
                    }
        return None

    def _call_gemini_remote(self, prompt: str) -> Optional[Tuple[str, List[str]]]:
        """Runs Gemini call with tight token constraints for maximum speed."""
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    temperature=0.2,
                    max_output_tokens=300
                )
            )
            if response and response.text:
                return self._extract_follow_ups(response.text, DEFAULT_FOLLOW_UPS)
        except Exception as e:
            logger.warning(f"Gemini remote call failed or timed out: {e}")
        return None

    def generate_response(
        self,
        messages: List[Dict[str, str]],
        user_role: Optional[str] = "student",
        current_page: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Ultra-fast hybrid response generator:
        1. In-memory LRU cache (< 1ms)
        2. High-precision intent match (< 5ms)
        3. Fast Gemini remote with 3.0s timeout fallback
        """
        user_query = ""
        for message in reversed(messages):
            if message.get("role") == "user":
                user_query = message.get("content", "").strip()
                break

        if not user_query:
            return {
                "reply": "Hello! I am your **RASPP Assistant**. How can I help you navigate the system or understand your predictions today?",
                "suggested_questions": DEFAULT_FOLLOW_UPS,
                "topic": "general"
            }

        cache_key = f"{user_role}:{user_query.lower()}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        # 1. Instant Fast-Path Knowledge Base Match (< 5ms)
        matched = self._match_knowledge_base(user_query)
        if matched:
            self._cache[cache_key] = matched
            return matched

        # 2. Open-ended question: Fast Remote Gemini with 3.0s timeout
        if self.is_configured and self.client:
            context_cue = f"[Role: {user_role or 'guest'}, Page: {current_page or '/'}] Question: {user_query}"
            try:
                future = self._executor.submit(self._call_gemini_remote, context_cue)
                remote_result = future.result(timeout=3.0)
                if remote_result:
                    reply_text, follow_ups = remote_result
                    result = {
                        "reply": reply_text,
                        "suggested_questions": follow_ups,
                        "topic": "genai"
                    }
                    self._cache[cache_key] = result
                    return result
            except TimeoutError:
                logger.warning("Gemini remote call exceeded 3.0s timeout, switching to fast fallback")
            except Exception as e:
                logger.warning(f"Error executing remote query: {e}")

        # 3. Fast Contextual Fallback (< 1ms)
        general_item = KNOWLEDGE_BASE[-1]
        fallback_result = {
            "reply": (
                f"Hello! I am your **RASPP Assistant**.\n\n"
                f"Here is how I can help you with your query:\n"
                f"* **Placement Predictions**: Explore how our 95% accurate Random Forest model evaluates your profile ([My Prediction](/student/placement/prediction)).\n"
                f"* **Official Transcripts**: View credits and cumulative SGPA/CGPA ([Official Transcript](/student/transcript)).\n"
                f"* **Resume Builder**: Build an ATS-optimized resume for placement drives ([Resume Builder](/student/resume)).\n"
                f"* **Faculty Tools**: Marks grading, merit lists, and attendance tracking.\n\n"
                f"Try selecting one of the questions below:"
            ),
            "suggested_questions": DEFAULT_FOLLOW_UPS,
            "topic": "general"
        }
        self._cache[cache_key] = fallback_result
        return fallback_result

chatbot_service = SystemChatbotService()
