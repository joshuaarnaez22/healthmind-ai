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

export const dateFormatUtc = (date: Date) => {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
};
