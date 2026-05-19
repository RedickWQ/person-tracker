const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Goals
  goals: {
    list: () => request('/goals'),
    get: (id) => request(`/goals/${id}`),
    create: (data) => request('/goals', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/goals/${id}`, { method: 'DELETE' }),
  },

  // Milestones
  milestones: {
    list: (goalId) => request(`/goals/${goalId}/milestones`),
    create: (goalId, data) => request(`/goals/${goalId}/milestones`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/milestones/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/milestones/${id}`, { method: 'DELETE' }),
  },

  // Daily Logs
  logs: {
    list: (goalId) => request(`/goals/${goalId}/logs`),
    create: (goalId, data) => request(`/goals/${goalId}/logs`, { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => request(`/logs/${id}`, { method: 'DELETE' }),
  },

  // Quotes
  quotes: {
    list: (goalId) => request(`/goals/${goalId}/quotes`),
    create: (goalId, data) => request(`/goals/${goalId}/quotes`, { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => request(`/quotes/${id}`, { method: 'DELETE' }),
  },
};
