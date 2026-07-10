'use client';

import { RadioGroup } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface EmotionSelectorProps {
  selectedEmotion: string;
  onSelectEmotion: (emotion: string) => void;
}
export default function EmotionSelector({
  selectedEmotion,
  onSelectEmotion,
}: EmotionSelectorProps) {
  const emotions = [
    'CALM',
    'ENERGIZED',
    'FOCUSED',
    'CONNECTED',
    'GRATEFUL',
    'CONFIDENT',
    'PEACEFUL',
    'INSPIRED',
  ];
  return (
    <RadioGroup className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {emotions.map((name) => (
        <div
          key={name}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 p-3 transition-colors',
            selectedEmotion === name
              ? 'border-primary bg-secondary text-primary'
              : 'hover:border-border/80 border-transparent bg-card'
          )}
          onClick={() => onSelectEmotion(name)}
        >
          <span className="mb-1 text-lg">{getEmotionEmoji(name)}</span>
          <span className="text-sm font-medium">{name}</span>
        </div>
      ))}
    </RadioGroup>
  );
}

function getEmotionEmoji(emotion: string): string {
  const emojiMap: Record<string, string> = {
    CALM: '😌',
    ENERGIZED: '⚡',
    FOCUSED: '🧠',
    CONNECTED: '🤝',
    GRATEFUL: '🙏',
    CONFIDENT: '💪',
    PEACEFUL: '🕊️',
    INSPIRED: '✨',
  };

  return emojiMap[emotion] || '😊';
}
