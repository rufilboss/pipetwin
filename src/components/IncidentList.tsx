"use client";

import type { Incident, Alert } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface IncidentListProps {
  incidents: Incident[];
  alerts: Alert[];
}

const STATUS_STYLES: Record<Incident["status"], string> = {
  open: "bg-red-500/15 text-red-300",
  investigating: "bg-amber-500/15 text-amber-300",
  contained: "bg-sky-500/15 text-sky-300",
  closed: "bg-slate-600/30 text-slate-400",
};

export function IncidentList({ incidents, alerts }: IncidentListProps) {
  const alertMap = Object.fromEntries(alerts.map((a) => [a.id, a]));

  return (
    <div className="space-y-2">
      {incidents.map((inc) => {
        const alert = alertMap[inc.alertId];
        return (
          <div
            key={inc.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[inc.status]}`}
              >
                {inc.status}
              </span>
              <span className="text-xs text-slate-500">{inc.type}</span>
              <span className="text-xs text-slate-600">{formatTime(inc.createdAt)}</span>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-white">
              {alert?.title ?? inc.alertId}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Assigned: <span className="text-slate-300">{inc.assignedTo}</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{inc.notes}</p>
          </div>
        );
      })}
    </div>
  );
}
