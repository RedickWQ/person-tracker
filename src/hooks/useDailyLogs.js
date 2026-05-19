import { useState, useEffect, useCallback } from 'react';
import { storage } from '../storage';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export function useDailyLogs(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (validGoalId === null) {
      setLogs([]);
      setLoading(false);
      return;
    }
    try {
      const data = await storage.logs.list(validGoalId);
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  }, [validGoalId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  async function addLog(log) {
    if (validGoalId === null) return;
    const newLog = await storage.logs.create(validGoalId, {
      ...log,
      date: log.date || getTodayStr(),
    });
    setLogs(prev => [newLog, ...prev]);
    return newLog;
  }

  async function deleteLog(id) {
    await storage.logs.delete(id);
    setLogs(prev => prev.filter(l => l.id !== id));
  }

  return { logs, loading, addLog, deleteLog };
}
