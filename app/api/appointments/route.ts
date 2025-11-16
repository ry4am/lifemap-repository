import { prismaAppointments } from '@/lib/prismaAppointments';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/appointments  -> create an appointment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 👇 match what page.tsx sends
    const { title, serviceType, dateTime, location } = body;

    // Basic validation
    if (!serviceType || !dateTime || !location) {
      return NextResponse.json(
        { ok: false, error: 'Missing required appointment fields' },
        { status: 400 }
      );
    }

    // Parse ISO date-time string
    const dt = new Date(dateTime);
    if (Number.isNaN(dt.getTime())) {
      return NextResponse.json(
        { ok: false, error: 'Invalid date/time value' },
        { status: 400 }
      );
    }

    // Map into your Appointment columns
    const service = serviceType;
    const day = dt.toISOString().slice(0, 10);    // "YYYY-MM-DD"
    const time = dt.toISOString().slice(11, 16);  // "HH:MM"
    const suburb = location;
    const state = 'VIC';

    // Prisma expects strings, so use empty strings instead of nulls
    const provider_id = ''; // or some default ID logic if you add providers later
    const provider_name = title || serviceType || 'Appointment';

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
