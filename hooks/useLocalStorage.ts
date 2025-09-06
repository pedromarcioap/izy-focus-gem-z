

declare const chrome: any;
// @ts-ignore
import React, { useState, useEffect, useCallback } from '../react.js';

// This hook is now adapted for chrome.storage.local which is asynchronous
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // In a non-extension context, chrome.storage may be undefined.
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
        console.warn('chrome.storage.local is not available. Using local state only.');
        setIsInitialized(true);
        return;
    }
    
    try {
        chrome.storage.local.get([key], (result) => {
            if (result.hasOwnProperty(key) && result[key] !== undefined) {
                setStoredValue(result[key]);
            } else {
                // If not in storage, set it with initialValue as a starting point.
                chrome.storage.local.set({ [key]: initialValue });
                setStoredValue(initialValue);
            }
            setIsInitialized(true);
        });
    } catch(e) {
        console.warn(`Error reading from chrome.storage.local, falling back to initial value.`, e);
        setStoredValue(initialValue);
        setIsInitialized(true);
    }
  }, [key, initialValue]);

  useEffect(() => {
    // Ensure chrome.storage.onChanged is available before adding a listener.
    if (typeof chrome === 'undefined' || !chrome.storage?.onChanged) {
        return;
    }

    const handleChange = (changes, areaName) => {
      if (areaName === 'local' && changes.hasOwnProperty(key)) {
        setStoredValue(changes[key].newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleChange);
    return () => {
      // Check if chrome API is available before trying to remove listener
      if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
        chrome.storage.onChanged.removeListener(handleChange);
      }
    };
  }, [key]);

  const setValue = useCallback((value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    
    // Ensure chrome.storage.local is available before setting a value.
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
        return;
    }

    try {
        chrome.storage.local.set({ [key]: valueToStore });
    } catch (e) {
        console.warn(`Error setting value for ${key} in chrome.storage.local`, e);
    }
  }, [key, storedValue]);

  return [isInitialized ? storedValue : initialValue, setValue];
}