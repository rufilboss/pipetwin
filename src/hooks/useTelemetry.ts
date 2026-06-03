"use client";

import { useCallback, useEffect, useState } from "react";
import type { TelemetrySnapshot } from "@/lib/types";

export function useTelemetry() {
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
        /* ignore parse errors */
      }
    };

    es.onerror = () => {
      setConnected(false);
      setError("Live stream disconnected — retrying…");
    };

    return () => es.close();
  }, [refresh]);

  const acknowledge = async (id: string) => {
    await fetch(`/api/alerts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "acknowledge" }),
    });
    await refresh();
  };

  const resolve = async (id: string) => {
    await fetch(`/api/alerts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resolve" }),
    });
    await refresh();
  };

  return { data, connected, error, acknowledge, resolve, refresh };
}
