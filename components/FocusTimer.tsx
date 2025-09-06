

// @ts-ignore
import React, { useState, useEffect } from '../react.js';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import { StopIcon } from './icons.tsx';

const FocusTimer = ({ task, onInterrupt }) => {
  const [timerState] = useLocalStorage('timerState', null);
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

  const formatTime = (seconds) => {
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
    React.createElement("div", { className: "h-full w-full bg-navy z-30 flex flex-col items-center justify-around p-4 text-center" },
      React.createElement("div", null,
        React.createElement("p", { className: "text-lg text-slate mb-1" }, "Focusing on:"),
        React.createElement("h2", { className: "text-2xl font-bold text-lightest-slate" }, task.name)
      ),

      React.createElement("div", { className: "relative w-60 h-60 flex items-center justify-center" },
        React.createElement("svg", { className: "w-full h-full", viewBox: "0 0 100 100" },
          React.createElement("circle", { className: "text-light-navy", strokeWidth: "7", stroke: "currentColor", fill: "transparent", r: "45", cx: "50", cy: "50" }),
          React.createElement("circle", {
            className: "text-brand",
            strokeWidth: "7",
            strokeDasharray: "283",
            strokeDashoffset: 283 - (progress / 100) * 283,
            strokeLinecap: "round",
            stroke: "currentColor",
            fill: "transparent",
            r: "45",
            cx: "50",
            cy: "50",
            style: { transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s linear' }
          })
        ),
        React.createElement("div", { className: "absolute flex flex-col items-center" },
          React.createElement("p", { className: "text-5xl font-mono font-bold text-lightest-slate" }, formatTime(timeLeft))
        )
      ),
      
      React.createElement("div", null,
        React.createElement("button", {
          onClick: handleInterrupt,
          className: "flex items-center gap-3 px-6 py-2.5 bg-lightest-navy rounded-lg text-light-slate hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
        },
          React.createElement(StopIcon, { className: "w-6 h-6" }),
          React.createElement("span", { className: "font-bold text-sm" }, "Interrupt")
        )
      )
    )
  );
};

export default FocusTimer;