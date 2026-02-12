#!/bin/bash
echo "Starting FastAPI Backend..."
cd backend

if [ ! -f "app/ml/fraud_model.joblib" ]; then
    echo "Model not found. Training model first..."
    python train_model.py
fi

echo "Starting API server on http://localhost:8000"
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
