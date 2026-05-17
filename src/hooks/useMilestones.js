import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { getNowStr } from '../utils/dateUtils';

export function useMilestones(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;

  const milestones = useLiveQuery(
    async () => {
      if (validGoalId === null) return [];
      return db.milestones
        .where('goalId')
        .equals(validGoalId)
        .toArray();
    },
    [validGoalId]
  );

  async function addMilestone(milestone) {
    if (validGoalId === null) return;
    await db.milestones.add({
      ...milestone,
      goalId: validGoalId,
      completed: false,
      createdAt: getNowStr()
    });
  }

  async function toggleMilestone(id, completed) {
    await db.milestones.update(id, { completed });
  }

  async function deleteMilestone(id) {
    await db.milestones.delete(id);
  }

  return { milestones: milestones || [], loading: false, addMilestone, toggleMilestone, deleteMilestone };
}
