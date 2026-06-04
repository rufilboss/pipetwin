import type { UserRole } from "./types";

export const ROLES: { id: UserRole; label: string; description: string }[] = [
  {
    id: "operator",
    label: "Control room operator",
    description: "Acknowledge alerts, monitor SCADA feeds",
  },
  {
    id: "supervisor",
    label: "Integrity supervisor",
    description: "Full alert actions, incident updates",
  },
  {
    id: "field_agent",
    label: "Field / community agent",
    description: "Submit field reports (CTMA-style)",
  },
  {
    id: "executive",
    label: "Executive (read-only)",
    description: "Board summary — no operational actions",
  },
];

export function canAcknowledgeAlerts(role: UserRole): boolean {
  return role === "operator" || role === "supervisor";
}

export function canResolveAlerts(role: UserRole): boolean {
  return role === "supervisor";
}

export function canSubmitFieldReport(role: UserRole): boolean {
  return role === "field_agent" || role === "supervisor" || role === "operator";
}

export function canExportReport(role: UserRole): boolean {
  return role === "supervisor" || role === "executive";
}
