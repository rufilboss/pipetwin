"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import type { Alert, PipelineSegment, Sensor, Station } from "@/lib/types";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

function FitBounds({ segments }: { segments: PipelineSegment[] }) {
  const map = useMap();
  useEffect(() => {
    const coords = segments.flatMap((s) =>
      s.coordinates.map((c) => [c.lat, c.lng] as [number, number])
    );
    if (coords.length) map.fitBounds(coords, { padding: [40, 40] });
  }, [map, segments]);
  return null;
}

const SEGMENT_COLORS: Record<string, string> = {
  operational: "#10b981",
  degraded: "#f59e0b",
  offline: "#ef4444",
  maintenance: "#6366f1",
};

interface PipelineMapProps {
  segments: PipelineSegment[];
  stations: Station[];
  sensors: Sensor[];
  alerts: Alert[];
  selectedSegmentId?: string;
  onSelectSegment?: (id: string) => void;
  height?: string;
  className?: string;
}

export function PipelineMap({
  segments,
  stations,
  sensors,
  alerts,
  selectedSegmentId,
  onSelectSegment,
  height = "100%",
  className,
}: PipelineMapProps) {
  const center = useMemo((): [number, number] => {
    const first = segments[0]?.coordinates[0];
    return first ? [first.lat, first.lng] : [6.5, 8.5];
  }, [segments]);

  const activeAlerts = alerts.filter((a) => !a.resolved);

  return (
    <div
      className={cn(
        "min-h-[240px] overflow-hidden rounded-xl border border-slate-800",
        className
      )}
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={7}
        className="h-full w-full z-0"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds segments={segments} />

        {segments.map((seg) => (
          <Polyline
            key={seg.id}
            positions={seg.coordinates.map((c) => [c.lat, c.lng] as [number, number])}
            pathOptions={{
              color: SEGMENT_COLORS[seg.status] ?? "#10b981",
              weight: selectedSegmentId === seg.id ? 6 : 4,
              opacity: selectedSegmentId && selectedSegmentId !== seg.id ? 0.35 : 0.9,
            }}
            eventHandlers={{
              click: () => onSelectSegment?.(seg.id),
            }}
          >
            <Popup>
              <div className="text-sm text-slate-900">
                <strong>{seg.name}</strong>
                <br />
                {seg.lengthKm} km · {seg.diameterMm} mm
                <br />
                Status: {seg.status}
              </div>
            </Popup>
          </Polyline>
        ))}

        {stations.map((st) => (
          <CircleMarker
            key={st.id}
            center={[st.position.lat, st.position.lng]}
            radius={8}
            pathOptions={{
              color: st.powerOnline ? "#38bdf8" : "#f97316",
              fillColor: st.powerOnline ? "#0ea5e9" : "#ea580c",
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm text-slate-900">
                <strong>{st.name}</strong>
                <br />
                Type: {st.type}
                <br />
                Power: {st.powerOnline ? "Online" : "Offline / backup"}
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {activeAlerts.map((a) => (
          <CircleMarker
            key={a.id}
            center={[a.position.lat, a.position.lng]}
            radius={10}
            pathOptions={{
              color: "#ef4444",
              fillColor: "#dc2626",
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm text-slate-900">
                <strong>{a.title}</strong>
                <br />
                {a.severity} · {a.category}
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {sensors
          .filter((s) => s.status !== "operational")
          .map((s) => (
            <CircleMarker
              key={s.id}
              center={[s.position.lat, s.position.lng]}
              radius={5}
              pathOptions={{
                color: "#a855f7",
                fillColor: "#9333ea",
                fillOpacity: 0.7,
                weight: 1,
              }}
            />
          ))}
      </MapContainer>
    </div>
  );
}
