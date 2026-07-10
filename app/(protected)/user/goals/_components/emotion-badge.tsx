import { cn } from '@/lib/utils';

interface EmotionBadgeProps {
  emotion: string;
  className?: string;
}

export default function EmotionBadge({
  emotion,
  className,
}: EmotionBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full border border-border/80 bg-secondary px-2.5 py-0.5 text-xs font-medium text-primary',
        className
      )}
    >
      {emotion}
    </span>
  );
}
