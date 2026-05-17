import { useMemo } from 'react';
import { GoalStatus } from '../../constants';

export function useQuote(goal) {
  // This hook is no longer used - quotes are managed through useQuotes hook
  return useMemo(() => {
    return null;
  }, [goal?.id]);
}
