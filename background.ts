import { initialTasks, initialStats, DEFAULT_BLOCKED_SITES } from './constants';
import { Task, Stats, TimerState, SessionLog } from './types';

interface StoredData {
    activeTask?: Task | null;
    stats?: Stats;
    timerState?: TimerState | null;
    blockedSites?: string[];
}

const getStorageData = (keys: string[]): Promise<StoredData> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => {
      resolve(result as StoredData);
    });
  });
};

// New blocking logic using chrome.tabs.onUpdated
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading" && tab.url) {
    const { activeTask, blockedSites } = await getStorageData(['activeTask', 'blockedSites']);
    const url = new URL(tab.url);

    console.log('onUpdated fired for:', tab.url);
    console.log('Inside onUpdated - activeTask:', activeTask);
    console.log('Inside onUpdated - blockedSites:', blockedSites);
    console.log('Inside onUpdated - hostname:', url.hostname);

    if (activeTask && blockedSites && blockedSites.length > 0) {
      const isBlocked = blockedSites.some(blockedDomain => url.hostname.includes(blockedDomain));
      console.log('Is blocked:', isBlocked);
      if (isBlocked) {
        console.log(`Redirecting: ${tab.url}`);
        chrome.tabs.update(tabId, { url: chrome.runtime.getURL("blocked.html") });
      }
    }
  }
});


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
      id: `session-${timerState.targetEndTime}`,
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
            blockedSites: DEFAULT_BLOCKED_SITES,
        });
    }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});