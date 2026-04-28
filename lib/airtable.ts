const API_KEY = process.env.AIRTABLE_API_KEY!;
const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const TABLE = "Subscribers";
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE}`;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

export async function createRecord(data: {
  name: string;
  email: string;
}): Promise<string> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      fields: {
        Name: data.name,
        Email: data.email,
        Status: "take_quiz",
        PrizeWon: "",
        CreatedAt: new Date().toISOString(),
      },
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || "Airtable create failed");
  return json.id;
}

export async function updateRecord(
  recordId: string,
  fields: Record<string, unknown>
): Promise<void> {
  console.log(`Updating record ${recordId} with fields:`, fields);
  const res = await fetch(`${BASE_URL}/${recordId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error?.message || "Airtable update failed");
  }
}

export async function getRecord(recordId: string) {
  const res = await fetch(`${BASE_URL}/${recordId}`, { headers });
  if (!res.ok) throw new Error("Record not found");
  return res.json();
}


export async function findByEmail(email: string) {
  const formula = encodeURIComponent(`{Email} = "${email}"`);
  const res = await fetch(`${BASE_URL}?filterByFormula=${formula}&maxRecords=1`, {
    headers,
  });
  const json = await res.json();
  if (json.records?.length === 0) return null;
  return { id: json.records[0].id, ...json.records[0].fields };
}