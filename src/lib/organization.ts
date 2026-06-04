/** Programme metadata — UNILORIN × NNPC partnership context */
export const PROGRAMME = {
  name: "PipeTwin",
  fullName: "Pipeline Integrity Digital Twin Platform",
  operator: "NNPC Ltd — Pipelines & Storage (pilot corridor)",
  partner: "University of Ilorin (UNILORIN)",
  partnership:
    "Research & innovation collaboration — pipeline monitoring, leak detection, and vandalism analytics",
  corridor: "Escravos–Warri–Kaduna (EWK) transmission corridor",
  corridorCode: "NPSL-EWK",
  totalLengthKm: 205,
  regulatory: ["Petroleum Industry Act (PIA) 2021", "NUPRC upstream guidelines", "NDPC data protection"],
  standards: ["API 1130 (liquid leak detection)", "API 1160 (integrity)", "ISO 55001 (asset management)"],
  pilotPhase: "Phase 0 — Engineering prototype (simulated SCADA feeds)",
} as const;

export const ROI_DEFAULTS = {
  oilPriceUsdPerBbl: 78,
  ngnPerUsd: 1550,
  avgBblLostPerIncident: 420,
  incidentsPreventedPerMonth: 3,
} as const;
