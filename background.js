// These constants are duplicated from the main app's constants.ts
// This is necessary because service workers cannot directly import from the app's modules without a bundler.
const initialTasks = [
    { id: 'task-1', name: 'Deep Work Session', duration: 45 },
    { id: 'task-2', name: 'Quick Review', duration: 25 },
    { id: 'task-3', name: 'Creative Brainstorming', duration: 60 },
];
const initialStats = {
    completedSessions: 0,
    interruptedSessions: 0,
    totalFocusTime: 0,
    sessionLogs: [],
};


const getStorageData = (keys) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => {
      resolve(result);
    });
  });
};

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'focusTimer') {
    const { activeTask, stats, timerState } = await getStorageData(['activeTask', 'stats', 'timerState']);
    
    if (!activeTask || !timerState) {
        // Alarm fired without an active task, clear it and exit.
        chrome.alarms.clear('focusTimer');
        return;
    }

    const timeElapsedInSeconds = timerState.taskDuration;
    const actualDurationMinutes = Math.round(timeElapsedInSeconds / 60);

    const sessionLog = {
      id: `session-${Date.now()}`,
      taskId: activeTask.id,
      taskName: activeTask.name,
      duration: activeTask.duration,
      actualDuration: actualDurationMinutes,
      startTime: timerState.targetEndTime - timeElapsedInSeconds * 1000,
      endTime: timerState.targetEndTime,
      status: 'completed',
    };
    
    const newStats = {
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
