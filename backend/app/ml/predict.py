import json
from pathlib import Path

import joblib
import pandas as pd

from app.config import ARTIFACTS_DIR


class ModelService:
    def __init__(self, artifacts_dir: Path | None = None):
        self.artifacts_dir = artifacts_dir or ARTIFACTS_DIR
        self._model = None
        self._columns: list[str] | None = None
        self._metadata: dict | None = None

    def load(self) -> None:
        model_path = self.artifacts_dir / "model.joblib"
        columns_path = self.artifacts_dir / "feature_columns.json"
        metadata_path = self.artifacts_dir / "metadata.json"

        if not model_path.exists():
            from app.ml.train import train_and_save

            train_and_save(self.artifacts_dir)

        self._model = joblib.load(model_path)
        with open(columns_path, encoding="utf-8") as f:
            self._columns = json.load(f)
        with open(metadata_path, encoding="utf-8") as f:
            self._metadata = json.load(f)

    @property
    def metadata(self) -> dict:
        if self._metadata is None:
            self.load()
        return self._metadata  # type: ignore[return-value]

    def predict(self, payload: dict) -> dict:
        if self._model is None or self._columns is None:
            self.load()

        row = pd.DataFrame(0.0, index=[0], columns=self._columns)

        if "Latitude" in row.columns:
            row.at[0, "Latitude"] = float(payload["latitude"])
        if "Longitude" in row.columns:
            row.at[0, "Longitude"] = float(payload["longitude"])

        mappings = [
            ("shipping_mode", "Shipping Mode"),
            ("customer_segment", "Customer Segment"),
            ("department_name", "Department Name"),
            ("order_region", "Order Region"),
            ("order_country", "Order Country"),
        ]
        for key, prefix in mappings:
            col = f"{prefix}_{payload[key]}"
            if col in row.columns:
                row.at[0, col] = 1

        days = float(self._model.predict(row)[0])  # type: ignore[union-attr]

        if days < 2:
            speed = "Express / Fast"
        elif days > 5:
            speed = "Slow / Standard"
        else:
            speed = "Typical"

        return {
            "estimated_days": round(days, 2),
            "speed_label": speed,
            "inputs": payload,
        }
