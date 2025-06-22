export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
import { MeasurementType, PostureType } from '@prisma/client';
import {
  FrownIcon,
  MehIcon,
  SmileIcon,
  SmilePlusIcon,
  CloudRainIcon,
  Brain,
  Heart,
  Sparkles,
  BookOpen,
  Smartphone,
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

const postures = Object.values(PostureType);
const measurementType = Object.values(MeasurementType);

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

const getGlucoseCategory = (value: number, isMMOL?: boolean) => {
  let glucoseValue;
  if (isMMOL) {
    glucoseValue = isMMOL ? value : value / 18;
  } else {
    glucoseValue = value;
  }

  if (glucoseValue < 4.0)
    return { label: 'Low', color: 'bg-red-100 text-red-800' };
  if (glucoseValue >= 4.0 && glucoseValue <= 5.9)
    return { label: 'Normal', color: 'bg-green-100 text-green-800' };
  if (glucoseValue > 5.9 && glucoseValue <= 7.0)
    return { label: 'Elevated', color: 'bg-yellow-100 text-yellow-800' };
  if (glucoseValue > 7.0 && glucoseValue <= 10.0)
    return { label: 'High', color: 'bg-orange-100 text-orange-800' };
  if (glucoseValue > 10.0)
    return { label: 'Very High', color: 'bg-red-100 text-red-800' };
  return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
};

const insightCards = [
  {
    title: 'Managing Anxiety',
    description: 'Learn techniques to manage anxiety in daily situations',
    icon: Brain,
    className: 'h-5 w-5 text-teal-500',
    category: 'Technique',
    categoryColor: 'bg-teal-100 text-teal-800',
  },
  {
    title: 'Mindful Breathing',
    description: 'Simple breathing exercises to center yourself',
    icon: Heart,
    className: 'h-5 w-5 text-rose-500',
    category: 'Exercise',
    categoryColor: 'bg-rose-100 text-rose-800',
  },
  {
    title: 'Positive Affirmations',
    description: 'Daily affirmations to boost your mental wellbeing',
    icon: Sparkles,
    className: 'h-5 w-5 text-amber-500',
    category: 'Practice',
    categoryColor: 'bg-amber-100 text-amber-800',
  },
  {
    title: 'Gratitude Journaling',
    description: 'How keeping a gratitude journal can improve your mindset',
    icon: BookOpen,
    className: 'h-5 w-5 text-indigo-500',
    category: 'Practice',
    categoryColor: 'bg-indigo-100 text-indigo-800',
  },
  {
    title: 'Digital Detox',
    description: 'Benefits of taking regular breaks from technology',
    icon: Smartphone,
    className: 'h-5 w-5 text-blue-500',
    category: 'Technique',
    categoryColor: 'bg-blue-100 text-blue-800',
  },
];

const validLucideIcons = [
  'brain',
  'sun',
  'tool',
  'eye',
  'hand',
  'heart',
  'cloud-rain',
  'target',
  'cloud',
] as const;

export {
  validLucideIcons,
  moods,
  commonSymptoms,
  getBPCategory,
  postures,
  getGlucoseCategory,
  measurementType,
  insightCards,
};
