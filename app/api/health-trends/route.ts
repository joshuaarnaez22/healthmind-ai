import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { deepseek } from '@/lib/ai';
import { getUserId } from '@/actions/server-actions/user';
import redis from '@/lib/upstash';
import { prisma } from '@/lib/client';
import { healthTrendsSchema } from '@/lib/ai-object-schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userId = await getUserId();
    const cacheKey = `health-trends:${userId}`;

    const cached = await redis.get(cacheKey);
    if (cached) return NextResponse.json({ data: cached });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [bpLogs, glucoseLogs] = await Promise.all([
      prisma.bloodPressureLog.findMany({
        where: { userId, loggedAt: { gte: thirtyDaysAgo } },
        select: { systolic: true, diastolic: true, loggedAt: true },
        orderBy: { loggedAt: 'asc' },
        take: 30,
      }),
      prisma.glucoseLog.findMany({
        where: { userId, loggedAt: { gte: thirtyDaysAgo } },
        select: { glucose: true, loggedAt: true },
        orderBy: { loggedAt: 'asc' },
        take: 30,
      }),
    ]);

    if (bpLogs.length === 0 && glucoseLogs.length === 0) {
      return NextResponse.json({ data: null, message: 'No health data found' });
    }

    const prompt = `You are a clinical health analyst reviewing a patient's recent vitals. Analyze the following data and identify trends, improvements, deteriorations, and anything requiring medical attention. Be factual and concise. Always include a reminder that findings are informational only and not a substitute for professional medical advice.

Blood pressure readings (last 30 days):
${JSON.stringify(bpLogs, null, 2)}

Glucose readings (last 30 days):
${JSON.stringify(glucoseLogs, null, 2)}`;

    const { object } = await generateObject({
      model: deepseek(),
      schema: healthTrendsSchema,
      prompt,
    });

    await redis.setex(cacheKey, 86400, object);
    return NextResponse.json({ data: object });
  } catch (error) {
    console.error('health-trends error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
