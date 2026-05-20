/**
 * Cloudflare Pages Middleware
 * Proxies /api/* requests to the D1 API backend
 */

const API_URL = 'https://person-tracker-api.p33099894.workers.dev';

export async function onRequest({ request }) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api')) {
    const apiPath = url.pathname.replace('/api', '');
    const apiUrl = `${API_URL}/api${apiPath || '/'}`;

    const response = await fetch(apiUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: request.body,
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return fetch(request);
}
