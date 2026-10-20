from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.core.database import engine, Base
from app.models import models

app = FastAPI(
    title="RASPP - Result Analyzer & Student Performance Predictor",
    description="AI-powered Student Performance Prediction System",
    version="1.0.0"
)

@app.on_event("startup")
def startup_db_check():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Notice: Database startup check: {e}")

from app.api.api_v1.api import api_router

# CORS Middleware
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost",
    "http://127.0.0.1",
]

if settings.CORS_ORIGINS:
    for origin in settings.CORS_ORIGINS.split(","):
        stripped = origin.strip()
        if stripped and stripped not in origins:
            origins.append(stripped)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
# ...
async def root():
    return {"message": "Welcome to RASPP API"}

from app.core.redis import redis_cache

@app.get("/health")
@app.get("/test_debug")
def test_debug():
    cache_mode = "Redis" if (redis_cache._client and redis_cache._is_connected) else "In-Memory Fast Cache (Zero-latency fallback)"
    return {
        "status": "healthy",
        "message": "RASPP API is active",
        "cache_engine": cache_mode
    }
