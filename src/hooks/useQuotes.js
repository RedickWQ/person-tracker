import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { storage, isLocal } from '../storage';

export function useQuotes(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;

  if (isLocal) {
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
      await storage.quotes.delete(id);
      await addQuote(content);
    }

    return { quotes: quotes || [], loading: false, addQuote, deleteQuote, updateQuote };
  }

  // Production: use remote API with manual refresh
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = useCallback(async () => {
    if (validGoalId === null) {
      setQuotes([]);
      setLoading(false);
      return;
    }
    try {
      const data = await storage.quotes.list(validGoalId);
      setQuotes(data);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setLoading(false);
    }
  }, [validGoalId]);

  useEffect(() => {
    fetchQuotes();
  }, [validGoalId, fetchQuotes]);

  async function addQuote(content) {
    if (validGoalId === null) return;
    if (!content.trim()) return;
    await storage.quotes.create(validGoalId, { content: content.trim() });
    const data = await storage.quotes.list(validGoalId);
    setQuotes(data);
  }

  async function deleteQuote(id) {
    await storage.quotes.delete(id);
    if (validGoalId !== null) {
      const data = await storage.quotes.list(validGoalId);
      setQuotes(data);
    }
  }

  async function updateQuote(id, content) {
    if (!content.trim()) return;
    await deleteQuote(id);
    await addQuote(content);
  }

  return { quotes, loading, addQuote, deleteQuote, updateQuote };
}
