import { useLiveQuery } from 'dexie-react-hooks';
import { storage } from '../storage';

export function useMilestones(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;

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
