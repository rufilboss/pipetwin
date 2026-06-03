import { NextResponse } from "next/server";
import { getTelemetry } from "@/lib/simulation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTelemetry());
}
