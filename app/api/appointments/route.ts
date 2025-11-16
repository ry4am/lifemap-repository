import { prismaAppointments } from '@/lib/prismaAppointments';
import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/providers.json';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ---- Provider + OpenAI setup ----

type Provider = {
  provider_id: number;
  provider_name: string;
  suburb: string;
  service_categories: string[];
  phone: string | null;
  email: string | null;
  active: boolean;
};

const providers = providersData as Provider[];

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Choose candidates by service category
function getCandidateProviders(serviceType: string) {
  const matches = providers.filter(p =>
    p.service_categories.includes(serviceType)
  );
  if (matches.length > 0) return matches;
  // Fallback: if no direct match, just return all active providers
  return providers.filter(p => p.active) || providers;
}

async function pickProviderWithAI(params: {
  title: string;
  serviceType: string;
  location: string;
}) {
  const { title, serviceType, location } = params;

  const candidates = getCandidateProviders(serviceType).slice(0, 25); // cap to 25 for prompt size

  // If for some reason we have no providers, bail out
  if (candidates.length === 0) {
    throw new Error('No providers available to choose from');
  }

  const providerSummary = candidates.map(p => ({
    provider_id: p.provider_id,
    provider_name: p.provider_name,
    suburb: p.suburb,
    service_categories: p.service_categories,
  }));

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You are helping match NDIS participants to providers. ' +
          'Given a user request and a list of candidate providers, ' +
          'choose the single most suitable provider_id. Return a JSON object like {"provider_id": 12345}.',
      },
      {
        role: 'user',
        content: JSON.stringify({
          title,
          serviceType,
          location,
          candidates: providerSummary,
        }),
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI when selecting provider');
  }

  let parsed: { provider_id?: number } = {};
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Failed to parse OpenAI provider selection');
  }

  const selectedId = parsed.provider_id;
  if (!selectedId) {
    throw new Error('OpenAI did not return a provider_id');
  }

  const selected = candidates.find(p => p.provider_id === selectedId);
  return selected ?? candidates[0];
}

// ---- API handlers ----

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { title, serviceType, date, time, location } = body;

    if (!serviceType || !date || !time) {
      return NextResponse.json(
        { ok: false, error: 'Missing required appointment fields' },
        { status: 400 }
      );
    }

    // Ask AI to pick the best provider
    const provider = await pickProviderWithAI({
      title: title || '',
      serviceType,
      location: location || '',
    });

    const service = serviceType;
    const day = date; 
    const suburb = location || provider.suburb || '';
    const state = 'VIC'; 

    const provider_id = String(provider.provider_id);
    const provider_name = provider.provider_name;

    const appointment = await prismaAppointments.appointment.create({
      data: {
        service,
        suburb,
        day,
        time,          
        provider_id,
        provider_name,
        state,
      },
    });

    return NextResponse.json({ ok: true, appointment }, { status: 201 });
  } catch (e: any) {
    console.error('appointments POST error:', e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Server error' },
      { status: 500 }
    );
  }
}

// GET /api/appointments  -> list recent appointments
export async function GET() {
  try {
    const appointments = await prismaAppointments.appointment.findMany({
      orderBy: { created_at: 'desc' },
      take: 100,
    });

    return NextResponse.json(appointments);
  } catch (e: any) {
    console.error('appointments GET error:', e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
