// lib/prismaAppointments.ts
// Client for the appointments DB (generated from prisma/appointments.schema.prisma)

import { PrismaClient } from "../prisma/generated/appointments";

const globalForPrismaAppointments = globalThis as unknown as {
  prismaAppointments?: PrismaClient;
};

export const prismaAppointments =
  globalForPrismaAppointments.prismaAppointments ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrismaAppointments.prismaAppointments = prismaAppointments;
}
