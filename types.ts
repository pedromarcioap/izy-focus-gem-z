export interface Task {
  id: string;
  name: string;
  duration: number; // in minutes
}

export interface SessionLog {
  id: string;
  taskId: string;
  taskName: string;
  duration: number; // planned duration in minutes
  actualDuration: number; // actual duration in minutes
  startTime: number; // timestamp
  endTime: number; // timestamp
  status: 'completed' | 'interrupted';
}

export interface Stats {
  completedSessions: number;
  interruptedSessions: number;
  totalFocusTime: number; // in minutes
  sessionLogs: SessionLog[];
}

export interface TimerState {
  targetEndTime: number; // timestamp
  taskDuration: number; // in seconds
}

export type View = 'DASHBOARD' | 'STATS';
