import { useLiveQuery } from 'dexie-react-hooks';
import { db, GoalStatus } from '../db';
import { getNowStr } from '../utils/dateUtils';

export function useGoals() {
  const goals = useLiveQuery(
    () => db.goals.orderBy('createdAt').reverse().toArray(),
    []
  );

  async function addGoal(goal) {
    const now = getNowStr();
    await db.goals.add({
      ...goal,
      status: goal.status || GoalStatus.NOT_STARTED,
      createdAt: now,
      updatedAt: now
    });
  }

  async function updateGoal(id, updates) {
    await db.goals.update(id, {
      ...updates,
      updatedAt: getNowStr()
    });
  }

  async function deleteGoal(id) {
    await db.goals.delete(id);
    await db.milestones.where('goalId').equals(id).delete();
    await db.dailyLogs.where('goalId').equals(id).delete();
  }

  return { goals: goals || [], loading: false, addGoal, updateGoal, deleteGoal };
}
