@echo off
echo Starting FastAPI Backend...
cd backend
if not exist "app\ml\fraud_model.joblib" (
    echo Model not found. Training model first...
    python train_model.py
)
echo Starting API server on http://localhost:8000
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
