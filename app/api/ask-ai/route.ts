import { NextRequest, NextResponse } from "next/server";

type HistoryItem = { role: "user" | "assistant"; content: string };

// Shape of a provider row from data/providers.json
type Provider = {
  provider_id: number;
  provider_name: string;
  suburb: string;
  service_categories: string[];
  phone?: string;
  email?: string;
  active?: boolean;
};

const SYSTEM_PROMPT = `
You are LifeMap's AI assistant.
You help NDIS participants and support workers understand schedules, appointments,
and general wellbeing planning. Be supportive, clear and concise.
Avoid giving medical, legal, or financial advice beyond general guidance.
When you talk about services, remind users that they should confirm details
directly with providers or official NDIS resources.
`;

/**
 * Load providers.json at build-time (bundled with the app).
 * If anything goes wrong we just fall back to an empty list.
 */
async function loadProviders(): Promise<Provider[]> {
  try {
    const mod = await import("@/data/providers.json");
    return (mod.default || mod) as Provider[];
  } catch (err) {
    console.error("[ask-ai] Failed to load providers.json:", err);
    return [];
  }
}

/**
 * Very simple ranking: providers in Melbourne whose name or service_categories
 * overlap with words in the user's question.
 */
function findRelevantProviders(
    question: string,
    providers: Provider[],
    maxResults = 6
): Provider[] {
  const q = question.toLowerCase();
  const tokens = q.split(/[^a-z0-9]+/).filter(Boolean);

  const inMelbourne = providers.filter(
      (p) => p.suburb && p.suburb.toLowerCase().includes("melbourne")
  );

  const scored = inMelbourne.map((p) => {
    const haystack = (
        p.provider_name +
        " " +
        (p.service_categories || []).join(" ")
    ).toLowerCase();

    let score = 0;
    for (const t of tokens) {
      if (haystack.includes(t)) score++;
    }

    return { p, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // If no keyword hits, just return a few Melbourne providers as generic options
  const filtered =
      scored.some((s) => s.score > 0) ? scored.filter((s) => s.score > 0) : scored;

  return filtered.slice(0, maxResults).map((x) => x.p);
}

/**
 * Format provider data as text that can be injected into the prompt.
 */
function buildProviderContext(question: string, providers: Provider[]): string {
  if (!providers.length) {
    return "";
  }

  const lines = providers.map((p) => {
    const services =
        p.service_categories && p.service_categories.length
            ? p.service_categories.join(", ")
            : "service categories not listed";

    return [
      `- ${p.provider_name} (${p.suburb || "suburb not specified"})`,
      `  Services: ${services}`,
      p.phone ? `  Phone: ${p.phone}` : "",
      p.email ? `  Email: ${p.email}` : "",
      p.active === false ? "  Note: marked as inactive in the dataset." : "",
    ]
        .filter(Boolean)
        .join("\n");
  });

  return [
    "The user may be asking about NDIS providers in Melbourne.",
    "Here is a subset of relevant providers from the local database:",
    "",
    ...lines,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message: string | undefined = body?.message;
    const history: HistoryItem[] = body?.history || [];

    if (!message || typeof message !== "string") {
      return NextResponse.json(
          { error: "Message is required" },
          { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

    // 1) If no API key, tell the user clearly
    if (!apiKey) {
      console.warn("[ask-ai] OPENAI_API_KEY not set in this environment.");
      return NextResponse.json({
        reply: buildFallbackReply(
            message,
            "I couldn't connect to the AI service because no API key is configured on the server."
        ),
      });
    }

    // 2) Load providers and build optional context
    const providers = await loadProviders();
    const relevantProviders = findRelevantProviders(message, providers);
    const providerContext = buildProviderContext(message, relevantProviders);

    // 3) Build messages for the model
    const messages: { role: "system" | "user" | "assistant"; content: string }[] =
        [
          { role: "system", content: SYSTEM_PROMPT },
        ];

    if (providerContext) {
      messages.push({
        role: "system",
        content:
            "You have access to structured data about NDIS providers in Melbourne. " +
            "Use it when the user asks about local providers or services.\n\n" +
            providerContext,
      });
    }

    // keep history reasonably short
    for (const h of history.slice(-6)) {
      messages.push(h);
    }

    messages.push({ role: "user", content: message });

    // 4) Call OpenAI Chat Completions
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("[ask-ai] OpenAI error:", response.status, text);

      return NextResponse.json({
        reply: buildFallbackReply(
            message,
            "I had trouble connecting to the AI service just now."
        ),
      });
    }

    const data = await response.json();
    const reply: string | undefined =
        data?.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({
      reply:
          reply ||
          buildFallbackReply(
              message,
              "I couldn't generate a full response just now."
          ),
    });
  } catch (err) {
    console.error("[ask-ai] Route error:", err);
    return NextResponse.json({
      reply: buildFallbackReply(
          "",
          "Something went wrong inside the Ask AI service."
      ),
    });
  }
}

/**
 * Fallback / demo reply used when there is no API key or when the OpenAI call fails.
 */
function buildFallbackReply(message: string, reason?: string): string {
  const trimmed = (message || "").trim();
  const short =
      trimmed.length > 220 ? `${trimmed.slice(0, 220).trimEnd()}…` : trimmed;

  return [
    reason || "I'm running in demo mode right now, without a live AI connection.",
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
