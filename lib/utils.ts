import { Decimal } from 'decimal.js';
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

export const enumConvertor = <T extends object>(
  enumOjb: T,
  value?: string
): keyof T | null => {
  if (!value) return null;
  const upperValue = value.toUpperCase();
  return upperValue in enumOjb ? (upperValue as keyof typeof enumOjb) : null;
};

export const truncatedText = (text: string, maxLength = 20): string => {
  const truncateText =
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  return truncateText;
};

export const decimalToString = (value: Decimal) => value.toString();

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

export const allowedTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];
