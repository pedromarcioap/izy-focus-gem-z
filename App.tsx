

import React, { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StatsPage from './components/StatsPage';
import BlocklistManager from './components/BlocklistManager';
import GardenPage from './components/GardenPage';
import { initialTasks, initialStats } from './constants';
import FocusTimer from './components/FocusTimer';
import { Task, Stats, TimerState, View, SessionLog } from './types';

const App = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', initialTasks);
  const [stats, setStats] = useLocalStorage<Stats>('stats', initialStats);
  const [activeTask, setActiveTask] = useLocalStorage<Task | null>('activeTask', null);
  const [timerState, setTimerState] = useLocalStorage<TimerState | null>('timerState', null);
  const [blockedSites, setBlockedSites] = useLocalStorage<string[]>('blockedSites', []);
  const [purchasedAssets, setPurchasedAssets] = useLocalStorage<string[]>('purchasedAssets', []);
  const [view, setView] = useState<View>('DASHBOARD');

  useEffect(() => {
    // When the popup opens, if the timer has ended (e.g. handled by background script),
    // but the view is still on the timer, switch back to dashboard.
    if (!activeTask && view === 'DASHBOARD') {
      // This is the correct state, do nothing.
    }
  }, [activeTask, view]);

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
    const timeElapsed = timeElapsedInSeconds ?? (durationInSeconds - Math.max(0, (timerState.targetEndTime - Date.now()) / 1000));
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
      
      setStats(prevStats => ({
          ...prevStats,
          interruptedSessions: prevStats.interruptedSessions + 1,
          totalFocusTime: prevStats.totalFocusTime + actualDurationMinutes,
          sessionLogs: [...prevStats.sessionLogs, sessionLog],
          focusPoints: (prevStats.focusPoints || 0) + actualDurationMinutes,
      }));
    }
    
    setActiveTask(null);
    setTimerState(null);
  }, [activeTask, timerState, setStats, setActiveTask, setTimerState]);

  return (
    <div className="w-[400px] h-[550px] overflow-y-auto bg-navy text-slate font-sans flex flex-col">
      <Header currentView={view} setView={setView} />
      <main className="flex-grow p-4">
        {activeTask ? (
           <FocusTimer
            task={activeTask}
            onInterrupt={(timeElapsed) => handleSessionEnd('interrupted', timeElapsed)}
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
            setStats={setStats}
            purchasedAssets={purchasedAssets}
            setPurchasedAssets={setPurchasedAssets}
          />
        ) : (
          <BlocklistManager blockedSites={blockedSites} setBlockedSites={setBlockedSites} />
        )}
      </main>
    </div>
  );
};

export default App;