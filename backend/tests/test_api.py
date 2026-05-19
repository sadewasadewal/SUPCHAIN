"""API smoke tests — run: cd backend && PYTHONPATH=. python -m pytest tests/ -q"""
import json
from pathlib import Path

import joblib
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.config import ARTIFACTS_DIR, DATASET_PATH

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def ensure_artifacts():
    if not (ARTIFACTS_DIR / "model.joblib").exists():
        from app.ml.train import train_and_save

        train_and_save()


def test_dataset_exists():
    assert DATASET_PATH.exists(), f"Dataset missing: {DATASET_PATH}"


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_metrics():
    r = client.get("/api/metrics")
    assert r.status_code == 200
    data = r.json()
    assert "mae" in data
    assert data["mae"] < 2.0
    assert data["train_rows"] > 1000


def test_options():
    r = client.get("/api/options")
    assert r.status_code == 200
    opts = r.json()
    assert len(opts["shipping_modes"]) >= 1
    assert "Standard Class" in opts["shipping_modes"]


def test_analytics():
    r = client.get("/api/analytics")
    assert r.status_code == 200
    data = r.json()
    assert len(data["feature_importance"]) > 0
    assert len(data["scatter_sample"]) > 0


def test_predict():
    body = {
        "shipping_mode": "Standard Class",
        "customer_segment": "Consumer",
        "department_name": "Fitness",
        "order_region": "Caribbean",
        "order_country": "Puerto Rico",
        "latitude": 18.25,
        "longitude": -66.04,
    }
    r = client.post("/api/predict", json=body)
    assert r.status_code == 200
    out = r.json()
    assert 0 < out["estimated_days"] < 30
    assert out["speed_label"] in ("Express / Fast", "Typical", "Slow / Standard")


def test_model_artifact_loadable():
    model = joblib.load(ARTIFACTS_DIR / "model.joblib")
    with open(ARTIFACTS_DIR / "feature_columns.json", encoding="utf-8") as f:
        cols = json.load(f)
    assert len(cols) > 0
    assert hasattr(model, "predict")
