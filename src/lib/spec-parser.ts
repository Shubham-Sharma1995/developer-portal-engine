import type {
  OpenAPISpec,
  OpenAPIPathItem,
  OpenAPIOperation,
  EndpointDefinition,
} from '@/types/openapi';

/**
 * Parses an OpenAPI 3.x spec into a flat array of EndpointDefinition.
 * This is the core transformation that powers the docs and sandbox.
 *
 * Design: Pure function, no side effects, easily testable.
 */
export function parseOpenAPISpec(spec: OpenAPISpec): EndpointDefinition[] {
  const endpoints: EndpointDefinition[] = [];

  for (const [path, pathItem] of Object.entries(spec.paths)) {
    const methods = ['get', 'post', 'put', 'patch', 'delete'] as const;

    for (const method of methods) {
      const operation = (pathItem as OpenAPIPathItem)[method];
      if (!operation) continue;

      endpoints.push(operationToEndpoint(method.toUpperCase() as EndpointDefinition['method'], path, operation));
    }
  }

  return endpoints;
}

function operationToEndpoint(
  method: EndpointDefinition['method'],
  path: string,
  operation: OpenAPIOperation,
): EndpointDefinition {
  return {
    id: operation.operationId || `${method.toLowerCase()}-${path.replace(/[^a-zA-Z0-9]/g, '-')}`,
    method,
    path,
    summary: operation.summary || '',
    description: operation.description || '',
    tags: operation.tags || [],
    parameters: operation.parameters || [],
    requestBody: operation.requestBody,
    responses: operation.responses,
    deprecated: operation.deprecated || false,
    operationId: operation.operationId,
  };
}

/**
 * Group endpoints by their first tag
 */
export function groupEndpointsByTag(
  endpoints: EndpointDefinition[],
): Record<string, EndpointDefinition[]> {
  const groups: Record<string, EndpointDefinition[]> = {};

  for (const endpoint of endpoints) {
    const tag = endpoint.tags[0] || 'Other';
    if (!groups[tag]) {
      groups[tag] = [];
    }
    groups[tag].push(endpoint);
  }

  return groups;
}

/**
 * Get all unique tags from endpoints
 */
export function getUniqueTags(endpoints: EndpointDefinition[]): string[] {
  const tags = new Set<string>();
  for (const endpoint of endpoints) {
    for (const tag of endpoint.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags);
}

/**
 * Build the full URL for an endpoint with path parameters substituted
 */
export function buildEndpointUrl(
  baseUrl: string,
  path: string,
  pathParams: Record<string, string>,
  queryParams: Record<string, string>,
): string {
  let url = `${baseUrl}${path}`;

  // Replace path parameters
  for (const [key, value] of Object.entries(pathParams)) {
    url = url.replace(`{${key}}`, encodeURIComponent(value));
  }

  // Add query parameters
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (value) searchParams.append(key, value);
  }

  const queryString = searchParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return url;
}
