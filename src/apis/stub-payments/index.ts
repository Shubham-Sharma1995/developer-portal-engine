import type { ApiDefinition } from '../types';
import type { ChangelogEntry } from '@/types/common';
import type { OpenAPISpec } from '@/types/openapi';
import docsContent from './docs.md?raw';
import changelog from './changelog.json';

import spec from './openapi.json';

export const stubPaymentsDefinition: ApiDefinition = {
  id: 'Demo-payments',
  name: 'Demo Payments',
  version: '1.0.0',
  spec: spec as unknown as OpenAPISpec,
  baseUrl: 'https://api.Demo.dev/v1',
  environments: {
    sandbox: 'https://sandbox.api.Demo.dev/v1',
    staging: 'https://staging.api.Demo.dev/v1',
    production: 'https://api.Demo.dev/v1'
  },
  description:
    'Process payments, manage customers, and handle refunds. This fictional API demonstrates portal extensibility.',
  icon: '💳',
  category: 'Payments',
  docsContent,
  changelog: changelog as unknown as ChangelogEntry[],
  sdks: [
    {
      language: 'JavaScript',
      name: '@Demo/payments-js',
      url: 'https://github.com/Demo/payments-js',
    },
    {
      language: 'Python',
      name: 'Demo-python',
      url: 'https://github.com/Demo/Demo-python',
    },
  ],
};
