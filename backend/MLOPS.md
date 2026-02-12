# MLOps Pipeline Documentation

This document describes the MLOps infrastructure integrated into the NetSecOps AI fraud detection platform.

## 🏗️ Architecture

### Components

1. **Model Registry** (`app/mlops/registry.py`)
   - Version control for models
   - Model metadata tracking
   - Production promotion workflow

2. **Experiment Tracking** (`app/mlops/experiments.py`)
   - MLflow integration for experiment logging
   - Fallback JSON logging if MLflow unavailable
   - Metrics and hyperparameter tracking

3. **Drift Detection** (`app/mlops/drift_detector.py`)
   - Real-time feature drift monitoring
   - Prediction distribution monitoring
   - Automatic drift alerts

4. **Training Pipeline** (`app/mlops/pipeline.py`)
   - Automated retraining orchestration
   - Model validation before deployment
   - Deployment automation

5. **CI/CD** (`.github/workflows/`)
   - Automated training on code changes
   - Model validation in CI
   - Artifact management

## 📊 MLOps Endpoints

### POST `/mlops/retrain`
Trigger model retraining pipeline.

**Response:**
```json
{
  "status": "success",
  "trigger": "api",
  "timestamp": "2026-02-12T...",
  "metrics": {
    "best_algorithm": "XGBoost",
    "best_f1": 0.699
  }
}
```

### GET `/mlops/drift`
Get current drift detection status.

**Response:**
```json
{
  "drift_score": 0.12,
  "feature_drift": 0.08,
  "prediction_drift": 0.15,
  "sample_size": 1000
}
```

### GET `/mlops/registry`
List all model versions.

**Response:**
```json
{
  "versions": [
    {
      "version": "v1.0.0",
      "model_id": "model_v1_0_0",
      "timestamp": "2026-02-12T...",
      "metrics": {...},
      "algorithm": "XGBoost"
    }
  ],
  "current": {...},
  "total": 1
}
```

### POST `/mlops/deploy/{version}`
Deploy a model version to production.

**Response:**
```json
{
  "status": "success",
  "version": "v1.0.0",
  "message": "Model v1.0.0 promoted to production"
}
```

### GET `/mlops/experiments`
List recent training experiments.

## 🔄 Workflow

### Training Workflow

1. **Trigger**: Manual via API or automatic via CI/CD
2. **Train**: Multiple algorithms (XGBoost, RF, LR, IsolationForest)
3. **Evaluate**: Compare F1 scores, select best
4. **Register**: Save to model registry with version
5. **Log**: Track experiment in MLflow
6. **Validate**: Check performance thresholds
7. **Deploy**: Promote to production if validated

### Monitoring Workflow

1. **Predict**: Each prediction tracked for drift
2. **Detect**: Calculate drift scores periodically
3. **Alert**: Trigger retraining if drift exceeds threshold
4. **Retrain**: Automatically retrain on new data/feedback

## 🚀 Usage

### Manual Retraining

```bash
curl -X POST http://localhost:8000/mlops/retrain
```

### Check Drift

```bash
curl http://localhost:8000/mlops/drift
```

### Deploy Model

```bash
curl -X POST http://localhost:8000/mlops/deploy/v1.0.0
```

### View Registry

```bash
curl http://localhost:8000/mlops/registry
```

## 📁 Directory Structure

```
backend/
├── app/
│   ├── mlops/
│   │   ├── registry.py      # Model versioning
│   │   ├── experiments.py    # MLflow tracking
│   │   ├── drift_detector.py # Drift monitoring
│   │   └── pipeline.py       # Training orchestration
│   └── ml/                   # Model inference
├── ml_registry/              # Model versions
├── mlflow_experiments/        # MLflow tracking data
└── train_model.py            # Training script
```

## 🔧 Configuration

### Drift Thresholds

Edit `app/mlops/drift_detector.py` to adjust:
- `window_size`: Number of predictions to track
- Drift detection thresholds

### Validation Criteria

Edit `app/mlops/pipeline.py` `validate_model()`:
- Minimum F1 score threshold
- Other performance criteria

### CI/CD Triggers

Edit `.github/workflows/mlops-pipeline.yml`:
- Branch triggers
- Path filters
- Manual dispatch

## 📈 Monitoring

- **Drift Score**: Updated in real-time from predictions
- **Model Metrics**: Available via `/metrics` endpoint
- **Experiment History**: Tracked in MLflow or JSON logs
- **Registry**: All versions tracked with metadata

## 🎯 Best Practices

1. **Version Control**: Always register models after training
2. **Validation**: Validate before production deployment
3. **Monitoring**: Monitor drift regularly
4. **Retraining**: Retrain when drift exceeds threshold
5. **Experiments**: Log all training runs for comparison
