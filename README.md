# Developer Portal Engine

A production-ready, extensible developer portal built with React 19, Vite, Tailwind v4, TanStack Query, and Zustand.

## Prerequisites
- Node.js (v20 or higher)
- npm (v10 or higher)

## Installation & Setup
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Creating a Test User (Authentication)
This application uses Auth0 for authentication. The `.env` file must contain your Auth0 Domain and Client ID. 

1. Ensure your `.env` (copied from `.env.example`) has the correct Auth0 credentials.
2. Click **Login** on the portal landing page.
3. If this is your first time, click **Sign Up** on the Auth0 universal login page and create an account with any valid email and password.
4. You will be redirected back to the portal and logged in as a Developer.

## How to Add a New API
This portal uses a "zero-React-code" Extensibility Registry. You can add a new API in seconds.

1. **Create a Directory:** Under `src/apis/`, create a new folder (e.g., `src/apis/stripe/`).
2. **Add OpenAPI Spec:** Download the API's OpenAPI 3.x spec and save it as `src/apis/stripe/openapi.json`.
3. **Add Metadata:** Create an `index.ts` file in the folder that exports an `ApiDefinition` (including the icon, docs, and changelog).
4. **Register the API:** Open `src/apis/api-registry.ts` and add your new definition to the `API_REGISTRY` array.
```typescript
import { stripeDefinition } from './stripe';

export const API_REGISTRY: ApiDefinition[] = [
  pokeapiDefinition,
  stubPaymentsDefinition,
  stripeDefinition, // <--- Added here
];
```
The entire UI (Sidebar, Specs, Markdown Docs, Sandbox Forms, Search) will automatically render the new API!
