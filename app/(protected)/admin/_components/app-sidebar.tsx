'use client';

import * as React from 'react';
import {
  Brain,
  FileText,
  BookOpen,
  PlayCircle,
  Bookmark,
  Notebook,
  SquareTerminal,
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
      title: 'Mental',
      url: '#',
      icon: Brain,
      items: [
        {
          title: 'Mood Tracker',
          url: '/admin/mood-tracker',
        },
      ],
    },

    {
      title: 'Journal', // Main title
      url: '#',
      icon: Notebook, // Icon for journaling
      isActive: false,
      items: [
        {
          title: 'Entries', // Nested item
          url: '/admin/journal',
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
          url: '/admin/insights/health-insights',
        },
        {
          title: 'Health Tracker',
          url: '/admin/insights/health-tracker',
        },
        {
          title: 'Health Summary',
          url: '/admin/insights/health-summary',
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
          title: 'CBT',
          url: '/admin/modules/cbt',
        },
        {
          title: 'DBT',
          url: '/admin/modules/dbt',
        },
        {
          title: 'ACT',
          url: '/admin/modules/act',
        },
      ],
    },
    {
      title: 'Videos',
      url: '#',
      icon: PlayCircle,
      isActive: false,
      items: [
        {
          title: 'Anxiety',
          url: '/videos/anxiety',
        },
        {
          title: 'Depression',
          url: '/videos/depression',
        },
        {
          title: 'Relationships',
          url: '/videos/relationships',
        },
        {
          title: 'Burnout',
          url: '/videos/burnout',
        },
      ],
    },
    {
      title: 'Articles',
      url: '#',
      icon: FileText,
      isActive: false,
      items: [
        {
          title: 'Stress & Coping',
          url: '/articles/stress',
        },
        {
          title: 'Grief & Trauma',
          url: '/articles/grief',
        },
        {
          title: 'Workplace Mental Health',
          url: '/articles/workplace',
        },
      ],
    },
    {
      title: 'Bookmarks',
      url: '/bookmarks',
      icon: Bookmark,
      isActive: false,
    },
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
