'use server';

import { prisma } from '@/lib/client';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/** For Server Components / server actions — redirects to sign-in when unauthenticated. */
export const getUserId = async () => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkId },
    select: { id: true },
  });

  if (!user) {
    redirect('/sign-in');
  }

  return user.id;
};

/**
 * For API route handlers — never redirects (redirect inside try/catch becomes a 500).
 * Returns the internal user id, or null if unauthenticated / missing DB user.
 */
export async function getApiUserId(): Promise<string | null> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkId },
    select: { id: true },
  });

  return user?.id ?? null;
}
