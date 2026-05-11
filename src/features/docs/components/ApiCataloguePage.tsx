import { Link } from 'react-router-dom';
import { API_REGISTRY } from '@/apis/api-registry';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { parseOpenAPISpec } from '@/lib/spec-parser';

/**
 * API Catalogue — the landing page after login.
 * Lists all registered APIs from the registry.
 */
export function ApiCataloguePage() {
  return (
    <div className="page-container">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          API Catalogue
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg">
          Browse our APIs, explore documentation, and start building.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Available APIs',
            value: API_REGISTRY.length,
            icon: '📡',
          },
          {
            label: 'Total Endpoints',
            value: API_REGISTRY.reduce(
              (sum, api) => sum + parseOpenAPISpec(api.spec).length,
              0,
            ),
            icon: '🔗',
          },
          {
            label: 'Status',
            value: 'All Operational',
            icon: '✅',
          },
        ].map((stat) => (
          <Card key={stat.label} glass>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--color-text-tertiary)]">
                  {stat.label}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* API Grid */}
      <div className="card-grid">
        {API_REGISTRY.map((api) => {
          const endpoints = parseOpenAPISpec(api.spec);
          const tags = [...new Set(endpoints.flatMap((e) => e.tags))];

          return (
            <Link key={api.id} to={`/docs/${api.id}`} className="no-underline">
              <Card hover glow className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{api.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                        {api.name}
                      </h3>
                      <span className="text-xs text-[var(--color-text-tertiary)]">
                        v{api.version}
                      </span>
                    </div>
                  </div>
                  {api.category && (
                    <Badge variant="neutral" size="sm">
                      {api.category}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                  {api.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="info" size="sm">
                        {tag}
                      </Badge>
                    ))}
                    {tags.length > 3 && (
                      <Badge variant="neutral" size="sm">
                        +{tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-[var(--color-text-tertiary)]">
                    {endpoints.length} endpoints
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
