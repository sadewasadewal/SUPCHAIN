from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATASET_PATH = ROOT / "Datasets" / "DataCoSupplyChainDataset.csv"
ARTIFACTS_DIR = Path(__file__).resolve().parents[1] / "artifacts"

FEATURES = [
    "Shipping Mode",
    "Customer Segment",
    "Department Name",
    "Latitude",
    "Longitude",
    "Order Region",
    "Order Country",
]
TARGET = "Days for shipping (real)"
