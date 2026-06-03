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
  name: string;
  from: string;
  to: string;
  coordinates: GeoPoint[];
  lengthKm: number;
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
  title: string;
  message: string;
  segmentId: string;
  stationId?: string;
  sensorId?: string;
  position: GeoPoint;
  acknowledged: boolean;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
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
  sensors: Sensor[];
  alerts: Alert[];
  segments: PipelineSegment[];
  stations: Station[];
  oilBatches: OilBatch[];
  incidents: Incident[];
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
  | "analytics";
