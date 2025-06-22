'use client';

import * as React from 'react';
import {
  FileText,
  BookOpen,
  // PlayCircle,
  // Bookmark,
  SquareTerminal,
  Goal,
  NotebookPen,
  // HeartHandshake,
} from 'lucide-react';

import NavMain from './nav-main';
import NavUser from './nav-user';
import NavHeader from './nav-header';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },

  navMain: [
    {
      title: 'Analytics',
      url: '#',
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: 'Mental Analysis',
          url: '#',
        },
        {
          title: 'Physical Analysis',
          url: '#',
        },
      ],
    },
    {
      title: 'MindLog',
      url: '#',
      icon: NotebookPen, // from Lucide or similar icon set
      isActive: false,
      items: [
        {
          title: 'Entries', // Nested item
          url: '/user/journal',
        },
        {
          title: 'Mood Tracker',
          url: '/user/mood-tracker',
        },
      ],
    },
    {
      title: 'MediSummary',
      url: '#',
      icon: FileText,
      isActive: false,
      items: [
        {
          title: 'Health Insights',
          url: '/user/insights/health-insights',
        },
        {
          title: 'Health Tracker',
          url: '/user/insights/health-tracker',
        },
        {
          title: 'Health Summary',
          url: '/user/insights/health-summary',
        },
      ],
    },
    {
      title: 'Therapy Modules',
      url: '#',
      icon: BookOpen,
      isActive: false,
      items: [
        {
          title: 'Modules',
          url: '/user/therapy_modules',
        },
      ],
    },
    {
      title: 'Goals',
      url: '#',
      icon: Goal,
      isActive: false,
      items: [
        {
          title: 'Mindful Goals',
          url: '/user/goals',
        },
      ],
    },
    // {
    //   title: 'AI Therapist',
    //   url: '#',
    //   icon: HeartHandshake,
    //   items: [
    //     {
    //       title: 'Talk to AI',
    //       url: '/user/ai-therapy',
    //     },
    //   ],
    // },
    // {
    //   title: 'Videos',
    //   url: '#',
    //   icon: PlayCircle,
    //   isActive: false,
    //   items: [
    //     {
    //       title: 'Anxiety',
    //       url: '/videos/anxiety',
    //     },
    //     {
    //       title: 'Depression',
    //       url: '/videos/depression',
    //     },
    //     {
    //       title: 'Relationships',
    //       url: '/videos/relationships',
    //     },
    //     {
    //       title: 'Burnout',
    //       url: '/videos/burnout',
    //     },
    //   ],
    // },
    // {
    //   title: 'Articles',
    //   url: '#',
    //   icon: FileText,
    //   isActive: false,
    //   items: [
    //     {
    //       title: 'Stress & Coping',
    //       url: '/articles/stress',
    //     },
    //     {
    //       title: 'Grief & Trauma',
    //       url: '/articles/grief',
    //     },
    //     {
    //       title: 'Workplace Mental Health',
    //       url: '/articles/workplace',
    //     },
    //   ],
    // },
    // {
    //   title: 'Bookmarks',
    //   url: '/bookmarks',
    //   icon: Bookmark,
    //   isActive: false,
    // },
  ],
};

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
