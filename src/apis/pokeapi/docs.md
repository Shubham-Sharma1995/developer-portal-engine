# Getting Started with PokéAPI

## Overview
PokéAPI provides a comprehensive RESTful API for accessing Pokémon game data. All responses are returned in JSON format.

## Base URL
```
https://pokeapi.co/api/v2
```

## Authentication
PokéAPI is a free, open API — **no authentication required**. However, please be respectful of rate limits.

## Rate Limiting
- **100 requests per minute** per IP address
- Use caching to minimize unnecessary requests
- Consider using the `limit` and `offset` parameters for pagination

## Quick Example
```bash
curl https://pokeapi.co/api/v2/pokemon/pikachu
```

## Response Format
All successful responses return JSON with the following structure:
- **List endpoints** return `{ count, next, previous, results }`
- **Detail endpoints** return the full resource object

## Error Handling
| Status Code | Description |
|---|---|
| 200 | Success |
| 404 | Resource not found |
| 429 | Rate limit exceeded |

## SDK Support
- **JavaScript**: Use `fetch` or `axios` with the base URL
- **Python**: `pokebase` or `requests` library
- **Ruby**: `pokemon_tcg_sdk` gem
