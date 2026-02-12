"""
MLOps Training Pipeline - Automated retraining with feedback loop
"""
import subprocess
import sys
from pathlib import Path
from typing import Dict, Optional
from datetime import datetime
import json


class TrainingPipeline:
    """Orchestrate model training, validation, and deployment."""

    def __init__(self):
        self.train_script = Path(__file__).resolve().parent.parent.parent / "train_model.py"

    def run_training(
        self,
        trigger: str = "manual",
        use_feedback: bool = False,
        feedback_data: Optional[list] = None,
    ) -> Dict:
        """Run the training pipeline."""
        try:
            # Run training script
            result = subprocess.run(
                [sys.executable, str(self.train_script)],
                capture_output=True,
                text=True,
                timeout=300,  # 5 min timeout
            )

            if result.returncode != 0:
                return {
                    "status": "failed",
                    "error": result.stderr,
                    "trigger": trigger,
                    "timestamp": datetime.now().isoformat(),
                }

            # Parse output for metrics
            output = result.stdout
            metrics = self._parse_training_output(output)

            return {
                "status": "success",
                "trigger": trigger,
                "timestamp": datetime.now().isoformat(),
                "metrics": metrics,
                "output": output,
            }

        except subprocess.TimeoutExpired:
            return {
                "status": "timeout",
                "trigger": trigger,
                "timestamp": datetime.now().isoformat(),
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "trigger": trigger,
                "timestamp": datetime.now().isoformat(),
            }

    def _parse_training_output(self, output: str) -> Dict:
        """Parse training script output for metrics."""
        metrics = {}
        lines = output.split("\n")
        for line in lines:
            if "Algorithm:" in line and "F1" in line:
                # Extract best algorithm and F1
                parts = line.split("Algorithm:")[-1].strip()
                if "(" in parts:
                    algo = parts.split("(")[0].strip()
                    f1_str = parts.split("F1 =")[-1].split(")")[0].strip()
                    metrics["best_algorithm"] = algo
                    try:
                        metrics["best_f1"] = float(f1_str)
                    except:
                        pass
        return metrics

    def validate_model(self, version: Optional[str] = None) -> Dict:
        """Validate model performance before deployment."""
        from app.mlops.registry import registry

        model_meta = registry.get_current_version() if version is None else None
        if model_meta is None:
            return {"valid": False, "reason": "Model not found"}

        metrics = model_meta.get("metrics", {})
        f1 = metrics.get("f1_score", 0)

        # Validation criteria
        valid = f1 >= 0.6  # Minimum F1 threshold
        return {
            "valid": valid,
            "f1_score": f1,
            "threshold": 0.6,
            "version": model_meta.get("version"),
        }

    def deploy_model(self, version: str, promote: bool = True) -> Dict:
        """Deploy a model version to production."""
        from app.mlops.registry import registry

        # Validate first
        validation = self.validate_model(version)
        if not validation["valid"]:
            return {
                "status": "failed",
                "reason": "Model validation failed",
                "validation": validation,
            }

        if promote:
            success = registry.promote_to_production(version)
            if success:
                return {
                    "status": "success",
                    "version": version,
                    "message": f"Model {version} promoted to production",
                }
            else:
                return {
                    "status": "failed",
                    "reason": "Failed to promote model",
                }

        return {"status": "success", "version": version}


pipeline = TrainingPipeline()
