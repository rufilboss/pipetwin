import {
  PIPELINE_SEGMENTS,
  STATIONS,
  INITIAL_SENSORS,
  INITIAL_OIL_BATCHES,
  INITIAL_ALERTS,
  INITIAL_INCIDENTS,
  INITIAL_AUDIT_LOGS,
} from "./pipeline-data";
import { PROGRAMME } from "./organization";
import { getIntegrationFeeds } from "./integrations";
import type {
  Alert,
  AlertCategory,
  AlertSeverity,
  AlertSource,
  AuditLogEntry,
  FieldReportInput,
  OilBatch,
  Sensor,
  TelemetrySnapshot,
  PipelineSegment,
  Station,
  Incident,
  UserRole,
} from "./types";

let sensors: Sensor[] = structuredClone(INITIAL_SENSORS);
let alerts: Alert[] = structuredClone(INITIAL_ALERTS);
let oilBatches: OilBatch[] = structuredClone(INITIAL_OIL_BATCHES);
let incidents: Incident[] = structuredClone(INITIAL_INCIDENTS);
let segments: PipelineSegment[] = structuredClone(PIPELINE_SEGMENTS);
let stations: Station[] = structuredClone(STATIONS);
let auditLogs: AuditLogEntry[] = structuredClone(INITIAL_AUDIT_LOGS);

const history: { t: number; pressure: number; flow: number; leakScore: number }[] = [];
let tick = 0;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function logAudit(
  entry: Omit<AuditLogEntry, "id" | "timestamp"> & { timestamp?: string }
) {
  auditLogs.unshift({
    ...entry,
    id: `aud-${Date.now()}`,
    timestamp: entry.timestamp ?? new Date().toISOString(),
  });
  if (auditLogs.length > 100) auditLogs = auditLogs.slice(0, 100);
}

function buildProgramme() {
  return {
    corridor: PROGRAMME.corridor,
    operator: PROGRAMME.operator,
    partner: PROGRAMME.partner,
    phase: PROGRAMME.pilotPhase,
  };
}

function maybePushAlert(
  alert: Omit<
    Alert,
    "id" | "createdAt" | "updatedAt" | "acknowledged" | "resolved" | "source"
  > & { source?: AlertSource }
) {
  if (Math.random() > 0.92) return;
  const now = new Date().toISOString();
  const exists = alerts.some(
    (a) => !a.resolved && a.category === alert.category && a.segmentId === alert.segmentId
  );
  if (exists) return;
  alerts.unshift({
    ...alert,
    source: alert.source ?? "scada",
    id: `alt-${Date.now()}`,
    acknowledged: false,
    resolved: false,
    createdAt: now,
    updatedAt: now,
  });
  if (alerts.length > 50) alerts = alerts.slice(0, 50);
}

function updateSensors() {
  const now = new Date().toISOString();
  sensors = sensors.map((s) => {
    let drift = rand(-0.8, 0.8);
    if (s.type === "acoustic" && alerts.some((a) => a.id === "alt-001" && !a.resolved)) {
      drift = rand(2, 5);
    }
    if (s.type === "fence" && alerts.some((a) => a.id === "alt-002" && !a.resolved)) {
      return { ...s, value: 1, status: "degraded" as const, lastUpdated: now };
    }
    if (s.type === "power" && !stations.find((st) => st.id === "st-meter-1")?.powerOnline) {
      return { ...s, value: rand(22, 26), status: "offline" as const, lastUpdated: now };
    }
    const value = Math.max(0, s.value + drift);
    let status = s.status;
    if (value >= s.threshold.critical) status = "offline";
    else if (value >= s.threshold.warn) status = "degraded";
    else status = "operational";
    return { ...s, value: Number(value.toFixed(2)), status, lastUpdated: now };
  });
}

function updateOilBatches() {
  oilBatches = oilBatches.map((b) => {
    if (b.status !== "in_transit") return b;
    const progress = Math.min(100, b.progressPct + rand(0.02, 0.15));
    const segOrder = ["seg-001", "seg-002", "seg-003", "seg-004", "seg-005"];
    const idx = segOrder.indexOf(b.currentSegmentId);
    let segmentId = b.currentSegmentId;
    if (progress > (idx + 1) * 20 && idx < segOrder.length - 1) {
      segmentId = segOrder[idx + 1];
    }
    return {
      ...b,
      progressPct: Number(progress.toFixed(1)),
      currentSegmentId: segmentId,
      etaHours: Math.max(0.5, b.etaHours - rand(0, 0.08)),
    };
  });
}

function simulateEvents() {
  tick++;
  if (tick % 120 === 0) {
    maybePushAlert({
      category: "vandalism",
      severity: "high",
      source: "cctv",
      kmPost: 55,
      title: "Motion detected near valve assembly",
      message: "CCTV analytics flagged vehicle stop near BV-12 for >8 minutes.",
      segmentId: "seg-002",
      position: { lat: 5.92, lng: 6.78 },
    });
  }
  if (tick % 200 === 0) {
    maybePushAlert({
      category: "leak",
      severity: "medium",
      source: "scada",
      kmPost: 61,
      title: "Pressure decay — segment watch",
      message: "Slow pressure decay observed over 30 min; within tolerance but trending.",
      segmentId: "seg-002",
      position: { lat: 5.85, lng: 6.62 },
    });
  }
  if (tick % 180 === 0 && Math.random() > 0.7) {
    maybePushAlert({
      category: "power",
      severity: "medium",
      source: "scada",
      kmPost: 155,
      title: "Voltage sag — pump station",
      message: "Brief voltage sag at Pump Station Bravo; no trip event.",
      segmentId: "seg-004",
      stationId: "st-pump-2",
      position: { lat: 6.22, lng: 7.45 },
    });
  }
}

function computeKpis() {
  const pressureSensors = sensors.filter((s) => s.type === "pressure");
  const flowSensors = sensors.filter((s) => s.type === "flow");
  const active = alerts.filter((a) => !a.resolved);
  const critical = active.filter((a) => a.severity === "critical" || a.severity === "high");
  const powerTotal = stations.filter(
    (s) => s.type === "substation" || s.type === "pump" || s.type === "metering"
  );
  const powerOnline = powerTotal.filter((s) => s.powerOnline);

  const acoustic = sensors.find((s) => s.type === "acoustic");
  const ground = sensors.find((s) => s.type === "ground_penetration");
  const leakRisk = Math.min(
    100,
    Math.round(
      ((acoustic?.value ?? 0) / (acoustic?.threshold.critical ?? 55)) * 50 +
        ((ground?.value ?? 0) / (ground?.threshold.critical ?? 350)) * 50
    )
  );

  const vandal24 = alerts.filter(
    (a) =>
      a.category === "vandalism" &&
      Date.now() - new Date(a.createdAt).getTime() < 86400000
  ).length;

  return {
    throughputBpd: Math.round(flowSensors.reduce((sum, s) => sum + s.value, 0) * 0.38),
    pressureAvgBar: Number(
      (
        pressureSensors.reduce((sum, s) => sum + s.value, 0) /
        Math.max(1, pressureSensors.length)
      ).toFixed(1)
    ),
    activeAlerts: active.length,
    criticalAlerts: critical.length,
    segmentsOperational: segments.filter((s) => s.status === "operational").length,
    segmentsTotal: segments.length,
    powerStationsOnline: powerOnline.length,
    powerStationsTotal: powerTotal.length,
    leakRiskScore: leakRisk,
    vandalismEvents24h: vandal24,
  };
}

function buildSnapshot(): TelemetrySnapshot {
  return {
    timestamp: new Date().toISOString(),
    programme: buildProgramme(),
    sensors,
    alerts,
    segments,
    stations,
    oilBatches,
    incidents,
    auditLogs: [...auditLogs],
    integrations: getIntegrationFeeds(),
    kpis: computeKpis(),
  };
}

export function runSimulationTick(): TelemetrySnapshot {
  updateSensors();
  updateOilBatches();
  simulateEvents();

  const kpis = computeKpis();
  history.push({
    t: Date.now(),
    pressure: kpis.pressureAvgBar,
    flow: kpis.throughputBpd / 100,
    leakScore: kpis.leakRiskScore,
  });
  if (history.length > 120) history.shift();

  return buildSnapshot();
}

export function getTelemetry(): TelemetrySnapshot {
  return buildSnapshot();
}

export function getHistory() {
  return [...history];
}

export function acknowledgeAlert(
  id: string,
  actor: { actorId: string; actorName: string; role: UserRole }
) {
  alerts = alerts.map((a) =>
    a.id === id ? { ...a, acknowledged: true, updatedAt: new Date().toISOString() } : a
  );
  logAudit({
    action: "acknowledge",
    targetId: id,
    summary: `Alert ${id} acknowledged`,
    actorId: actor.actorId,
    actorName: actor.actorName,
    role: actor.role,
  });
}

export function resolveAlert(
  id: string,
  actor: { actorId: string; actorName: string; role: UserRole }
) {
  alerts = alerts.map((a) =>
    a.id === id
      ? { ...a, resolved: true, acknowledged: true, updatedAt: new Date().toISOString() }
      : a
  );
  logAudit({
    action: "resolve",
    targetId: id,
    summary: `Alert ${id} resolved and closed`,
    actorId: actor.actorId,
    actorName: actor.actorName,
    role: actor.role,
  });
}

export function submitFieldReport(input: FieldReportInput) {
  const segment = segments.find((s) => s.id === input.segmentId);
  const position = segment?.coordinates[Math.floor(segment.coordinates.length / 2)] ?? {
    lat: 6.5,
    lng: 8.0,
  };

  const alertId = `alt-${Date.now()}`;
  const now = new Date().toISOString();
  alerts.unshift({
    id: alertId,
    category: input.category,
    severity: input.severity,
    source: "field",
    title: `Field report — ${input.category} at km ${input.kmPost}`,
    message: input.description,
    segmentId: input.segmentId,
    kmPost: input.kmPost,
    position,
    reportedBy: input.reporterName,
    acknowledged: false,
    resolved: false,
    createdAt: now,
    updatedAt: now,
  });

  incidents.unshift({
    id: `inc-${Date.now()}`,
    alertId,
    type: input.category,
    status: "open",
    assignedTo: "Dispatch — EWK corridor",
    notes: `Submitted via PipeTwin field channel. Contact: ${input.reporterPhone ?? "N/A"}`,
    createdAt: now,
  });

  logAudit({
    action: "field_report",
    targetId: alertId,
    summary: `Field report at km ${input.kmPost} — ${input.category}`,
    actorId: `field-${input.reporterName.replace(/\s/g, "-").toLowerCase()}`,
    actorName: input.reporterName,
    role: input.role,
  });

  return { alertId };
}

export function updateIncident(id: string, patch: Partial<Incident>) {
  incidents = incidents.map((i) => (i.id === id ? { ...i, ...patch } : i));
}

export function setStationPower(stationId: string, online: boolean) {
  stations = stations.map((s) =>
    s.id === stationId ? { ...s, powerOnline: online } : s
  );
}
