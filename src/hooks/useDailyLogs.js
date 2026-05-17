import { useState, useEffect } from 'react';

const API_BASE = '/api';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export function useDailyLogs(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (validGoalId !== null) {
      fetchLogs();
    } else {
      setLogs([]);
      setLoading(false);
    }
  }, [validGoalId]);

  async function fetchLogs() {
    try {
      const res = await fetch(`${API_BASE}/goals/${validGoalId}/logs`);
      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addLog(log) {
    if (validGoalId === null) return;
    const res = await fetch(`${API_BASE}/goals/${validGoalId}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...log,
        date: log.date || getTodayStr(),
        createdAt: new Date().toISOString()
      })
    });
    const newLog = await res.json();
    setLogs(prev => [newLog, ...prev]);
    return newLog;
  }

  async function deleteLog(id) {
    await fetch(`${API_BASE}/logs/${id}`, { method: 'DELETE' });
    setLogs(prev => prev.filter(l => l.id !== id));
  }

  return { logs, loading, addLog, deleteLog };
}
