"use client";

import { ArrowRight, Droplet } from "lucide-react";
import type { OilBatch, PipelineSegment } from "@/lib/types";

interface OilTrackingProps {
  batches: OilBatch[];
  segments: PipelineSegment[];
}

export function OilTracking({ batches, segments }: OilTrackingProps) {
  const segMap = Object.fromEntries(segments.map((s) => [s.id, s.name]));

  return (
    <div className="space-y-3">
      {batches.map((b) => (
        <div
          key={b.id}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-amber-500/80" />
              <div>
                <h3 className="text-sm font-semibold text-white">{b.label}</h3>
                <p className="text-xs text-slate-500">{b.id}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                b.status === "in_transit"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {b.status.replace("_", " ")}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span>{b.origin}</span>
            <ArrowRight className="h-3 w-3" />
            <span>{b.destination}</span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-slate-800/50 p-2">
              <p className="text-slate-500">Volume</p>
              <p className="font-semibold text-white tabular-nums">
                {(b.volumeBbl / 1000).toFixed(1)}k bbl
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-2">
              <p className="text-slate-500">API / Sulfur</p>
              <p className="font-semibold text-white tabular-nums">
                {b.apiGravity}° / {b.sulfurPct}%
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-2">
              <p className="text-slate-500">ETA</p>
              <p className="font-semibold text-white tabular-nums">
                {b.etaHours.toFixed(1)} h
              </p>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>{segMap[b.currentSegmentId] ?? b.currentSegmentId}</span>
              <span>{b.progressPct}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                style={{ width: `${b.progressPct}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
