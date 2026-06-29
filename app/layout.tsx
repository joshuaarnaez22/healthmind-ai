import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { Manrope, Libre_Baskerville } from 'next/font/google';
import { MotionConfig } from 'motion/react';
import NextTopLoader from 'nextjs-toploader';
import QueryProvider from '@/components/wrappers/query-client';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
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
        <body className={`${manrope.variable} ${libreBaskerville.variable}`}>
          <NextTopLoader color="oklch(0.490 0.150 270)" showSpinner={false} />
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
