import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { GoalStatus } from '../../db';

export function useQuote(goal) {
  const quotes = useLiveQuery(
    async () => {
      return db.quotes.toArray();
    },
    []
  );

  return useMemo(() => {
    if (!quotes || quotes.length === 0) {
      return null;
    }

    // 随机选择一条
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }, [quotes, goal?.id, goal?.progress, goal?.status]);
}

export function useDashboardQuote() {
  const quotes = useLiveQuery(
    async () => {
      return db.quotes.toArray();
    },
    []
  );

  return useMemo(() => {
    if (!quotes || quotes.length === 0) {
      return null;
    }

    // 随机选择一条
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }, [quotes]);
}
