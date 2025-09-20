import { getUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const userId = await getUserId();
    const goals = await prisma.goal.findMany({
      where: {
        userId,
      },
      include: {
        checkIns: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const durationMap = {
      ONE_WEEK: '1-week',
      TWO_WEEKS: '2-weeks',
      ONE_MONTH: '1-month',
    };
    const goalsData = goals.map((goal) => {
      const progress = Math.min(
        Math.round((goal.completedCount / goal.targetCount) * 100),
        100
      );

      return {
        id: goal.id,
        title: goal.title,
        emotion: goal.emotion,
        frequency: goal.frequency,
        targetCount: goal.targetCount,
        completedCount: goal.completedCount,
        duration: durationMap[goal.duration],
        progress,
        status: goal.isCompleted ? 'completed' : 'active',
      };
    });
    console.log(goalsData);

    return NextResponse.json({ goalsData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
