export const GoalStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAUSED: 'paused'
};

export const GoalType = {
  SIDE_BUSINESS: 'side_business',   // 副业
  THINKING: 'thinking',             // 思维训练
  EXERCISE: 'exercise',             // 锻炼
  READING: 'reading'                 // 阅读
};

export const GoalTypeConfig = {
  [GoalType.SIDE_BUSINESS]: { label: '副业', color: '#8B5CF6', icon: '💼' },
  [GoalType.THINKING]: { label: '思维训练', color: '#06B6D4', icon: '🧠' },
  [GoalType.EXERCISE]: { label: '锻炼', color: '#10B981', icon: '💪' },
  [GoalType.READING]: { label: '阅读', color: '#F59E0B', icon: '📚' }
};
