# AI Tool Usage Log (PROMPTS.md)

As per the Take-Home Assignment AI Tool Usage Policy, this document tracks the usage of AI tools during the development of the KULU Developer Portal. 

The primary AI tool used was an Agentic AI Coding Assistant (Antigravity Model - Claude 3.5 Sonnet / Gemini 1.5 Pro).

---

## Prompt Log

### Entry 001
**Tool:** Claude 3.5 Sonnet (Agent)
**Goal:** Establish the foundation and design tokens using Tailwind v4.
**Prompt:** 
> "I want to build a fintech developer portal using React 19, Vite, and Tailwind v4. Please help me set up the `index.css` file with a dark-first, premium fintech design system using native CSS variables instead of a `tailwind.config.js`. Ensure it includes logical padding, gradients, and custom border-radius tokens."
**Outcome:** Used as-is. The agent generated the massive `index.css` file containing all the CSS custom properties that drive our dynamic theming, aligning perfectly with modern Tailwind v4 practices.

### Entry 002
**Tool:** Claude 3.5 Sonnet (Agent)
**Goal:** Architecture for extensibility (API Registry & Spec Parsing).
**Prompt:** 
> "We need to ensure that new APIs can be added to the portal without changing any React code. Let's create an `api-registry.ts` file that acts as the single source of truth. Then, write a `spec-parser.ts` utility that takes an `openapi.json` file and shreds it into a clean `EndpointDefinition[]` array that the Sidebar, Sandbox, and Docs components can map over."
**Outcome:** Used with minor adaptations. The AI successfully generated the parsing logic. I manually cleaned up the type definitions (`src/types/openapi.ts`) to ensure it strictly handled edge cases like missing parameters or complex request bodies.

### Entry 003
**Tool:** Claude 3.5 Sonnet (Agent)
**Goal:** Interactive Sandbox Data Fetching.
**Prompt:** 
> "Refactor the SandboxPage to use `@tanstack/react-query`. Replace the manual `useEffect` and `fetch` calls with a `useMutation`. It needs to dynamically construct the URL from the `pathParams` and `queryParams`, and it needs to automatically inject an API key into the headers."
**Outcome:** Used as-is. The AI installed the `@tanstack/react-query` package and refactored the fetch logic perfectly, eliminating manual loading states and drastically improving the Sandbox stability.

### Entry 004
**Tool:** Claude 3.5 Sonnet (Agent)
**Goal:** Zustand State Management for API Keys and Environments.
**Prompt:** 
> "Implement an `apiKeyStore` using Zustand with the `persist` middleware so keys survive page refreshes. Then, implement an `envStore` to handle switching between Sandbox, Staging, and Production. Finally, update the `Header` and `SandboxPage` so that when the user switches environments, the Sandbox automatically targets the correct base URL and selects the correct environment-specific API key from the Zustand vault."
**Outcome:** Used as-is. The AI perfectly wired the global state stores together, allowing the portal to intelligently switch API keys and base URLs without any complex prop-drilling.

### Entry 005
**Tool:** GitHub Copilot (Inline)
**Goal:** Code snippets generation.
**Prompt:** `// generate curl snippet with headers and body`
**Outcome:** Accepted with modifications. Copilot generated the basic template string for the `cURL` request in `snippet-generator.ts`. I manually adapted the formatting to ensure proper escaping of JSON strings in the shell command.

---

*Note to Reviewer: The AI was used strictly as a pair-programming tool to accelerate boilerplate, architect the global state stores, and handle complex string-parsing algorithms (like the OpenAPI parser). All architectural decisions (like CSS-first theming and the registry plugin pattern) were deliberately chosen to maximize scalability and extensibility.*
