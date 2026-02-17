import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Standard Prisma Client (v5)
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
