import { NextRequest, NextResponse } from "next/server";
import { getRecord, updateRecord } from "@/lib/airtable";
import { PRIZES } from "@/lib/prizes";

export async function GET(req: NextRequest) {
  const recordId = req.nextUrl.searchParams.get("recordId");
  if (!recordId) return NextResponse.json({ error: "recordId required" }, { status: 400 });
  const record = await getRecord(recordId);
  return NextResponse.json({ status: record.fields.Status });
}

export async function POST(req: NextRequest) {
  const { recordId } = await req.json();
  if (!recordId) return NextResponse.json({ error: "recordId required" }, { status: 400 });
  
  const record = await getRecord(recordId);
  const status = record.fields.Status;
  const prizeName = record.fields.PrizeWon;
  const prize = PRIZES.find((p) => p.label === prizeName) ?? null;

  return NextResponse.json({ status, prize });
}

export async function PATCH(req: NextRequest) {
  const { recordId, status } = await req.json();
  if (!recordId || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  await updateRecord(recordId, { Status: status });
  return NextResponse.json({ ok: true });
}