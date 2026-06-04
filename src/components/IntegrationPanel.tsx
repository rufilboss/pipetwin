"use client";

import type { IntegrationFeed } from "@/lib/types";
import { formatTime, integrationStatusColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface IntegrationPanelProps {
  feeds: IntegrationFeed[];
}

export function IntegrationPanel({ feeds }: IntegrationPanelProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4">
      <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Enterprise data feeds
      </h3>
      <p className="mt-1 text-[10px] text-slate-600">
        Aligns with NNPC PMCC, SCADA, CTMA & CCTV — pilot adapters
      </p>
      <ul className="mt-3 space-y-2">
        {feeds.map((f) => (
          <li
            key={f.id}
            className="flex flex-col gap-1 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{f.name}</p>
              <p className="truncate text-[10px] text-slate-500">{f.description}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase",
                  integrationStatusColor(f.status)
                )}
              >
                {f.status}
              </span>
              <span className="text-[10px] text-slate-600">
                {formatTime(f.lastSync)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
