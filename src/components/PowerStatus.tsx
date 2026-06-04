"use client";

import { Battery, BatteryWarning, Power } from "lucide-react";
import type { Station } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PowerStatusProps {
  stations: Station[];
}

export function PowerStatus({ stations }: PowerStatusProps) {
  const powered = stations.filter(
    (s) => s.type === "pump" || s.type === "metering" || s.type === "substation"
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {powered.map((st) => (
        <div
          key={st.id}
          className={cn(
            "rounded-xl border p-4",
            st.powerOnline
              ? "border-emerald-500/20 bg-emerald-500/5"
              : "border-orange-500/30 bg-orange-500/5"
          )}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">{st.name}</h3>
              <p className="text-xs capitalize text-slate-500">{st.type}</p>
            </div>
            {st.powerOnline ? (
              <Power className="h-5 w-5 text-emerald-400" />
            ) : (
              <BatteryWarning className="h-5 w-5 text-orange-400" />
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:gap-4">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-medium",
                st.powerOnline
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-orange-500/20 text-orange-300"
              )}
            >
              {st.powerOnline ? "Grid online" : "On backup / offline"}
            </span>
            {st.powerBackup && (
              <span className="flex items-center gap-1 text-slate-500">
                <Battery className="h-3 w-3" />
                UPS available
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
