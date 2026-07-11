'use client';

import AppSidebar from '@/app/(protected)/user/_components/app-sidebar';
import SearchCommand from '@/app/(protected)/user/_components/search-command';
import { ModeToggle } from '@/components/dark-mode';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import ChatbotWidget from '@/components/chatbot/chatbot-widget';

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  journal: 'Journal',
  'mood-tracker': 'Mood Tracker',
  insights: 'Insights',
  'health-insights': 'Health Insights',
  'health-tracker': 'Health Tracker',
  'health-summary': 'Health Summary',
  goals: 'Goals',
  'all-goals': 'All Goals',
  'check-in': 'Check-in',
  therapy_modules: 'Therapy Modules',
  'ai-therapy': 'AI Therapy',
  analytics: 'Analytics',
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname
    .replace(/^\/user\//, '')
    .split('/')
    .filter(Boolean);
  return segments.map((seg, i) => {
    const label =
      ROUTE_LABELS[seg] ??
      seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const href = '/user/' + segments.slice(0, i + 1).join('/');
    const isLast = i === segments.length - 1;
    return { label, href, isLast };
  });
}

export default function UserLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const crumbs = useBreadcrumbs();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header
          data-tour="app-header"
          className="border-border/80 bg-background/90 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 backdrop-blur-md transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
        >
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((crumb, i) => (
                  <span key={crumb.href} className="flex items-center gap-1.5">
                    {i > 0 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                    <BreadcrumbItem
                      className={i < crumbs.length - 1 ? 'hidden md:block' : ''}
                    >
                      {crumb.isLast ? (
                        <BreadcrumbPage className="font-semibold">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </span>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-3" data-tour="app-search">
            <ModeToggle tone="onLight" />
            <div className="hidden md:flex">
              <SearchCommand />
            </div>
          </div>
        </header>
        <div className="px-4 py-6 md:px-6 md:py-8">{children}</div>
        <ChatbotWidget surface="app" />
      </SidebarInset>
    </SidebarProvider>
  );
}
