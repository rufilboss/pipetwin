import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Map,
  Bell,
  Droplets,
  Box,
  Zap,
  BarChart3,
} from "lucide-react";
import type { DashboardView } from "./types";

export const NAV_ITEMS: {
  id: DashboardView;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}[] = [
  { id: "overview", label: "Overview", shortLabel: "Home", icon: LayoutDashboard },
  { id: "map", label: "Pipeline map", shortLabel: "Map", icon: Map },
  { id: "alerts", label: "Alerts & incidents", shortLabel: "Alerts", icon: Bell },
  { id: "oil-tracking", label: "Oil tracking", shortLabel: "Oil", icon: Droplets },
  { id: "digital-twin", label: "Digital twin", shortLabel: "Twin", icon: Box },
  { id: "power", label: "Power grid", shortLabel: "Power", icon: Zap },
  { id: "analytics", label: "Analytics", shortLabel: "Stats", icon: BarChart3 },
];

export function viewTitle(view: DashboardView): string {
  return NAV_ITEMS.find((n) => n.id === view)?.label ?? view.replace("-", " ");
}
