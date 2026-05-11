import { cn } from '@/lib/utils';
import type { ApiStatus } from '@/types/common';

const statusConfig: Record<ApiStatus, { color: string; label: string; pulse: boolean }> = {
  operational: { color: 'bg-emerald-400', label: 'Operational', pulse: false },
  degraded: { color: 'bg-amber-400', label: 'Degraded', pulse: true },
  outage: { color: 'bg-red-400', label: 'Outage', pulse: true },
  maintenance: { color: 'bg-blue-400', label: 'Maintenance', pulse: false },
};

interface StatusIndicatorProps {
  status: ApiStatus;
  showLabel?: boolean;
  className?: string;
}

export function StatusIndicator({ status, showLabel = true, className }: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div className={cn('h-2.5 w-2.5 rounded-full', config.color)} />
        {config.pulse && (
          <div
            className={cn(
              'absolute inset-0 h-2.5 w-2.5 rounded-full animate-ping opacity-75',
              config.color,
            )}
          />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">
          {config.label}
        </span>
      )}
    </div>
  );
}
