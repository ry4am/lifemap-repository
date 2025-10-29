import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { getProviders, searchProviders } from "@/lib/providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const prompt = `
You are an NDIS appointment planner.
Extract structured JSON from: "${message}"
Return exactly:
{
  "service": string,
  "suburb": string,
  "day": string,
  "time": string
}
`;

  const result = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      { role: "system", content: "Output only valid JSON, no commentary." },
      { role: "user", content: prompt },
    ],
  });

  const text = result.choices?.[0]?.message?.content?.trim() || "{}";
  const parsed = JSON.parse(text);

  const providers = searchProviders(getProviders(), {
    suburb: parsed.suburb,
    services: [parsed.service],
  });

  return NextResponse.json({
    state: "draft",
    service: parsed.service,
    suburb: parsed.suburb,
    day: parsed.day,
    time: parsed.time,
    suggestedProviders: providers.slice(0, 5),
  });
}
