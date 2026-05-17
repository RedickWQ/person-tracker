import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { getNowStr } from '../utils/dateUtils';

export function useQuotes(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;

  const quotes = useLiveQuery(
    async () => {
      if (validGoalId === null) return [];
      return db.quotes
        .where('goalId')
        .equals(validGoalId)
        .toArray();
    },
    [validGoalId]
  );

  async function addQuote(content) {
    if (validGoalId === null) return;
    if (!content.trim()) return;
    await db.quotes.add({
      goalId: validGoalId,
      content: content.trim(),
      createdAt: getNowStr()
    });
  }

  async function deleteQuote(id) {
    await db.quotes.delete(id);
  }

  async function updateQuote(id, content) {
    if (!content.trim()) return;
    await db.quotes.update(id, { content: content.trim() });
  }

  return {
    quotes: quotes || [],
    loading: false,
    addQuote,
    deleteQuote,
    updateQuote
  };
}
