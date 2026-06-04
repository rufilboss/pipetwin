export type UserRole = "operator" | "supervisor" | "executive" | "field_agent";

export type AlertSource = "scada" | "das" | "cctv" | "ctma" | "satellite" | "field" | "manual";

export type AlertSeverity = "critical" | "high" | "medium" | "low" | "info";
export type AlertCategory =
  | "leak"
  | "vandalism"
  | "power"
  | "pressure"
  | "flow"
  | "theft"
  | "maintenance"
  | "security";

export type AssetStatus = "operational" | "degraded" | "offline" | "maintenance";
export type SensorType =
  | "pressure"
  | "flow"
  | "temperature"
  | "vibration"
  | "acoustic"
  | "ground_penetration"
  | "fence"
  | "power";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface PipelineSegment {
  id: string;
  assetCode: string;
  name: string;
  from: string;
  to: string;
  coordinates: GeoPoint[];
  lengthKm: number;
  kmStart: number;
  kmEnd: number;
  diameterMm: number;
  capacityBpd: number;
  status: AssetStatus;
}

export interface Station {
  id: string;
  name: string;
  type: "pump" | "valve" | "metering" | "storage" | "substation";
  position: GeoPoint;
  segmentId: string;
  status: AssetStatus;
  powerBackup: boolean;
  powerOnline: boolean;
}

export interface Sensor {
  id: string;
  segmentId: string;
  stationId?: string;
  type: SensorType;
  label: string;
  position: GeoPoint;
  unit: string;
  value: number;
  baseline: number;
  threshold: { warn: number; critical: number };
  status: AssetStatus;
  lastUpdated: string;
}

export interface Alert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  source: AlertSource;
  title: string;
  message: string;
  segmentId: string;
  kmPost?: number;
  stationId?: string;
  sensorId?: string;
  position: GeoPoint;
  reportedBy?: string;
  acknowledged: boolean;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: "acknowledge" | "resolve" | "field_report" | "login" | "export";
  targetId?: string;
  summary: string;
  actorId: string;
  actorName: string;
  role: UserRole;
  timestamp: string;
}

export interface IntegrationFeed {
  id: string;
  name: string;
  type: "scada" | "pmcc" | "ctma" | "cctv" | "satellite" | "gis";
  status: "connected" | "degraded" | "disconnected" | "pilot";
  lastSync: string;
  recordsPerHour?: number;
  description: string;
}

export interface FieldReportInput {
  category: AlertCategory;
  severity: AlertSeverity;
  segmentId: string;
  kmPost: number;
  description: string;
  reporterName: string;
  reporterPhone?: string;
  role: UserRole;
}

export interface OilBatch {
  id: string;
  label: string;
  origin: string;
  destination: string;
  volumeBbl: number;
  apiGravity: number;
  sulfurPct: number;
  currentSegmentId: string;
  progressPct: number;
  etaHours: number;
  status: "in_transit" | "held" | "delivered" | "diverted";
  startedAt: string;
}

export interface Incident {
  id: string;
  alertId: string;
  type: AlertCategory;
  status: "open" | "investigating" | "contained" | "closed";
  assignedTo: string;
  notes: string;
  createdAt: string;
}

export interface TelemetrySnapshot {
  timestamp: string;
  programme: {
    corridor: string;
    operator: string;
    partner: string;
    phase: string;
  };
  sensors: Sensor[];
  alerts: Alert[];
  segments: PipelineSegment[];
  stations: Station[];
  oilBatches: OilBatch[];
  incidents: Incident[];
  auditLogs: AuditLogEntry[];
  integrations: IntegrationFeed[];
  kpis: {
    throughputBpd: number;
    pressureAvgBar: number;
    activeAlerts: number;
    criticalAlerts: number;
    segmentsOperational: number;
    segmentsTotal: number;
    powerStationsOnline: number;
    powerStationsTotal: number;
    leakRiskScore: number;
    vandalismEvents24h: number;
  };
}

export type DashboardView =
  | "overview"
  | "map"
  | "alerts"
  | "oil-tracking"
  | "digital-twin"
  | "power"
  | "analytics"
  | "executive";
