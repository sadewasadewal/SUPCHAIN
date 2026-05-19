import { BarChart3, LayoutDashboard, Package, Truck } from "lucide-react";
import type { ReactNode } from "react";
import type { Tab } from "../types";

const NAV: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "predict", label: "Predictor", icon: Package },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

interface LayoutProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  children: ReactNode;
}

export function Layout({ tab, onTabChange, children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-surface-900/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold tracking-tight text-white">
                SUPCHAIN
              </h1>
              <p className="text-xs text-slate-400">Supply Chain Intelligence</p>
            </div>
          </div>
          <nav className="flex gap-1 rounded-xl bg-surface-800 p-1">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  tab === id
                    ? "bg-brand-500 text-white shadow-md"
                    : "text-slate-400 hover:bg-surface-700 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}

