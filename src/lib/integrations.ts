import type { IntegrationFeed } from "./types";

/** Simulated enterprise feeds — replace with live adapters in production */
export function getIntegrationFeeds(): IntegrationFeed[] {
  const now = Date.now();
  return [
    {
      id: "int-scada",
      name: "NNPC SCADA (corridor)",
      type: "scada",
      status: "pilot",
      lastSync: new Date(now - 4000).toISOString(),
      recordsPerHour: 7200,
      description: "Pressure, flow, temperature — OPC-UA gateway (pilot)",
    },
    {
      id: "int-pmcc",
      name: "PMCC production feed",
      type: "pmcc",
      status: "connected",
      lastSync: new Date(now - 12000).toISOString(),
      recordsPerHour: 360,
      description: "Hydrocarbon production & transport summary",
    },
    {
      id: "int-ctma",
      name: "CTMA / community reports",
      type: "ctma",
      status: "connected",
      lastSync: new Date(now - 180000).toISOString(),
      recordsPerHour: 12,
      description: "Crude theft & vandalism citizen reports",
    },
    {
      id: "int-cctv",
      name: "CCTV analytics (Niger Delta)",
      type: "cctv",
      status: "degraded",
      lastSync: new Date(now - 95000).toISOString(),
      recordsPerHour: 48,
      description: "Aramco-model video surveillance — 2 cameras offline",
    },
    {
      id: "int-sat",
      name: "Satellite corridor monitoring",
      type: "satellite",
      status: "pilot",
      lastSync: new Date(now - 604800000).toISOString(),
      description: "14-day revisit — third-party encroachment AI",
    },
    {
      id: "int-gis",
      name: "Corporate GIS / asset registry",
      type: "gis",
      status: "connected",
      lastSync: new Date(now - 86400000).toISOString(),
      description: "Segment km posts, valve stations, ROW boundaries",
    },
  ];
}
