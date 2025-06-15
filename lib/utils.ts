import { Decimal } from 'decimal.js';
import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import DOMPurify from 'dompurify';

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

export const processMedicalSummary = (chunk: string): string => {
  let cleaned = chunk
    .replace(/\\n/g, '\n') // Convert escaped newlines
    .replace(/^---$/gm, '') // Remove markdown dividers
    .replace(/^###\s*/gm, '') // Remove markdown headings
    .replace(/^[-–—]\s*/gm, ''); // Remove list markers

  // Make the summary header bold and ensure it's followed by a newline
  cleaned = cleaned.replace(
    /===(.*?)PATIENT ===/g,
    '<strong>=== SUMMARY FOR PATIENT ===</strong>\n'
  );

  // Ensure there's always a newline after the patient header
  cleaned = cleaned.replace(
    /<strong>=== SUMMARY FOR PATIENT ===<\/strong>(?!\n)/g,
    '<strong>=== SUMMARY FOR PATIENT ===</strong>\n'
  );

  // Extract the description line (after the header and before KEY FINDINGS)
  const parts = cleaned.split(/\*\*KEY FINDINGS:/);
  if (parts.length > 1) {
    const headerPart = parts[0].trim();
    const descriptionMatch = headerPart.match(/.*?\n(.*?)$/);
    let description = '';

    if (descriptionMatch && descriptionMatch[1]) {
      description = descriptionMatch[1].trim() + '\n';
    }

    // Process the rest of the content
    let contentPart = parts[1];

    // Make section headers bold
    contentPart = contentPart
      .replace(/\*\*KEY FINDINGS:/g, '<strong>KEY FINDINGS:</strong>')
      .replace(/\*\*WHAT THIS MEANS:/g, '<strong>WHAT THIS MEANS:</strong>')
      .replace(/\*\*NEXT STEPS:/g, '<strong>NEXT STEPS:</strong>');

    // Remove other bold markers
    contentPart = contentPart.replace(/\*\*/g, '');

    // Format spacing
    contentPart = contentPart
      .replace(/([a-z])→/g, '$1 →') // Add space before arrows
      .replace(/→([A-Za-z])/g, '→ $1') // Add space after arrows
      .replace(/⚠️\s*/g, '⚠️ '); // Preserve warning symbols

    // Normalize spacing
    contentPart = contentPart.replace(/\s+/g, ' ').trim();

    // Add line breaks before each section header
    contentPart = contentPart
      .replace(
        /<strong>WHAT THIS MEANS:<\/strong>/g,
        '\n<strong>WHAT THIS MEANS:</strong>'
      )
      .replace(
        /<strong>NEXT STEPS:<\/strong>/g,
        '\n<strong>NEXT STEPS:</strong>'
      );

    // Combine everything - ensuring newline after the header
    cleaned = `<strong>=== SUMMARY FOR PATIENT ===</strong>\n${description}<strong>KEY FINDINGS:</strong> ${contentPart}`;
  }

  // Final check to ensure every patient header has a newline after it
  cleaned = cleaned.replace(
    /<strong>=== SUMMARY FOR PATIENT ===<\/strong>(?!\n)/g,
    '<strong>=== SUMMARY FOR PATIENT ===</strong>\n'
  );

  return cleaned;
};

export const isContentEmpty = (htmlString: string) => {
  const clean = DOMPurify.sanitize(htmlString);
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = clean;
  return tempDiv.textContent?.trim() === '';
};

export const getDaysLeft = ({
  duration,
  createdAt,
}: {
  duration: string;
  createdAt: Date;
}) => {
  const durationDays =
    duration === '1-week' ? 7 : duration === '2-weeks' ? 14 : 30;
  const createdDate = new Date(createdAt);
  const daysSinceCreated = Math.floor(
    (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(durationDays - daysSinceCreated, 0);
};
