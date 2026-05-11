import type { OpenAPISpec } from '@/types/openapi';
import type { ChangelogEntry, SdkLink } from '@/types/common';

export interface ApiDefinition {

  id: string;
  name: string;
  version: string; //API Version
  spec: OpenAPISpec; //OpenAPI 3.x specification
  docsContent?: string;//markdown content 
  changelog?: ChangelogEntry[];
  sdks?: SdkLink[];
  baseUrl: string;//Base URL for sandbox 
  proxyPath?: string;//Optional proxy path (for CORS)
  description?: string; //Description on API Catalog
  icon?: string;
  category?: string;
  environments?: Record<string, string>;
}
