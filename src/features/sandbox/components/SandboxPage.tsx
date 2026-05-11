import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useApiKeyStore } from '@/features/keys/stores/apiKeyStore';
import { useEnvStore } from '@/stores/envStore';
import { API_REGISTRY, getDefaultApi } from '@/apis/api-registry';
import { parseOpenAPISpec, buildEndpointUrl } from '@/lib/spec-parser';
import { generateSnippet, type SnippetLanguage } from '@/lib/snippet-generator';
import { MethodBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { formatLatency, formatBytes } from '@/lib/utils';
import type { EndpointDefinition } from '@/types/openapi';
import type { SandboxResponse } from '@/types/common';

export function SandboxPage() {
  const [searchParams] = useSearchParams();
  const endpointParam = searchParams.get('endpoint');

  const [selectedApiId, setSelectedApiId] = useState(
    API_REGISTRY.find((api) =>
      parseOpenAPISpec(api.spec).some((e) => e.id === endpointParam),
    )?.id || getDefaultApi().id,
  );

  const api = API_REGISTRY.find((a) => a.id === selectedApiId) || getDefaultApi();
  const endpoints = useMemo(() => parseOpenAPISpec(api.spec), [api]);

  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDefinition | null>(
    endpoints.find((e) => e.id === endpointParam) || endpoints[0] || null,
  );

  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<SandboxResponse | null>(null);
  const [snippetLang, setSnippetLang] = useState<SnippetLanguage>('curl');

  // Pull active keys for auth injection
  const activeKeys = useApiKeyStore((state) => state.getActiveKeys());
  
  // Get active environment
  const { environment } = useEnvStore();

  // Determine base URL based on environment
  const activeBaseUrl = api.environments?.[environment] || api.baseUrl;
  
  // Determine proxy path based on environment (for demo purposes, use proxyPath if exists, else activeBaseUrl)
  const activeProxyUrl = api.proxyPath || activeBaseUrl;

  // Build current URL
  const currentUrl = selectedEndpoint
    ? buildEndpointUrl(activeBaseUrl, selectedEndpoint.path, pathParams, queryParams)
    : '';

  // Setup TanStack Query mutation for firing requests
  const sandboxMutation = useMutation({
    mutationFn: async () => {
      if (!selectedEndpoint) throw new Error('No endpoint selected');
      
      const start = performance.now();
      const url = buildEndpointUrl(
        activeProxyUrl,
        selectedEndpoint.path,
        pathParams,
        queryParams,
      );

      // Construct headers, automatically injecting API Key if available
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Look for a key that matches the current environment, otherwise use the first available
      // Note: we only map 'sandbox' and 'production' in Key Management right now. 
      // If environment is 'staging', it will fallback.
      const envForSearch = environment === 'production' ? 'production' : 'sandbox';
      const keyToUse = activeKeys.find(k => k.environment === envForSearch) || activeKeys[0];
      if (keyToUse) {
        // Standard injection (can be configured per-API via spec in a real system)
        headers['Authorization'] = `Bearer ${keyToUse.key}`;
        headers['x-api-key'] = keyToUse.key;
      }

      const res = await fetch(url, {
        method: selectedEndpoint.method,
        headers,
      });

      const text = await res.text();
      const latency = performance.now() - start;

      return {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: text,
        latencyMs: latency,
        size: new Blob([text]).size,
      } as SandboxResponse;
    },
    onSuccess: (data) => {
      setResponse(data);
    },
    onError: (err) => {
      setResponse({
        status: 0,
        statusText: 'Network Error',
        headers: {},
        body: JSON.stringify({ error: (err as Error).message }, null, 2),
        latencyMs: 0,
        size: 0,
      });
    }
  });

  const sendRequest = () => {
    setResponse(null);
    sandboxMutation.mutate();
  };

  // Generate code snippet
  const snippet = selectedEndpoint
    ? generateSnippet(snippetLang, {
      method: selectedEndpoint.method,
      url: currentUrl,
      headers: { 'Content-Type': 'application/json' },
    })
    : '';

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Endpoint selector */}
      <div className="w-64 border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-y-auto shrink-0">
        <div className="p-3">
          <select
            value={selectedApiId}
            onChange={(e) => {
              setSelectedApiId(e.target.value);
              setSelectedEndpoint(null);
              setResponse(null);
            }}
            className="w-full h-8 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-2 text-xs text-[var(--color-text-primary)] mb-2"
          >
            {API_REGISTRY.map((a) => (
              <option key={a.id} value={a.id}>
                {a.icon} {a.name}
              </option>
            ))}
          </select>
        </div>

        {endpoints.map((ep) => (
          <button
            key={ep.id}
            onClick={() => {
              setSelectedEndpoint(ep);
              setPathParams({});
              setQueryParams({});
              setResponse(null);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--color-bg-hover)] transition-colors cursor-pointer ${selectedEndpoint?.id === ep.id
              ? 'bg-[var(--color-accent-subtle)] border-r-2 border-[var(--color-accent)]'
              : ''
              }`}
          >
            <MethodBadge method={ep.method} />
            <span className="truncate text-xs text-[var(--color-text-secondary)]">
              {ep.path}
            </span>
          </button>
        ))}
      </div>

      {/* Request builder + Response */}
      <div className="flex-1 flex flex-col overflow-hidden ">
        {selectedEndpoint ? (
          <>
            {/* Request bar */}
            <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              <div className="flex items-center gap-3">
                <MethodBadge method={selectedEndpoint.method} />
                <div className="flex-1 font-mono text-sm text-[var(--color-text-primary)] bg-[var(--color-bg-tertiary)] rounded-lg px-3 py-4 border border-[var(--color-border)] truncate">
                  {currentUrl}
                </div>
                <Button onClick={sendRequest} isLoading={sandboxMutation.isPending} id="send-request">
                  Send
                </Button>
              </div>

              {/* Parameters */}
              {selectedEndpoint.parameters.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {selectedEndpoint.parameters.map((param) => (
                    <div key={param.name} className="flex flex-col gap-1">
                      <label className="text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                        {param.name}
                        {param.required && (
                          <span className="text-red-400 ml-1">*</span>
                        )}
                        <span className="ml-2 opacity-50">{param.in}</span>
                      </label>
                      <input
                        value={
                          param.in === 'path'
                            ? pathParams[param.name] || ''
                            : queryParams[param.name] || ''
                        }
                        onChange={(e) => {
                          if (param.in === 'path') {
                            setPathParams((prev) => ({
                              ...prev,
                              [param.name]: e.target.value,
                            }));
                          } else {
                            setQueryParams((prev) => ({
                              ...prev,
                              [param.name]: e.target.value,
                            }));
                          }
                        }}
                        placeholder={
                          param.example?.toString() ||
                          param.schema?.default?.toString() ||
                          param.name
                        }
                        className="h-8 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-2 text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Response + Snippets */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Code snippets */}
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    Code Snippet
                  </span>
                  <div className="flex gap-1 ml-auto">
                    {(['curl', 'javascript', 'python'] as SnippetLanguage[]).map(
                      (lang) => (
                        <button
                          key={lang}
                          onClick={() => setSnippetLang(lang)}
                          className={`px-2 py-1 text-[10px] rounded font-medium transition-all cursor-pointer capitalize ${snippetLang === lang
                            ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                            : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
                            }`}
                        >
                          {lang}
                        </button>
                      ),
                    )}
                  </div>
                </div>
                <CodeBlock code={snippet} language={snippetLang} maxHeight="200px" />
              </Card>

              {/* Response */}
              {response && (
                <Card className="animate-slide-in-up">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      Response
                    </span>
                    <span
                      className={`font-mono text-sm font-bold ${response.status < 300
                        ? 'text-emerald-400'
                        : response.status < 500
                          ? 'text-amber-400'
                          : 'text-red-400'
                        }`}
                    >
                      {response.status} {response.statusText}
                    </span>
                    <span className="text-xs text-[var(--color-text-tertiary)] ml-auto">
                      {formatLatency(response.latencyMs)} · {formatBytes(response.size)}
                    </span>
                  </div>
                  <CodeBlock
                    code={(() => {
                      try {
                        return JSON.stringify(JSON.parse(response.body), null, 2);
                      } catch {
                        return response.body;
                      }
                    })()}
                    language="json"
                    maxHeight="400px"
                  />
                </Card>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <span className="text-4xl mb-4 block">🧪</span>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                API Sandbox
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                Select an endpoint to start making requests.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
