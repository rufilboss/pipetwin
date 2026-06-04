"use client";

import { useCallback, useEffect, useState } from "react";
import type { FieldReportInput, TelemetrySnapshot, UserRole } from "@/lib/types";

export function useTelemetry(actor?: {
  actorId: string;
  actorName: string;
  role: UserRole;
}) {
  const [data, setData] = useState<TelemetrySnapshot | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/telemetry");
      if (!res.ok) throw new Error("Failed to fetch");
      setData(await res.json());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }, []);

  useEffect(() => {
    refresh();
    const es = new EventSource("/api/stream");

    es.onopen = () => {
      setConnected(true);
      setError(null);
    };

    es.onmessage = (ev) => {
      try {
        setData(JSON.parse(ev.data) as TelemetrySnapshot);
      } catch {
        /* ignore */
      }
    };

    es.onerror = () => {
      setConnected(false);
      setError("Live stream disconnected — retrying…");
    };

    return () => es.close();
  }, [refresh]);

  const acknowledge = async (id: string) => {
    if (!actor) return;
    await fetch(`/api/alerts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "acknowledge",
        actorId: actor.actorId,
        actorName: actor.actorName,
        role: actor.role,
      }),
    });
    await refresh();
  };

  const resolve = async (id: string) => {
    if (!actor) return;
    await fetch(`/api/alerts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "resolve",
        actorId: actor.actorId,
        actorName: actor.actorName,
        role: actor.role,
      }),
    });
    await refresh();
  };

  const submitFieldReport = async (report: Omit<FieldReportInput, "role">) => {
    if (!actor) return;
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...report, role: actor.role }),
    });
    if (!res.ok) throw new Error("Failed to submit report");
    const json = await res.json();
    if (json.telemetry) setData(json.telemetry);
    else await refresh();
  };

  return { data, connected, error, acknowledge, resolve, submitFieldReport, refresh };
}
