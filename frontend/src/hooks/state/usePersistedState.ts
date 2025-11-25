/**
 * Persisted State Hook
 *
 * Like useState but automatically persists to localStorage/sessionStorage.
 * Syncs state across browser tabs.
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = usePersistedState('app-theme', 'light');
 * const [user, setUser] = usePersistedState('user-data', null, {
 *   storage: 'session',
 *   serialize: JSON.stringify,
 *   deserialize: JSON.parse,
 * });
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UsePersistedStateOptions<T> {
  /**
   * Storage type
   * @default 'local'
   */
  storage?: 'local' | 'session';

  /**
   * Custom serializer
   * @default JSON.stringify
   */
  serialize?: (value: T) => string;

  /**
   * Custom deserializer
   * @default JSON.parse
   */
  deserialize?: (value: string) => T;

  /**
   * Sync across tabs
   * @default true
   */
  syncTabs?: boolean;

  /**
   * Validation function to check if stored value is valid
   */
  validate?: (value: any) => value is T;
}

/**
 * Hook to persist state to localStorage or sessionStorage
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T,
  options: UsePersistedStateOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    storage = 'local',
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncTabs = true,
    validate,
  } = options;

  const storageObject = storage === 'local' ? localStorage : sessionStorage;
  const isFirstRender = useRef(true);

  // Initialize state from storage or use initial value
  const [state, setState] = useState<T>(() => {
    try {
      const item = storageObject.getItem(key);
      if (item === null) {
        return initialValue;
      }

      const parsed = deserialize(item);

      // Validate if validator is provided
      if (validate && !validate(parsed)) {
        console.warn(`Invalid stored value for key "${key}", using initial value`);
        return initialValue;
      }

      return parsed;
    } catch (error) {
      console.error(`Error loading persisted state for key "${key}":`, error);
      return initialValue;
    }
  });

  // Update storage when state changes
  useEffect(() => {
    // Skip on first render (state already loaded from storage)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    try {
      storageObject.setItem(key, serialize(state));
    } catch (error) {
      console.error(`Error persisting state for key "${key}":`, error);
    }
  }, [key, state, serialize, storageObject]);

  // Sync across tabs
  useEffect(() => {
    if (!syncTabs) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== storageObject) return;

      try {
        if (e.newValue === null) {
          setState(initialValue);
        } else {
          const parsed = deserialize(e.newValue);

          if (validate && !validate(parsed)) {
            console.warn(`Invalid synced value for key "${key}", ignoring`);
            return;
          }

          setState(parsed);
        }
      } catch (error) {
        console.error(`Error syncing state for key "${key}":`, error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue, deserialize, validate, syncTabs, storageObject]);

  // Clear function to remove from storage and reset to initial
  const clear = useCallback(() => {
    try {
      storageObject.removeItem(key);
      setState(initialValue);
    } catch (error) {
      console.error(`Error clearing persisted state for key "${key}":`, error);
    }
  }, [key, initialValue, storageObject]);

  return [state, setState, clear];
}
