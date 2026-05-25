import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { storage, isLocal } from '../storage';

export function useGoals() {
  if (isLocal) {
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

  // Production: use remote API with manual refresh
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    try {
      const data = await storage.goals.list();
      setGoals(data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  async function addGoal(goal) {
    await storage.goals.create(goal);
    const data = await storage.goals.list();
    setGoals(data);
  }

  async function updateGoal(id, updates) {
    await storage.goals.update(id, updates);
    const data = await storage.goals.list();
    setGoals(data);
  }

  async function deleteGoal(id) {
    await storage.goals.delete(id);
    const data = await storage.goals.list();
    setGoals(data);
  }

  return { goals, loading, addGoal, updateGoal, deleteGoal };
}
