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
