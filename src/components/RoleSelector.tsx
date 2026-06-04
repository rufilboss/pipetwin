"use client";

import { ROLES } from "@/lib/roles";
import type { UserRole } from "@/lib/types";

interface RoleSelectorProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function RoleSelector({ role, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="role-select" className="text-[10px] font-medium uppercase text-slate-500">
        Session role
      </label>
      <select
        id="role-select"
        value={role}
        onChange={(e) => onRoleChange(e.target.value as UserRole)}
        className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500/50"
      >
        {ROLES.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
