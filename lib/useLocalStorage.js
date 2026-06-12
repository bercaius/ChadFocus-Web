'use client';
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  // Lazy initializer: read from localStorage on first render
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    setIsReady(true);
  }, [key]);

  // Persist to localStorage whenever value changes
  useEffect(() => {
    if (isReady) {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue, isReady]);

  const setValue = useCallback((value) => {
    setStoredValue((prev) => (typeof value === 'function' ? value(prev) : value));
  }, []);

  return [storedValue, setValue, isReady];
}