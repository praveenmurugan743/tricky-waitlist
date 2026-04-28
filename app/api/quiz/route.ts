import { NextRequest, NextResponse } from "next/server";
import { updateRecord } from "@/lib/airtable";

// Correct answer IDs for each question (1-indexed)
const CORRECT_ANSWERS: Record<number, string> = {
  1: "b", // Light and neutral tones
  2: "b", // 60-30-10 = dominant/secondary/accent
  3: "c", // Use closed cabinets with concealed wiring and minimal open shelves
};

const STATUS_MAP: Record<number, string> = {
  1: "mcq_completed_1",
  2: "mcq_completed_2",
  3: "passed_pending",
};

export async function POST(req: NextRequest) {
  try {
    const { recordId, questionNumber, answer } = await req.json();

    if (!recordId || !questionNumber || !answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const qNum = Number(questionNumber);
    const isCorrect = CORRECT_ANSWERS[qNum] === answer.toLowerCase();

    if (!isCorrect) {
      await updateRecord(recordId, { Status: "failed"});
      return NextResponse.json({ correct: false, status: "failed" });
    }

    await updateRecord(recordId, {
      Status: STATUS_MAP[qNum]
    });

    return NextResponse.json({
      correct: true,
      status: STATUS_MAP[qNum],
      passed: qNum === 3
    });
  } catch (err: any) {
    console.error("Error processing quiz answer:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
