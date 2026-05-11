import { Button } from './Button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in">
      <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          className="text-red-400"
        >
          <path
            d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
        Something went wrong
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-md mb-2">
        An unexpected error occurred. Please try again.
      </p>
      <pre className="text-xs text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg p-3 max-w-md overflow-auto mb-6">
        {error.message}
      </pre>
      <Button variant="secondary" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </div>
  );
}
