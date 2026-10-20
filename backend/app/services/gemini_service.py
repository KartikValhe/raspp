import logging
from google import genai
from app.core.config import settings

logger = logging.getLogger(__name__)

class GeminiAdvisorService:
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
            except Exception:
                logger.exception("Failed to initialize Gemini client")

    def generate_career_advice(
        self,
        student_profile: dict,
        ml_prediction: dict,
        shap_explanation: list,
    ) -> str:
        if not self.is_configured or not self.client:
            return (
                "Gemini API key is missing or the client "
                "could not be initialized."
            )

        prompt = f"""
You are an expert AI Career Advisor for a university.

A student needs advice about their career and placement prospects.

Academic and project profile:
{student_profile}

Predicted placement probability:
{ml_prediction.get('confidence', 0) * 100}%

Key factors influencing this prediction:
{shap_explanation}

Provide a personalized, encouraging, actionable 3-step plan
to improve this student's placement chances.

Be specific to their strengths and areas for improvement.
Explain that the model's prediction is an estimate, not a guarantee.
"""

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
            )

            if response and response.text:
                return response.text

            logger.warning("Gemini returned an empty response")
            return (
                "Gemini returned no text. Please try again "
                "or use the internal knowledge base."
            )

        except Exception:
            logger.exception("Gemini career-advice request failed")
            return (
                "Gemini is temporarily unavailable. "
                "Please try again or use the internal knowledge base."
            )

advisor_service = GeminiAdvisorService()
