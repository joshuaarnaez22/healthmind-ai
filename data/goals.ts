import { Goal } from '@/lib/types';

export const goals: Goal[] = [
  {
    id: '1',
    title: 'Do yoga 2x',
    emotion: 'Calm',
    frequency: 'weekly',
    targetCount: 2,
    duration: '1-week',
    why: 'To reduce stress and improve flexibility',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    completedCount: 1,
    checkIns: [
      {
        id: 'c1',
        goalId: '1',
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        actualEmotion: 'Relaxed',
        reflection: 'Felt really good after a 30-minute session.',
        rating: 4,
      },
      {
        id: 'c2',
        goalId: '1',
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        actualEmotion: 'Peaceful',
        reflection: 'Helped me clear my mind.',
        rating: 5,
      },
    ],
    isCompleted: true,
  },
  {
    id: '2',
    title: 'Call a friend',
    emotion: 'Connected',
    frequency: 'weekly',
    targetCount: 1,
    duration: '1-week',
    why: 'To maintain social connections',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    completedCount: 1,
    checkIns: [
      {
        id: 'c3',
        goalId: '2',
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        actualEmotion: 'Happy',
        reflection: 'Great chat with an old friend. Felt energized.',
        rating: 5,
      },
    ],
    isCompleted: true,
  },
  {
    id: '3',
    title: 'Read for 15 minutes daily',
    emotion: 'Focused',
    frequency: 'daily',
    targetCount: 7,
    duration: '1-week',
    why: 'To improve focus and reduce screen time',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    completedCount: 3,
    checkIns: [
      {
        id: 'c4',
        goalId: '3',
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        actualEmotion: 'Curious',
        reflection: 'Read a fascinating article about mindfulness.',
        rating: 4,
      },
      {
        id: 'c5',
        goalId: '3',
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        actualEmotion: 'Calm',
        reflection: 'Felt peaceful after reading a short story.',
        rating: 5,
      },
      {
        id: 'c6',
        goalId: '3',
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        actualEmotion: 'Neutral',
        reflection: 'Read for 10 mins, not super focused.',
        rating: 3,
      },
    ],
    isCompleted: false,
  },
];
