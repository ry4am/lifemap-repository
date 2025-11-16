import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import OpenAI from 'openai';
import sgMail from '@sendgrid/mail';

import { prismaAppointments } from '@/lib/prismaAppointments';
import providersData from '@/data/providers.json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ---------- Types & data ----------

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

// ---------- SendGrid setup ----------

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const sendgridFrom = process.env.SENDGRID_FROM_EMAIL;

if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
} else {
  console.warn('SENDGRID_API_KEY is not set – appointment emails will not be sent.');
}

// ---------- Helpers ----------

// Filter providers by service type
function getCandidateProviders(serviceType: string) {
  const matches = providers.filter(p =>
    p.service_categories.includes(serviceType)
  );

  return matches.length ? matches : providers.filter(p => p.active);
}

// Ask OpenAI to choose the best provider
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

  const content = completion.choices[0]?.message?.content || '{}';

  let parsed: { provider_id?: number } = {};
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    console.error('AI provider selection parse error:', e, content);
  }

  const selectedId = parsed.provider_id;
  const selected = candidates.find(p => p.provider_id === selectedId);
  return selected ?? candidates[0];
}

// ---------- POST /api/appointments ----------
// Creates appointment, AI picks provider, SendGrid emails NextAuth user

export async function POST(req: NextRequest) {
  try {
    // 1) Get current session via NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { ok: false, error: 'Not authenticated or email missing from session' },
        { status: 401 }
      );
    }

    const recipientEmail = session.user.email;
    const recipientName = session.user.name || '';

    // 2) Read appointment data from request body
    const body = await req.json();
    const { title, serviceType, date, time, location } = body;

    if (!serviceType || !date || !time) {
      return NextResponse.json(
        { ok: false, error: 'Missing required appointment fields' },
        { status: 400 }
      );
    }

    // 3) AI chooses provider
    const provider = await pickProviderWithAI({
      title: title || '',
      serviceType,
      location: location || '',
    });

    // 4) Save appointment in appointments DB
    const appointment = await prismaAppointments.appointment.create({
      data: {
        service: serviceType,
        suburb: location || provider.suburb || '',
        day: date,                 // "YYYY-MM-DD"
        time,                      // "HH:MM" 24h
        provider_id: String(provider.provider_id),
        provider_name: provider.provider_name,
        state: 'VIC',
      },
    });

    // 5) Send confirmation email to the logged-in user
    let emailStatus: string | null = null;

    if (sendgridApiKey && sendgridFrom) {
      try {
        const msg = {
          to: recipientEmail,
          from: sendgridFrom,
          subject: 'Your LifeMap appointment has been booked',
          html: `
            <h2>Appointment Confirmed</h2>
            <p>Hi ${recipientName ? recipientName + ',' : ''}</p>
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
        };

        const result = await sgMail.send(msg);
        console.log('SendGrid result:', result);
        emailStatus = 'sent';
      } catch (err: any) {
        console.error('SendGrid email error:', err);
        emailStatus = `error: ${err?.message || 'unknown'}`;
      }
    } else {
      console.warn('SendGrid not configured (missing API key or FROM email).');
      emailStatus = 'not-configured';
    }

    return NextResponse.json(
      { ok: true, appointment, emailStatus },
      { status: 201 }
    );
  } catch (e: any) {
    console.error('appointments POST error:', e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Server error' },
      { status: 500 }
    );
  }
}

// ---------- GET /api/appointments ----------

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
