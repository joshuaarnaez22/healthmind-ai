import { prisma } from '@/lib/client';
import type { SubscriptionTier } from '@prisma/client';

export async function startTherapyUsage({
  userId,
  tier,
  openingBalance,
}: {
  userId: string;
  tier: SubscriptionTier;
  openingBalance: number;
}) {
  return prisma.aiTherapyUsage.create({
    data: {
      userId,
      tier,
      openingBalance: Math.max(0, openingBalance),
    },
    select: { id: true, startedAt: true, openingBalance: true },
  });
}

export async function touchTherapyUsage({
  usageId,
  userId,
  durationSeconds,
  tokensDebited,
}: {
  usageId: string;
  userId: string;
  durationSeconds: number;
  tokensDebited: number;
}) {
  const existing = await prisma.aiTherapyUsage.findFirst({
    where: { id: usageId, userId, endedAt: null },
    select: { id: true, tokensConsumed: true },
  });
  if (!existing) return null;

  return prisma.aiTherapyUsage.update({
    where: { id: usageId },
    data: {
      durationSeconds: Math.max(0, durationSeconds),
      ...(tokensDebited > 0
        ? { tokensConsumed: { increment: tokensDebited } }
        : {}),
    },
    select: {
      id: true,
      tokensConsumed: true,
      durationSeconds: true,
      openingBalance: true,
    },
  });
}

export async function endTherapyUsage({
  usageId,
  userId,
  durationSeconds,
  endReason,
}: {
  usageId: string;
  userId: string;
  durationSeconds: number;
  endReason?: string | null;
}) {
  const existing = await prisma.aiTherapyUsage.findFirst({
    where: { id: usageId, userId },
    select: { id: true, endedAt: true },
  });
  if (!existing || existing.endedAt) return null;

  return prisma.aiTherapyUsage.update({
    where: { id: usageId },
    data: {
      endedAt: new Date(),
      durationSeconds: Math.max(0, durationSeconds),
      endReason: endReason ?? null,
    },
    select: {
      id: true,
      durationSeconds: true,
      tokensConsumed: true,
      openingBalance: true,
      endReason: true,
    },
  });
}
