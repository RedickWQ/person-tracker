import { useLiveQuery } from 'dexie-react-hooks';
import { storage } from '../storage';

export function useGoals() {
  const goals = useLiveQuery(
    async () => storage.goals.list(),
    [],
    []
  );

  async function addGoal(goal) {
    return storage.goals.create(goal);
  }

  async function updateGoal(id, updates) {
    return storage.goals.update(id, updates);
  }

  async function deleteGoal(id) {
    await storage.goals.delete(id);
  }

  return { goals: goals || [], loading: false, addGoal, updateGoal, deleteGoal };
}
