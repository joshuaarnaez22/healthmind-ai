import { cn } from '@/lib/utils';

type HealthMindBotProps = {
  className?: string;
  size?: number;
  /** brand = blue tile; plain = face only (for FAB on primary) */
  variant?: 'brand' | 'plain';
};

/** Friendly robot companion mark — used in chat + favicon. */
export default function HealthMindBot({
  className,
  size = 32,
  variant = 'brand',
}: HealthMindBotProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      {variant === 'brand' ? (
        <rect width="32" height="32" rx="10" fill="#0a70ff" />
      ) : null}

      {/* Antenna */}
      <line
        x1="16"
        y1="5.5"
        x2="16"
        y2="9"
        stroke="#fffcf5"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity={variant === 'plain' ? 0.9 : 1}
      />
      <circle cx="16" cy="4.25" r="2.1" fill="#fcff7e" />

      {/* Soft ear nubs */}
      <rect x="5.25" y="14" width="2.25" height="5" rx="1.1" fill="#fffcf5" />
      <rect x="24.5" y="14" width="2.25" height="5" rx="1.1" fill="#fffcf5" />

      {/* Head */}
      <rect x="7" y="9" width="18" height="16.5" rx="6.5" fill="#fffcf5" />

      {/* Soft cheek blush */}
      <circle cx="10.4" cy="19.2" r="1.7" fill="#ffb4a8" opacity="0.5" />
      <circle cx="21.6" cy="19.2" r="1.7" fill="#ffb4a8" opacity="0.5" />

      {/* Eyes */}
      <circle cx="12.2" cy="15.8" r="2.25" fill="#282830" />
      <circle cx="19.8" cy="15.8" r="2.25" fill="#282830" />
      <circle cx="12.85" cy="15.15" r="0.75" fill="#fffcf5" />
      <circle cx="20.45" cy="15.15" r="0.75" fill="#fffcf5" />

      {/* Smile */}
      <path
        d="M12.4 20.4 C13.8 22.15 18.2 22.15 19.6 20.4"
        stroke="#0a70ff"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
