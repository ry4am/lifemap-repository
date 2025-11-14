import { PrismaClient as AppointmentsClient } from '../generated/appointments';

const globalForApt = global as unknown as { prismaAppointments?: AppointmentsClient };

export const prismaAppointments =
  globalForApt.prismaAppointments ??
  new AppointmentsClient({ log: ['error', 'warn'] });

if (process.env.NODE_ENV !== 'production') globalForApt.prismaAppointments = prismaAppointments;
