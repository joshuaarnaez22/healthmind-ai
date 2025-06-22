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
    { name: 'CALM', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    {
      name: 'ENERGIZED',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    {
      name: 'FOCUSED',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    { name: 'CONNECTED', color: 'bg-pink-100 text-pink-800 border-pink-200' },
    { name: 'GRATEFUL', color: 'bg-green-100 text-green-800 border-green-200' },
    {
      name: 'CONFIDENT',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
    },
    { name: 'PEACEFUL', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    {
      name: 'INSPIRED',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
  ];
  return (
    <RadioGroup className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {emotions.map((emotion) => (
        <div
          key={emotion.name}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-3 transition-all',
            selectedEmotion === emotion.name
              ? `${emotion.color} border-current`
              : 'border-transparent hover:border-gray-200'
          )}
          onClick={() => onSelectEmotion(emotion.name)}
        >
          <span className="mb-1 text-lg">{getEmotionEmoji(emotion.name)}</span>
          <span className="text-sm font-medium">{emotion.name}</span>
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
