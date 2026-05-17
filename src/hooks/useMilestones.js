import { useState, useEffect } from 'react';

const API_BASE = '/api';

export function useMilestones(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (validGoalId !== null) {
      fetchMilestones();
    } else {
      setMilestones([]);
      setLoading(false);
    }
  }, [validGoalId]);

  async function fetchMilestones() {
    try {
      const res = await fetch(`${API_BASE}/goals/${validGoalId}/milestones`);
      const data = await res.json();
      setMilestones(data);
    } catch (error) {
      console.error('Failed to fetch milestones:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addMilestone(milestone) {
    if (validGoalId === null) return;
    const res = await fetch(`${API_BASE}/goals/${validGoalId}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...milestone,
        completed: false,
        createdAt: new Date().toISOString()
      })
    });
    const newMilestone = await res.json();
    setMilestones(prev => [...prev, newMilestone]);
    return newMilestone;
  }

  async function toggleMilestone(id, completed) {
    const res = await fetch(`${API_BASE}/milestones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    const updatedMilestone = await res.json();
    setMilestones(prev => prev.map(m => m.id === id ? updatedMilestone : m));
  }

  async function deleteMilestone(id) {
    await fetch(`${API_BASE}/milestones/${id}`, { method: 'DELETE' });
    setMilestones(prev => prev.filter(m => m.id !== id));
  }

  return { milestones, loading, addMilestone, toggleMilestone, deleteMilestone };
}
