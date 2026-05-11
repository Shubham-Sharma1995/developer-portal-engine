import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, glass, glow, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--color-border)] p-5 transition-all duration-200',
        glass
          ? 'glass'
          : 'bg-[var(--color-bg-secondary)]',
        hover && 'hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-hover)] cursor-pointer',
        glow && 'hover:shadow-[var(--glow-accent)]',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-lg font-semibold text-[var(--color-text-primary)]', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-[var(--color-text-secondary)] mt-1', className)}>
      {children}
    </p>
  );
}
