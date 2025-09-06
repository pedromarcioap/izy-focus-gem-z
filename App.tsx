

declare const chrome: any;

// @ts-ignore
import React, { useState, useCallback, useEffect } from './react.js';
import { useLocalStorage } from './hooks/useLocalStorage.ts';
import Header from './components/Header.tsx';
import Dashboard from './components/Dashboard.tsx';
import StatsPage from './components/StatsPage.tsx';
import { initialTasks, initialStats } from './constants.ts';
import FocusTimer from './components/FocusTimer.tsx';

const App = () => {
  const [tasks, setTasks] = useLocalStorage('tasks', initialTasks);
  const [stats, setStats] = useLocalStorage('stats', initialStats);
  const [activeTask, setActiveTask] = useLocalStorage('activeTask', null);
  const [timerState, setTimerState] = useLocalStorage('timerState', null);
  const [view, setView] = useState('DASHBOARD');

  useEffect(() => {
    // When the popup opens, if the timer has ended (e.g. handled by background script),
    // but the view is still on the timer, switch back to dashboard.
    if (!activeTask && view === 'DASHBOARD') {
      // This is the correct state, do nothing.
    }
  }, [activeTask, view]);

  const handleTaskStart = (task) => {
    const durationInMinutes = task.duration;
    const durationInSeconds = durationInMinutes * 60;
    const targetEndTime = Date.now() + durationInSeconds * 1000;

    chrome.alarms.create('focusTimer', { when: targetEndTime });
    
    setActiveTask(task);
    setTimerState({ targetEndTime, taskDuration: durationInSeconds });
  };

  const handleSessionEnd = useCallback((status, timeElapsedInSeconds) => {
    if (!activeTask) return;

    chrome.alarms.clear('focusTimer');

    const durationInSeconds = timerState?.taskDuration ?? activeTask.duration * 60;
    const timeElapsed = timeElapsedInSeconds ?? (durationInSeconds - Math.max(0, (timerState.targetEndTime - Date.now()) / 1000));
    const actualDurationMinutes = Math.round(timeElapsed / 60);

    if (status === 'interrupted' && actualDurationMinutes > 0) {
      const sessionLog = {
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
      }));
    }
    
    setActiveTask(null);
    setTimerState(null);
  }, [activeTask, timerState, setStats, setActiveTask, setTimerState]);

  return (
    React.createElement("div", { className: "w-[400px] h-[550px] overflow-y-auto bg-navy text-slate font-sans flex flex-col" },
      React.createElement(Header, { currentView: view, setView: setView }),
      React.createElement("main", { className: "flex-grow p-4" },
        activeTask ? (
           React.createElement(FocusTimer, { 
            task: activeTask,
            onInterrupt: (timeElapsed) => handleSessionEnd('interrupted', timeElapsed)
           })
        ) : view === 'DASHBOARD' ? (
          React.createElement(Dashboard, {
            tasks: tasks,
            setTasks: setTasks,
            stats: stats,
            onTaskStart: handleTaskStart
          })
        ) : (
          React.createElement(StatsPage, { stats: stats })
        )
      )
    )
  );
};

export default App;