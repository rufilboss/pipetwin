"use client";

import { Clock, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { viewTitle } from "@/lib/navigation";
import type { DashboardView } from "@/lib/types";

interface DashboardHeaderProps {
  view: DashboardView;
  segmentCount: number;
  connected: boolean;
  error: string | null;
  timestamp: string;
}

export function DashboardHeader({
  view,
  segmentCount,
  connected,
  error,
  timestamp,
}: DashboardHeaderProps) {
  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 shrink-0 border-b border-slate-800 bg-slate-950/95 px-3 py-2.5 backdrop-blur-lg lg:hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600/20 ring-1 ring-emerald-500/40">
              <Radio className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold text-white">PipeTwin</h1>
              <p className="truncate text-[10px] text-slate-500">{viewTitle(view)}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-0.5 text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  connected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                )}
              />
              {connected ? "Live" : "Offline"}
            </span>
            <span className="flex items-center gap-0.5 tabular-nums">
              <Clock className="h-2.5 w-2.5" />
              {new Date(timestamp).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        {error && (
          <p className="mt-1.5 truncate text-[10px] text-amber-500">{error}</p>
        )}
      </header>

      {/* Desktop header */}
      <header className="hidden shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 py-3 backdrop-blur lg:flex">
        <div>
          <h2 className="text-lg font-semibold text-white">{viewTitle(view)}</h2>
          <p className="text-xs text-slate-500">
            Escravos–Warri–Kaduna trunk · {segmentCount} segments monitored
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {error && <span className="text-amber-500">{error}</span>}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(timestamp).toLocaleTimeString()}
          </span>
        </div>
      </header>
    </>
  );
}
