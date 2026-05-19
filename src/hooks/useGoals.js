import { useState, useEffect, useCallback } from 'react';
import { storage } from '../storage';

export function useGoals() {
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
    const newGoal = await storage.goals.create(goal);
    setGoals(prev => [newGoal, ...prev]);
    return newGoal;
  }

  async function updateGoal(id, updates) {
    const updatedGoal = await storage.goals.update(id, updates);
    setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g));
    return updatedGoal;
  }

  async function deleteGoal(id) {
    await storage.goals.delete(id);
    setGoals(prev => prev.filter(g => g.id !== id));
  }

  return { goals, loading, addGoal, updateGoal, deleteGoal, refetch: fetchGoals };
}
