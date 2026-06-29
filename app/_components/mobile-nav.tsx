'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export default function MobileNav({ scrolled = false }: { scrolled?: boolean }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className={
            scrolled
              ? 'text-foreground hover:bg-muted'
              : 'text-primary-foreground hover:bg-primary-foreground/10'
          }
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-1">
          <a
            href="#features"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Features
          </a>
          <Link
            href="/sign-in"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Sign in
          </Link>
          <Link href="/sign-up" className="mt-4">
            <Button className="w-full">Get started</Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
