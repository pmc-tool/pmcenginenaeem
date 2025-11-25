/**
 * useBreakpoint Hook
 *
 * Detects the current responsive breakpoint based on viewport width.
 * Provides both the current breakpoint name and helper boolean flags.
 *
 * @module hooks/responsive/useBreakpoint
 *
 * @example
 * const { current, isMobile, isTablet, isDesktop } = useBreakpoint();
 *
 * if (isMobile) {
 *   return <MobileNav />;
 * }
 * return <DesktopNav />;
 */

import { useMemo } from 'react';
import { useMediaQuery } from './useMediaQuery';
import { breakpoints } from '../../styles/tokens';

/**
 * Breakpoint names matching design system
 */
export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Breakpoint detection result
 */
export interface BreakpointState {
  /** Current breakpoint name */
  current: BreakpointName;
  /** True if viewport is xs (≤480px) */
  isXs: boolean;
  /** True if viewport is sm (481-768px) */
  isSm: boolean;
  /** True if viewport is md (769-1024px) */
  isMd: boolean;
  /** True if viewport is lg (≥1025px) */
  isLg: boolean;
  /** True if viewport is mobile (xs or sm) */
  isMobile: boolean;
  /** True if viewport is tablet (md) */
  isTablet: boolean;
  /** True if viewport is desktop (lg) */
  isDesktop: boolean;
}

/**
 * Custom hook to detect current responsive breakpoint
 *
 * @returns BreakpointState object with current breakpoint and helper flags
 *
 * @remarks
 * - Mobile-first approach: checks from largest to smallest breakpoint
 * - Defaults to 'xs' during SSR or when window is undefined
 * - Uses useMediaQuery for efficient match detection
 * - Re-renders only when breakpoint changes (not on every resize)
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const { current, isMobile, isDesktop } = useBreakpoint();
 *
 *   return (
 *     <div>
 *       <p>Current breakpoint: {current}</p>
 *       {isMobile && <MobileMenu />}
 *       {isDesktop && <DesktopSidebar />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useBreakpoint(): BreakpointState {
  // Check breakpoints from largest to smallest (mobile-first)
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md})`);
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm})`);
  const isXs = useMediaQuery(`(min-width: ${breakpoints.xs})`);

  // Determine current breakpoint
  const current: BreakpointName = useMemo(() => {
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    return 'xs';
  }, [isLg, isMd, isSm]);

  // Helper flags for common use cases
  const state: BreakpointState = useMemo(
    () => ({
      current,
      isXs: current === 'xs',
      isSm: current === 'sm',
      isMd: current === 'md',
      isLg: current === 'lg',
      isMobile: current === 'xs' || current === 'sm',
      isTablet: current === 'md',
      isDesktop: current === 'lg',
    }),
    [current]
  );

  return state;
}
