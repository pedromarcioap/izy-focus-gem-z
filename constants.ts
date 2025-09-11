import { Task, Stats } from './types';

export const initialTasks: Task[] = [
  { id: 'task-1', name: 'Deep Work Session', duration: 45 },
  { id: 'task-2', name: 'Quick Review', duration: 25 },
  { id: 'task-3', name: 'Creative Brainstorming', duration: 60 },
];

export const initialStats: Stats = {
  completedSessions: 0,
  interruptedSessions: 0,
  totalFocusTime: 0,
  sessionLogs: [],
};
