"use client";

import { Check, X } from "lucide-react";
import type { Alert } from "@/lib/types";
import { categoryLabel, cn, formatTime, severityColor } from "@/lib/utils";

interface AlertPanelProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  compact?: boolean;
}

export function AlertPanel({
  alerts,
  onAcknowledge,
  onResolve,
  compact = false,
}: AlertPanelProps) {
  const active = alerts.filter((a) => !a.resolved);

  if (active.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-sm text-slate-500">
        No active alerts
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", compact && "max-h-80 overflow-y-auto")}>
      {active.map((alert) => (
        <article
          key={alert.id}
          className={cn(
            "rounded-lg border p-3",
            severityColor(alert.severity),
            alert.acknowledged && "opacity-75"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {alert.severity}
                </span>
                <span className="text-[10px] text-slate-400">
                  {categoryLabel(alert.category)}
                </span>
                <span className="text-[10px] text-slate-500">
                  {formatTime(alert.createdAt)}
                </span>
              </div>
              <h3 className="mt-1 text-sm font-semibold text-white">{alert.title}</h3>
              {!compact && (
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {alert.message}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-1">
              {!alert.acknowledged && (
                <button
                  type="button"
                  title="Acknowledge"
                  onClick={() => onAcknowledge(alert.id)}
                  className="rounded p-1 hover:bg-white/10"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                title="Resolve"
                onClick={() => onResolve(alert.id)}
                className="rounded p-1 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
