import { useCallback, useEffect, useState } from 'react';

export const useLocalStorage = <T>(
  key: string,
  value: T,
  setValue: (value: T) => any
) => {
  const [recovered, setRecovered] = useState(false);

  const store = useCallback((value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, []);

  const load = useCallback(() => {
    const json = localStorage.getItem(key);
    if (!json) return;
    const oldValue = JSON.parse(json);
    if (!oldValue) return;
    setValue(oldValue);
  }, []);

  const forget = useCallback(() => {
    localStorage.removeItem(key);
  }, []);

  useEffect(() => {
    if (!recovered) {
      load();
      setRecovered(true);
    } else {
      store(value);
    }
  }, [value]);

  return { store, load, forget };
};
