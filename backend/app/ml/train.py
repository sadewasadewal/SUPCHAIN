import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split

from app.config import ARTIFACTS_DIR, DATASET_PATH, FEATURES, TARGET


def load_dataset() -> pd.DataFrame:
    return pd.read_csv(DATASET_PATH, encoding="latin-1")


def prepare_model_frame(df: pd.DataFrame) -> pd.DataFrame:
    cols = FEATURES + [TARGET]
    return df[cols].dropna()


def train_and_save(artifacts_dir: Path | None = None) -> dict:
    artifacts_dir = artifacts_dir or ARTIFACTS_DIR
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    df = load_dataset()
    df_model = prepare_model_frame(df)
    df_encoded = pd.get_dummies(df_model, drop_first=True)

    X = df_encoded.drop(TARGET, axis=1)
    y = df_encoded[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(n_estimators=50, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    mae = float(mean_absolute_error(y_test, predictions))
    baseline = float(y.std())

    importances = model.feature_importances_
    names = list(X.columns)
    top_idx = np.argsort(importances)[-15:]
    feature_importance = [
        {"feature": names[i], "importance": float(importances[i])}
        for i in top_idx
    ]
    feature_importance.sort(key=lambda x: x["importance"])

    sample_size = min(500, len(y_test))
    rng = np.random.default_rng(42)
    idx = rng.choice(len(y_test), size=sample_size, replace=False)
    scatter = [
        {"actual": float(y_test.iloc[i]), "predicted": float(predictions[i])}
        for i in idx
    ]

    options = {
        "shipping_modes": sorted(df_model["Shipping Mode"].unique().tolist()),
        "customer_segments": sorted(df_model["Customer Segment"].unique().tolist()),
        "departments": sorted(df_model["Department Name"].unique().tolist()),
        "order_regions": sorted(df_model["Order Region"].unique().tolist()),
        "order_countries": sorted(df_model["Order Country"].unique().tolist()),
    }

    joblib.dump(model, artifacts_dir / "model.joblib")
    with open(artifacts_dir / "feature_columns.json", "w", encoding="utf-8") as f:
        json.dump(list(X.columns), f)

    metadata = {
        "mae": mae,
        "baseline_std": baseline,
        "train_rows": int(len(X_train)),
        "test_rows": int(len(X_test)),
        "feature_count": int(X.shape[1]),
        "avg_shipping_days": float(df_model[TARGET].mean()),
        "options": options,
        "feature_importance": feature_importance,
        "scatter_sample": scatter,
    }
    with open(artifacts_dir / "metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f)

    return metadata


if __name__ == "__main__":
    result = train_and_save()
    print(f"Model trained. MAE: {result['mae']:.2f} days")
