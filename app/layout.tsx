import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import localFont from 'next/font/local';
import { MotionConfig } from 'motion/react';
import NextTopLoader from 'nextjs-toploader';
import QueryProvider from '@/components/wrappers/query-client';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const alanSans = localFont({
  src: './fonts/AlanSans-Variable.woff2',
  variable: '--font-sans',
  display: 'swap',
  weight: '300 900',
});

export const metadata: Metadata = {
  title: 'HealthMind — Your Wellness Journey',
  description:
    'Track your mood, log your vitals, and talk to an AI therapist. HealthMind brings mental and physical health into one place.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${alanSans.variable} font-sans`}
          style={{ fontFamily: 'var(--font-sans), Helvetica, Arial, sans-serif' }}
        >
          <NextTopLoader color="#0a70ff" showSpinner={false} />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MotionConfig reducedMotion="user">
              <QueryProvider>{children}</QueryProvider>
            </MotionConfig>
            <Toaster />
            <SpeedInsights />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
