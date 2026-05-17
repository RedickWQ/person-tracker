import { useState, useEffect } from 'react';

const API_BASE = '/api';

export function useGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  async function fetchGoals() {
    try {
      const res = await fetch(`${API_BASE}/goals`);
      const data = await res.json();
      setGoals(data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addGoal(goal) {
    const res = await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...goal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    });
    const newGoal = await res.json();
    setGoals(prev => [newGoal, ...prev]);
    return newGoal;
  }

  async function updateGoal(id, updates) {
    const res = await fetch(`${API_BASE}/goals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updates,
        updatedAt: new Date().toISOString()
      })
    });
    const updatedGoal = await res.json();
    setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g));
    return updatedGoal;
  }

  async function deleteGoal(id) {
    await fetch(`${API_BASE}/goals/${id}`, { method: 'DELETE' });
    setGoals(prev => prev.filter(g => g.id !== id));
  }

  return { goals, loading, addGoal, updateGoal, deleteGoal, refetch: fetchGoals };
}
