/**
 * Person Tracker Worker
 * Serves frontend and proxies API requests
 */

const PAGES_URL = 'https://06614eef.person-tracker.pages.dev';
const API_URL = 'https://person-tracker-api.p33099894.workers.dev';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // API requests: proxy to person-tracker-api
    if (path.startsWith('/api')) {
      const apiUrl = `${API_URL}${path}`;
      return fetch(apiUrl, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: request.body,
      });
    }

    // For all other requests, fetch from Pages and return
    const pagesUrl = `${PAGES_URL}${path === '/' ? '/index.html' : path}`;
    const response = await fetch(pagesUrl);

    if (response.ok) {
      return response;
    }

    // Fallback to index.html for SPA routing
    const indexResponse = await fetch(`${PAGES_URL}/index.html`);
    return indexResponse;
  }
};
