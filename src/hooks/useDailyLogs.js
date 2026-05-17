import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { getNowStr, getTodayStr } from '../utils/dateUtils';

export function useDailyLogs(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;

  const logs = useLiveQuery(
    async () => {
      if (validGoalId === null) return [];
      return db.dailyLogs
        .where('goalId')
        .equals(validGoalId)
        .sortBy('date');
    },
    [validGoalId]
  );

  async function addLog(log) {
    if (validGoalId === null) return;
    await db.dailyLogs.add({
      ...log,
      goalId: validGoalId,
      date: log.date || getTodayStr(),
      createdAt: getNowStr()
    });
  }

  async function updateLog(id, updates) {
    await db.dailyLogs.update(id, updates);
  }

  async function deleteLog(id) {
    await db.dailyLogs.delete(id);
  }

  return { logs: logs || [], loading: false, addLog, updateLog, deleteLog };
}
