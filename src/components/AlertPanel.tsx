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
    <div
      className={cn(
        "space-y-2",
        compact && "max-h-none overflow-visible sm:max-h-80 sm:overflow-y-auto"
      )}
    >
      {active.map((alert) => (
        <article
          key={alert.id}
          className={cn(
            "rounded-lg border p-3 sm:p-3",
            severityColor(alert.severity),
            alert.acknowledged && "opacity-75"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
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
              <h3 className="mt-1 text-sm font-semibold leading-snug text-white">
                {alert.title}
              </h3>
              <p
                className={cn(
                  "mt-1 text-xs leading-relaxed text-slate-400",
                  compact && "line-clamp-2 sm:line-clamp-none"
                )}
              >
                {alert.message}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              {!alert.acknowledged && (
                <button
                  type="button"
                  title="Acknowledge"
                  onClick={() => onAcknowledge(alert.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10 active:bg-white/20 touch-manipulation sm:h-8 sm:w-8"
                >
                  <Check className="h-5 w-5 sm:h-4 sm:w-4" />
                </button>
              )}
              <button
                type="button"
                title="Resolve"
                onClick={() => onResolve(alert.id)}
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10 active:bg-white/20 touch-manipulation sm:h-8 sm:w-8"
              >
                <X className="h-5 w-5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
