/**
 * Code snippet generators for the sandbox.
 * Each generator is a pure function — easy to test, easy to extend.
 */

interface SnippetContext {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

/**
 * Generate a cURL command
 */
export function generateCurl(ctx: SnippetContext): string {
  const parts = [`curl -X ${ctx.method}`];

  // URL
  parts.push(`  '${ctx.url}'`);

  // Headers
  for (const [key, value] of Object.entries(ctx.headers)) {
    if (value) {
      parts.push(`  -H '${key}: ${value}'`);
    }
  }

  // Body
  if (ctx.body && ['POST', 'PUT', 'PATCH'].includes(ctx.method)) {
    parts.push(`  -d '${ctx.body}'`);
  }

  return parts.join(' \\\n');
}

/**
 * Generate a JavaScript fetch() snippet
 */
export function generateJavaScript(ctx: SnippetContext): string {
  const hasBody = ctx.body && ['POST', 'PUT', 'PATCH'].includes(ctx.method);

  const options: string[] = [];
  options.push(`  method: '${ctx.method}',`);

  const headerEntries = Object.entries(ctx.headers).filter(([, v]) => v);
  if (headerEntries.length > 0) {
    options.push(`  headers: {`);
    for (const [key, value] of headerEntries) {
      options.push(`    '${key}': '${value}',`);
    }
    options.push(`  },`);
  }

  if (hasBody) {
    options.push(`  body: JSON.stringify(${ctx.body}),`);
  }

  return `const response = await fetch('${ctx.url}', {
${options.join('\n')}
});

const data = await response.json();
console.log(data);`;
}

/**
 * Generate a Python requests snippet
 */
export function generatePython(ctx: SnippetContext): string {
  const lines = ['import requests', ''];

  // URL
  lines.push(`url = '${ctx.url}'`);

  // Headers
  const headerEntries = Object.entries(ctx.headers).filter(([, v]) => v);
  if (headerEntries.length > 0) {
    lines.push(`headers = {`);
    for (const [key, value] of headerEntries) {
      lines.push(`    '${key}': '${value}',`);
    }
    lines.push(`}`);
  }

  // Request
  const method = ctx.method.toLowerCase();
  const args = [];
  if (headerEntries.length > 0) args.push('headers=headers');
  if (ctx.body && ['post', 'put', 'patch'].includes(method)) {
    args.push(`json=${ctx.body}`);
  }

  lines.push('');
  lines.push(`response = requests.${method}(url${args.length ? ', ' + args.join(', ') : ''})`);
  lines.push(`print(response.json())`);

  return lines.join('\n');
}

export type SnippetLanguage = 'curl' | 'javascript' | 'python';

const generators: Record<SnippetLanguage, (ctx: SnippetContext) => string> = {
  curl: generateCurl,
  javascript: generateJavaScript,
  python: generatePython,
};

export function generateSnippet(language: SnippetLanguage, ctx: SnippetContext): string {
  return generators[language](ctx);
}
