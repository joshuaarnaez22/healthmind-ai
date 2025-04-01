import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const safeFormat = (
  date: Date | undefined,
  formatString: string
): string => {
  if (!date || isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return format(date, formatString);
};

export const formatDateKey = (date: Date | undefined) => {
  if (!date) return undefined;
  // This ensures we get YYYY-MM-DD in local timezone, not UTC
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
