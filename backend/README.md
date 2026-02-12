# NetSecOps AI - Fraud Detection API

FastAPI backend with an ML-based fraud detection model.

## Setup

```bash
cd backend
pip install -r requirements.txt
python train_model.py   # Train and save model (run once)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

| Method | Endpoint   | Description                          |
|--------|------------|--------------------------------------|
| GET    | `/health`  | Health check and model load status   |
| POST   | `/predict` | Risk score for a transaction         |
| GET    | `/metrics` | Model performance metrics             |
| POST   | `/feedback`| Submit feedback for model improvement|
| GET    | `/feedback`| List stored feedback (demo)          |

### POST /predict

Request body:

```json
{
  "amount": 15000.50,
  "source_ip": "192.168.1.100",
  "timestamp": 1700000000000
}
```

Response:

```json
{
  "risk_score": 0.72,
  "risk_level": "Medium",
  "ai_summary": "Transaction flagged due to...",
  "risk_explanation": "The transaction from IP...",
  "suggested_action": "Review transaction details..."
}
```

### GET /metrics

Returns accuracy, precision, recall, F1, drift score, latency, false positive rate, and model version.

### POST /feedback

Request body:

```json
{
  "incident_id": "INC-123",
  "is_fraud": true,
  "comment": "Confirmed fraud"
}
```

## ML Model

- **Algorithms compared**: Isolation Forest, **XGBoost**, Random Forest, Logistic Regression. The best by F1-score is saved.
- **Features**: Normalized amount, IP octets, hour, day-of-week
- **Training**: Run `python train_model.py` to train all four, compare them, and save the best to `app/ml/fraud_model.joblib` and `app/ml/scaler.joblib`. The `/metrics` response includes `best_algorithm` and `all_algorithms` (comparison table).
- If no model file exists, the API falls back to rule-based risk scoring

## CORS

Allowed origins include `http://localhost:5173` and `http://127.0.0.1:5173` for the Vite dev server.
