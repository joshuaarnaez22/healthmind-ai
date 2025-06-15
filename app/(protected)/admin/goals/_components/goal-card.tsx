import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import EmotionBadge from './emotion-badge';

interface GoalCardProps {
  id: string;
  title: string;
  emotion: string;
  progress: number;
  daysLeft: number;
  completed: number;
  total: number;
}

export default function GoalCard({
  id,
  title,
  emotion,
  progress,
  daysLeft,
  completed,
  total,
}: GoalCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-1.5 bg-green-100">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="font-medium">{title}</h3>
          <EmotionBadge emotion={emotion} />
        </div>

        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5 text-gray-400" />
            <span className="font-medium">{completed}</span>/{total} completed
          </div>
          <Progress value={progress} className="h-2 w-16" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-2 pt-0">
        <Link href={`/admin/goals/check-in/${id}`}>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            Check-in
          </Button>
        </Link>
        <Link href={`/goals/${id}`}>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
