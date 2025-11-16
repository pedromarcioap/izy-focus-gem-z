import { useState, useEffect, useCallback } from 'react';

type StorageValues = {
  [key: string]: any;
};

export const useChromeStorage = <T extends StorageValues>(
  initialValues: T
): [T, (key: keyof T, value: any) => void, boolean] => {
  const [values, setValues] = useState<T>(initialValues);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const keysToGet = Object.keys(initialValues);
    chrome.storage.local.get(keysToGet, (result) => {
      const loadedValues = { ...initialValues };
      for (const key of keysToGet) {
        if (result[key] !== undefined) {
          loadedValues[key as keyof T] = result[key];
        }
      }
      setValues(loadedValues);
      setIsLoaded(true);
    });
  }, []);

  const setStoredValue = useCallback((key: keyof T, value: any) => {
    setValues((prev) => {
      const newValues = { ...prev, [key]: value };
      chrome.storage.local.set({ [key as string]: value });
      return newValues;
    });
  }, []);

  return [values, setStoredValue, isLoaded];
};
