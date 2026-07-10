import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import EmotionBadge from './emotion-badge';
import GoalDetailsModal from './goal-details-modal';
import { Goal } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  id: string;
  title: string;
  emotion: string;
  progress: number;
  daysLeft: number;
  completed: number;
  total: number;
  goal: Goal;
}

export default function GoalCard({
  id,
  title,
  emotion,
  progress,
  daysLeft,
  completed,
  total,
  goal,
}: GoalCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/80 bg-card">
      <div className="h-1.5 bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3
            className={cn(
              'font-medium text-foreground',
              progress === 100 && 'text-muted-foreground line-through'
            )}
          >
            {title}
          </h3>
          <EmotionBadge emotion={emotion} />
        </div>

        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <CheckCircle className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">{completed}</span>/
            {total} completed
          </div>
          <Progress value={progress} className="h-2 w-16" />
        </div>
      </div>
      <div className="flex justify-between px-2 pb-2 pt-0">
        {progress < 100 ? (
          <Link href={`/user/goals/check-in/${id}`}>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              Check-in
            </Button>
          </Link>
        ) : (
          <p className="p-2 text-xs text-muted-foreground">Completed</p>
        )}
        <GoalDetailsModal goal={goal} progress={progress} />
      </div>
    </div>
  );
}
