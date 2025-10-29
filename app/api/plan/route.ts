import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import * as fs from "node:fs";
import * as path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Provider = {
  provider_id: number;
  provider_name: string;
  suburb: string;
  service_categories: string[];
  phone?: string | null;
  email?: string | null;
  active?: boolean;
};

function getProviders(): Provider[] {
  const p = path.join(process.cwd(), "data", "providers.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw) as Provider[];
}

function searchProviders(
  all: Provider[],
  { suburb, services }: { suburb?: string; services: string[] }
): Provider[] {
  const svcSet = new Set((services ?? []).map((s) => s.toLowerCase()));
  return all
    .filter((p) => p.active ?? true)
    .filter((p) => {
      const sub = typeof p.suburb === "string" ? p.suburb : "";
      const cats = Array.isArray(p.service_categories) ? p.service_categories : [];
      const suburbOk = suburb ? sub.toLowerCase().includes(suburb.toLowerCase()) : true;
      const hasAnyService =
        svcSet.size === 0 || cats.some((c) => svcSet.has(String(c).toLowerCase()));
      return suburbOk && hasAnyService;
    })
    .slice(0, 5);
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    // Ask the model to extract a structured plan
    const prompt = `
You are an NDIS appointment planner.
Extract strict JSON from this text: "${message}"
Return exactly this shape (no commentary):
{
  "service": string,   // e.g., "Speech Therapy", "Support Worker", "Psychology"
  "suburb": string,    // e.g., "Epping"
  "day": string,       // e.g., "Thursday" or ISO date if provided
  "time": string       // e.g., "2pm", "morning", "after school"
}
`;

    const out = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        { role: "system", content: "Output only valid JSON. No commentary." },
        { role: "user", content: prompt }
      ]
    });

    const json = out.choices?.[0]?.message?.content?.trim() || "{}";
    let parsed: { service?: string; suburb?: string; day?: string; time?: string };
    try {
      parsed = JSON.parse(json);
    } catch {
      parsed = {};
    }

    const providers = searchProviders(getProviders(), {
      suburb: parsed.suburb,
      services: [parsed.service || ""].filter(Boolean)
    });

    return NextResponse.json({
      state: "draft",
      service: parsed.service || "",
      suburb: parsed.suburb || "",
      day: parsed.day || "",
      time: parsed.time || "",
      suggestedProviders: providers
    });
  } catch (e: any) {
    console.error("plan error:", e);
    return NextResponse.json({ error: "AI planning failed" }, { status: 500 });
  }
}
