"use client";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/navigation";
import type { DashboardView } from "@/lib/types";

interface MobileNavProps {
  view: DashboardView;
  onViewChange: (v: DashboardView) => void;
  criticalCount: number;
}

export function MobileNav({ view, onViewChange, criticalCount }: MobileNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur-lg lg:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      aria-label="Main navigation"
    >
      <div className="flex items-stretch justify-around gap-0.5 overflow-x-auto px-1 pt-1 scrollbar-none">
        {NAV_ITEMS.map(({ id, shortLabel, icon: Icon }) => {
          const active = view === id;
          const badge = id === "alerts" && criticalCount > 0;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onViewChange(id)}
              className={cn(
                "relative flex min-w-[3.25rem] flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-2 transition-colors touch-manipulation",
                active
                  ? "text-emerald-400"
                  : "text-slate-500 active:text-slate-300"
              )}
            >
              <span className="relative">
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                {badge && (
                  <span className="absolute -right-1.5 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-0.5 text-[8px] font-bold text-white">
                    {criticalCount > 9 ? "9+" : criticalCount}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "max-w-full truncate text-[10px] font-medium leading-tight",
                  active && "text-emerald-300"
                )}
              >
                {shortLabel}
              </span>
              {active && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
