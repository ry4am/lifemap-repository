import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { to, subject, text, html } = await req.json();

    if (!to || !subject || (!text && !html)) {
      return NextResponse.json({ error: 'Missing to/subject/body' }, { status: 400 });
    }

    const from = process.env.EMAIL_FROM || 'LifeMap <noreply@example.com>';

    await sgMail.send({
      to,
      from,
      subject,
      text: text || undefined,
      html: html || undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message ?? 'Send failed' }, { status: 500 });
  }
}
