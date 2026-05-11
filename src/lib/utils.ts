import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with clsx and tailwind-merge
 * This guarantees that when you pass custom tailwind classes, they properly override defaults.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Format a date with time
 */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
}

/**
 * Mask an API key, showing only last 4 characters
 */
export function maskApiKey(key: string): string {
  if (key.length <= 4) return key;
  return `${'•'.repeat(key.length - 4)}${key.slice(-4)}`;
}

/**
 * Generate a random API key
 */
export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const prefix = 'Demo_';
  const keyLength = 32;
  let result = prefix;
  const array = new Uint8Array(keyLength);
  crypto.getRandomValues(array);
  for (let i = 0; i < keyLength; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format milliseconds to human readable latency
 */
export function formatLatency(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * HTTP method color mapping
 */
export const METHOD_COLORS: Record<string, string> = {
  GET: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  POST: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  PUT: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  PATCH: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  DELETE: 'text-red-400 bg-red-400/10 border-red-400/20',
};

/**
 * HTTP status code color mapping
 */
export function getStatusColor(status: number): string {
  if (status < 300) return 'text-emerald-400';
  if (status < 400) return 'text-amber-400';
  if (status < 500) return 'text-orange-400';
  return 'text-red-400';
}
