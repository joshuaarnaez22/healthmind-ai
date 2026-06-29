'use client';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  NotebookPen,
  Smile,
  FileText,
  Activity,
  FileScan,
  Goal,
  BookOpen,
  BarChart2,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
  { label: 'Journal Entries', href: '/user/journal', icon: NotebookPen },
  { label: 'Mood Tracker', href: '/user/mood-tracker', icon: Smile },
  {
    label: 'Health Tracker',
    href: '/user/insights/health-tracker',
    icon: Activity,
  },
  {
    label: 'Health Insights',
    href: '/user/insights/health-insights',
    icon: FileText,
  },
  {
    label: 'Health Summary',
    href: '/user/insights/health-summary',
    icon: FileScan,
  },
  { label: 'Goals', href: '/user/goals', icon: Goal },
  { label: 'Therapy Modules', href: '/user/therapy_modules', icon: BookOpen },
  { label: 'Analytics', href: '/user/analytics', icon: BarChart2 },
];

export default function SearchCommand() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <Button
        className="placeholder:text-muted-foreground/70 focus-visible:ring-ring/20 inline-flex h-9 w-fit rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow hover:bg-muted focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px]"
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center">
          <Search
            className="text-muted-foreground/80 -ms-1 me-3"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="text-muted-foreground/70 font-normal">Search</span>
        </span>
        <kbd className="text-muted-foreground/70 -me-1 ms-12 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
              <CommandItem key={href} onSelect={() => navigate(href)}>
                <Icon
                  size={16}
                  strokeWidth={2}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>{label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
