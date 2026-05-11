import { useState, useMemo } from 'react';
import { API_REGISTRY } from '@/apis/api-registry';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { ChangelogEntry } from '@/types/common';

interface ChangelogWithApi extends ChangelogEntry {
  apiName: string;
  apiIcon: string;
}

export function ChangelogPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterApi, setFilterApi] = useState<string>('all');

  const allEntries = useMemo(() => {
    const entries: ChangelogWithApi[] = [];
    for (const api of API_REGISTRY) {
      if (api.changelog) {
        for (const entry of api.changelog) {
          entries.push({
            ...entry,
            apiName: api.name,
            apiIcon: api.icon || '📋',
          });
        }
      }
    }
    return entries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, []);

  const filtered = useMemo(() => {
    return allEntries.filter((entry) => {
      if (filterType !== 'all' && entry.type !== filterType) return false;
      if (filterApi !== 'all' && entry.apiName !== filterApi) return false;
      return true;
    });
  }, [allEntries, filterType, filterApi]);

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Changelog
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Track all API changes, features, and deprecations.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1 bg-[var(--color-bg-tertiary)] rounded-lg p-1">
          {['all', 'feature', 'fix', 'breaking', 'deprecation'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer capitalize ${
                filterType === type
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <select
          value={filterApi}
          onChange={(e) => setFilterApi(e.target.value)}
          className="h-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-2 text-xs text-[var(--color-text-primary)]"
        >
          <option value="all">All APIs</option>
          {API_REGISTRY.map((api) => (
            <option key={api.id} value={api.name}>
              {api.name}
            </option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filtered.map((entry, i) => (
          <Card key={i} className="animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="text-2xl mt-1">{entry.apiIcon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant={entry.type} size="sm">
                    {entry.type}
                  </Badge>
                  <span className="font-mono text-xs text-[var(--color-accent)]">
                    {entry.version}
                  </span>
                  <span className="text-xs text-[var(--color-text-tertiary)]">
                    {entry.apiName}
                  </span>
                  <span className="text-xs text-[var(--color-text-tertiary)] ml-auto">
                    {entry.date}
                  </span>
                </div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                  {entry.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {entry.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
