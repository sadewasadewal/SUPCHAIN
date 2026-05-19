import { MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { api } from "../api";
import type { Options, PredictRequest, PredictResponse } from "../types";

interface PredictorProps {
  options: Options | null;
  loading: boolean;
}

const DEFAULTS: PredictRequest = {
  shipping_mode: "Standard Class",
  customer_segment: "Consumer",
  department_name: "Fitness",
  order_region: "Caribbean",
  order_country: "Puerto Rico",
  latitude: 18.25,
  longitude: -66.04,
};

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-300">{label}</span>
      <select
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Predictor({ options, loading }: PredictorProps) {
  const [form, setForm] = useState<PredictRequest>(DEFAULTS);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof PredictRequest>(key: K, value: PredictRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  };

  const handlePredict = async () => {
    setPredicting(true);
    setError(null);
    try {
      const res = await api.predict(form);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prediction failed");
    } finally {
      setPredicting(false);
    }
  };

  if (loading || !options) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="card space-y-5 p-6 lg:col-span-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-white">
            Delivery time predictor
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Configure a shipment — same inputs as your Colab widget
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Shipping mode"
            value={form.shipping_mode}
            onChange={(v) => update("shipping_mode", v)}
            options={options.shipping_modes}
          />
          <SelectField
            label="Customer segment"
            value={form.customer_segment}
            onChange={(v) => update("customer_segment", v)}
            options={options.customer_segments}
          />
          <SelectField
            label="Department"
            value={form.department_name}
            onChange={(v) => update("department_name", v)}
            options={options.departments}
          />
          <SelectField
            label="Order region"
            value={form.order_region}
            onChange={(v) => update("order_region", v)}
            options={options.order_regions}
          />
          <SelectField
            label="Order country"
            value={form.order_country}
            onChange={(v) => update("order_country", v)}
            options={options.order_countries}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-300">
              <MapPin className="h-3.5 w-3.5" /> Latitude
            </span>
            <input
              type="number"
              step="0.01"
              className="input-field"
              value={form.latitude}
              onChange={(e) => update("latitude", parseFloat(e.target.value) || 0)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-300">
              <MapPin className="h-3.5 w-3.5" /> Longitude
            </span>
            <input
              type="number"
              step="0.01"
              className="input-field"
              value={form.longitude}
              onChange={(e) => update("longitude", parseFloat(e.target.value) || 0)}
            />
          </label>
        </div>

        <button
          type="button"
          className="btn-primary w-full sm:w-auto"
          onClick={handlePredict}
          disabled={predicting}
        >
          <Sparkles className="h-4 w-4" />
          {predicting ? "Predicting…" : "Predict delivery time"}
        </button>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>

      <div className="card flex flex-col justify-center p-6 lg:col-span-2">
        {result ? (
          <div className="text-center">
            <p className="text-sm uppercase tracking-wider text-slate-400">
              Estimated delivery
            </p>
            <p className="mt-2 font-display text-6xl font-bold text-brand-300">
              {result.estimated_days}
              <span className="ml-2 text-2xl font-medium text-slate-400">days</span>
            </p>
            <p className="mt-4 inline-flex rounded-full bg-brand-500/20 px-4 py-1.5 text-sm font-medium text-brand-200">
              {result.speed_label}
            </p>
            <div className="mt-8 space-y-2 text-left text-sm text-slate-400">
              <p>
                <span className="text-slate-500">Mode:</span> {result.inputs.shipping_mode}
              </p>
              <p>
                <span className="text-slate-500">Destination:</span>{" "}
                {result.inputs.order_country} ({result.inputs.order_region})
              </p>
              <p>
                <span className="text-slate-500">Segment:</span>{" "}
                {result.inputs.customer_segment}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500">
            <PackageIcon />
            <p className="mt-4 text-sm">Run a prediction to see estimated shipping days</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PackageIcon() {
  return (
    <svg
      className="mx-auto h-16 w-16 text-slate-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
}


