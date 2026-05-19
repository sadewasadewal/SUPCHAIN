import type { Analytics, Metrics, Options, PredictRequest, PredictResponse } from "./types";

const BASE = "/api";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  metrics: () => fetchJson<Metrics>("/metrics"),
  options: () => fetchJson<Options>("/options"),
  analytics: () => fetchJson<Analytics>("/analytics"),
  predict: (body: PredictRequest) =>
    fetchJson<PredictResponse>("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};
