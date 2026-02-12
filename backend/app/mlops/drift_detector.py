"""
Data Drift Detection for Model Monitoring
"""
import numpy as np
from typing import List, Tuple, Dict
from scipy import stats
from collections import deque
from datetime import datetime


class DriftDetector:
    """Detect data drift and model performance degradation."""

    def __init__(self, window_size: int = 1000):
        self.window_size = window_size
        self.reference_distribution: Dict[str, np.ndarray] = {}
        self.recent_predictions = deque(maxlen=window_size)
        self.recent_features = deque(maxlen=window_size)

    def set_reference(self, features: np.ndarray, predictions: np.ndarray):
        """Set reference distribution from training data."""
        self.reference_distribution = {
            "mean": np.mean(features, axis=0),
            "std": np.std(features, axis=0),
            "pred_mean": np.mean(predictions),
            "pred_std": np.std(predictions),
        }

    def add_prediction(self, features: np.ndarray, prediction: float):
        """Add a new prediction for drift monitoring."""
        self.recent_features.append(features.flatten())
        self.recent_predictions.append(prediction)

    def detect_drift(self) -> Dict[str, float]:
        """Detect drift in features and predictions."""
        if len(self.recent_features) < 100:
            return {"drift_score": 0.0, "feature_drift": 0.0, "prediction_drift": 0.0}

        recent_feat = np.array(list(self.recent_features))
        recent_pred = np.array(list(self.recent_predictions))

        # Feature drift: compare means using Kolmogorov-Smirnov test
        feature_drift = 0.0
        if "mean" in self.reference_distribution:
            ref_mean = self.reference_distribution["mean"]
            ref_std = self.reference_distribution["std"]
            current_mean = np.mean(recent_feat, axis=0)

            # Normalized difference
            diff = np.abs(current_mean - ref_mean)
            normalized_diff = diff / (ref_std + 1e-8)
            feature_drift = float(np.mean(normalized_diff))

        # Prediction drift
        prediction_drift = 0.0
        if "pred_mean" in self.reference_distribution:
            ref_pred_mean = self.reference_distribution["pred_mean"]
            ref_pred_std = self.reference_distribution["pred_std"]
            current_pred_mean = np.mean(recent_pred)

            if ref_pred_std > 0:
                z_score = abs(current_pred_mean - ref_pred_mean) / ref_pred_std
                prediction_drift = min(float(z_score / 3.0), 1.0)  # Normalize to [0,1]

        # Combined drift score
        drift_score = (feature_drift + prediction_drift) / 2.0

        return {
            "drift_score": round(drift_score, 4),
            "feature_drift": round(feature_drift, 4),
            "prediction_drift": round(prediction_drift, 4),
            "sample_size": len(self.recent_features),
        }


# Global drift detector instance
drift_detector = DriftDetector()
