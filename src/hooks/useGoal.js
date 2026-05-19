import { useState, useEffect, useCallback } from 'react';
import { storage } from '../storage';

export function useGoal(id) {
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoal = useCallback(async () => {
    if (id === null || id === undefined) {
      setGoal(null);
      setLoading(false);
      return;
    }

    const goalId = Number(id);
    if (isNaN(goalId)) {
      setGoal(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await storage.goals.get(goalId);
      setGoal(data);
    } catch (err) {
      setError(err.message);
      setGoal(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  return { goal, loading, error, refetch: fetchGoal };
}
