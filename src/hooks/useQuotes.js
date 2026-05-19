import { useState, useEffect, useCallback } from 'react';
import { storage } from '../storage';

export function useQuotes(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;
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
  }, [fetchQuotes]);

  async function addQuote(content) {
    if (validGoalId === null) return;
    if (!content.trim()) return;
    const newQuote = await storage.quotes.create(validGoalId, { content: content.trim() });
    setQuotes(prev => [newQuote, ...prev]);
    return newQuote;
  }

  async function deleteQuote(id) {
    await storage.quotes.delete(id);
    setQuotes(prev => prev.filter(q => q.id !== id));
  }

  async function updateQuote(id, content) {
    if (!content.trim()) return;
    await deleteQuote(id);
    await addQuote(content);
  }

  return { quotes, loading, addQuote, deleteQuote, updateQuote };
}
