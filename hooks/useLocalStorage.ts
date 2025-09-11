

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

// This hook is now adapted for chrome.storage.local which is asynchronous
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
        console.warn('chrome.storage.local is not available. Using local state only.');
        setIsInitialized(true);
        return;
    }
    
    try {
        chrome.storage.local.get([key], (result) => {
            if (result.hasOwnProperty(key) && result[key] !== undefined) {
                setStoredValue(result[key] as T);
            } else {
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
    if (typeof chrome === 'undefined' || !chrome.storage?.onChanged) {
        return;
    }

    const handleChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'local' && changes.hasOwnProperty(key)) {
        setStoredValue(changes[key].newValue as T);
      }
    };

    chrome.storage.onChanged.addListener(handleChange);
    return () => {
      if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
        chrome.storage.onChanged.removeListener(handleChange);
      }
    };
  }, [key]);

  const setValue: SetValue<T> = useCallback((value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    
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