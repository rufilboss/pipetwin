import { clsx, type ClassValue } from "clsx";
import type { AlertSeverity, AlertCategory, AlertSource, IntegrationFeed } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function severityColor(severity: AlertSeverity): string {
  const map: Record<AlertSeverity, string> = {
    critical: "text-red-400 bg-red-500/15 border-red-500/40",
    high: "text-orange-400 bg-orange-500/15 border-orange-500/40",
    medium: "text-amber-400 bg-amber-500/15 border-amber-500/40",
    low: "text-sky-400 bg-sky-500/15 border-sky-500/40",
    info: "text-slate-400 bg-slate-500/15 border-slate-500/40",
  };
  return map[severity];
}

export function categoryLabel(cat: AlertCategory): string {
  const map: Record<AlertCategory, string> = {
    leak: "Leak",
    vandalism: "Vandalism",
    power: "Power",
    pressure: "Pressure",
    flow: "Flow",
    theft: "Oil theft",
    maintenance: "Maintenance",
    security: "Security",
  };
  return map[cat];
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function sourceLabel(source: AlertSource): string {
  const map: Record<AlertSource, string> = {
    scada: "SCADA",
    das: "DAS / acoustic",
    cctv: "CCTV",
    ctma: "CTMA",
    satellite: "Satellite",
    field: "Field report",
    manual: "Manual",
  };
  return map[source];
}

export function integrationStatusColor(status: IntegrationFeed["status"]): string {
  const map: Record<IntegrationFeed["status"], string> = {
    connected: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    degraded: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    disconnected: "text-red-400 bg-red-500/15 border-red-500/30",
    pilot: "text-sky-400 bg-sky-500/15 border-sky-500/30",
  };
  return map[status];
}
