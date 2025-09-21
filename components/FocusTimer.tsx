import React, { useState, useEffect } from 'react';
// Removed import { useLocalStorage } from '../hooks/useLocalStorage';
import { StopIcon } from './icons';
import { Task, TimerState } from '../types';

interface FocusTimerProps {
  task: Task;
  onInterrupt: (timeElapsed: number) => void;
  timerState: TimerState | null; // timerState is now a prop
}

const FocusTimer: React.FC<FocusTimerProps> = ({ task, onInterrupt, timerState }) => {
  // Removed const [timerState] = useLocalStorage<TimerState | null>('timerState', null);
  const [timeLeft, setTimeLeft] = useState(task.duration * 60);

  useEffect(() => {
    if (!timerState) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.round((timerState.targetEndTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer(); // Initial call to prevent 1-second delay
    const intervalId = setInterval(updateTimer, 500);

    return () => clearInterval(intervalId);
  }, [timerState]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const durationInSeconds = timerState?.taskDuration ?? task.duration * 60;
  const progress = durationInSeconds > 0 ? ((durationInSeconds - timeLeft) / durationInSeconds) * 100 : 0;
  
  const handleInterrupt = () => {
    const timeElapsed = durationInSeconds - timeLeft;
    onInterrupt(timeElapsed < 0 ? durationInSeconds : timeElapsed);
  }

  return (
    <div className="focus-timer-container">
      <div>
        <p className="focus-timer-label">Focusing on:</p>
        <h2 className="focus-timer-task-name">{task.name}</h2>
      </div>

      <div className="focus-timer-circle-container">
        <svg className="focus-timer-svg" viewBox="0 0 100 100">
          <circle className="focus-timer-circle-bg" strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle
            className="focus-timer-circle-progress"
            strokeWidth="7"
            strokeDasharray="283"
            strokeDashoffset={283 - (progress / 100) * 283}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s linear' }}
          />
        </svg>
        <div className="focus-timer-time-display">
          <p className="focus-timer-time">{formatTime(timeLeft)}</p>
        </div>
      </div>
      
      <div>
        <button
          onClick={handleInterrupt}
          className="button-primary focus-timer-interrupt-button-override"
        >
          <StopIcon className="focus-timer-icon" />
          <span className="focus-timer-button-text">Interrupt</span>
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;