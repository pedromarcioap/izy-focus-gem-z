import { useState, useEffect, useCallback } from 'react';

export const useStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void, boolean] => {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    chrome.storage.local.get([key], (result) => {
      if (result[key] !== undefined) {
        setValue(result[key]);
      }
      setIsLoaded(true);
    });
  }, [key]);

  const setStoredValue = useCallback((newValue: T) => {
    setValue(newValue);
    chrome.storage.local.set({ [key]: newValue });
  }, [key]);

  return [value, setStoredValue, isLoaded];
};
