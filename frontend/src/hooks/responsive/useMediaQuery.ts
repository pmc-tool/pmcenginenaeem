/**
 * useMediaQuery Hook
 *
 * Tracks whether a CSS media query matches the current viewport.
 * Re-renders component when match state changes.
 *
 * @module hooks/responsive/useMediaQuery
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 *
 * return <div>{isMobile ? 'Mobile View' : 'Desktop View'}</div>;
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if a media query matches
 *
 * @param query - CSS media query string (e.g., '(max-width: 768px)')
 * @returns boolean indicating if the media query currently matches
 *
 * @remarks
 * - Uses window.matchMedia API with addEventListener for modern browsers
 * - Cleans up event listener on unmount
 * - Returns false during SSR (window is undefined)
 * - Re-renders component only when match state changes
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if window is available (not SSR)
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // Check if window is available (not SSR)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    // Update state when media query match changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Add event listener (modern browsers)
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup event listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
