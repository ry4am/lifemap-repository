import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import OpenAI from 'openai';
import sgMail from '@sendgrid/mail';

import { prismaAppointments } from '@/lib/prismaAppointments';
import providersData from '@/data/providers.json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ------------------------------
// Types
// ------------------------------

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

// ------------------------------
// SendGrid setup
// ------------------------------

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const sendgridFrom = process.env.SENDGRID_FROM_EMAIL;

if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
} else {
  console.warn('SENDGRID_API_KEY is not set – appointment emails will not be sent.');
}

// ------------------------------
// Helper: get providers by category
// ------------------------------

function getCandidateProviders(serviceType: string) {
  const matches = providers.filter(p =>
    p.service_categories.includes(serviceType)
  );


  return matches.length ? matches : providers.filter(p => p.active);
}

// ------------------------------
// Helper: AI provider selection
// ------------------------------

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
          'Pick the best provider based on the service type and location. Only return JSON like {"provider_id": 123}.'
      },
      {
        role: 'user',
        content: JSON.stringify({
          title,
          serviceType,
          location,
          candidates: providerSummary
        })
      }
    ],
  });

  const content = completion.choices[0]?.message?.content || '{}';

  let parsed: { provider_id?: number } = {};
  try {
    parsed = JSON.parse(content);
  } catch {
    console.error('AI provider selection JSON error:', content);
  }

  const selected = candidates.find(p => p.provider_id === parsed.provider_id);
  return selected ?? candidates[0];
}

// ------------------------------
// POST /api/appointments
// ------------------------------

export async function POST(req: NextRequest) {
  try {
    // Validate session
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { ok: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const userName = session.user.name || '';

    // Parse body
    const body = await req.json();
    const { title, serviceType, date, time, location } = body;

    if (!serviceType || !date || !time) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // AI selects provider
    const provider = await pickProviderWithAI({
      title: title || '',
      serviceType,
      location: location || ''
    });

    // Create appointment and assign to user
    const appointment = await prismaAppointments.appointment.create({
      data: {
        service: serviceType,
        suburb: location || provider.suburb || '',
        day: date,
        time,
        provider_id: String(provider.provider_id),
        provider_name: provider.provider_name,
        state: 'VIC',
        user_email: userEmail   
      },
    });

    // ------------------------------
    // Send Confirmation Email
    // ------------------------------

    let emailStatus: string | null = null;

    if (sendgridApiKey && sendgridFrom) {
      try {
        const msg = {
          to: userEmail,
          from: sendgridFrom,
          subject: `Your LifeMap Appointment (${serviceType})`,
          html: `
            <h2>Your appointment is booked!</h2>
            <p>Hi ${userName || ''},</p>
            <p>Your appointment has been successfully scheduled.</p>

            <h3>Appointment Details</h3>
            <p><strong>Service:</strong> ${serviceType}</p>
            <p><strong>Provider:</strong> ${provider.provider_name}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Location:</strong> ${location || 'Not specified'}</p>

            <br />
            <p>Thank you for using LifeMap ❤️</p>
          `,
        };

        await sgMail.send(msg);
        emailStatus = 'sent';
      } catch (err: any) {
        console.error('SendGrid error:', err);
        emailStatus = 'error';
      }
    } else {
      emailStatus = 'not-configured';
    }

    return NextResponse.json(
      { ok: true, appointment, emailStatus },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('POST /appointments error:', err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}

// ------------------------------
// GET /api/appointments
// ------------------------------

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { ok: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const email = session.user.email;

    const appointments = await prismaAppointments.appointment.findMany({
      where: {
        user_email: email,    //Only appointments booked by this user
      },
      orderBy: { created_at: 'desc' },
      take: 100,
    });

    return NextResponse.json(appointments);
  } catch (err: any) {
    console.error('GET /appointments error:', err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
