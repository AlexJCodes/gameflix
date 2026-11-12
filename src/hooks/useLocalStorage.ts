import { useEffect, useState } from "react";

function readStoredValue<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => value is T,
): T {
  try {
    const stored = localStorage.getItem(key);

    if (stored === null) return initialValue;

    const parsed: unknown = JSON.parse(stored);

    return isValid(parsed) ? parsed : initialValue;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => readStoredValue(key, initialValue, isValid));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Keep the state working if storage is unavailable.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
