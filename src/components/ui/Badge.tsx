import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center justify-center font-mono font-semibold uppercase tracking-wider border rounded-md',
  {
    variants: {
      variant: {
        get: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        post: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        put: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        patch: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
        delete: 'text-red-400 bg-red-400/10 border-red-400/20',
        info: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
        success: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        error: 'text-red-400 bg-red-400/10 border-red-400/20',
        neutral: 'text-[var(--color-text-secondary)] bg-[var(--color-bg-tertiary)] border-[var(--color-border)]',
        breaking: 'text-red-400 bg-red-400/10 border-red-400/20',
        feature: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        fix: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        deprecation: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-[10px]',
        md: 'px-2 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  },
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

export function Badge({ variant, size, children, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)}>
      {children}
    </span>
  );
}

/**
 * Convenience component for HTTP method badges
 */
export function MethodBadge({ method }: { method: string }) {
  const variant = method.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete';
  return (
    <Badge variant={variant} size="sm">
      {method}
    </Badge>
  );
}

/**
 * HTTP status code badge
 */
export function StatusBadge({ status }: { status: number }) {
  let variant: 'success' | 'warning' | 'error' = 'success';
  if (status >= 300 && status < 400) variant = 'warning';
  else if (status >= 400) variant = 'error';

  return (
    <Badge variant={variant} size="sm">
      {status}
    </Badge>
  );
}
