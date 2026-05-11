import { useState, type ReactNode } from 'react';
import { cn, copyToClipboard } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
  showCopy?: boolean;
  maxHeight?: string;
}

export function CodeBlock({
  code,
  language = 'json',
  title,
  className,
  showCopy = true,
  maxHeight = '400px',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--color-border)] overflow-hidden',
        className,
      )}
    >
      {(title || showCopy) && (
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
          <span className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
            {title || language}
          </span>
          {showCopy && (
            <button
              onClick={handleCopy}
              className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          )}
        </div>
      )}
      <pre
        className="p-4 overflow-auto text-sm leading-relaxed bg-[var(--color-bg-primary)] m-0 border-0 rounded-none"
        style={{ maxHeight }}
      >
        <code className={`language-${language} text-[var(--color-text-primary)]`}>
          {code}
        </code>
      </pre>
    </div>
  );
}

/**
 * Inline code span
 */
export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 text-sm font-mono bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-md text-[var(--color-accent)]">
      {children}
    </code>
  );
}
