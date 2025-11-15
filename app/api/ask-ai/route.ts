// app/api/ask-ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body as { message?: string };

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY env var");
      return NextResponse.json(
        { error: "AI is not configured on the server." },
        { status: 500 }
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are LifeMap's assistant. You help NDIS participants and support workers with schedules, appointments, and general wellbeing guidance. Be clear and supportive, but do NOT give medical or legal advice.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.4,
      max_tokens: 400,
    });

    const reply =
      completion.choices[0]?.message?.content ?? "Sorry, I couldn't respond.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Ask AI error:", err);
    return NextResponse.json(
      { error: "Something went wrong talking to the AI." },
      { status: 500 }
    );
  }
}
