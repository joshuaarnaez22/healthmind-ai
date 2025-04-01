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
const commonSymptoms = [
  'Headache',
  'Dizziness',
  'Nausea',
  'Blurred Vision',
  'Shortness of Breath',
  'Chest Pain',
  'Fatigue',
  'Anxiety',
];

const postures = ['SITTING', 'STANDING', 'LYING_DOWN'];

const getBPCategory = (systolic: number, diastolic: number) => {
  if (systolic < 120 && diastolic < 80)
    return { label: 'Normal', color: 'bg-green-100 text-green-800' };
  if (systolic >= 120 && systolic <= 129 && diastolic < 80)
    return { label: 'Elevated', color: 'bg-yellow-100 text-yellow-800' };
  if (
    (systolic >= 130 && systolic <= 139) ||
    (diastolic >= 80 && diastolic <= 89)
  )
    return {
      label: 'Stage 1 Hypertension',
      color: 'bg-orange-100 text-orange-800',
    };
  if (systolic >= 140 || diastolic >= 90)
    return { label: 'Stage 2 Hypertension', color: 'bg-red-100 text-red-800' };
  if (systolic > 180 || diastolic > 120)
    return { label: 'Hypertensive Crisis', color: 'bg-red-500 text-white' };
  return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
};

export { moods, commonSymptoms, getBPCategory, postures };
