export interface Metrics {
  mae: number;
  baseline_std: number;
  train_rows: number;
  test_rows: number;
  feature_count: number;
  avg_shipping_days: number;
}

export interface Options {
  shipping_modes: string[];
  customer_segments: string[];
  departments: string[];
  order_regions: string[];
  order_countries: string[];
}

export interface PredictRequest {
  shipping_mode: string;
  customer_segment: string;
  department_name: string;
  order_region: string;
  order_country: string;
  latitude: number;
  longitude: number;
}

export interface PredictResponse {
  estimated_days: number;
  speed_label: string;
  inputs: PredictRequest;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ScatterPoint {
  actual: number;
  predicted: number;
}

export interface Analytics {
  feature_importance: FeatureImportance[];
  scatter_sample: ScatterPoint[];
  mae: number;
}

export type Tab = "dashboard" | "predict" | "analytics";
