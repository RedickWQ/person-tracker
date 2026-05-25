import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { storage } from '../storage';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export function useDailyLogs(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;

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
