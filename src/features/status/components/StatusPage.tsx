import { API_REGISTRY } from '@/apis/api-registry';
import { Card } from '@/components/ui/Card';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import type { ApiStatus } from '@/types/common';

// Mock status data
const apiStatuses: Record<string, { status: ApiStatus; uptime: number }> = {
  pokeapi: { status: 'operational', uptime: 99.98 },
  'Demo-payments': { status: 'operational', uptime: 99.95 },
};

const mockIncidents = [
  {
    id: '1',
    title: 'Elevated latency on PokéAPI endpoints',
    status: 'operational' as ApiStatus,
    createdAt: '2024-12-01T14:30:00Z',
    resolvedAt: '2024-12-01T15:45:00Z',
    description: 'Increased response times observed on pokemon and type endpoints.',
  },
  {
    id: '2',
    title: 'Scheduled maintenance window',
    status: 'maintenance' as ApiStatus,
    createdAt: '2024-11-15T02:00:00Z',
    resolvedAt: '2024-11-15T04:00:00Z',
    description: 'Routine infrastructure maintenance. No data loss expected.',
  },
];

export function StatusPage() {
  const allOperational = Object.values(apiStatuses).every(
    (s) => s.status === 'operational',
  );

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          System Status
        </h1>

        {/* Overall status banner */}
        <div
          className={`rounded-xl p-4 border ${allOperational
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : 'bg-amber-500/5 border-amber-500/20'
            }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${allOperational ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
            />
            <span className="font-semibold text-[var(--color-text-primary)]">
              {allOperational
                ? 'All Systems Operational'
                : 'Some Systems Experiencing Issues'}
            </span>
          </div>
        </div>
      </div>

      {/* API Status Cards */}
      <div className="space-y-3 mb-8">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          APIs
        </h2>
        {API_REGISTRY.map((api) => {
          const status = apiStatuses[api.id] || {
            status: 'operational',
            uptime: 99.9,
          };

          return (
            <Card key={api.id} className="flex items-center gap-4">
              <span className="text-2xl">{api.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-[var(--color-text-primary)]">
                  {api.name}
                </div>
                <div className="text-xs text-[var(--color-text-tertiary)]">
                  v{api.version}
                </div>
              </div>

              {/* Uptime bar */}
              <div className="flex gap-0.5">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-6 rounded-sm ${i === 15
                        ? 'bg-amber-400/60'
                        : 'bg-emerald-400/60'
                      }`}
                    title={`Day ${30 - i}`}
                  />
                ))}
              </div>

              <div className="text-right">
                <div className="text-sm font-mono font-medium text-emerald-400">
                  {status.uptime}%
                </div>
                <div className="text-[10px] text-[var(--color-text-tertiary)]">
                  uptime
                </div>
              </div>

              <StatusIndicator status={status.status} />
            </Card>
          );
        })}
      </div>

      {/* Incident History */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Incident History
        </h2>
        <div className="space-y-3">
          {mockIncidents.map((incident) => (
            <Card key={incident.id}>
              <div className="flex items-start gap-3">
                <StatusIndicator
                  status={incident.resolvedAt ? 'operational' : incident.status}
                  showLabel={false}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {incident.title}
                    </span>
                    {incident.resolvedAt && (
                      <Badge variant="success" size="sm">
                        Resolved
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                    {incident.description}
                  </p>
                  <div className="text-xs text-[var(--color-text-tertiary)]">
                    {formatDateTime(incident.createdAt)}
                    {incident.resolvedAt && ` — Resolved ${formatDateTime(incident.resolvedAt)}`}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
