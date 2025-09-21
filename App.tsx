import React, { useState, useCallback, useEffect } from 'react';
// Removed import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StatsPage from './components/StatsPage';
import BlocklistManager from './components/BlocklistManager';
import GardenPage from './components/GardenPage';
import AISettings from './components/AISettings';
import { initialTasks, initialStats } from './constants';
import FocusTimer from './components/FocusTimer';
import { Task, Stats, TimerState, View, SessionLog } from './types';

// Define initial values for all storage keys
const initialStorageValues = {
  tasks: initialTasks,
  stats: initialStats,
  activeTask: null,
  timerState: null,
  blockedSites: [],
  openRouterApiKey: '',
  openRouterModel: 'openai/gpt-3.5-turbo',
};

const App = () => {
  // Use a single state for all storage-managed values
  const [storageValues, setStorageValues] = useState(initialStorageValues);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  const [view, setView] = useState<View>('DASHBOARD');

  // Load all values from chrome.storage.local once
  useEffect(() => {
    console.log('App: Loading all storage values...');
    chrome.storage.local.get(Object.keys(initialStorageValues), (result) => {
      console.log('App: All storage values loaded:', result);
      setStorageValues(prev => ({ ...prev, ...result }));
      setIsStorageLoaded(true);
    });
  }, []);

  // Function to update a specific storage key
  const setStorageValue = useCallback((key: keyof typeof initialStorageValues, value: any) => {
    setStorageValues(prev => {
      const newValues = { ...prev, [key]: value };
      chrome.storage.local.set({ [key]: value }, () => {
        console.log(`App: Stored ${key} with value:`, value);
      });
      return newValues;
    });
  }, []);

  // Destructure values for easier use
  const { tasks, stats, activeTask, timerState, blockedSites, openRouterApiKey, openRouterModel } = storageValues;

  // ... rest of the App component logic ...

  // handleTaskStart
  const handleTaskStart = (task: Task) => {
    const durationInSeconds = task.duration * 60;
    const targetEndTime = Date.now() + durationInSeconds * 1000;

    chrome.alarms.create('focusTimer', { when: targetEndTime });
    
    setStorageValue('activeTask', task); // Use new setter
    setStorageValue('timerState', { targetEndTime, taskDuration: durationInSeconds }); // Use new setter
  };

  // handleSessionEnd
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
      
      setStorageValue('stats', { // Use new setter
          ...stats,
          interruptedSessions: stats.interruptedSessions + 1,
          totalFocusTime: stats.totalFocusTime + actualDurationMinutes,
          sessionLogs: [...stats.sessionLogs, sessionLog],
      });
    }
    
    setStorageValue('activeTask', null); // Use new setter
    setStorageValue('timerState', null); // Use new setter
  }, [activeTask, timerState, stats, setStorageValue]); // Add setStorageValue to dependencies

  // Render only after storage is loaded
  if (!isStorageLoaded) {
    return <div className="app-loading">Loading extension data...</div>; // Simple loading state
  }

  return (
    <div className="app-container">
      <Header currentView={view} setView={setView} />
      <main className="app-main">
        {activeTask ? (
           <FocusTimer
            task={activeTask}
            onInterrupt={(timeElapsed) => handleSessionEnd('interrupted', timeElapsed)}
            timerState={timerState} // Pass timerState as prop
           />
        ) : view === 'DASHBOARD' ? (
          <Dashboard
            tasks={tasks}
            setTasks={(newTasks) => setStorageValue('tasks', newTasks)} // Use new setter
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
            setOpenRouterApiKey={(key) => setStorageValue('openRouterApiKey', key)} // Use new setter
            openRouterModel={openRouterModel}
            setOpenRouterModel={(model) => setStorageValue('openRouterModel', model)} // Use new setter
          />
        ) : view === 'SETTINGS' ? (
          <BlocklistManager
            blockedSites={blockedSites}
            setBlockedSites={(newSites) => setStorageValue('blockedSites', newSites)} // Use new setter
          />
        ) : null}
      </main>
    </div>
  );
};

export default App;
