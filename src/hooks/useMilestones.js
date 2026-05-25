import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { storage, isLocal } from '../storage';

export function useMilestones(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;

  if (isLocal) {
    const milestones = useLiveQuery(
      async () => {
        if (validGoalId === null) return [];
        return storage.milestones.list(validGoalId);
      },
      [validGoalId],
      []
    );

    async function addMilestone(data) {
      if (validGoalId === null) return;
      return storage.milestones.create(validGoalId, data);
    }

    async function toggleMilestone(id, completed) {
      return storage.milestones.update(id, { completed });
    }

    async function deleteMilestone(id) {
      await storage.milestones.delete(id);
    }

    return { milestones: milestones || [], loading: false, addMilestone, toggleMilestone, deleteMilestone };
  }

  // Production: use remote API with manual refresh
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
  }, [validGoalId, fetchMilestones]);

  async function addMilestone(data) {
    if (validGoalId === null) return;
    await storage.milestones.create(validGoalId, data);
    const d = await storage.milestones.list(validGoalId);
    setMilestones(d);
  }

  async function toggleMilestone(id, completed) {
    await storage.milestones.update(id, { completed });
    if (validGoalId !== null) {
      const d = await storage.milestones.list(validGoalId);
      setMilestones(d);
    }
  }

  async function deleteMilestone(id) {
    await storage.milestones.delete(id);
    if (validGoalId !== null) {
      const d = await storage.milestones.list(validGoalId);
      setMilestones(d);
    }
  }

  return { milestones, loading, addMilestone, toggleMilestone, deleteMilestone };
}
