"use client";

import { Download, Shield, TrendingDown } from "lucide-react";
import type { TelemetrySnapshot } from "@/lib/types";
import { PROGRAMME, ROI_DEFAULTS } from "@/lib/organization";
import { categoryLabel, formatTime } from "@/lib/utils";
import { canExportReport } from "@/lib/roles";
import type { UserRole } from "@/lib/types";

interface ExecutiveSummaryProps {
  data: TelemetrySnapshot;
  role: UserRole;
}

export function ExecutiveSummary({ data, role }: ExecutiveSummaryProps) {
  const active = data.alerts.filter((a) => !a.resolved);
  const critical = active.filter((a) => a.severity === "critical" || a.severity === "high");

  const monthlySavingsUsd =
    ROI_DEFAULTS.incidentsPreventedPerMonth *
    ROI_DEFAULTS.avgBblLostPerIncident *
    ROI_DEFAULTS.oilPriceUsdPerBbl;
  const monthlySavingsNgn = monthlySavingsUsd * ROI_DEFAULTS.ngnPerUsd;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 print:text-black">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white print:text-black">
            Executive briefing
          </h2>
          <p className="text-xs text-slate-500">
            {PROGRAMME.operator} · {formatTime(data.timestamp)}
          </p>
        </div>
        {canExportReport(role) && (
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 print:hidden"
          >
            <Download className="h-3.5 w-3.5" />
            Export / print PDF
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-[10px] uppercase text-slate-500">Critical / high alerts</p>
          <p className="mt-1 text-3xl font-bold text-red-400">{critical.length}</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-[10px] uppercase text-slate-500">Leak risk index</p>
          <p className="mt-1 text-3xl font-bold text-amber-400">{data.kpis.leakRiskScore}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-[10px] uppercase text-slate-500">Throughput</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {(data.kpis.throughputBpd / 1000).toFixed(1)}k BPD
          </p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-[10px] uppercase text-slate-500">Segments operational</p>
          <p className="mt-1 text-3xl font-bold text-emerald-400">
            {data.kpis.segmentsOperational}/{data.kpis.segmentsTotal}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <TrendingDown className="h-4 w-4 text-emerald-400" />
          Pilot ROI estimate (90-day model)
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Assuming {ROI_DEFAULTS.incidentsPreventedPerMonth} prevented incidents/month at{" "}
          {ROI_DEFAULTS.avgBblLostPerIncident} bbl each @ ${ROI_DEFAULTS.oilPriceUsdPerBbl}/bbl:
        </p>
        <p className="mt-2 text-2xl font-bold text-emerald-300">
          ≈ ₦{(monthlySavingsNgn / 1e6).toFixed(1)}M / month
        </p>
        <p className="text-[10px] text-slate-600">
          Illustrative — calibrate with NNPC loss accounts during pilot
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Shield className="h-4 w-4 text-sky-400" />
          Top risks requiring decision
        </div>
        <ul className="mt-3 space-y-2">
          {critical.slice(0, 5).map((a) => (
            <li key={a.id} className="text-xs text-slate-300">
              <span className="font-medium text-white">{a.title}</span>
              {a.kmPost != null && (
                <span className="text-slate-500"> · km {a.kmPost}</span>
              )}
              <span className="text-slate-600"> · {categoryLabel(a.category)}</span>
            </li>
          ))}
          {critical.length === 0 && (
            <li className="text-xs text-slate-500">No critical items at this time</li>
          )}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-500">
        <p className="font-medium text-slate-400">Compliance & standards</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {PROGRAMME.standards.map((s) => (
            <li key={s}>{s}</li>
          ))}
          {PROGRAMME.regulatory.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <p className="mt-3">
          Developed under {PROGRAMME.partner} engineering collaboration — ready for NNPC
          corridor pilot integration.
        </p>
      </div>
    </div>
  );
}
