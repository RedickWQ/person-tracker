import { useState, useEffect } from 'react';

const API_BASE = '/api';

export function useQuotes(goalId) {
  const validGoalId = typeof goalId === 'number' && !isNaN(goalId) ? goalId : null;
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (validGoalId !== null) {
      fetchQuotes();
    } else {
      setQuotes([]);
      setLoading(false);
    }
  }, [validGoalId]);

  async function fetchQuotes() {
    try {
      const res = await fetch(`${API_BASE}/goals/${validGoalId}/quotes`);
      const data = await res.json();
      setQuotes(data);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addQuote(content) {
    if (validGoalId === null) return;
    if (!content.trim()) return;
    const res = await fetch(`${API_BASE}/goals/${validGoalId}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: content.trim(),
        createdAt: new Date().toISOString()
      })
    });
    const newQuote = await res.json();
    setQuotes(prev => [newQuote, ...prev]);
    return newQuote;
  }

  async function deleteQuote(id) {
    await fetch(`${API_BASE}/quotes/${id}`, { method: 'DELETE' });
    setQuotes(prev => prev.filter(q => q.id !== id));
  }

  async function updateQuote(id, content) {
    if (!content.trim()) return;
    // D1 API doesn't have update for quotes, so we delete and recreate
    await deleteQuote(id);
    await addQuote(content);
  }

  return {
    quotes,
    loading,
    addQuote,
    deleteQuote,
    updateQuote
  };
}
