/**
 * useTouchDevice Hook
 *
 * Detects if the device has touch capability.
 * Useful for showing/hiding touch-specific UI or alternatives to hover interactions.
 *
 * @module hooks/responsive/useTouchDevice
 *
 * @example
 * const isTouch = useTouchDevice();
 *
 * return (
 *   <button
 *     onClick={handleClick}
 *     onTouchStart={isTouch ? handleTouchFeedback : undefined}
 *   >
 *     Click me
 *   </button>
 * );
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if device has touch capability
 *
 * @returns boolean indicating if device supports touch events
 *
 * @remarks
 * - Checks for touch events API (ontouchstart)
 * - Checks for pointer events with coarse pointer (touch/stylus)
 * - Checks navigator.maxTouchPoints for modern devices
 * - Returns false during SSR (window is undefined)
 * - Note: Some laptops with touchscreens will return true
 * - Value is cached and doesn't change after initial detection
 *
 * @example
 * ```tsx
 * function InteractiveComponent() {
 *   const isTouch = useTouchDevice();
 *
 *   return (
 *     <div>
 *       {isTouch ? (
 *         <p>Tap to show tooltip</p>
 *       ) : (
 *         <p>Hover to show tooltip</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(() => {
    // Check if window is available (not SSR)
    if (typeof window === 'undefined') {
      return false;
    }

    // Check multiple touch detection methods
    return (
      // Check for touch events support
      'ontouchstart' in window ||
      // Check for pointer events with coarse pointer (touch/stylus)
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
      // Check navigator.maxTouchPoints (modern approach)
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
    );
  });

  useEffect(() => {
    // Check if window is available (not SSR)
    if (typeof window === 'undefined') {
      return;
    }

    // Detect touch capability on mount
    const hasTouchCapability =
      'ontouchstart' in window ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

    setIsTouch(hasTouchCapability);
  }, []);

  return isTouch;
}
