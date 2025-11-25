/**
 * Responsive Hooks
 *
 * Collection of hooks for building responsive, mobile-friendly UIs.
 * Use these hooks to detect breakpoints, touch capability, and orientation.
 *
 * @module hooks/responsive
 */

export { useMediaQuery } from './useMediaQuery';
export { useBreakpoint } from './useBreakpoint';
export type { BreakpointName, BreakpointState } from './useBreakpoint';
export { useTouchDevice } from './useTouchDevice';
export { useOrientation } from './useOrientation';
export type { Orientation, OrientationState } from './useOrientation';
