import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { service, suburb, day, time, provider_id, provider_name, state = "confirmed" } = req.body || {};
      if (!service) return res.status(400).json({ ok: false, error: "service required" });

      const inserted = await sql`
        INSERT INTO appointments (service, suburb, day, time, provider_id, provider_name, state)
        VALUES (${service}, ${suburb}, ${day}, ${time}, ${provider_id}, ${provider_name}, ${state})
        RETURNING *;
      `;
      return res.status(200).json({ ok: true, appointment: inserted.rows[0] });
    }

    if (req.method === "GET") {
      const rows = await sql`SELECT * FROM appointments ORDER BY created_at DESC LIMIT 100;`;
      return res.status(200).json(rows.rows);
    }

    return res.status(405).json({ ok: false, error: "Method not allowed" });
  } catch (e: any) {
    console.error("appointments api error:", e);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
