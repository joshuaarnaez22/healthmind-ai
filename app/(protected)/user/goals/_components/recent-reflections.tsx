'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EmotionBadge from './emotion-badge';
import { formatDistanceToNow } from 'date-fns';
import { CheckIn } from '@/lib/types';

interface RecentReflectionsProps {
  recentCheckIns: (CheckIn & { title: string })[];
}

export default function RecentReflections({
  recentCheckIns,
}: RecentReflectionsProps) {
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
      {recentCheckIns.map((checkIn) => (
        <div key={checkIn.id} className="flex gap-3 rounded-lg border p-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{checkIn.title}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(checkIn.completedAt), {
                  addSuffix: true,
                })}
              </span>
              <EmotionBadge emotion={checkIn.actualEmotion} />
            </div>
            {checkIn.reflection ? (
              <p className="text-sm text-muted-foreground">
                {checkIn.reflection}
              </p>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                No reflection added
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
