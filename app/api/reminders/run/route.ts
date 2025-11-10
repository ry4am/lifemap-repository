import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

/**
 * In production, query your DB for appointments where reminder_time is in the past N minutes.
 * For demo, we’ll send a single mock reminder.
 */
export async function GET() {
  try {
    const from = process.env.EMAIL_FROM || 'LifeMap <noreply@example.com>';

    // TODO: replace with DB lookup logic
    const due = [{
      to: 'your-email@example.com',
      subject: 'Appointment Reminder',
      html: `<p>Hi Ryan, this is your reminder for Speech Therapy with BetterHealth at <strong>5:30 PM</strong>.</p>`
    }];

    for (const m of due) {
      await sgMail.send({ to: m.to, from, subject: m.subject, html: m.html });
    }

    return NextResponse.json({ sent: due.length });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message ?? 'failed' }, { status: 500 });
  }
}
