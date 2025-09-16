import { initialTasks, initialStats } from './constants';
import { Task, Stats, TimerState, SessionLog } from './types';

const BLOCKER_RULE_ID = 1;

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

const updateBlockingRules = async () => {
    const { activeTask, blockedSites } = await getStorageData(['activeTask', 'blockedSites']);

    if (!activeTask || !blockedSites || blockedSites.length === 0) {
        // No active session or no sites to block, so remove any existing rules.
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [BLOCKER_RULE_ID]
        }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error clearing blocking rules:', chrome.runtime.lastError);
            } else {
                console.log('Blocking rules cleared.');
            }
        });
        return;
    }

    // There is an active session and a blocklist, so create the rules.
    const newRule: chrome.declarativeNetRequest.Rule = {
        id: BLOCKER_RULE_ID,
        priority: 1,
        action: { type: 'block' as chrome.declarativeNetRequest.RuleActionType.BLOCK },
        condition: {
            resourceTypes: ['main_frame' as chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
            domains: blockedSites,
        }
    };

    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [BLOCKER_RULE_ID], // Remove old rule first
        addRules: [newRule]
    }, () => {
        if (chrome.runtime.lastError) {
            console.error('Error updating blocking rules:', chrome.runtime.lastError);
        } else {
            console.log('Blocking rules updated for sites:', blockedSites);
        }
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
        focusPoints: (stats.focusPoints || 0) + actualDurationMinutes,
    };

    chrome.storage.local.set({
        stats: newStats,
        activeTask: null,
        timerState: null,
    });

    // No need to call updateBlockingRules() here, as the storage change listener will handle it.

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
            blockedSites: [],
        });
    }
    // Ensure rules are cleared on installation
    updateBlockingRules();
});

// Listen for changes in storage to update blocking rules dynamically
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && (changes.activeTask || changes.blockedSites)) {
        updateBlockingRules();
    }
});

// Open the side panel on the action button click.
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});
