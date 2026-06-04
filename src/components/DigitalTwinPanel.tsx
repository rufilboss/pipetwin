"use client";

import type { PipelineSegment, Sensor, Alert } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DigitalTwinPanelProps {
  segment: PipelineSegment | undefined;
  sensors: Sensor[];
  alerts: Alert[];
}

export function DigitalTwinPanel({ segment, sensors, alerts }: DigitalTwinPanelProps) {
  if (!segment) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 text-sm text-slate-500">
        Select a pipeline segment on the map to view its digital twin
      </div>
    );
  }

  const segSensors = sensors.filter((s) => s.segmentId === segment.id);
  const segAlerts = alerts.filter((a) => a.segmentId === segment.id && !a.resolved);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-sm font-semibold text-white">{segment.name}</h2>
      <p className="text-xs text-slate-500">
        {segment.assetCode} · km {segment.kmStart}–{segment.kmEnd} · Ø{segment.diameterMm} mm
      </p>
      <p className="text-[10px] text-slate-600">
        {segment.from} → {segment.to} ({segment.lengthKm} km)
      </p>

      {/* Schematic twin */}
      <div className="relative mt-4 h-32 overflow-hidden rounded-lg bg-slate-950 ring-1 ring-slate-800">
        <svg viewBox="0 0 400 120" className="h-full w-full">
          <defs>
            <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#065f46" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
          </defs>
          <rect x="20" y="52" width="360" height="16" rx="8" fill="url(#pipeGrad)" opacity="0.9" />
          {[80, 160, 240, 320].map((x, i) => (
            <g key={x}>
              <rect x={x - 6} y="44" width="12" height="32" rx="2" fill="#1e293b" stroke="#475569" />
              <circle cx={x} cy="60" r="4" fill={segSensors[i]?.status === "operational" ? "#10b981" : "#f59e0b"} />
            </g>
          ))}
          {segAlerts.length > 0 && (
            <circle cx="200" cy="60" r="18" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.8">
              <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>
        <div className="absolute bottom-2 left-3 text-[10px] text-slate-500">SCADA twin · live</div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {segSensors.map((s) => (
          <div
            key={s.id}
            className={cn(
              "rounded-lg border p-2 text-xs",
              s.status === "operational"
                ? "border-slate-800 bg-slate-800/40"
                : "border-amber-500/30 bg-amber-500/5"
            )}
          >
            <p className="text-slate-500">{s.label}</p>
            <p className="font-mono text-sm font-semibold text-white">
              {s.value} <span className="text-slate-500">{s.unit}</span>
            </p>
            <p className="text-[10px] text-slate-600">
              baseline {s.baseline} · warn {s.threshold.warn}
            </p>
          </div>
        ))}
      </div>

      {segAlerts.length > 0 && (
        <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/5 p-2">
          <p className="text-[10px] font-bold uppercase text-red-400">
            {segAlerts.length} active event(s) on segment
          </p>
        </div>
      )}
    </div>
  );
}
