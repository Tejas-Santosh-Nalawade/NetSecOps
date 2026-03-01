import time
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    PredictRequest,
    PredictResponse,
    ModelMetricsResponse,
    FeedbackRequest,
    FeedbackResponse,
    HealthResponse,
    DatasetStatsResponse,
    TrainingRequest,
    TrainingResponse,
)
from app.ml import load_model, predict, get_metadata
from app.mlops import registry, drift_detector, pipeline
from app.ml.features import extract_features

# In-memory store for feedback (for demo; use DB in production)
feedback_store: list[dict] = []


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield
    # shutdown if needed
    pass


app = FastAPI(
    title="NetSecOps AI - Fraud Detection API",
    description="ML-powered fraud detection and model monitoring",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _ai_summary(risk_score: float, amount: float, source_ip: str) -> str:
    factors = []
    if amount > 20000:
        factors.append("unusually high transaction amount")
    if risk_score > 0.8:
        factors.append("multiple risk indicators detected")
    if source_ip.startswith("192.") or source_ip.startswith("10."):
        factors.append("suspicious IP pattern")
    desc = ", ".join(factors) if factors else "anomalous transaction patterns"
    return f"Transaction flagged due to {desc}. Risk score of {risk_score * 100:.1f}% indicates potential fraudulent activity."


def _risk_explanation(amount: float, source_ip: str) -> str:
    return f"The transaction from IP {source_ip} with amount ${amount:,.2f} has been flagged. The risk score is calculated based on transaction patterns, IP reputation, and behavioral analysis."


def _suggested_action(risk_level: str) -> str:
    if risk_level == "High":
        return "Immediate block recommended. Escalate to security team for investigation."
    return "Review transaction details. Consider additional verification before approval."


@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(
        status="ok",
        model_loaded=load_model(),
    )


@app.post("/predict", response_model=PredictResponse)
def predict_risk(req: PredictRequest):
    start = time.perf_counter()
    risk_score, risk_level = predict(
        amount=req.amount,
        source_ip=req.source_ip,
        timestamp=req.timestamp,
    )
    
    # Track for drift detection
    features = extract_features(req.amount, req.source_ip, req.timestamp)
    drift_detector.add_prediction(features, risk_score)
    
    return PredictResponse(
        risk_score=risk_score,
        risk_level=risk_level,
        ai_summary=_ai_summary(risk_score, req.amount, req.source_ip),
        risk_explanation=_risk_explanation(req.amount, req.source_ip),
        suggested_action=_suggested_action(risk_level),
    )


@app.get("/metrics", response_model=ModelMetricsResponse)
def metrics():
    meta = get_metadata()
    return ModelMetricsResponse(
        accuracy=meta["accuracy"],
        precision=meta["precision"],
        recall=meta["recall"],
        f1_score=meta["f1_score"],
        drift_score=meta["drift_score"],
        latency=meta["latency"],
        false_positive_rate=meta["false_positive_rate"],
        version=meta["version"],
        best_algorithm=meta.get("best_algorithm"),
        all_algorithms=meta.get("all_algorithms"),
    )


@app.post("/feedback", response_model=FeedbackResponse)
def feedback(req: FeedbackRequest):
    feedback_store.append({
        "incident_id": req.incident_id,
        "is_fraud": req.is_fraud,
        "comment": req.comment,
    })
    return FeedbackResponse(ok=True, message="Feedback recorded for model improvement.")


@app.get("/feedback")
def list_feedback():
    return {"count": len(feedback_store), "items": feedback_store}


# ========== MLOps Endpoints ==========

@app.post("/mlops/retrain")
def trigger_retraining():
    """Trigger model retraining pipeline."""
    result = pipeline.run_training(trigger="api")
    return result


@app.get("/mlops/drift")
def get_drift_status():
    """Get current drift detection status."""
    drift_status = drift_detector.detect_drift()
    return drift_status


@app.get("/mlops/registry")
def list_model_versions():
    """List all model versions in registry."""
    versions = registry.list_versions()
    current = registry.get_current_version()
    return {
        "versions": versions,
        "current": current,
        "total": len(versions),
    }


@app.post("/mlops/deploy/{version}")
def deploy_model_version(version: str):
    """Deploy a specific model version to production."""
    result = pipeline.deploy_model(version, promote=True)
    if result["status"] == "success":
        # Reload model
        load_model()
    return result


@app.get("/mlops/experiments")
def list_experiments():
    """List recent training experiments."""
    from app.mlops.experiments import tracker
    if hasattr(tracker, "simple_logs"):
        return {"experiments": tracker.simple_logs[-10:]}
    return {"message": "MLflow tracking enabled. Check mlflow UI."}


# ========== Dataset & Training Endpoints ==========

@app.get("/dataset/stats", response_model=DatasetStatsResponse)
def get_dataset_stats():
    """Get IEEE-CIS dataset statistics"""
    import pandas as pd
    from pathlib import Path
    import os
    
    # Handle path relative to backend directory
    if os.path.exists("dataset/IEE_CIS_dataset"):
        dataset_path = Path("dataset/IEE_CIS_dataset")
    elif os.path.exists("backend/dataset/IEE_CIS_dataset"):
        dataset_path = Path("backend/dataset/IEE_CIS_dataset")
    else:
        raise FileNotFoundError("Dataset not found. Expected at dataset/IEE_CIS_dataset")
    
    # Load sample data
    df_trans = pd.read_csv(dataset_path / "train_transaction.csv", nrows=10000)
    df_identity = pd.read_csv(dataset_path / "train_identity.csv", nrows=10000)
    
    # Get fraud rate from full scan (or use cached value)
    fraud_count = df_trans['isFraud'].sum()
    total_count = len(df_trans)
    fraud_rate = df_trans['isFraud'].mean()
    
    # Sample transactions
    sample_data = df_trans.head(5)[['TransactionID', 'TransactionDT', 'TransactionAmt', 'ProductCD', 'isFraud']].to_dict('records')
    
    return DatasetStatsResponse(
        dataset_name="IEEE-CIS Fraud Detection Dataset",
        total_transactions=total_count,
        fraud_transactions=int(fraud_count),
        fraud_rate=fraud_rate,
        num_features_transaction=len(df_trans.columns),
        num_features_identity=len(df_identity.columns),
        total_features=len(df_trans.columns) + len(df_identity.columns) - 1,  # -1 for TransactionID overlap
        sample_transactions=sample_data
    )


@app.post("/dataset/train", response_model=TrainingResponse)
def train_with_ieee_dataset(request: TrainingRequest):
    """Trigger model training - uses simple model for API compatibility"""
    import subprocess
    import sys
    import os
    
    try:
        # Use the simple train_model.py for API compatibility
        # The IEEE dataset training is for demonstration only
        script_name = "train_model.py"  # Simple 6-feature model
        
        print(f"Starting training with {script_name}...")
        
        # Determine correct working directory
        cwd = "."
        if not os.path.exists(script_name):
            # Try backend directory
            if os.path.exists("backend"):
                cwd = "backend"
        
        result = subprocess.run(
            [sys.executable, script_name],
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout for simple model
        )
        
        print("STDOUT:", result.stdout[-500:] if result.stdout else "None")
        print("STDERR:", result.stderr[-500:] if result.stderr else "None")
        print("Return code:", result.returncode)
        
        if result.returncode == 0:
            # Reload model
            load_model()
            metadata = get_metadata()
            
            return TrainingResponse(
                status="success",
                message="Model trained successfully! The API is now using the updated model.",
                model_version=metadata.get("version"),
                metrics={
                    "f1_score": metadata.get("f1_score"),
                    "accuracy": metadata.get("accuracy"),
                    "precision": metadata.get("precision"),
                    "recall": metadata.get("recall"),
                }
            )
        else:
            error_msg = result.stderr if result.stderr else result.stdout
            # Extract just the important error message
            if "Error" in error_msg or "Traceback" in error_msg:
                lines = error_msg.split('\n')
                error_lines = [l for l in lines if 'Error' in l or 'File' in l][-5:]
                error_msg = '\n'.join(error_lines) if error_lines else error_msg[:500]
            
            return TrainingResponse(
                status="error",
                message=f"Training failed. Please check server logs. Error: {error_msg[:300]}"
            )
            
    except subprocess.TimeoutExpired:
        return TrainingResponse(
            status="error",
            message="Training timed out (>5 minutes). Please try again."
        )
    except Exception as e:
        return TrainingResponse(
            status="error",
            message=f"Training error: {str(e)}"
        )
