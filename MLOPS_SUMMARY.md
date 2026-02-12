# MLOps Pipeline Summary

This repository now includes a **complete MLOps pipeline** demonstrating enterprise-grade ML operations beyond simple model training.

## ✅ What's Been Added

### 1. **Experiment Tracking** (`app/mlops/experiments.py`)
- MLflow integration for experiment logging
- Tracks metrics, hyperparameters, and model artifacts
- Fallback JSON logging if MLflow unavailable
- Compare training runs and select best models

### 2. **Model Registry** (`app/mlops/registry.py`)
- Version control for all trained models
- Metadata tracking (metrics, algorithm, timestamp)
- Production promotion workflow
- Model version comparison

### 3. **Drift Detection** (`app/mlops/drift_detector.py`)
- Real-time feature distribution monitoring
- Prediction drift detection
- Automatic alerts when drift exceeds thresholds
- Integrated into prediction endpoint

### 4. **Training Pipeline** (`app/mlops/pipeline.py`)
- Automated retraining orchestration
- Model validation before deployment
- Deployment automation with versioning
- Feedback loop integration

### 5. **CI/CD Workflows** (`.github/workflows/`)
- **mlops-pipeline.yml**: Automated training on code changes
- **test-api.yml**: API endpoint testing
- Model validation gates
- Artifact management

### 6. **API Endpoints**
- `POST /mlops/retrain` - Trigger retraining
- `GET /mlops/drift` - Check drift status
- `GET /mlops/registry` - List model versions
- `POST /mlops/deploy/{version}` - Deploy model
- `GET /mlops/experiments` - View experiments

## 🔄 MLOps Workflow

```
┌─────────────┐
│   Trigger   │ (API, CI/CD, or Scheduled)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Train     │ (Multiple algorithms)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Evaluate   │ (Compare F1 scores)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Register   │ (Version & metadata)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Log       │ (MLflow experiment)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Validate   │ (Performance checks)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Deploy    │ (Promote to production)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Monitor    │ (Drift detection)
└─────────────┘
```

## 📊 Key Differences from Simple ML

| Feature | Simple ML | MLOps Pipeline |
|---------|-----------|----------------|
| Model Versioning | ❌ Single model file | ✅ Registry with versions |
| Experiment Tracking | ❌ No tracking | ✅ MLflow + JSON logs |
| Drift Detection | ❌ Manual checks | ✅ Real-time monitoring |
| Retraining | ❌ Manual script | ✅ Automated pipeline |
| Deployment | ❌ File replacement | ✅ Versioned deployment |
| CI/CD | ❌ None | ✅ GitHub Actions |
| Validation | ❌ None | ✅ Pre-deployment gates |

## 🚀 Quick Start

### 1. Train with MLOps
```bash
cd backend
python train_model.py
# Model automatically registered and logged
```

### 2. Check Drift
```bash
curl http://localhost:8000/mlops/drift
```

### 3. Retrain Model
```bash
curl -X POST http://localhost:8000/mlops/retrain
```

### 4. View Registry
```bash
curl http://localhost:8000/mlops/registry
```

### 5. Deploy Model
```bash
curl -X POST http://localhost:8000/mlops/deploy/v1.0.0
```

## 📁 Directory Structure

```
backend/
├── app/
│   ├── mlops/              # MLOps infrastructure
│   │   ├── registry.py     # Model versioning
│   │   ├── experiments.py  # MLflow tracking
│   │   ├── drift_detector.py # Drift monitoring
│   │   └── pipeline.py     # Training orchestration
│   └── ml/                 # Model inference
├── ml_registry/            # Model versions (gitignored)
├── mlflow_experiments/     # MLflow data (gitignored)
└── train_model.py          # Training script (MLOps integrated)

.github/workflows/
├── mlops-pipeline.yml      # CI/CD for training
└── test-api.yml            # API testing
```

## 🎯 MLOps Best Practices Demonstrated

1. ✅ **Version Control** - All models versioned in registry
2. ✅ **Experiment Tracking** - All runs logged with MLflow
3. ✅ **Automated Testing** - CI/CD validates models
4. ✅ **Drift Monitoring** - Real-time detection integrated
5. ✅ **Automated Retraining** - API-triggered pipeline
6. ✅ **Validation Gates** - Pre-deployment checks
7. ✅ **Model Registry** - Centralized model management
8. ✅ **Deployment Automation** - Versioned deployments

## 📚 Documentation

- **MLOps Details**: See `backend/MLOPS.md`
- **API Docs**: Run API and visit `/docs` for Swagger UI
- **CI/CD**: See `.github/workflows/` for pipeline definitions

This demonstrates a **production-ready MLOps pipeline** suitable for enterprise fraud detection systems.
