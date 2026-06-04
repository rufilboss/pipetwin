import { NextRequest, NextResponse } from "next/server";
import { submitFieldReport, getTelemetry } from "@/lib/simulation";
import type { FieldReportInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as FieldReportInput;

  if (!body.segmentId || !body.description || !body.reporterName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = submitFieldReport(body);
  return NextResponse.json({ ok: true, ...result, telemetry: getTelemetry() });
}
