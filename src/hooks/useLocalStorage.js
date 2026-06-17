import { useState, useEffect } from "react";

// Persisted state backed by localStorage with JSON serialization.
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota / serialization errors */
    }
  }, [key, value]);

  return [value, setValue];
}
