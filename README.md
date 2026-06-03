# PipeTwin — Oil Pipeline Digital Twin

Real-time monitoring dashboard for oil pipeline operations: **vandalism detection**, **leak monitoring**, **oil batch tracking**, **power outages**, theft/hot-tap alerts, and segment-level **digital twin** views.

## Features

| Module | Capabilities |
|--------|----------------|
| **Overview** | Live KPIs, pipeline map, priority alerts, pressure/flow charts |
| **Pipeline map** | GIS view with segments, stations, alert markers (Carto dark basemap) |
| **Alerts & incidents** | Acknowledge/resolve alerts, incident triage workflow |
| **Oil tracking** | Batch progress, API gravity, sulfur, ETA along corridor |
| **Digital twin** | Segment schematic + live sensor bindings |
| **Power grid** | Substation/pump/metering online vs backup status |
| **Analytics** | Integrity sensors (acoustic, ground intrusion, fence, vibration) |

## Tech stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4**
- **Leaflet / react-leaflet** — pipeline GIS
- **Recharts** — telemetry charts
- **Server-Sent Events** — live simulation stream (`/api/stream`)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/telemetry` | Snapshot of sensors, alerts, KPIs |
| `GET /api/stream` | SSE — updates every 2s |
| `PATCH /api/alerts/:id` | `{ "action": "acknowledge" \| "resolve" }` |

## Production notes

This repo ships a **simulation engine** for demo and UX validation. For production:

1. Replace `src/lib/simulation.ts` with adapters to SCADA (OPC-UA), PI System, or MQTT ingest.
2. Persist alerts/incidents in PostgreSQL or TimescaleDB.
3. Add auth (OIDC), RBAC, and audit logs for acknowledge/resolve actions.
4. Wire real CCTV/analytics and DAS (distributed acoustic sensing) for leak and vandalism models.

## Project structure

```
src/
├── app/api/          # REST + SSE
├── components/       # Dashboard UI
├── hooks/            # useTelemetry (EventSource)
└── lib/
    ├── pipeline-data.ts   # Static network model
    ├── simulation.ts      # Live tick + events
    └── types.ts
```

## License

Private / internal use — adjust as needed.
