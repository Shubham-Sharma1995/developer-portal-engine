

export interface ChangelogEntry {
  version: string;
  date: string;
  type: 'breaking' | 'feature' | 'fix' | 'deprecation';
  title: string;
  description: string;
}

export interface SdkLink {
  language: string;
  name: string;
  url: string;
  icon?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  maskedKey: string;
  environment: 'sandbox' | 'production';
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  isRevoked: boolean;
}

export interface SandboxRequest {
  id: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  pathParams: Record<string, string>;
  queryParams: Record<string, string>;
  body?: string;
  timestamp: string;
}

export interface SandboxResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  latencyMs: number;
  size: number;
}

export interface RequestHistoryEntry {
  id: string;
  request: SandboxRequest;
  response?: SandboxResponse;
  timestamp: string;
}

export type ApiStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';

export interface IncidentEntry {
  id: string;
  title: string;
  status: ApiStatus;
  createdAt: string;
  resolvedAt?: string;
  description: string;
  updates: Array<{
    timestamp: string;
    message: string;
    status: ApiStatus;
  }>;
}

export interface AnalyticsDataPoint {
  date: string;
  calls: number;
  errors: number;
  avgLatency: number;
}
