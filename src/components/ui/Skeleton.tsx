import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton h-4 rounded', className)} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[var(--color-border)] p-5 bg-[var(--color-bg-secondary)]">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

export function SkeletonEndpoint() {
  return (
    <div className="py-3 px-4 border-b border-[var(--color-border)]">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="page-container">
      <Skeleton className="h-8 w-64 mb-6" />
      <div className="card-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
