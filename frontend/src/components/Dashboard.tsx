import { Activity, Brain, Clock, Target } from "lucide-react";
import type { Metrics } from "../types";

interface DashboardProps {
  metrics: Metrics | null;
  loading: boolean;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: typeof Activity;
  accent: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-white">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <div className={`rounded-xl p-3 ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function Dashboard({ metrics, loading }: DashboardProps) {
  if (loading || !metrics) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
      </div>
    );
  }

  const beatsBaseline = metrics.mae < metrics.baseline_std;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-white">Overview</h2>
        <p className="mt-1 text-slate-400">
          Random Forest model trained on DataCo supply chain orders
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Model error (MAE)"
          value={`${metrics.mae.toFixed(2)} days`}
          sub={`Baseline std: ${metrics.baseline_std.toFixed(2)} days`}
          icon={Target}
          accent="bg-emerald-500/15 text-emerald-300"
        />
        <StatCard
          label="Avg shipping time"
          value={`${metrics.avg_shipping_days.toFixed(1)} days`}
          sub="Across training dataset"
          icon={Clock}
          accent="bg-sky-500/15 text-sky-300"
        />
        <StatCard
          label="Training samples"
          value={metrics.train_rows.toLocaleString()}
          sub={`${metrics.test_rows.toLocaleString()} held out for test`}
          icon={Brain}
          accent="bg-violet-500/15 text-violet-300"
        />
        <StatCard
          label="Encoded features"
          value={String(metrics.feature_count)}
          sub="After one-hot encoding"
          icon={Activity}
          accent="bg-amber-500/15 text-amber-300"
        />
      </div>

      <div className="card p-6">
        <h3 className="font-display text-lg font-semibold text-white">Model status</h3>
        <p className="mt-3 text-slate-300 leading-relaxed">
          {beatsBaseline ? (
            <>
              The model predicts shipping duration with{" "}
              <span className="text-brand-300 font-medium">
                {metrics.mae.toFixed(2)} days
              </span>{" "}
              average error — better than the dataset&apos;s natural variation (
              {metrics.baseline_std.toFixed(2)} days std dev).
            </>
          ) : (
            <>
              Current MAE is{" "}
              <span className="text-brand-300 font-medium">
                {metrics.mae.toFixed(2)} days
              </span>
              . Consider adding features or tuning hyperparameters to improve
              further.
            </>
          )}
        </p>
        <p className="mt-4 text-sm text-slate-500">
          Features: shipping mode, customer segment, department, coordinates, region,
          and country — matching your Colab notebook (scheduled days excluded for a
          fair prediction challenge).
        </p>
      </div>
    </div>
  );
}


