"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { DashboardHeader } from "./DashboardHeader";
import { KpiCards } from "./KpiCards";
import { AlertPanel } from "./AlertPanel";
import { OilTracking } from "./OilTracking";
import { DigitalTwinPanel } from "./DigitalTwinPanel";
import { PowerStatus } from "./PowerStatus";
import { SensorCharts } from "./SensorCharts";
import { IncidentList } from "./IncidentList";
import { PartnershipBanner } from "./PartnershipBanner";
import { IntegrationPanel } from "./IntegrationPanel";
import { AuditLogPanel } from "./AuditLogPanel";
import { FieldReportForm } from "./FieldReportForm";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useRole } from "@/hooks/useRole";
import {
  canAcknowledgeAlerts,
  canResolveAlerts,
  canSubmitFieldReport,
} from "@/lib/roles";
import type { DashboardView } from "@/lib/types";

const PipelineMap = dynamic(
  () => import("./PipelineMap").then((m) => m.PipelineMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(50dvh,420px)] min-h-[240px] items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 text-sm text-slate-500">
        Loading map…
      </div>
    ),
  }
);

const MOBILE_MAIN_PB =
  "pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] lg:pb-0";

export function Dashboard() {
  const [view, setView] = useState<DashboardView>("overview");
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>("seg-003");
  const { role, setRole, actor } = useRole();
  const { data, connected, error, acknowledge, resolve, submitFieldReport } =
    useTelemetry(actor);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  if (!data) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950 px-4 text-center text-slate-400">
        Initializing PipeTwin SCADA…
      </div>
    );
  }

  const selectedSegment = data.segments.find((s) => s.id === selectedSegmentId);
  const mapHeightOverview = "min(50dvh, 420px)";
  const mapHeightTwin = "min(45dvh, 400px)";
  const mapHeightFullClass =
    "h-[calc(100dvh-3.5rem-4.75rem-env(safe-area-inset-bottom,0px))] lg:h-[calc(100vh-8rem)]";

  const alertActions = {
    canAcknowledge: canAcknowledgeAlerts(role),
    canResolve: canResolveAlerts(role),
  };

  return (
    <div className="flex min-h-dvh bg-slate-950 text-slate-200">
      <Sidebar
        view={view}
        onViewChange={setView}
        connected={connected}
        criticalCount={data.kpis.criticalAlerts}
        role={role}
        onRoleChange={setRole}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          view={view}
          programme={data.programme}
          connected={connected}
          error={error}
          timestamp={data.timestamp}
        />

        <main
          className={`flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 md:p-6 ${MOBILE_MAIN_PB}`}
        >
          {view === "overview" && (
            <div className="space-y-3 sm:space-y-4">
              <PartnershipBanner />
              <KpiCards kpis={data.kpis} />
              <div className="grid gap-3 sm:gap-4 xl:grid-cols-3">
                <div className="min-w-0 xl:col-span-2">
                  <PipelineMap
                    segments={data.segments}
                    stations={data.stations}
                    sensors={data.sensors}
                    alerts={data.alerts}
                    selectedSegmentId={selectedSegmentId}
                    onSelectSegment={setSelectedSegmentId}
                    height={mapHeightOverview}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Priority alerts
                  </h3>
                  <AlertPanel
                    alerts={data.alerts}
                    onAcknowledge={acknowledge}
                    onResolve={resolve}
                    compact
                    {...alertActions}
                  />
                </div>
              </div>
              <IntegrationPanel feeds={data.integrations} />
              <SensorCharts sensors={data.sensors} />
            </div>
          )}

          {view === "map" && (
            <div className={`min-h-[280px] min-w-0 ${mapHeightFullClass}`}>
              <PipelineMap
                segments={data.segments}
                stations={data.stations}
                sensors={data.sensors}
                alerts={data.alerts}
                selectedSegmentId={selectedSegmentId}
                onSelectSegment={setSelectedSegmentId}
                height="100%"
                className="h-full"
              />
            </div>
          )}

          {view === "alerts" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                <div className="min-w-0">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Alert queue
                  </h3>
                  <AlertPanel
                    alerts={data.alerts}
                    onAcknowledge={acknowledge}
                    onResolve={resolve}
                    {...alertActions}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Incidents
                  </h3>
                  <IncidentList incidents={data.incidents} alerts={data.alerts} />
                </div>
              </div>
              {canSubmitFieldReport(role) && (
                <FieldReportForm
                  segments={data.segments}
                  onSubmit={submitFieldReport}
                  defaultReporter={actor.actorName}
                />
              )}
              <div>
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Audit trail (immutable log)
                </h3>
                <AuditLogPanel logs={data.auditLogs} />
              </div>
            </div>
          )}

          {view === "oil-tracking" && (
            <OilTracking batches={data.oilBatches} segments={data.segments} />
          )}

          {view === "digital-twin" && (
            <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
              <div className="min-h-[240px] min-w-0">
                <PipelineMap
                  segments={data.segments}
                  stations={data.stations}
                  sensors={data.sensors}
                  alerts={data.alerts}
                  selectedSegmentId={selectedSegmentId}
                  onSelectSegment={setSelectedSegmentId}
                  height={mapHeightTwin}
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

          {view === "executive" && <ExecutiveSummary data={data} role={role} />}
        </main>
      </div>

      <MobileNav
        view={view}
        onViewChange={setView}
        criticalCount={data.kpis.criticalAlerts}
      />
    </div>
  );
}
