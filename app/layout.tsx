import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { Poppins } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import QueryProvider from '@/components/wrappers/query-client';

const poppins = Poppins({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HealthMind - Your Wellness Journey',
  description:
    'Track, improve, and celebrate your health milestones with HealthMind',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={poppins.className}>
          <NextTopLoader showSpinner={true} />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
