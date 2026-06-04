"use client";

import type { AuditLogEntry } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface AuditLogPanelProps {
  logs: AuditLogEntry[];
}

export function AuditLogPanel({ logs }: AuditLogPanelProps) {
  if (logs.length === 0) {
    return (
      <p className="text-center text-sm text-slate-500 py-6">No audit entries yet</p>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900/60">
      <table className="w-full text-left text-xs">
        <thead className="sticky top-0 bg-slate-900 text-slate-500">
          <tr>
            <th className="px-3 py-2 font-medium">Time</th>
            <th className="px-3 py-2 font-medium">Action</th>
            <th className="hidden px-3 py-2 font-medium sm:table-cell">Actor</th>
            <th className="px-3 py-2 font-medium">Summary</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t border-slate-800/80">
              <td className="whitespace-nowrap px-3 py-2 text-slate-500">
                {formatTime(log.timestamp)}
              </td>
              <td className="px-3 py-2 capitalize text-emerald-400/90">{log.action}</td>
              <td className="hidden px-3 py-2 text-slate-400 sm:table-cell">
                {log.actorName}
              </td>
              <td className="px-3 py-2 text-slate-300">{log.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
