'use client';

import * as React from 'react';
import { Brain, FileText, Heart, Notebook, SquareTerminal } from 'lucide-react';

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
      title: 'Physical',
      url: '#',
      icon: Heart,
      items: [
        {
          title: 'Fitness',
          url: '#',
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
          url: '#',
        },
        {
          title: 'Health Tracker',
          url: '/admin/health-tracker',
        },
      ],
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
