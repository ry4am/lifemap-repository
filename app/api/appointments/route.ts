import { prismaAppointments } from '@/lib/prismaAppointments';
import { NextRequest, NextResponse } from 'next/server';
import providersData from '@/data/providers.json';
import OpenAI from 'openai';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const resend = new Resend(process.env.RESEND_API_KEY!);

// -------------------------------------------------------
// Helper: choose candidate providers
// -------------------------------------------------------
function getCandidateProviders(serviceType: string) {
  const matches = providers.filter(p =>
    p.service_categories.includes(serviceType)
  );
  return matches.length ? matches : providers.filter(p => p.active);
}

// -------------------------------------------------------
// Helper: AI picks provider
// -------------------------------------------------------
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
          'Choose the single best provider_id from the list based on relevance. Return JSON: {"provider_id": 123}.'
      },
      {
        role: 'user',
        content: JSON.stringify({
          title,
          serviceType,
          location,
          candidates: providerSummary,
        }),
      }
    ],
  });

  let parsed: { provider_id?: number } = {};
  parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');

  const selected = candidates.find(p => p.provider_id === parsed.provider_id);
  return selected ?? candidates[0];
}

// -------------------------------------------------------
// POST /api/appointments
// -------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, serviceType, date, time, location, email } = body;

    if (!serviceType || !date || !time) {
      return NextResponse.json(
        { ok: false, error: 'Missing required appointment fields' },
        { status: 400 }
      );
    }

    // 1. AI picks provider
    const provider = await pickProviderWithAI({
      title: title || '',
      serviceType,
      location: location || '',
    });

    // 2. Save appointment
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

    // 3. Send confirmation email using Resend
    if (email) {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: `Your appointment has been booked`,
        html: `
          <h2>Appointment Confirmed</h2>
          <p>Hello,</p>
          <p>Your appointment has been successfully booked.</p>

          <h3>Details</h3>
          <p><strong>Service:</strong> ${serviceType}</p>
          <p><strong>Provider:</strong> ${provider.provider_name}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Location:</strong> ${location || 'Not specified'}</p>

          <br />
          <p>Thank you for using LifeMap ❤️</p>
        `,
      });
    }

    return NextResponse.json({ ok: true, appointment }, { status: 201 });

  } catch (e: any) {
    console.error('appointments POST error:', e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Server error' },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------
// GET /api/appointments
// -------------------------------------------------------
export async function GET() {
  try {
    const appointments = await prismaAppointments.appointment.findMany({
      orderBy: { created_at: 'desc' },
      take: 100,
    });

    return NextResponse.json(appointments);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
