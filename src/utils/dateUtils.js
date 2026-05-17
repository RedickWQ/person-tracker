import { format, formatDistanceToNow, isToday, isYesterday, parseISO, subDays, differenceInDays, startOfWeek, startOfMonth } from 'date-fns';

export function formatDate(date, pattern = 'yyyy-MM-dd') {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern);
}

export function formatRelativeDate(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return '今天';
  if (isYesterday(d)) return '昨天';
  return formatDistanceToNow(d, { addSuffix: true });
}

export function getTodayStr() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getNowStr() {
  return new Date().toISOString();
}

export function calculateCurrentStreak(uniqueDates) {
  if (!uniqueDates || uniqueDates.length === 0) return 0;

  const sorted = [...new Set(uniqueDates)].sort().reverse();
  const today = getTodayStr();
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  if (!sorted.includes(today) && !sorted.includes(yesterday)) return 0;

  let streak = 0;
  const checkDate = new Date(sorted.includes(today) ? today : yesterday);

  for (const dateStr of sorted) {
    const expected = format(checkDate, 'yyyy-MM-dd');
    if (dateStr === expected) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (new Date(dateStr) < checkDate) {
      break;
    }
  }

  return streak;
}

export function calculateLongestStreak(uniqueDates) {
  if (!uniqueDates || uniqueDates.length === 0) return 0;

  const sorted = [...new Set(uniqueDates)].sort();
  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

export { startOfWeek, startOfMonth };
