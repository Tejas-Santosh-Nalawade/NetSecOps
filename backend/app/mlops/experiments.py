"""
MLflow Experiment Tracking Integration
"""
import os
from pathlib import Path
from typing import Dict, Optional
import json

try:
    import mlflow
    import mlflow.sklearn
    HAS_MLFLOW = True
except ImportError:
    HAS_MLFLOW = False

EXPERIMENTS_DIR = Path(__file__).resolve().parent.parent.parent / "mlflow_experiments"
EXPERIMENTS_DIR.mkdir(exist_ok=True)

if HAS_MLFLOW:
    os.environ.setdefault("MLFLOW_TRACKING_URI", str(EXPERIMENTS_DIR / "mlruns"))


class ExperimentTracker:
    """Track ML experiments with MLflow or simple JSON fallback."""

    def __init__(self, experiment_name: str = "fraud_detection"):
        self.experiment_name = experiment_name
        if HAS_MLFLOW:
            mlflow.set_experiment(experiment_name)
        self.simple_logs = []

    def log_experiment(
        self,
        run_name: str,
        metrics: Dict[str, float],
        params: Dict[str, any],
        model=None,
        model_path: Optional[str] = None,
    ) -> str:
        """Log an experiment run."""
        if HAS_MLFLOW:
            with mlflow.start_run(run_name=run_name):
                mlflow.log_metrics(metrics)
                mlflow.log_params(params)
                if model is not None:
                    mlflow.sklearn.log_model(model, "model")
                if model_path:
                    mlflow.log_artifact(model_path)
                run_id = mlflow.active_run().info.run_id
            return run_id
        else:
            # Simple JSON logging
            log_entry = {
                "run_name": run_name,
                "timestamp": str(Path(__file__).stat().st_mtime),
                "metrics": metrics,
                "params": params,
            }
            self.simple_logs.append(log_entry)
            log_file = EXPERIMENTS_DIR / f"{run_name}.json"
            with open(log_file, "w") as f:
                json.dump(log_entry, f, indent=2)
            return run_name

    def get_best_run(self, metric: str = "f1_score", maximize: bool = True):
        """Get best run by metric."""
        if HAS_MLFLOW:
            experiment = mlflow.get_experiment_by_name(self.experiment_name)
            if experiment:
                runs = mlflow.search_runs(
                    experiment_ids=[experiment.experiment_id],
                    order_by=[f"metrics.{metric} {'DESC' if maximize else 'ASC'}"],
                    max_results=1,
                )
                if len(runs) > 0:
                    return runs.iloc[0].to_dict()
        return None


tracker = ExperimentTracker()
