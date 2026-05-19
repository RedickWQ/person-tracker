import { db } from '../db';

export const local = {
  // Goals
  goals: {
    list: () => db.goals.orderBy('createdAt').reverse().toArray(),
    get: (id) => db.goals.get(id),
    create: async (data) => {
      const id = await db.goals.add({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return db.goals.get(id);
    },
    update: async (id, data) => {
      await db.goals.update(id, { ...data, updatedAt: new Date().toISOString() });
      return db.goals.get(id);
    },
    delete: async (id) => {
      await db.goals.delete(id);
    },
  },

  // Milestones
  milestones: {
    list: (goalId) => db.milestones.where('goalId').equals(goalId).toArray(),
    create: async (goalId, data) => {
      const id = await db.milestones.add({
        ...data,
        goalId,
        createdAt: new Date().toISOString(),
      });
      return db.milestones.get(id);
    },
    update: async (id, data) => {
      await db.milestones.update(id, data);
      return db.milestones.get(id);
    },
    delete: async (id) => {
      await db.milestones.delete(id);
    },
  },

  // Daily Logs
  logs: {
    list: (goalId) => db.dailyLogs.where('goalId').equals(goalId).reverse().sortBy('date'),
    create: async (goalId, data) => {
      const id = await db.dailyLogs.add({
        ...data,
        goalId,
        date: data.date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      });
      return db.dailyLogs.get(id);
    },
    delete: async (id) => {
      await db.dailyLogs.delete(id);
    },
  },

  // Quotes
  quotes: {
    list: (goalId) => db.quotes.where('goalId').equals(goalId).toArray(),
    create: async (goalId, data) => {
      const id = await db.quotes.add({
        ...data,
        goalId,
        createdAt: new Date().toISOString(),
      });
      return db.quotes.get(id);
    },
    delete: async (id) => {
      await db.quotes.delete(id);
    },
  },
};
