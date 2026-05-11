import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { getApiById } from '@/apis/api-registry';
import { parseOpenAPISpec, groupEndpointsByTag } from '@/lib/spec-parser';
import { MethodBadge, Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Button } from '@/components/ui/Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { EndpointDefinition } from '@/types/openapi';

/**
 * API Documentation page — renders docs entirely from the OpenAPI spec.
 * No hardcoded endpoint data — everything comes from the registry.
 */
export function ApiDocsPage() {
  const { apiId } = useParams<{ apiId: string }>();
  const api = apiId ? getApiById(apiId) : undefined;
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDefinition | null>(null);
  const [activeTab, setActiveTab] = useState<'endpoints' | 'guide' | 'sdks' | 'changelog'>('endpoints');
  const [searchQuery, setSearchQuery] = useState('');

  const endpoints = useMemo(() => (api ? parseOpenAPISpec(api.spec) : []), [api]);
  const grouped = useMemo(() => groupEndpointsByTag(endpoints), [endpoints]);

  const filteredGrouped = useMemo(() => {
    if (!searchQuery) return grouped;
    const result: Record<string, EndpointDefinition[]> = {};
    for (const [tag, eps] of Object.entries(grouped)) {
      const filtered = eps.filter(
        (e) =>
          e.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.path.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      if (filtered.length > 0) result[tag] = filtered;
    }
    return result;
  }, [grouped, searchQuery]);

  if (!api) {
    return (
      <div className="page-container">
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
            API not found
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            The requested API does not exist in the registry.
          </p>
          <Link to="/">
            <Button variant="secondary">Back to Catalogue</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[calc(100vh-var(--header-height))] bg-[var(--color-bg-primary)]">
      {/* Endpoint sidebar */}
      <div className="w-80 border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-y-auto shrink-0 flex flex-col shadow-[1px_0_10px_rgba(0,0,0,0.1)] z-10">
        <div className="p-5 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] sticky top-0 z-20">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-cyan-500 flex items-center justify-center text-white text-xl shadow-lg shadow-[var(--color-accent-subtle)]">
              {api.icon}
            </div>
            <div>
              <h2 className="font-bold text-[var(--color-text-primary)] leading-tight">{api.name}</h2>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">v{api.version}</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4 group">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-accent)] transition-colors pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter endpoints..."
              className="w-full h-10 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-primary)] pl-[42px] pr-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)] transition-all shadow-inner"
            />
          </div>

          {/* Tab switches */}
          <div className="flex gap-1 bg-[var(--color-bg-primary)] p-1 rounded-lg border border-[var(--color-border)]">
            {(['endpoints', 'guide', 'sdks', 'changelog'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-[11px] rounded-md font-semibold transition-all cursor-pointer capitalize ${
                  activeTab === tab
                    ? 'bg-[var(--color-bg-elevated)] text-[var(--color-accent)] shadow-sm'
                    : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'endpoints' && (
          <div className="flex-1 overflow-y-auto pb-6">
            {Object.entries(filteredGrouped).map(([tag, eps]) => (
              <div key={tag} className="mb-2">
                <div className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-tertiary)] bg-gradient-to-r from-[var(--color-bg-tertiary)] to-transparent sticky top-0 backdrop-blur-md z-10">
                  {tag}
                </div>
                <div className="px-2 space-y-0.5">
                  {eps.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => setSelectedEndpoint(ep)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer group ${
                        selectedEndpoint?.id === ep.id
                          ? 'bg-[var(--color-accent-subtle)] border border-[var(--color-accent-border)]'
                          : 'border border-transparent hover:bg-[var(--color-bg-hover)]'
                      }`}
                    >
                      <MethodBadge method={ep.method} />
                      <span className={`truncate text-sm font-medium ${selectedEndpoint?.id === ep.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]'}`}>
                        {ep.path}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'endpoints' && selectedEndpoint && (
          <EndpointDetail endpoint={selectedEndpoint} baseUrl={api.baseUrl} />
        )}

        {activeTab === 'endpoints' && !selectedEndpoint && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <span className="text-4xl mb-4">{api.icon}</span>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              {api.name} Documentation
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-4 max-w-md">
              {api.description}
            </p>
            <p className="text-sm text-[var(--color-text-tertiary)]">
              Select an endpoint from the sidebar to view its documentation.
            </p>
          </div>
        )}

        {activeTab === 'guide' && api.docsContent && (
          <div className="prose prose-invert max-w-3xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{api.docsContent}</ReactMarkdown>
          </div>
        )}

        {activeTab === 'sdks' && api.sdks && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
              SDK & Libraries
            </h2>
            <div className="card-grid">
              {api.sdks.map((sdk) => (
                <a
                  key={sdk.name}
                  href={sdk.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  <Card hover>
                    <Badge variant="info" size="sm" className="mb-2">
                      {sdk.language}
                    </Badge>
                    <h3 className="font-mono text-sm text-[var(--color-text-primary)]">
                      {sdk.name}
                    </h3>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'changelog' && api.changelog && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
              Changelog
            </h2>
            <div className="space-y-4">
              {api.changelog.map((entry, i) => (
                <Card key={i}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={entry.type} size="sm">
                      {entry.type}
                    </Badge>
                    <span className="font-mono text-sm text-[var(--color-text-primary)]">
                      {entry.version}
                    </span>
                    <span className="text-xs text-[var(--color-text-tertiary)]">
                      {entry.date}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                    {entry.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {entry.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Endpoint detail view */
function EndpointDetail({
  endpoint,
  baseUrl,
}: {
  endpoint: EndpointDefinition;
  baseUrl: string;
}) {
  return (
    <div className="max-w-3xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <MethodBadge method={endpoint.method} />
        <code className="text-lg font-mono text-[var(--color-text-primary)]">
          {endpoint.path}
        </code>
        {endpoint.deprecated && (
          <Badge variant="warning" size="sm">
            Deprecated
          </Badge>
        )}
      </div>

      <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
        {endpoint.summary}
      </h2>
      <p className="text-[var(--color-text-secondary)] mb-6">
        {endpoint.description}
      </p>

      {/* Try it button */}
      <Link to={`/sandbox?endpoint=${endpoint.id}`}>
        <Button variant="accent" size="sm" className="mb-6">
          Try it in Sandbox →
        </Button>
      </Link>

      {/* URL */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
          Request URL
        </h3>
        <CodeBlock
          code={`${endpoint.method} ${baseUrl}${endpoint.path}`}
          language="http"
          showCopy
        />
      </div>

      {/* Parameters */}
      {endpoint.parameters.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Parameters
          </h3>
          <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-bg-tertiary)]">
                  <th className="text-left px-4 py-2 font-medium text-[var(--color-text-secondary)]">
                    Name
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-[var(--color-text-secondary)]">
                    In
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-[var(--color-text-secondary)]">
                    Type
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-[var(--color-text-secondary)]">
                    Required
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-[var(--color-text-secondary)]">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {endpoint.parameters.map((param) => (
                  <tr
                    key={param.name}
                    className="border-t border-[var(--color-border)]"
                  >
                    <td className="px-4 py-2 font-mono text-[var(--color-accent)]">
                      {param.name}
                    </td>
                    <td className="px-4 py-2">
                      <Badge variant="neutral" size="sm">
                        {param.in}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-[var(--color-text-secondary)]">
                      {param.schema?.type || 'string'}
                    </td>
                    <td className="px-4 py-2">
                      {param.required ? (
                        <span className="text-red-400 text-xs font-medium">Required</span>
                      ) : (
                        <span className="text-[var(--color-text-tertiary)] text-xs">Optional</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-[var(--color-text-secondary)]">
                      {param.description || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Body */}
      {endpoint.requestBody && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Request Body
          </h3>
          {Object.entries(endpoint.requestBody.content).map(
            ([contentType, media]) => (
              <div key={contentType}>
                <Badge variant="neutral" size="sm" className="mb-2">
                  {contentType}
                </Badge>
                {media.schema && (
                  <CodeBlock
                    code={JSON.stringify(media.schema, null, 2)}
                    language="json"
                    title="Schema"
                  />
                )}
              </div>
            ),
          )}
        </div>
      )}

      {/* Responses */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          Responses
        </h3>
        <div className="space-y-3">
          {Object.entries(endpoint.responses).map(([statusCode, response]) => (
            <Card key={statusCode}>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={
                    Number(statusCode) < 300
                      ? 'success'
                      : Number(statusCode) < 500
                        ? 'warning'
                        : 'error'
                  }
                  size="sm"
                >
                  {statusCode}
                </Badge>
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {response.description}
                </span>
              </div>
              {response.content &&
                Object.entries(response.content).map(
                  ([, media]) =>
                    media.schema && (
                      <CodeBlock
                        key={statusCode}
                        code={JSON.stringify(media.schema, null, 2)}
                        language="json"
                        title="Response Schema"
                        maxHeight="300px"
                      />
                    ),
                )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
