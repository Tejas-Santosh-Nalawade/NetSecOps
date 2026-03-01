# Model Information

## Current Setup

This project now supports **two model types**:

### 1. **Simple 6-Feature Model** (Active for API Predictions)
- **Features:** amount, IP octets (3), hour, day-of-week
- **Algorithms Compared:** XGBoost, RandomForest, LogisticRegression, IsolationForest
- **Best Algorithm:** XGBoost (F1 = 0.699)
- **Use Case:** Real-time API predictions via `/predict` endpoint
- **Training:** `python train_model.py`
- **Location:** `app/ml/fraud_model.joblib`

### 2. **IEEE-CIS 432-Feature Model** (For Dataset Training/Demo)
- **Features:** 432 features from IEEE-CIS Competition dataset
- **Algorithms Compared:** XGBoost, RandomForest, LogisticRegression
- **Best Algorithm:** XGBoost (F1 = 0.554, Accuracy = 0.984)
- **Use Case:** Training on real-world fraud dataset for demonstration
- **Training:** `python train_model_ieee.py`
- **Location:** `ml_registry/model_v3_0_0_ieee/`

## Why Two Models?

The API `/predict` endpoint accepts simple transaction data (amount, IP, timestamp), which generates only 6 features. The IEEE-CIS dataset has 432+ features including card details, device info, email domains, etc. 

**Solution:** We maintain two models:
- The **simple model** handles API predictions
- The **IEEE model** demonstrates training on real-world data

## Feature Mismatch Protection

The `predict()` function in `app/ml/model.py` automatically detects feature mismatches:

```python
if expected_features is not None and X.shape[1] != expected_features:
    # Falls back to rule-based prediction
    print(f"Warning: Feature mismatch. Using rule-based prediction.")
```

This ensures the API never crashes due to feature count differences.

## Training Commands

```bash
# Train simple model for API use
cd backend
python train_model.py

# Train IEEE model for demonstration
cd backend
python train_model_ieee.py

# Restart API to load new model
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `POST /predict` - Uses simple 6-feature model
- `GET /metrics` - Returns current model metrics
- `GET /dataset/stats` - Show IEEE dataset statistics
- `POST /dataset/train` - Train new model with IEEE dataset
- `POST /mlops/retrain` - Retrain current model

## Frontend Integration

The frontend graphs display real metrics from whichever model is currently loaded:
- **Model Monitoring** page: Shows algorithm comparison and metrics
- **Dataset & Training** page: Allows training with IEEE dataset
- **Dashboard** page: Shows live predictions using active model
