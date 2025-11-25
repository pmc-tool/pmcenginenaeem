/**
 * Async Hook
 *
 * Manages async operations with loading, error, and data states.
 * Handles race conditions and cleanup automatically.
 *
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useAsync(fetchUser);
 *
 * useEffect(() => {
 *   execute(userId);
 * }, [userId]);
 *
 * if (loading) return <LoadingState />;
 * if (error) return <ErrorState message={error.message} />;
 * return <div>{data.name}</div>;
 * ```
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseAsyncState<T> {
  /**
   * Async operation data (undefined until first success)
   */
  data: T | undefined;

  /**
   * Is operation currently loading
   */
  loading: boolean;

  /**
   * Error from last failed operation
   */
  error: Error | undefined;

  /**
   * Has operation been called at least once
   */
  called: boolean;
}

export interface UseAsyncReturn<T, Args extends any[]> extends UseAsyncState<T> {
  /**
   * Execute the async operation
   */
  execute: (...args: Args) => Promise<T | undefined>;

  /**
   * Reset state to initial
   */
  reset: () => void;

  /**
   * Set data manually
   */
  setData: (data: T | undefined) => void;

  /**
   * Set error manually
   */
  setError: (error: Error | undefined) => void;
}

/**
 * Hook to manage async operations
 */
export function useAsync<T, Args extends any[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
  immediate = false
): UseAsyncReturn<T, Args> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: undefined,
    loading: immediate,
    error: undefined,
    called: immediate,
  });

  const activeRequestRef = useRef(0);

  const execute = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      const requestId = ++activeRequestRef.current;

      setState((prev) => ({
        ...prev,
        loading: true,
        error: undefined,
        called: true,
      }));

      try {
        const data = await asyncFunction(...args);

        // Ignore if this request was superseded
        if (requestId !== activeRequestRef.current) {
          return undefined;
        }

        setState({
          data,
          loading: false,
          error: undefined,
          called: true,
        });

        return data;
      } catch (error) {
        // Ignore if this request was superseded
        if (requestId !== activeRequestRef.current) {
          return undefined;
        }

        const errorObj = error instanceof Error ? error : new Error(String(error));

        setState({
          data: undefined,
          loading: false,
          error: errorObj,
          called: true,
        });

        return undefined;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    activeRequestRef.current++;
    setState({
      data: undefined,
      loading: false,
      error: undefined,
      called: false,
    });
  }, []);

  const setData = useCallback((data: T | undefined) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: Error | undefined) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute([] as unknown as Args);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  };
}
