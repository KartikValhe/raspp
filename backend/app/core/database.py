from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

import os

# Robust SSL certificate resolution for local, Docker, and Render environments
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
connect_args = {}

ssl_ca_path = None
if settings.DB_SSL_CA:
    if os.path.exists(settings.DB_SSL_CA):
        ssl_ca_path = settings.DB_SSL_CA
    elif os.path.exists(os.path.join(backend_dir, settings.DB_SSL_CA)):
        ssl_ca_path = os.path.join(backend_dir, settings.DB_SSL_CA)

# Auto-fallback to bundled cert if connecting to TiDB Cloud and path not found/set
if not ssl_ca_path and "tidbcloud.com" in settings.DB_HOST:
    bundled_ca = os.path.join(backend_dir, "certs", "isrgrootx1.pem")
    if os.path.exists(bundled_ca):
        ssl_ca_path = bundled_ca
    elif os.path.exists("/etc/ssl/certs/ca-certificates.crt"):
        ssl_ca_path = "/etc/ssl/certs/ca-certificates.crt"

if ssl_ca_path:
    connect_args["ssl_ca"] = ssl_ca_path

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_pre_ping=True,          # Detect stale connections before using them
    pool_size=10,
    max_overflow=20,
    pool_recycle=1800,           # 30 min: prevents stale TiDB connections (was 1hr)
    pool_timeout=10,             # Fail fast instead of hanging for 30s (default)
    connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@event.listens_for(engine, "connect")
def configure_connection(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("SET session sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'")
    cursor.close()

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
