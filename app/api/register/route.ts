import { NextRequest, NextResponse } from "next/server";
import { createRecord, findByEmail } from "@/lib/airtable";

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const existing = await findByEmail(email.trim());
    if (existing) {
      return NextResponse.json(
        {
          error: "Already registered",
          recordId: existing.id,
          name: existing.Name,
          status: existing.Status,
        },
        { status: 409 }
      );
    }

    const recordId = await createRecord({ name: name.trim(), email: email.trim() });
    return NextResponse.json({ recordId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}