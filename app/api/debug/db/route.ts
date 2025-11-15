import { NextResponse } from "next/server";
import { prismaAppointments } from '@/lib/prismaAppointments';

export async function GET() {
  const count = await prisma.user.count();
  return NextResponse.json({ ok: true, users: count });
}
