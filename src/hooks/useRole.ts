"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserRole } from "@/lib/types";
import { ROLES } from "@/lib/roles";

const STORAGE_KEY = "pipetwin-role";

const DEFAULT_ACTORS: Record<UserRole, { id: string; name: string }> = {
  operator: { id: "usr-op-01", name: "Control Room — EWK" },
  supervisor: { id: "usr-sup-01", name: "A. Ibrahim (UNILORIN pilot)" },
  field_agent: { id: "usr-field-01", name: "Community Field Agent" },
  executive: { id: "usr-exec-01", name: "Executive Viewer" },
};

export function useRole() {
  const [role, setRoleState] = useState<UserRole>("supervisor");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as UserRole | null;
    if (saved && ROLES.some((r) => r.id === saved)) setRoleState(saved);
  }, []);

  const setRole = useCallback((r: UserRole) => {
    setRoleState(r);
    localStorage.setItem(STORAGE_KEY, r);
  }, []);

  const base = DEFAULT_ACTORS[role];
  const actor = {
    actorId: base.id,
    actorName: base.name,
    role,
  };

  return { role, setRole, actor };
}
