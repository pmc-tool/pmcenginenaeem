/**
 * useOrientation Hook
 *
 * Detects device orientation (portrait vs landscape).
 * Useful for adjusting layouts based on device rotation.
 *
 * @module hooks/responsive/useOrientation
 *
 * @example
 * const { orientation, isPortrait, isLandscape } = useOrientation();
 *
 * return (
 *   <div>
 *     {isPortrait ? <VerticalLayout /> : <HorizontalLayout />}
 *   </div>
 * );
 */

import { useState, useEffect } from 'react';
import { useMediaQuery } from './useMediaQuery';

/**
 * Device orientation types
 */
export type Orientation = 'portrait' | 'landscape';

/**
 * Orientation detection result
 */
export interface OrientationState {
  /** Current orientation: 'portrait' or 'landscape' */
  orientation: Orientation;
  /** True if device is in portrait orientation (height > width) */
  isPortrait: boolean;
  /** True if device is in landscape orientation (width > height) */
  isLandscape: boolean;
}

/**
 * Custom hook to detect device orientation
 *
 * @returns OrientationState object with current orientation and helper flags
 *
 * @remarks
 * - Uses CSS media query (orientation: portrait/landscape)
 * - Re-renders component when orientation changes
 * - Defaults to 'portrait' during SSR
 * - Works on both mobile and desktop devices
 *
 * @example
 * ```tsx
 * function ResponsiveGallery() {
 *   const { isPortrait, isLandscape } = useOrientation();
 *
 *   return (
 *     <div className={isPortrait ? 'gallery-vertical' : 'gallery-horizontal'}>
 *       {images.map(img => (
 *         <img key={img.id} src={img.url} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useOrientation(): OrientationState {
  // Use media query to detect orientation
  const isPortrait = useMediaQuery('(orientation: portrait)');

  const [state, setState] = useState<OrientationState>(() => ({
    orientation: isPortrait ? 'portrait' : 'landscape',
    isPortrait,
    isLandscape: !isPortrait,
  }));

  useEffect(() => {
    setState({
      orientation: isPortrait ? 'portrait' : 'landscape',
      isPortrait,
      isLandscape: !isPortrait,
    });
  }, [isPortrait]);

  return state;
}
