import { initialTasks, initialStats } from './constants';
import { Task, Stats, TimerState, SessionLog } from './types';

interface StoredData {
    activeTask?: Task | null;
    stats?: Stats;
    timerState?: TimerState | null;
}

const getStorageData = (keys: string[]): Promise<StoredData> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => {
      resolve(result as StoredData);
    });
  });
};

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'focusTimer') {
    const { activeTask, stats, timerState } = await getStorageData(['activeTask', 'stats', 'timerState']);
    
    if (!activeTask || !timerState || !stats) {
        chrome.alarms.clear('focusTimer');
        return;
    }

    const timeElapsedInSeconds = timerState.taskDuration;
    const actualDurationMinutes = Math.round(timeElapsedInSeconds / 60);

    const sessionLog: SessionLog = {
      id: `session-${Date.now()}`,
      taskId: activeTask.id,
      taskName: activeTask.name,
      duration: activeTask.duration,
      actualDuration: actualDurationMinutes,
      startTime: timerState.targetEndTime - timeElapsedInSeconds * 1000,
      endTime: timerState.targetEndTime,
      status: 'completed',
    };
    
    const newStats: Stats = {
        ...stats,
        completedSessions: (stats.completedSessions || 0) + 1,
        totalFocusTime: (stats.totalFocusTime || 0) + actualDurationMinutes,
        sessionLogs: [...(stats.sessionLogs || []), sessionLog],
    };
    
    chrome.storage.local.set({
        stats: newStats,
        activeTask: null,
        timerState: null,
    });

    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icon128.png',
      title: 'Session Complete!',
      message: `Great work! You completed your focus session for "${activeTask.name}".`,
      priority: 2,
    });
  }
});

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.storage.local.set({
            tasks: initialTasks,
            stats: initialStats,
            activeTask: null,
            timerState: null,
        });
    }
});
