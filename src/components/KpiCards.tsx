"use client";

import {
  Activity,
  AlertTriangle,
  Gauge,
  ShieldAlert,
  Zap,
  Waves,
} from "lucide-react";
import type { TelemetrySnapshot } from "@/lib/types";

interface KpiCardsProps {
  kpis: TelemetrySnapshot["kpis"];
}

export function KpiCards({ kpis }: KpiCardsProps) {
  const cards = [
    {
      label: "Throughput",
      value: `${(kpis.throughputBpd / 1000).toFixed(1)}k`,
      unit: "BPD",
      icon: Activity,
      tone: "text-emerald-400",
    },
    {
      label: "Avg pressure",
      value: kpis.pressureAvgBar.toString(),
      unit: "bar",
      icon: Gauge,
      tone: "text-sky-400",
    },
    {
      label: "Active alerts",
      value: kpis.activeAlerts.toString(),
      unit: `${kpis.criticalAlerts} critical`,
      icon: AlertTriangle,
      tone: kpis.criticalAlerts > 0 ? "text-red-400" : "text-amber-400",
    },
    {
      label: "Leak risk",
      value: `${kpis.leakRiskScore}`,
      unit: "/ 100",
      icon: Waves,
      tone: kpis.leakRiskScore > 60 ? "text-red-400" : "text-amber-400",
    },
    {
      label: "Vandalism (24h)",
      value: kpis.vandalismEvents24h.toString(),
      unit: "events",
      icon: ShieldAlert,
      tone: "text-orange-400",
    },
    {
      label: "Power online",
      value: `${kpis.powerStationsOnline}/${kpis.powerStationsTotal}`,
      unit: "stations",
      icon: Zap,
      tone:
        kpis.powerStationsOnline < kpis.powerStationsTotal
          ? "text-amber-400"
          : "text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur"
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              {c.label}
            </span>
            <c.icon className={`h-4 w-4 ${c.tone}`} />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-white">
            {c.value}
            <span className="ml-1 text-xs font-normal text-slate-500">{c.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
