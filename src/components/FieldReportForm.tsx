"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { AlertCategory, AlertSeverity, PipelineSegment } from "@/lib/types";

interface FieldReportFormProps {
  segments: PipelineSegment[];
  onSubmit: (data: {
    category: AlertCategory;
    severity: AlertSeverity;
    segmentId: string;
    kmPost: number;
    description: string;
    reporterName: string;
    reporterPhone?: string;
  }) => Promise<void>;
  defaultReporter?: string;
}

export function FieldReportForm({
  segments,
  onSubmit,
  defaultReporter = "",
}: FieldReportFormProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    category: "vandalism" as AlertCategory,
    severity: "high" as AlertSeverity,
    segmentId: segments[0]?.id ?? "",
    kmPost: segments[0]?.kmStart ?? 0,
    description: "",
    reporterName: defaultReporter,
    reporterPhone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      setDone(true);
      setForm((f) => ({ ...f, description: "" }));
      setTimeout(() => setDone(false), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3"
    >
      <div>
        <h3 className="text-sm font-semibold text-white">Field incident report</h3>
        <p className="text-[10px] text-slate-500">
          CTMA-style channel — routed to control room & audit log
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs text-slate-400">
          Category
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as AlertCategory })
            }
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
          >
            <option value="vandalism">Vandalism</option>
            <option value="leak">Leak</option>
            <option value="theft">Oil theft</option>
            <option value="security">Security</option>
            <option value="power">Power</option>
          </select>
        </label>
        <label className="block text-xs text-slate-400">
          Severity
          <select
            value={form.severity}
            onChange={(e) =>
              setForm({ ...form, severity: e.target.value as AlertSeverity })
            }
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
      </div>

      <label className="block text-xs text-slate-400">
        Pipeline segment
        <select
          value={form.segmentId}
          onChange={(e) => {
            const seg = segments.find((s) => s.id === e.target.value);
            setForm({
              ...form,
              segmentId: e.target.value,
              kmPost: seg?.kmStart ?? 0,
            });
          }}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
        >
          {segments.map((s) => (
            <option key={s.id} value={s.id}>
              {s.assetCode} — {s.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-xs text-slate-400">
        KM post (chainage)
        <input
          type="number"
          min={0}
          max={205}
          value={form.kmPost}
          onChange={(e) => setForm({ ...form, kmPost: Number(e.target.value) })}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
        />
      </label>

      <label className="block text-xs text-slate-400">
        Description
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="What did you observe? Location landmarks, vehicles, sounds…"
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs text-slate-400">
          Reporter name
          <input
            required
            value={form.reporterName}
            onChange={(e) => setForm({ ...form, reporterName: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-slate-400">
          Phone (optional)
          <input
            value={form.reporterPhone}
            onChange={(e) => setForm({ ...form, reporterPhone: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 touch-manipulation"
      >
        <Send className="h-4 w-4" />
        {loading ? "Submitting…" : done ? "Report received ✓" : "Submit to control room"}
      </button>
    </form>
  );
}
