import { NextRequest, NextResponse } from "next/server";
import { updateRecord, getRecord } from "@/lib/airtable";
import { PRIZES, getWeightedPrizeIndex } from "@/lib/prizes";

export async function POST(req: NextRequest) {
  try {
    const { recordId } = await req.json();
    if (!recordId) {
      return NextResponse.json({ error: "recordId required" }, { status: 400 });
    }

    // Tamper check: only passed_pending records can spin
    const record = await getRecord(recordId);
    if (record.fields.Status !== "passed_pending") {
      return NextResponse.json(
        { error: "Invalid state — spin already used or quiz not passed" },
        { status: 400 }
      );
    }

    const prizeIndex = getWeightedPrizeIndex();
    const prize = PRIZES[prizeIndex];

    await updateRecord(recordId, {
      Status: "passed_completed",
      PrizeWon: prize.label,
    });

    return NextResponse.json({ prizeIndex, prize });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
