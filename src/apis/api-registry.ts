/**
 * API Registry — Single source of truth for all APIs in the portal.
 * ★ FUTURE EXTENSIBILITY: To add a new API, simply:
 * 1. Create a new folder under src/apis/your-api/
 * 2. Add openapi.json, index.ts
 * 3. Import and add to this array
 */
import type { ApiDefinition } from './types';
import { pokeapiDefinition } from './pokeapi';
import { stubPaymentsDefinition } from './stub-payments';

export const API_REGISTRY: ApiDefinition[] = [
  pokeapiDefinition,
  stubPaymentsDefinition,
];

export function getApiById(id: string): ApiDefinition | undefined {
  return API_REGISTRY.find((api) => api.id === id);
}

export function getDefaultApi(): ApiDefinition {
  return API_REGISTRY[0];
}
