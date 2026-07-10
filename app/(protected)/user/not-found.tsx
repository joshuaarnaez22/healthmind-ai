import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary">
          <Heart className="h-10 w-10 text-primary" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Page not found
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
            This page has wandered off. Let’s get you back to something useful.
          </p>
        </div>

        <section className="rounded-3xl border border-border/80 bg-card p-6 text-left">
          <h3 className="mb-2 font-semibold text-foreground">
            You’re not lost — just exploring
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Every journey has unexpected turns. Head back to your dashboard to
            continue journaling, tracking vitals, or working on goals.
          </p>
        </section>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/user/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/user/journal">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Open Journal
            </Link>
          </Button>
        </div>

        <div className="border-t border-border/80 pt-6">
          <p className="mb-3 text-xs text-muted-foreground">Popular sections</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/user/goals"
              className="font-medium text-primary hover:underline"
            >
              Goals
            </Link>
            <Link
              href="/user/insights/health-tracker"
              className="font-medium text-primary hover:underline"
            >
              Health Tracker
            </Link>
            <Link
              href="/user/therapy_modules"
              className="font-medium text-primary hover:underline"
            >
              Therapy Modules
            </Link>
            <Link
              href="/user/analytics"
              className="font-medium text-primary hover:underline"
            >
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
