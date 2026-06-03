import { NextRequest, NextResponse } from "next/server";
import { acknowledgeAlert, resolveAlert } from "@/lib/simulation";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  if (body.action === "acknowledge") acknowledgeAlert(id);
  else if (body.action === "resolve") resolveAlert(id);
  else return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
