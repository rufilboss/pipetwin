"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { KpiCards } from "./KpiCards";
import { AlertPanel } from "./AlertPanel";
import { OilTracking } from "./OilTracking";
import { DigitalTwinPanel } from "./DigitalTwinPanel";
import { PowerStatus } from "./PowerStatus";
import { SensorCharts } from "./SensorCharts";
import { IncidentList } from "./IncidentList";
import { useTelemetry } from "@/hooks/useTelemetry";
import type { DashboardView } from "@/lib/types";
import { Clock } from "lucide-react";

const PipelineMap = dynamic(
  () => import("./PipelineMap").then((m) => m.PipelineMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 text-sm text-slate-500">
        Loading map…
      </div>
    ),
  }
);

export function Dashboard() {
  const [view, setView] = useState<DashboardView>("overview");
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>("seg-003");
  const { data, connected, error, acknowledge, resolve } = useTelemetry();

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Initializing PipeTwin SCADA…
      </div>
    );
  }

  const selectedSegment = data.segments.find((s) => s.id === selectedSegmentId);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar
        view={view}
        onViewChange={setView}
        connected={connected}
        criticalCount={data.kpis.criticalAlerts}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 py-3 backdrop-blur">
          <div>
            <h2 className="text-lg font-semibold text-white capitalize">
              {view.replace("-", " ")}
            </h2>
            <p className="text-xs text-slate-500">
              Escravos–Warri–Kaduna trunk · {data.segments.length} segments monitored
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {error && <span className="text-amber-500">{error}</span>}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(data.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {view === "overview" && (
            <div className="space-y-4">
              <KpiCards kpis={data.kpis} />
              <div className="grid gap-4 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  <PipelineMap
                    segments={data.segments}
                    stations={data.stations}
                    sensors={data.sensors}
                    alerts={data.alerts}
                    selectedSegmentId={selectedSegmentId}
                    onSelectSegment={setSelectedSegmentId}
                    height="420px"
                  />
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Priority alerts
                  </h3>
                  <AlertPanel
                    alerts={data.alerts}
                    onAcknowledge={acknowledge}
                    onResolve={resolve}
                    compact
                  />
                </div>
              </div>
              <SensorCharts sensors={data.sensors} />
            </div>
          )}

          {view === "map" && (
            <PipelineMap
              segments={data.segments}
              stations={data.stations}
              sensors={data.sensors}
              alerts={data.alerts}
              selectedSegmentId={selectedSegmentId}
              onSelectSegment={setSelectedSegmentId}
              height="calc(100vh - 140px)"
            />
          )}

          {view === "alerts" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Alert queue
                </h3>
                <AlertPanel
                  alerts={data.alerts}
                  onAcknowledge={acknowledge}
                  onResolve={resolve}
                />
              </div>
              <div>
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Incidents
                </h3>
                <IncidentList incidents={data.incidents} alerts={data.alerts} />
              </div>
            </div>
          )}

          {view === "oil-tracking" && (
            <OilTracking batches={data.oilBatches} segments={data.segments} />
          )}

          {view === "digital-twin" && (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="min-h-[400px]">
                <PipelineMap
                  segments={data.segments}
                  stations={data.stations}
                  sensors={data.sensors}
                  alerts={data.alerts}
                  selectedSegmentId={selectedSegmentId}
                  onSelectSegment={setSelectedSegmentId}
                  height="400px"
                />
              </div>
              <DigitalTwinPanel
                segment={selectedSegment}
                sensors={data.sensors}
                alerts={data.alerts}
              />
            </div>
          )}

          {view === "power" && <PowerStatus stations={data.stations} />}

          {view === "analytics" && <SensorCharts sensors={data.sensors} />}
        </div>
      </main>
    </div>
  );
}
