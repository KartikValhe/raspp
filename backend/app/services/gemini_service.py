import google.generativeai as genai
from app.core.config import settings

class GeminiAdvisorService:
    def __init__(self):
        # Configure the Gemini API with the key from our .env file
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-flash-latest')
            self.is_configured = True
        else:
            self.is_configured = False

    def generate_career_advice(self, student_profile: dict, ml_prediction: dict, shap_explanation: list) -> str:
        if not self.is_configured:
            return "Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file."

        # Construct the prompt using the student's data and ML insights
        prompt = f"""
        You are an expert AI Career Advisor for a university. 
        A student has asked for advice on their career and placement prospects.
        
        Here is their academic and project profile:
        {student_profile}
        
        Our internal Machine Learning model predicted their placement probability as: {ml_prediction.get('confidence', 0) * 100}%
        The model identified the following key factors influencing this prediction:
        {shap_explanation}
        
        Based on this data, provide a highly personalized, encouraging, and actionable 3-step plan 
        for this student to improve their placement chances. Be specific to their strengths and weaknesses.
        """

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error communicating with Gemini AI: {str(e)}"

advisor_service = GeminiAdvisorService()
