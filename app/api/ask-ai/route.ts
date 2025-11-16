import { NextRequest, NextResponse } from "next/server";

import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  
});


const SYSTEM_PROMPT = `
You are LifeMap's AI assistant.
You help NDIS participants and support workers understand schedules, appointments,
and general wellbeing planning. Be supportive, clear and concise.
Avoid giving medical, legal, or financial advice beyond general guidance.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message: string | undefined = body?.message;
    const history: { role: "user" | "assistant"; content: string }[] = body?.history || [];

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

    // If no API key is configured, fall back to a simple demo response
    // so the chatbot still replies instead of failing.
    if (!apiKey) {
      console.warn("[ask-ai] OPENAI_API_KEY not set; returning demo reply.");
      return NextResponse.json({ reply: buildFallbackReply(message) });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          // keep history short
          ...history.slice(-6),
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("OpenAI error:", response.status, text);
      return NextResponse.json({ reply: buildFallbackReply(message) });
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn’t generate a response just now.";

    return NextResponse.json({
      reply:
        reply || "Sorry, I couldn't generate a response just now.",
    });
  } catch (err) {
    console.error("ask-ai route error:", err);
    // On unexpected errors, still return a graceful fallback reply
    // so the UI always shows some assistant response.
    return NextResponse.json({
      reply: buildFallbackReply(""),
    });
  }
}

function buildFallbackReply(message: string): string {
  const trimmed = (message || "").trim();
  const short =
    trimmed.length > 220 ? `${trimmed.slice(0, 220).trimEnd()}…` : trimmed;

  return [
    "I'm running in demo mode right now, without a live AI connection.",
    trimmed ? "" : undefined,
    trimmed ? "Based on what you asked:" : undefined,
    trimmed ? `"${short}"` : undefined,
    "",
    "Here are some next steps you could consider:",
    "- Clarify what support or outcome you want.",
    "- Check your upcoming appointments in the Calendar.",
    "- If this is urgent or medical, contact a qualified professional.",
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}
