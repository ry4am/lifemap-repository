import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      service,
      suburb,
      day,
      time,
      provider_id,
      provider_name,
      state = "confirmed"
    } = body || {};

    if (!service) return NextResponse.json({ ok: false, error: "service required" }, { status: 400 });

    const inserted = await sql`
      INSERT INTO appointments (service, suburb, day, time, provider_id, provider_name, state)
      VALUES (${service}, ${suburb}, ${day}, ${time}, ${provider_id}, ${provider_name}, ${state})
      RETURNING *;
    `;

    return NextResponse.json({ ok: true, appointment: inserted.rows[0] });
  } catch (e: any) {
    console.error("appointments POST error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// GET /api/appointments 
export async function GET() {
  try {
    const res = await sql`SELECT * FROM appointments ORDER BY created_at DESC LIMIT 100;`;
    return NextResponse.json(res.rows);
  } catch (e: any) {
    console.error("appointments GET error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
