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
  focusPoints: 0,
};

export const GARDEN_STORE_ITEMS = [
    { id: 'tree1', name: 'Sturdy Oak', cost: 50 },
    { id: 'tree2', name: 'Tall Pine', cost: 75 },
    { id: 'flowers', name: 'Flower Patch', cost: 30 },
    { id: 'rock', name: 'Mossy Rock', cost: 20 },
    { id: 'pond', name: 'Serene Pond', cost: 150 },
];
