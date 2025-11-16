import { prismaAppointments } from '@/lib/prismaAppointments';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      serviceType,
      date,
      time,
      location,
      providerId,
      providerName,
    } = body;

    if (!serviceType || !date || !time || !providerId) {
      return NextResponse.json(
        { ok: false, error: 'Missing required appointment fields' },
        { status: 400 }
      );
    }

    const service = serviceType;
    const day = date;
    const suburb = location || '';
    const state = 'VIC';

    const provider_id = String(providerId);
    const provider_name =
      providerName || title || serviceType || 'Appointment';

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
