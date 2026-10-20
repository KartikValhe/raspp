from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.services.system_chatbot_service import chatbot_service

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    user_role: Optional[str] = "student"
    current_page: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    status: str = "success"
    is_genai_active: bool = False

@router.post("/message", response_model=ChatResponse)
def send_chat_message(request: ChatRequest):
    if not request.messages:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chat history cannot be empty."
        )

    formatted_messages = [{"role": m.role, "content": m.content} for m in request.messages]
    reply = chatbot_service.generate_response(
        messages=formatted_messages,
        user_role=request.user_role
    )

    return ChatResponse(
        reply=reply,
        status="success",
        is_genai_active=chatbot_service.is_configured
    )

@router.get("/status")
def get_chatbot_status():
    return {
        "status": "online",
        "is_genai_active": chatbot_service.is_configured,
        "model": "gemini-1.5-flash" if chatbot_service.is_configured else "internal-knowledge-engine"
    }
