import React, { useState, useCallback } from 'react';
import { useStorage } from './hooks/useStorage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StatsPage from './components/StatsPage';
import BlocklistManager from './components/BlocklistManager';
import GardenPage from './components/GardenPage';
import AISettings from './components/AISettings';
import { initialTasks, initialStats, DEFAULT_BLOCKED_SITES } from './constants';
import FocusTimer from './components/FocusTimer';
import { Task, Stats, TimerState, View, SessionLog } from './types';

const App = () => {
  const [view, setView] = useState<View>('DASHBOARD');

  const [tasks, setTasks, tasksLoaded] = useStorage<Task[]>('tasks', initialTasks);
  const [stats, setStats, statsLoaded] = useStorage<Stats>('stats', initialStats);
  const [activeTask, setActiveTask, activeTaskLoaded] = useStorage<Task | null>('activeTask', null);
  const [timerState, setTimerState, timerStateLoaded] = useStorage<TimerState | null>('timerState', null);
  const [blockedSites, setBlockedSites, blockedSitesLoaded] = useStorage<string[]>('blockedSites', DEFAULT_BLOCKED_SITES);
  const [openRouterApiKey, setOpenRouterApiKey, openRouterApiKeyLoaded] = useStorage<string>('openRouterApiKey', '');
  const [openRouterModel, setOpenRouterModel, openRouterModelLoaded] = useStorage<string>('openRouterModel', 'openai/gpt-3.5-turbo');

  const isStorageLoaded = tasksLoaded && statsLoaded && activeTaskLoaded && timerStateLoaded && blockedSitesLoaded && openRouterApiKeyLoaded && openRouterModelLoaded;

  const handleTaskStart = (task: Task) => {
    const durationInSeconds = task.duration * 60;
    const targetEndTime = Date.now() + durationInSeconds * 1000;

    chrome.alarms.create('focusTimer', { when: targetEndTime });
    
    setActiveTask(task);
    setTimerState({ targetEndTime, taskDuration: durationInSeconds });
  };

  const handleSessionEnd = useCallback((status: 'interrupted', timeElapsedInSeconds?: number) => {
    if (!activeTask) return;

    chrome.alarms.clear('focusTimer');

    const durationInSeconds = timerState?.taskDuration ?? activeTask.duration * 60;
    const timeElapsed = timeElapsedInSeconds ?? (durationInSeconds - Math.max(0, (timerState!.targetEndTime - Date.now()) / 1000));
    const actualDurationMinutes = Math.round(timeElapsed / 60);

    if (status === 'interrupted' && actualDurationMinutes > 0) {
      const sessionLog: SessionLog = {
        id: `session-${Date.now()}`,
        taskId: activeTask.id,
        taskName: activeTask.name,
        duration: activeTask.duration,
        actualDuration: actualDurationMinutes,
        startTime: Date.now() - timeElapsed * 1000,
        endTime: Date.now(),
        status,
      };
      
      setStats({
          ...stats,
          interruptedSessions: stats.interruptedSessions + 1,
          totalFocusTime: stats.totalFocusTime + actualDurationMinutes,
          sessionLogs: [...stats.sessionLogs, sessionLog],
      });
    }
    
    setActiveTask(null);
    setTimerState(null);
  }, [activeTask, timerState, stats, setStats, setActiveTask, setTimerState]);

  if (!isStorageLoaded) {
    return <div className="app-loading">Loading extension data...</div>;
  }

  return (
    <div className="app-container">
      <Header currentView={view} setView={setView} />
      <main className="app-main">
        {activeTask ? (
           <FocusTimer
            task={activeTask}
            onInterrupt={(timeElapsed) => handleSessionEnd('interrupted', timeElapsed)}
            timerState={timerState}
           />
        ) : view === 'DASHBOARD' ? (
          <Dashboard
            tasks={tasks}
            setTasks={setTasks}
            stats={stats}
            onTaskStart={handleTaskStart}
          />
        ) : view === 'STATS' ? (
          <StatsPage stats={stats} />
        ) : view === 'GARDEN' ? (
          <GardenPage
            stats={stats}
          />
        ) : view === 'AI_SETTINGS' ? (
          <AISettings
            openRouterApiKey={openRouterApiKey}
            setOpenRouterApiKey={setOpenRouterApiKey}
            openRouterModel={openRouterModel}
            setOpenRouterModel={setOpenRouterModel}
          />
        ) : view === 'SETTINGS' ? (
          <BlocklistManager
            blockedSites={blockedSites}
            setBlockedSites={setBlockedSites}
          />
        ) : null}
      </main>
    </div>
  );
};

export default App;
