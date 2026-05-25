import { useLiveQuery } from 'dexie-react-hooks';
import { storage } from '../storage';

export function useQuotes(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;

  const quotes = useLiveQuery(
    async () => {
      if (validGoalId === null) return [];
      return storage.quotes.list(validGoalId);
    },
    [validGoalId],
    []
  );

  async function addQuote(content) {
    if (validGoalId === null) return;
    if (!content.trim()) return;
    return storage.quotes.create(validGoalId, { content: content.trim() });
  }

  async function deleteQuote(id) {
    await storage.quotes.delete(id);
  }

  async function updateQuote(id, content) {
    if (!content.trim()) return;
    await deleteQuote(id);
    await addQuote(content);
  }

  return { quotes: quotes || [], loading: false, addQuote, deleteQuote, updateQuote };
}
