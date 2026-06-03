"use client";

import {
  LayoutDashboard,
  Map,
  Bell,
  Droplets,
  Box,
  Zap,
  BarChart3,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardView } from "@/lib/types";

const NAV: { id: DashboardView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "map", label: "Pipeline map", icon: Map },
  { id: "alerts", label: "Alerts & incidents", icon: Bell },
  { id: "oil-tracking", label: "Oil tracking", icon: Droplets },
  { id: "digital-twin", label: "Digital twin", icon: Box },
  { id: "power", label: "Power grid", icon: Zap },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

interface SidebarProps {
  view: DashboardView;
  onViewChange: (v: DashboardView) => void;
  connected: boolean;
  criticalCount: number;
}

export function Sidebar({ view, onViewChange, connected, criticalCount }: SidebarProps) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-slate-800 bg-slate-950/90">
      <div className="border-b border-slate-800 px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/20 ring-1 ring-emerald-500/40">
            <Radio className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-white">PipeTwin</h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Digital twin SCADA
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              connected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
            )}
          />
          <span className="text-slate-400">
            {connected ? "Live telemetry" : "Reconnecting…"}
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 p-2">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onViewChange(id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
              view === id
                ? "bg-emerald-600/15 text-emerald-300 ring-1 ring-emerald-500/30"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {id === "alerts" && criticalCount > 0 && (
              <span className="rounded-full bg-red-500/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {criticalCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4 text-[10px] text-slate-600">
        EW-K pipeline corridor · demo simulation
      </div>
    </aside>
  );
}
