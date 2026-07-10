'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  BarChart2,
  FileText,
  BookOpen,
  Goal,
  NotebookPen,
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

const navItems = [
  {
    title: 'Dashboard',
    url: '/user/dashboard',
    icon: LayoutDashboard,
    isActive: false,
    tourId: 'nav-dashboard',
    items: [],
  },
  {
    title: 'MindLog',
    url: '/user/journal',
    icon: NotebookPen,
    isActive: false,
    tourId: 'nav-journal',
    items: [{ title: 'Journal Entries', url: '/user/journal' }],
  },
  {
    title: 'Health',
    url: '/user/insights/health-tracker',
    icon: FileText,
    isActive: false,
    tourId: 'nav-health',
    items: [
      { title: 'Health Tracker', url: '/user/insights/health-tracker' },
      { title: 'Health Insights', url: '/user/insights/health-insights' },
      { title: 'Health Summary', url: '/user/insights/health-summary' },
    ],
  },
  {
    title: 'Goals',
    url: '/user/goals',
    icon: Goal,
    isActive: false,
    tourId: 'nav-goals',
    items: [
      { title: 'Mindful Goals', url: '/user/goals' },
      { title: 'All Goals', url: '/user/goals/all-goals' },
    ],
  },
  {
    title: 'Therapy',
    url: '/user/therapy_modules',
    icon: BookOpen,
    isActive: false,
    tourId: 'nav-therapy',
    items: [
      { title: 'Modules', url: '/user/therapy_modules' },
      { title: 'AI Therapy', url: '/user/ai-therapy' },
    ],
  },
  {
    title: 'Analytics',
    url: '/user/analytics',
    icon: BarChart2,
    isActive: false,
    tourId: 'nav-analytics',
    items: [{ title: 'Mood Analytics', url: '/user/analytics' }],
  },
];

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
