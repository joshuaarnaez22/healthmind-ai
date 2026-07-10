'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TherapyModule } from '@/lib/types';
import {
  cn,
  getDifficultyColor,
  getIcon,
  getTherapyTypeColor,
} from '@/lib/utils';
import { CheckCircle2, Clock, Users } from 'lucide-react';
import Link from 'next/link';

interface ModuleCardProps {
  module: TherapyModule;
  iconColor: string;
}
export default function ModuleCard({ module, iconColor }: ModuleCardProps) {
  const IconComponent = getIcon(module.icon);
  const isCompleted = module.isDone;

  return (
    <div
      className={cn(
        'border-border/80 hover:border-primary/30 flex h-full flex-col rounded-3xl border bg-card p-6 transition-colors',
        isCompleted && 'bg-secondary/60'
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <IconComponent className={cn('h-8 w-8', iconColor)} />
          {isCompleted && <CheckCircle2 className="h-5 w-5 text-primary" />}
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          <Badge className={getDifficultyColor(module.difficulty)}>
            {module.difficulty}
          </Badge>
          <Badge className={getTherapyTypeColor(module.therapyType)}>
            {module.therapyType}
          </Badge>
        </div>
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        {module.title}
      </h3>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">
        {module.description}
      </p>
      <div className="mb-4 mt-4 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          {module.estimatedTime}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          {module.audience}
        </div>
      </div>
      <Link href={`/user/therapy_modules/${module.id}`}>
        <Button
          className="w-full"
          variant={isCompleted ? 'outline' : 'default'}
        >
          {isCompleted ? 'Review Module' : 'Start Module'}
        </Button>
      </Link>
      {isCompleted && (
        <div className="mt-2 text-center">
          <Badge variant="secondary" className="bg-secondary text-primary">
            Completed
          </Badge>
        </div>
      )}
    </div>
  );
}
