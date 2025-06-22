import { cn } from '@/lib/utils';

interface EmotionBadgeProps {
  emotion: string;
  className?: string;
}

export default function EmotionBadge({
  emotion,
  className,
}: EmotionBadgeProps) {
  // Map emotions to colors
  const colorMap: Record<string, { bg: string; text: string }> = {
    CALM: { bg: 'bg-blue-100', text: 'text-blue-800' },
    ENERGIZED: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    FOCUSED: { bg: 'bg-purple-100', text: 'text-purple-800' },
    CONNECTED: { bg: 'bg-pink-100', text: 'text-pink-800' },
    GRATEFUL: { bg: 'bg-green-100', text: 'text-green-800' },
    CONFIDENT: { bg: 'bg-orange-100', text: 'text-orange-800' },
    PEACEFUL: { bg: 'bg-teal-100', text: 'text-teal-800' },
    INSPIRED: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  };

  const colors = colorMap[emotion] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
  };

  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs font-medium',
        colors.bg,
        colors.text,
        className
      )}
    >
      {emotion}
    </span>
  );
}
