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
    "http://localhost:5175",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
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
    allow_origin_regex=r"^(https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?|https:\/\/.*\.vercel\.app)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import Request
from starlette.responses import JSONResponse
from jose import jwt, JWTError

SAFE_WRITE_PATHS = {
    "/api/v1/auth/login",
    "/api/v1/superadmin/login",
    "/api/v1/chatbot/message",
    "/api/v1/ml/predict",
    "/api/v1/ml/bulk-predict",
    "/api/v1/advisor",
}

@app.middleware("http")
async def demo_mode_write_guard(request: Request, call_next):
    """
    Global protection: Blocks create, update, delete operations for users
    in Demo / View-Only mode (can_modify=False), while allowing full viewing access.
    """
    if request.method in ("POST", "PUT", "PATCH", "DELETE"):
        path = request.url.path
        if not any(path.startswith(p) for p in SAFE_WRITE_PATHS):
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ", 1)[1]
                try:
                    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
                    can_modify = payload.get("can_modify")
                    if can_modify is False:
                        return JSONResponse(
                            status_code=403,
                            content={
                                "detail": "Demo / View-Only Mode: Modification permissions are restricted. You cannot create, update, or delete records in demo mode."
                            }
                        )
                except JWTError:
                    pass

    return await call_next(request)

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
