import { useLiveQuery } from 'dexie-react-hooks';
import { storage } from '../storage';

export function useGoal(id) {
  const goalId = id !== null && id !== undefined ? Number(id) : null;
  const isValidId = !isNaN(goalId) && goalId !== null;

  const goal = useLiveQuery(
    async () => {
      if (!isValidId) return null;
      return storage.goals.get(goalId);
    },
    [goalId],
    null
  );

  return { goal, loading: false, error: null };
}
