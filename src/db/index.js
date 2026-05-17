import Dexie from 'dexie';

export const db = new Dexie('PersonTrackerDB');

db.version(1).stores({
  goals: '++id, title, description, status, createdAt, updatedAt',
  milestones: '++id, goalId, title, completed, dueDate, createdAt',
  dailyLogs: '++id, goalId, date, completedItems, output, createdAt'
});

db.version(2).stores({
  goals: '++id, title, description, status, createdAt, updatedAt',
  milestones: '++id, goalId, title, completed, dueDate, createdAt',
  dailyLogs: '++id, goalId, date, completedItems, output, createdAt'
}).upgrade(tx => {
  return tx.dailyLogs.toCollection().modify(log => {
    if (log.result !== undefined) {
      log.completedItems = log.result;
      delete log.result;
    }
    if (log.progress !== undefined) {
      delete log.progress;
    }
  });
});

db.version(3).stores({
  goals: '++id, title, description, status, startDate, endDate, createdAt, updatedAt',
  milestones: '++id, goalId, title, completed, dueDate, createdAt',
  dailyLogs: '++id, goalId, date, completedItems, output, createdAt'
});

db.version(4).stores({
  goals: '++id, title, description, status, progress, startDate, endDate, createdAt, updatedAt',
  milestones: '++id, goalId, title, completed, dueDate, createdAt',
  dailyLogs: '++id, goalId, date, completedItems, output, createdAt'
});

db.version(5).stores({
  goals: '++id, title, description, status, progress, startDate, endDate, createdAt, updatedAt',
  milestones: '++id, goalId, title, completed, dueDate, createdAt',
  dailyLogs: '++id, goalId, date, completedItems, output, createdAt',
  quotes: '++id, content, createdAt'
});

db.version(6).stores({
  goals: '++id, title, description, status, progress, startDate, endDate, createdAt, updatedAt',
  milestones: '++id, goalId, title, completed, dueDate, createdAt',
  dailyLogs: '++id, goalId, date, completedItems, output, createdAt',
  quotes: '++id, goalId, content, createdAt'
}).upgrade(tx => {
  return tx.quotes.toCollection().modify(quote => {
    quote.goalId = null;
  });
});

export const GoalStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAUSED: 'paused'
};
