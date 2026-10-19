# ── Backend Dockerfile ──────────────────────────────────────────────────────
# Python 3.11 slim image for the FastAPI backend
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies needed by mysqlclient / some ML libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies first (layer-cache friendly)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Run with uvicorn (reload disabled in production)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
