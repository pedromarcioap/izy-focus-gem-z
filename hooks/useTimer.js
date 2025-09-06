

import React, { useState, useEffect, useRef } from '../react.js';

export const useTimer = ({ duration, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);

  // Refs for values that can change without triggering effects
  const timerId = useRef(null);
  const onEndRef = useRef(onEnd);
  const targetTimeRef = useRef(0);

  // Keep onEnd callback ref up to date
  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  const start = () => {
    if (isActive) return;
    // Set target time based on the current time left.
    // This works for both a fresh start and resuming from pause.
    targetTimeRef.current = Date.now() + timeLeft * 1000;
    setIsActive(true);
  };

  const pause = () => {
    if (!isActive) return;
    // When pausing, we stop the interval. The `timeLeft` state is
    // automatically preserved until we resume.
    setIsActive(false);
  };
  
  // The core timer loop is managed by this effect, which only runs when `isActive` changes.
  useEffect(() => {
    if (!isActive) {
      // If timer is paused or stopped, clear any running interval.
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = null;
      }
      return;
    }

    // When the timer is active, set up the interval.
    timerId.current = setInterval(() => {
      // On each tick, calculate the new time left.
      const newTimeLeft = Math.max(0, Math.round((targetTimeRef.current - Date.now()) / 1000));
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === 0) {
        // If time is up, stop the timer and call the onEnd callback.
        setIsActive(false);
        onEndRef.current();
      }
    }, 500); // Tick every 500ms for better accuracy and responsiveness.

    // Cleanup function for when the effect re-runs or component unmounts.
    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = null;
      }
    };
  }, [isActive]);


  const reset = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };
  
  const addTime = (seconds) => {
    // We can update the target time directly, and the next tick will reflect it.
    if (isActive) {
      targetTimeRef.current += seconds * 1000;
    }
    // Also update the state so the UI updates immediately.
    setTimeLeft(prev => Math.max(0, prev + seconds));
  };
  
  // Effect to reset the timer if the parent component provides a new duration.
  useEffect(() => {
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  return { timeLeft, isActive, start, pause, reset, addTime };
};