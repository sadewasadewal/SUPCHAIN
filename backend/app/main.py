from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.ml.predict import ModelService

model_service = ModelService()


@asynccontextmanager
async def lifespan(_: FastAPI):
    model_service.load()
    yield


app = FastAPI(
    title="SUPCHAIN API",
    description="Supply chain shipping time prediction",
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


class PredictRequest(BaseModel):
    shipping_mode: str
    customer_segment: str
    department_name: str
    order_region: str
    order_country: str
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/metrics")
def metrics():
    meta = model_service.metadata
    return {
        "mae": meta["mae"],
        "baseline_std": meta["baseline_std"],
        "train_rows": meta["train_rows"],
        "test_rows": meta["test_rows"],
        "feature_count": meta["feature_count"],
        "avg_shipping_days": meta["avg_shipping_days"],
    }


@app.get("/api/options")
def options():
    return model_service.metadata["options"]


@app.get("/api/analytics")
def analytics():
    meta = model_service.metadata
    return {
        "feature_importance": meta["feature_importance"],
        "scatter_sample": meta["scatter_sample"],
        "mae": meta["mae"],
    }


@app.post("/api/predict")
def predict(body: PredictRequest):
    result = model_service.predict(body.model_dump())
    return result
