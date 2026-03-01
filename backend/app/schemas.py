from pydantic import BaseModel, Field
from typing import Optional, List, Any


class PredictRequest(BaseModel):
    amount: float = Field(..., gt=0, description="Transaction amount")
    source_ip: str = Field(..., description="Source IP address")
    timestamp: Optional[int] = Field(None, description="Unix timestamp (ms)")


class PredictResponse(BaseModel):
    risk_score: float = Field(..., ge=0, le=1)
    risk_level: str = Field(..., pattern="^(Low|Medium|High)$")
    ai_summary: Optional[str] = None
    risk_explanation: Optional[str] = None
    suggested_action: Optional[str] = None


class ModelMetricsResponse(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    drift_score: float
    latency: float
    false_positive_rate: float
    version: str
    best_algorithm: Optional[str] = None
    all_algorithms: Optional[List[Any]] = None


class FeedbackRequest(BaseModel):
    incident_id: str
    is_fraud: bool
    comment: str = ""


class FeedbackResponse(BaseModel):
    ok: bool
    message: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    
    class Config:
        protected_namespaces = ()


class DatasetStatsResponse(BaseModel):
    dataset_name: str
    total_transactions: int
    fraud_transactions: int
    fraud_rate: float
    num_features_transaction: int
    num_features_identity: int
    total_features: int
    sample_transactions: List[dict]
    
    
class TrainingRequest(BaseModel):
    sample_size: Optional[int] = 100000
    use_ieee_dataset: bool = True
    

class TrainingResponse(BaseModel):
    status: str
    message: str
    model_version: Optional[str] = None
    metrics: Optional[dict] = None
    
    class Config:
        protected_namespaces = ()
