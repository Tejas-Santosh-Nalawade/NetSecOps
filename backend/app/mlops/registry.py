"""
MLOps Model Registry - Versioning and Model Management
"""
import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List
import joblib

REGISTRY_DIR = Path(__file__).resolve().parent.parent.parent / "ml_registry"
REGISTRY_DIR.mkdir(exist_ok=True)
METADATA_FILE = REGISTRY_DIR / "registry.json"


class ModelRegistry:
    """Simple model registry for versioning and tracking models."""

    def __init__(self):
        self.registry_file = METADATA_FILE
        self.registry_dir = REGISTRY_DIR
        self._ensure_registry()

    def _ensure_registry(self):
        if not self.registry_file.exists():
            self._save_registry({"models": [], "current_version": None})

    def _load_registry(self) -> Dict:
        if not self.registry_file.exists():
            return {"models": [], "current_version": None}
        with open(self.registry_file, "r") as f:
            return json.load(f)

    def _save_registry(self, data: Dict):
        with open(self.registry_file, "w") as f:
            json.dump(data, f, indent=2)

    def register_model(
        self,
        model_path: Path,
        scaler_path: Path,
        metadata: Dict,
        version: Optional[str] = None,
    ) -> str:
        """Register a new model version."""
        registry = self._load_registry()
        if version is None:
            version = f"v{len(registry['models']) + 1}.0.0"

        model_id = f"model_{version.replace('.', '_')}"
        version_dir = self.registry_dir / model_id
        version_dir.mkdir(exist_ok=True)

        # Copy model files
        shutil.copy(model_path, version_dir / "model.joblib")
        if scaler_path.exists():
            shutil.copy(scaler_path, version_dir / "scaler.joblib")

        # Save metadata
        model_meta = {
            "version": version,
            "model_id": model_id,
            "timestamp": datetime.now().isoformat(),
            "metrics": metadata,
            "algorithm": metadata.get("best_algorithm", "Unknown"),
            "path": str(version_dir),
        }
        with open(version_dir / "metadata.json", "w") as f:
            json.dump(model_meta, f, indent=2)

        registry["models"].append(model_meta)
        registry["current_version"] = version
        registry["latest"] = model_meta
        self._save_registry(registry)

        return version

    def get_current_version(self) -> Optional[Dict]:
        """Get current production model."""
        registry = self._load_registry()
        return registry.get("latest")

    def list_versions(self) -> List[Dict]:
        """List all model versions."""
        registry = self._load_registry()
        return registry.get("models", [])

    def load_model_version(self, version: Optional[str] = None):
        """Load a specific model version (default: latest)."""
        registry = self._load_registry()
        if version is None:
            model_meta = registry.get("latest")
        else:
            model_meta = next(
                (m for m in registry["models"] if m["version"] == version), None
            )

        if model_meta is None:
            return None, None

        model_path = Path(model_meta["path"]) / "model.joblib"
        scaler_path = Path(model_meta["path"]) / "scaler.joblib"

        model = joblib.load(model_path) if model_path.exists() else None
        scaler = joblib.load(scaler_path) if scaler_path.exists() else None

        return model, scaler

    def promote_to_production(self, version: str) -> bool:
        """Promote a model version to production."""
        registry = self._load_registry()
        model_meta = next(
            (m for m in registry["models"] if m["version"] == version), None
        )
        if model_meta is None:
            return False

        registry["current_version"] = version
        registry["latest"] = model_meta
        self._save_registry(registry)
        return True


# Global registry instance
registry = ModelRegistry()
