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
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set on the server" },
        { status: 500 }
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

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
      return NextResponse.json(
        { error: "Failed to get a response from the AI service." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn’t generate a response just now.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("ask-ai route error:", err);
    return NextResponse.json(
      { error: "Unexpected server error in ask-ai route." },
      { status: 500 }
    );
  }
}
