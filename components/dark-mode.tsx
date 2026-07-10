'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ModeToggle({
  tone = 'default',
}: Readonly<{
  tone?: 'default' | 'onDark' | 'onLight';
}>) {
  const { setTheme, theme } = useTheme();

  const toneClasses: Record<typeof tone, string> = {
    onDark:
      'relative border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white',
    onLight:
      'relative border-border bg-transparent text-foreground hover:bg-secondary hover:text-foreground',
    default: 'relative',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={toneClasses[tone]}>
          <motion.div
            animate={{ rotate: theme === 'light' ? 360 : 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          </motion.div>
          <motion.div
            animate={{ rotate: theme === 'dark' ? 360 : 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
