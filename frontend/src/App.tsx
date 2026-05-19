import { useEffect, useState } from "react";
import { api } from "./api";
import { Analytics } from "./components/Analytics";
import { Dashboard } from "./components/Dashboard";
import { Layout } from "./components/Layout";
import { Predictor } from "./components/Predictor";
import type { Analytics as AnalyticsData, Metrics, Options, Tab } from "./types";

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [options, setOptions] = useState<Options | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bootError, setBootError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [m, o, a] = await Promise.all([
          api.metrics(),
          api.options(),
          api.analytics(),
        ]);
        if (!cancelled) {
          setMetrics(m);
          setOptions(o);
          setAnalytics(a);
        }
      } catch (e) {
        if (!cancelled) {
          setBootError(
            e instanceof Error
              ? e.message
              : "Could not reach the API. Start the backend on port 8000."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (bootError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-900 p-6">
        <div className="card max-w-md p-8 text-center">
          <p className="text-lg font-semibold text-white">Backend not ready</p>
          <p className="mt-2 text-sm text-slate-400">{bootError}</p>
          <p className="mt-4 text-xs text-slate-500">
            Run: <code className="text-brand-300">cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout tab={tab} onTabChange={setTab}>
      {tab === "dashboard" && <Dashboard metrics={metrics} loading={loading} />}
      {tab === "predict" && <Predictor options={options} loading={loading} />}
      {tab === "analytics" && <Analytics data={analytics} loading={loading} />}
    </Layout>
  );
}

