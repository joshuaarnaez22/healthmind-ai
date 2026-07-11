import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function hasTherapyUsageDelegate(client: PrismaClient): boolean {
  const delegate = (
    client as PrismaClient & {
      aiTherapyUsage?: { create?: unknown };
    }
  ).aiTherapyUsage;
  return typeof delegate?.create === 'function';
}

function createPrismaClient() {
  return new PrismaClient();
}

function getPrisma(): PrismaClient {
  const existing = globalForPrisma.prisma;
  if (existing && hasTherapyUsageDelegate(existing)) {
    return existing;
  }

  // Drop stale HMR singleton (Proxy makes `in` checks unreliable)
  if (existing) {
    void existing.$disconnect().catch(() => undefined);
  }

  const client = createPrismaClient();
  if (!hasTherapyUsageDelegate(client)) {
    throw new Error(
      'Prisma client is missing aiTherapyUsage. Run: npx prisma generate && restart the dev server.'
    );
  }

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = getPrisma();
