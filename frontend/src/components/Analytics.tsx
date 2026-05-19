import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import type { Analytics as AnalyticsData } from "../types";

interface AnalyticsProps {
  data: AnalyticsData | null;
  loading: boolean;
}

function shortFeature(name: string) {
  return name.length > 28 ? `${name.slice(0, 26)}…` : name;
}

export function Analytics({ data, loading }: AnalyticsProps) {
  if (loading || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
      </div>
    );
  }

  const chartData = data.feature_importance.map((f) => ({
    name: shortFeature(f.feature),
    fullName: f.feature,
    importance: Number((f.importance * 100).toFixed(2)),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-white">Model analytics</h2>
        <p className="mt-1 text-slate-400">
          Feature importance and actual vs. predicted (test set sample)
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 font-display text-lg font-semibold text-white">
            Top features affecting shipping speed
          </h3>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} unit="%" />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                stroke="#94a3b8"
                fontSize={11}
              />
              <Tooltip
                contentStyle={{
                  background: "#1c2632",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                }}
                formatter={(value: number) => [`${value}%`, "Importance"]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? ""
                }
              />
              <Bar dataKey="importance" fill="#359489" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 font-display text-lg font-semibold text-white">
            Actual vs. predicted (MAE: {data.mae.toFixed(2)} days)
          </h3>
          <ResponsiveContainer width="100%" height={360}>
            <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                type="number"
                dataKey="actual"
                name="Actual"
                stroke="#94a3b8"
                fontSize={12}
                label={{ value: "Actual days", position: "bottom", fill: "#64748b" }}
              />
              <YAxis
                type="number"
                dataKey="predicted"
                name="Predicted"
                stroke="#94a3b8"
                fontSize={12}
                label={{
                  value: "Predicted days",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#64748b",
                }}
              />
              <ZAxis range={[40, 40]} />
              <Tooltip
                contentStyle={{
                  background: "#1c2632",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                }}
              />
              <Scatter data={data.scatter_sample} fill="#a78bfa" fillOpacity={0.5} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

