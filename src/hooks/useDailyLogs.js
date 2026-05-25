import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { storage, isLocal } from '../storage';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export function useDailyLogs(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;

  // Local development: use useLiveQuery for reactive updates
  if (isLocal) {
    const logs = useLiveQuery(
      async () => {
        if (validGoalId === null) return [];
        return storage.logs.list(validGoalId);
      },
      [validGoalId],
      []
    );

    async function addLog(log) {
      if (validGoalId === null) return;
      return storage.logs.create(validGoalId, {
        ...log,
        date: log.date || getTodayStr(),
      });
    }

    async function deleteLog(id) {
      await storage.logs.delete(id);
    }

    return { logs: logs || [], loading: false, addLog, deleteLog };
  }

  // Production: use remote API with manual refresh
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
  }, [validGoalId]);

  async function addLog(log) {
    if (validGoalId === null) return;
    await storage.logs.create(validGoalId, {
      ...log,
      date: log.date || getTodayStr(),
    });
    // Refetch after mutation
    const data = await storage.logs.list(validGoalId);
    setLogs(data);
  }

  async function deleteLog(id) {
    await storage.logs.delete(id);
    // Refetch after mutation
    if (validGoalId !== null) {
      const data = await storage.logs.list(validGoalId);
      setLogs(data);
    }
  }

  return { logs, loading, addLog, deleteLog };
}
