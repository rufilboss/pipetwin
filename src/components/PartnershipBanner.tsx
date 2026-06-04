"use client";

import { GraduationCap, X } from "lucide-react";
import { useState } from "react";
import { PROGRAMME } from "@/lib/organization";

export function PartnershipBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative rounded-xl border border-emerald-500/25 bg-gradient-to-r from-emerald-950/50 to-slate-900/80 p-3 sm:p-4">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-2 rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex gap-3 pr-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600/20">
          <GraduationCap className="h-5 w-5 text-emerald-400" />
        </div>
        <div className="min-w-0 text-xs leading-relaxed text-slate-300">
          <p className="font-semibold text-emerald-300">
            UNILORIN × NNPC — Research & innovation pilot
          </p>
          <p className="mt-1 text-slate-400">
            {PROGRAMME.partnership}. Corridor: {PROGRAMME.corridor} ({PROGRAMME.corridorCode},{" "}
            {PROGRAMME.totalLengthKm} km). {PROGRAMME.pilotPhase}.
          </p>
        </div>
      </div>
    </div>
  );
}
