# RASPP Development Guide

## Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MySQL Server

## Setup

### Backend
1. Navigate to `backend/`
2. Create virtual environment (optional but recommended)
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env` file with your DB credentials.
5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   Docs at: http://localhost:8000/docs

### Frontend
1. Navigate to `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

## Project Structure
- `backend/app`: FastAPI application
- `frontend/src`: React application
- `docs/`: Documentation
