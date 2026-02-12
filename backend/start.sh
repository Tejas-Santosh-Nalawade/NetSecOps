#!/bin/bash
# Start FastAPI backend server

echo "Checking Python environment..."
python --version

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Checking if model exists..."
if [ ! -f "app/ml/fraud_model.joblib" ]; then
    echo "Model not found. Training model..."
    python train_model.py
fi

echo "Starting FastAPI server..."
echo "API will be available at http://localhost:8000"
echo "API docs at http://localhost:8000/docs"
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
