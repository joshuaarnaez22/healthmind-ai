import {
  FrownIcon,
  MehIcon,
  SmileIcon,
  SmilePlusIcon,
  CloudRainIcon,
} from 'lucide-react';

const moods = [
  {
    value: 'TERRIBLE',
    label: 'Terrible',
    icon: CloudRainIcon,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    hoverColor: 'hover:bg-red-200',
    selectedColor: 'bg-red-200 border-red-500',
  },
  {
    value: 'BAD',
    label: 'Bad',
    icon: FrownIcon,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    hoverColor: 'hover:bg-orange-200',
    selectedColor: 'bg-orange-200 border-orange-500',
  },
  {
    value: 'NEUTRAL',
    label: 'Neutral',
    icon: MehIcon,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    hoverColor: 'hover:bg-yellow-200',
    selectedColor: 'bg-yellow-200 border-yellow-500',
  },
  {
    value: 'GOOD',
    label: 'Good',
    icon: SmileIcon,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    hoverColor: 'hover:bg-green-200',
    selectedColor: 'bg-green-200 border-green-500',
  },
  {
    value: 'GREAT',
    label: 'Great',
    icon: SmilePlusIcon,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    hoverColor: 'hover:bg-blue-200',
    selectedColor: 'bg-blue-200 border-blue-500',
  },
];

export default moods;
