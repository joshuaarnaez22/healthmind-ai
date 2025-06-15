'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EmotionBadge from './emotion-badge';
import { goals } from '@/data/goals';

export default function RecentReflections() {
  const allCheckIns = goals.flatMap((goal) => goal.checkIns);
  const recentCheckIns = allCheckIns
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
    .slice(0, 5);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (recentCheckIns.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          No reflections yet. Complete a goal check-in to see your reflections
          here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentCheckIns.map((checkIn) => {
        const goal = goals.find((g) => g.id === checkIn.goalId);
        if (!goal) return null;

        return (
          <div key={checkIn.id} className="flex gap-3 rounded-lg border p-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{goal.title}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(checkIn.completedAt)}
                </span>
                <EmotionBadge emotion={checkIn.actualEmotion} />
              </div>
              {checkIn.reflection && (
                <p className="text-sm text-muted-foreground">
                  {checkIn.reflection}
                </p>
              )}
              {!checkIn.reflection && (
                <p className="text-sm italic text-muted-foreground">
                  No reflection added
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
