import { prismaAppointments } from '@/lib/prismaAppointments';
import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/providers.json';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Provider type
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

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Choose candidates by service type
function getCandidateProviders(serviceType: string) {
  const matches = providers.filter(p =>
    p.service_categories.includes(serviceType)
  );

  return matches.length ? matches : providers.filter(p => p.active);
}

// AI picks provider
async function pickProviderWithAI(params: {
  title: string;
  serviceType: string;
  location: string;
}) {
  const { title, serviceType, location } = params;

  const candidates = getCandidateProviders(serviceType).slice(0, 25);

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
          'Choose the single best provider_id from the list based on relevance. Return JSON like {"provider_id": 123}.',
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

  let parsed = {};
  try {
    parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
  } catch (e) {
    console.error("AI provider selection parse error:", e);
  }

  const selectedId = (parsed as any).provider_id;
  const selected = candidates.find(p => p.provider_id === selectedId);

  return selected ?? candidates[0];
}

// POST — Create appointment (NO EMAIL)
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

    // AI chooses provider
    const provider = await pickProviderWithAI({
      title: title || '',
      serviceType,
      location: location || '',
    });

    // Save appointment
    const appointment = await prismaAppointments.appointment.create({
      data: {
        service: serviceType,
        suburb: location || provider.suburb || '',
        day: date,
        time,
        provider_id: String(provider.provider_id),
        provider_name: provider.provider_name,
        state: 'VIC',
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

// GET — List appointments
export async function GET() {
  try {
    const appointments = await prismaAppointments.appointment.findMany({
      orderBy: { created_at: 'desc' },
      take: 100,
    });

    return NextResponse.json(appointments);
  } catch (e: any) {
    console.error("appointments GET error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
