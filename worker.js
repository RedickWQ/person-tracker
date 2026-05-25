/**
 * Person Tracker Worker
 * Serves frontend and API from D1
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // API requests - handle directly with D1
    if (path.startsWith('/api')) {
      return handleApiRequest(request, env);
    }

    // Serve static files from Workers Assets
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      // Fallback to index.html for SPA routing
      const indexRequest = new Request(`${url.origin}/index.html`, request);
      return await env.ASSETS.fetch(indexRequest);
    }
  },
};

async function handleApiRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '') || '/';
  const method = request.method;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // Goals endpoints
    if (path === '/goals' && method === 'GET') {
      const { results } = await env.DB.prepare('SELECT * FROM goals ORDER BY createdAt DESC').all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (path === '/goals' && method === 'POST') {
      const body = await request.json();
      const { title, description, goalType, status, progress, startDate, endDate, readingTime, totalReadingTime } = body;
      const result = await env.DB.prepare(`
        INSERT INTO goals (title, description, goalType, status, progress, startDate, endDate, readingTime, totalReadingTime, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `).bind(title, description || '', goalType || 'side_business', status || 'in_progress', progress || 0, startDate || null, endDate || null, readingTime || 0, totalReadingTime || null).run();
      const inserted = await env.DB.prepare('SELECT * FROM goals WHERE id = ?').bind(result.lastInsertId).first();
      return new Response(JSON.stringify(inserted), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (path.match(/^\/goals\/(\d+)$/) && method === 'GET') {
      const id = path.match(/^\/goals\/(\d+)$/)[1];
      const goal = await env.DB.prepare('SELECT * FROM goals WHERE id = ?').bind(id).first();
      return new Response(JSON.stringify(goal), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (path.match(/^\/goals\/(\d+)$/) && method === 'PUT') {
      const id = path.match(/^\/goals\/(\d+)$/)[1];
      const body = await request.json();
      const updates = [];
      const values = [];
      for (const [key, value] of Object.entries(body)) {
        if (key !== 'id' && key !== 'createdAt') {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
      if (updates.length > 0) {
        updates.push('updatedAt = datetime("now")');
        values.push(id);
        await env.DB.prepare(`UPDATE goals SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
      }
      const updated = await env.DB.prepare('SELECT * FROM goals WHERE id = ?').bind(id).first();
      return new Response(JSON.stringify(updated), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (path.match(/^\/goals\/(\d+)$/) && method === 'DELETE') {
      const id = path.match(/^\/goals\/(\d+)$/)[1];
      await env.DB.prepare('DELETE FROM goals WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Milestones
    if (path.match(/^\/goals\/(\d+)\/milestones$/) && method === 'GET') {
      const goalId = path.match(/^\/goals\/(\d+)\/milestones$/)[1];
      const { results } = await env.DB.prepare('SELECT * FROM milestones WHERE goalId = ? ORDER BY createdAt ASC').bind(goalId).all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (path.match(/^\/goals\/(\d+)\/milestones$/) && method === 'POST') {
      const goalId = path.match(/^\/goals\/(\d+)\/milestones$/)[1];
      const body = await request.json();
      const { title, completed, dueDate } = body;
      const result = await env.DB.prepare(`
        INSERT INTO milestones (goalId, title, completed, dueDate, createdAt)
        VALUES (?, ?, ?, ?, datetime('now'))
      `).bind(goalId, title, completed ? 1 : 0, dueDate || null).run();
      const inserted = await env.DB.prepare('SELECT * FROM milestones WHERE id = ?').bind(result.lastInsertId).first();
      return new Response(JSON.stringify(inserted), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (path.match(/^\/milestones\/(\d+)$/) && method === 'PUT') {
      const id = path.match(/^\/milestones\/(\d+)$/)[1];
      const body = await request.json();
      await env.DB.prepare('UPDATE milestones SET title = ?, completed = ?, dueDate = ? WHERE id = ?').bind(body.title, body.completed ? 1 : 0, body.dueDate || null, id).run();
      const updated = await env.DB.prepare('SELECT * FROM milestones WHERE id = ?').bind(id).first();
      return new Response(JSON.stringify(updated), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (path.match(/^\/milestones\/(\d+)$/) && method === 'DELETE') {
      const id = path.match(/^\/milestones\/(\d+)$/)[1];
      await env.DB.prepare('DELETE FROM milestones WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Daily Logs
    if (path.match(/^\/goals\/(\d+)\/logs$/) && method === 'GET') {
      const goalId = path.match(/^\/goals\/(\d+)\/logs$/)[1];
      const { results } = await env.DB.prepare('SELECT * FROM dailyLogs WHERE goalId = ? ORDER BY date DESC').bind(goalId).all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (path.match(/^\/goals\/(\d+)\/logs$/) && method === 'POST') {
      const goalId = path.match(/^\/goals\/(\d+)\/logs$/)[1];
      const body = await request.json();
      const result = await env.DB.prepare(`
        INSERT INTO dailyLogs (goalId, completedItems, output, date, createdAt)
        VALUES (?, ?, ?, ?, datetime('now'))
      `).bind(goalId, body.completedItems, body.output || '', body.date || new Date().toISOString().split('T')[0]).run();
      const inserted = await env.DB.prepare('SELECT * FROM dailyLogs WHERE id = ?').bind(result.lastInsertId).first();
      return new Response(JSON.stringify(inserted), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (path.match(/^\/logs\/(\d+)$/) && method === 'DELETE') {
      const id = path.match(/^\/logs\/(\d+)$/)[1];
      await env.DB.prepare('DELETE FROM dailyLogs WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Quotes
    if (path.match(/^\/goals\/(\d+)\/quotes$/) && method === 'GET') {
      const goalId = path.match(/^\/goals\/(\d+)\/quotes$/)[1];
      const { results } = await env.DB.prepare('SELECT * FROM quotes WHERE goalId = ? ORDER BY createdAt DESC').bind(goalId).all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (path.match(/^\/goals\/(\d+)\/quotes$/) && method === 'POST') {
      const goalId = path.match(/^\/goals\/(\d+)\/quotes$/)[1];
      const body = await request.json();
      const result = await env.DB.prepare(`
        INSERT INTO quotes (goalId, content, createdAt)
        VALUES (?, ?, datetime('now'))
      `).bind(goalId, body.content).run();
      const inserted = await env.DB.prepare('SELECT * FROM quotes WHERE id = ?').bind(result.lastInsertId).first();
      return new Response(JSON.stringify(inserted), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (path.match(/^\/quotes\/(\d+)$/) && method === 'DELETE') {
      const id = path.match(/^\/quotes\/(\d+)$/)[1];
      await env.DB.prepare('DELETE FROM quotes WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // All logs
    if (path === '/all-logs' && method === 'GET') {
      const { results } = await env.DB.prepare('SELECT * FROM dailyLogs ORDER BY date DESC').all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found', path }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
