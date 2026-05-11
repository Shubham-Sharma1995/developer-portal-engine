import { describe, it, expect } from 'vitest';
import { maskApiKey, formatBytes, formatLatency, getStatusColor } from './utils';

describe('Utility Functions', () => {
  describe('maskApiKey', () => {
    it('should mask all but the last 4 characters', () => {
      expect(maskApiKey('Demo_sk_test_1234567890')).toBe('•••••••••••••••••••7890');
    });

    it('should return the full key if it is 4 characters or less', () => {
      expect(maskApiKey('1234')).toBe('1234');
      expect(maskApiKey('abc')).toBe('abc');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes to human readable strings', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
    });
  });

  describe('formatLatency', () => {
    it('should format milliseconds to readable strings', () => {
      expect(formatLatency(500)).toBe('500ms');
      expect(formatLatency(1500)).toBe('1.50s');
    });
  });

  describe('getStatusColor', () => {
    it('should return emerald for 2xx status', () => {
      expect(getStatusColor(200)).toBe('text-emerald-400');
      expect(getStatusColor(201)).toBe('text-emerald-400');
    });

    it('should return red for 5xx status', () => {
      expect(getStatusColor(500)).toBe('text-red-400');
    });
  });
});
