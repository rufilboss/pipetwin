"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Sensor } from "@/lib/types";

interface SensorChartsProps {
  sensors: Sensor[];
}

export function SensorCharts({ sensors }: SensorChartsProps) {
  const pressure = sensors.filter((s) => s.type === "pressure");
  const flow = sensors.filter((s) => s.type === "flow");

  const chartData = pressure.map((p, i) => ({
    name: p.label.split(" ").slice(-1)[0] ?? `T${i}`,
    pressure: p.value,
    flow: flow[i]?.value ?? 0,
  }));

  return (
    <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-2">
      <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Pressure & flow (live)
        </h3>
        <div className="chart-container mt-3 h-44 w-full min-w-0 sm:h-48">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="pFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="pressure"
                stroke="#10b981"
                fill="url(#pFill)"
                name="Pressure (bar)"
              />
              <Area
                type="monotone"
                dataKey="flow"
                stroke="#38bdf8"
                fill="none"
                name="Flow"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Integrity sensors
        </h3>
        <ul className="mt-3 space-y-2">
          {sensors
            .filter((s) =>
              ["acoustic", "ground_penetration", "fence", "vibration"].includes(s.type)
            )
            .map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-lg bg-slate-800/40 px-3 py-2 text-xs"
              >
                <span className="min-w-0 flex-1 pr-2 text-slate-400">{s.label}</span>
                <span
                  className={
                    s.status === "operational"
                      ? "font-mono text-emerald-400"
                      : "font-mono text-amber-400"
                  }
                >
                  {s.value} {s.unit}
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
