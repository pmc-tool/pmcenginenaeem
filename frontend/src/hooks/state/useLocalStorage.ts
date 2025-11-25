/**
 * LocalStorage Hook
 *
 * Simplified hook for localStorage operations.
 * Type-safe, with error handling and SSR support.
 *
 * @example
 * ```tsx
 * const { value, setValue, remove } = useLocalStorage('settings', {
 *   theme: 'light',
 *   language: 'en',
 * });
 *
 * <button onClick={() => setValue({ ...value, theme: 'dark' })}>
 *   Toggle Theme
 * </button>
 * ```
 */

import { useState, useCallback, useEffect } from 'react';

export interface UseLocalStorageReturn<T> {
  /**
   * Current value
   */
  value: T;

  /**
   * Set new value
   */
  setValue: (value: T | ((prev: T) => T)) => void;

  /**
   * Remove from storage
   */
  remove: () => void;

  /**
   * Is value loaded (false during SSR)
   */
  isLoaded: boolean;

  /**
   * Error if any occurred during load/save
   */
  error: Error | null;
}

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Hook for localStorage operations
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize state
  const [value, setValueState] = useState<T>(() => {
    if (!isBrowser) {
      return initialValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      return JSON.parse(item) as T;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Mark as loaded after first render
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue;

        setValueState(valueToStore);

        if (isBrowser) {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }

        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, value]
  );

  // Remove from localStorage
  const remove = useCallback(() => {
    try {
      setValueState(initialValue);

      if (isBrowser) {
        localStorage.removeItem(key);
      }

      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes from other tabs
  useEffect(() => {
    if (!isBrowser) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== localStorage) return;

      try {
        if (e.newValue === null) {
          setValueState(initialValue);
        } else {
          setValueState(JSON.parse(e.newValue) as T);
        }
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error(`Error syncing localStorage key "${key}":`, error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return {
    value,
    setValue,
    remove,
    isLoaded,
    error,
  };
}
