'use server';

import { prisma } from '@/lib/client';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const getUserId = async () => {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      redirect('/sign-in');
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkId },
      select: { id: true },
    });

    console.log({ user });

    if (!user) {
      redirect('/sign-in');
    }

    return user.id;
  } catch (error) {
    console.error('Error in getUserId:', error);
    redirect('/sign-in');
  }
};
