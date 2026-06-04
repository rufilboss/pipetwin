import { NextRequest, NextResponse } from "next/server";
import { acknowledgeAlert, resolveAlert } from "@/lib/simulation";
import type { UserRole } from "@/lib/types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const actor = {
    actorId: body.actorId ?? "anonymous",
    actorName: body.actorName ?? "Unknown user",
    role: (body.role ?? "operator") as UserRole,
  };

  if (body.action === "acknowledge") acknowledgeAlert(id, actor);
  else if (body.action === "resolve") resolveAlert(id, actor);
  else return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  return NextResponse.json({ ok: true });
}
