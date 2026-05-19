import { useState, useEffect } from 'react';

const API_BASE = '/api';

export function useGoal(id) {
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    let cancelled = false;

    async function fetchGoal() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/goals/${goalId}`);
        if (!res.ok) {
          throw new Error('Goal not found');
        }
        const data = await res.json();
        if (!cancelled) {
          setGoal(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setGoal(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchGoal();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { goal, loading, error };
}
