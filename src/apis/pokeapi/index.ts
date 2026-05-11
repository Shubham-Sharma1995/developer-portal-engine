import type { ApiDefinition } from '../types';
import type { ChangelogEntry } from '@/types/common';
import spec from './openapi.json';
import type { OpenAPISpec } from '@/types/openapi';

import docsContent from './docs.md?raw';
import changelog from './changelog.json';

export const pokeapiDefinition: ApiDefinition = {
  id: 'pokeapi',
  name: 'PokéAPI',
  version: '2.0.0',
  spec: spec as unknown as OpenAPISpec,
  baseUrl: 'https://pokeapi.co/api/v2',
  proxyPath: '/pokeapi/api/v2',
  environments: {
    sandbox: 'https://pokeapi.co/api/v2',
    staging: 'https://beta.pokeapi.co/api/v2',
    production: 'https://pokeapi.co/api/v2'
  },
  description:
    'The RESTful Pokémon API — access data for 1,300+ Pokémon, moves, abilities, types, berries, and more.',
  icon: '⚡',
  category: 'Data',
  docsContent,
  changelog: changelog as unknown as ChangelogEntry[],
  sdks: [
    {
      language: 'JavaScript',
      name: 'pokedex-promise-v2',
      url: 'https://github.com/PokeAPI/pokedex-promise-v2',
    },
    {
      language: 'Python',
      name: 'pokebase',
      url: 'https://github.com/PokeAPI/pokebase',
    },
    {
      language: 'Ruby',
      name: 'poke-api-v2',
      url: 'https://github.com/rdavid1099/poke-api-v2',
    },
  ],
};
