/**
 * Throttle Hook
 *
 * Throttles a value by limiting updates to at most once per specified interval.
 * Unlike debounce, throttle ensures the value updates at regular intervals.
 *
 * @example
 * ```tsx
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScrollY = useThrottle(scrollY, 200);
 *
 * useEffect(() => {
 *   const handleScroll = () => setScrollY(window.scrollY);
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, []);
 *
 * // throttledScrollY updates at most every 200ms
 * ```
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Hook to throttle a value
 *
 * @param value - The value to throttle
 * @param interval - Minimum interval between updates in milliseconds (default: 500ms)
 * @returns Throttled value
 */
export function useThrottle<T>(value: T, interval = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    if (timeSinceLastUpdate >= interval) {
      // Update immediately if enough time has passed
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      // Schedule update for later
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - timeSinceLastUpdate);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, interval]);

  return throttledValue;
}

/**
 * Throttled Callback Hook
 *
 * Returns a throttled version of a callback function.
 * Ensures the callback is called at most once per interval.
 *
 * @example
 * ```tsx
 * const handleResize = useThrottledCallback(() => {
 *   console.log('Window resized');
 * }, 200);
 *
 * useEffect(() => {
 *   window.addEventListener('resize', handleResize);
 *   return () => window.removeEventListener('resize', handleResize);
 * }, [handleResize]);
 * ```
 */
export function useThrottledCallback<Args extends any[]>(
  callback: (...args: Args) => void,
  interval = 500
): (...args: Args) => void {
  const lastRan = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (...args: Args) => {
    const now = Date.now();
    const timeSinceLastRan = now - lastRan.current;

    if (timeSinceLastRan >= interval) {
      // Execute immediately
      lastRan.current = now;
      callback(...args);
    } else {
      // Schedule execution
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastRan.current = Date.now();
        callback(...args);
      }, interval - timeSinceLastRan);
    }
  };
}
