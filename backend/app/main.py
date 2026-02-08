from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.core.database import engine, Base
from app.models import models

# Create tables
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RASPP - Result Analyzer & Student Performance Predictor",
    description="AI-powered Student Performance Prediction System",
    version="1.0.0"
)

from app.api.api_v1.api import api_router

# ... (existing code)

# CORS Middleware
origins = [
    "http://localhost",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
# ...
async def root():
    return {"message": "Welcome to RASPP API"}

@app.get("/health")
@app.get("/test_debug")
def test_debug():
    return {"message": "You are hitting the correct server!"}
