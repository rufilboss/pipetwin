# PipeTwin — Oil Pipeline Digital Twin

**UNILORIN × NNPC** research pilot — real-time pipeline integrity monitoring for vandalism, leaks, oil theft, power outages, and custody tracking on the **NPSL-EWK** corridor (Escravos–Warri–Kaduna).

Built as an engineering platform suitable for academic demonstration and NNPC corridor pilot integration.

## Real-world features

| Capability | Description |
|------------|-------------|
| **Role-based access** | Operator, supervisor, field agent, executive (read-only) |
| **Audit trail** | Immutable log of acknowledge, resolve, and field reports |
| **Field reporting** | CTMA-style incident submission → alert + incident + audit |
| **Enterprise feeds** | PMCC, SCADA, CTMA, CCTV, satellite, GIS (pilot status panel) |
| **Asset registry** | Segment codes (`NPSL-EWK-01`…), km chainage posts |
| **Alert provenance** | Source tags: SCADA, DAS, CCTV, CTMA, field, satellite |
| **Executive brief** | Board summary, ROI model, print/PDF export |
| **Standards** | API 1130 / 1160, ISO 55001, PIA alignment (reference) |

## Dashboard modules

| View | Purpose |
|------|---------|
| Overview | KPIs, map, alerts, integration panel |
| Pipeline map | Full GIS corridor |
| Alerts & incidents | Queue, triage, field reports, audit log |
| Oil tracking | Batch custody along line |
| Digital twin | Segment schematic + sensors |
| Power grid | Station grid / UPS status |
| Analytics | Pressure, flow, integrity sensors |
| Executive brief | Chairman-ready summary |

## Tech stack

- Next.js 16 · TypeScript · Tailwind CSS 4
- Leaflet · Recharts · SSE live telemetry

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the sidebar **Session role** to test permissions.

## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/telemetry` | Full snapshot (programme, audit, integrations) |
| `GET /api/stream` | SSE — updates every 2s |
| `PATCH /api/alerts/:id` | `{ action, actorId, actorName, role }` |
| `POST /api/reports` | Field incident report body (`FieldReportInput`) |

## Production path (NNPC pilot)

1. Replace `src/lib/simulation.ts` with OPC-UA / MQTT / PI adapters.
2. Persist audit + alerts in PostgreSQL (append-only audit table).
3. OIDC auth (NNPC Entra ID) — map to roles in `src/lib/roles.ts`.
4. Connect PMCC, CTMA, and corridor SCADA via `src/lib/integrations.ts` adapters.

## Project structure

```
src/
├── app/api/           # telemetry, stream, alerts, reports
├── components/        # dashboard UI
├── hooks/             # useTelemetry, useRole
└── lib/
    ├── organization.ts   # UNILORIN / NNPC programme metadata
    ├── integrations.ts # enterprise feed registry
    ├── roles.ts        # RBAC helpers
    ├── pipeline-data.ts
    └── simulation.ts
```

## Academic use

Present as **Phase 0 prototype** under the UNILORIN–NNPC partnership: simulated feeds with production-shaped data models, ready for one-corridor pilot deployment.
