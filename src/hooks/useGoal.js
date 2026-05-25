import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { storage, isLocal } from '../storage';

export function useGoal(id) {
  const goalId = id !== null && id !== undefined ? Number(id) : null;
  const isValidId = !isNaN(goalId) && goalId !== null;

  if (isLocal) {
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

  // Production: use remote API
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoal = useCallback(async () => {
    if (!isValidId) {
      setGoal(null);
      setLoading(false);
      return;
    }

    try {
      const data = await storage.goals.get(goalId);
      setGoal(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [goalId, isValidId]);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  return { goal, loading, error };
}
