import { useState, useEffect, useCallback } from 'react';
import { storage } from '../storage';

export function useMilestones(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMilestones = useCallback(async () => {
    if (validGoalId === null) {
      setMilestones([]);
      setLoading(false);
      return;
    }
    try {
      const data = await storage.milestones.list(validGoalId);
      setMilestones(data);
    } catch (error) {
      console.error('Failed to fetch milestones:', error);
    } finally {
      setLoading(false);
    }
  }, [validGoalId]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  async function addMilestone(data) {
    if (validGoalId === null) return;
    const newMilestone = await storage.milestones.create(validGoalId, data);
    setMilestones(prev => [...prev, newMilestone]);
    return newMilestone;
  }

  async function toggleMilestone(id, completed) {
    const updated = await storage.milestones.update(id, { completed });
    setMilestones(prev => prev.map(m => m.id === id ? updated : m));
    return updated;
  }

  async function deleteMilestone(id) {
    await storage.milestones.delete(id);
    setMilestones(prev => prev.filter(m => m.id !== id));
  }

  return { milestones, loading, addMilestone, toggleMilestone, deleteMilestone };
}
