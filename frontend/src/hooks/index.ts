/**
 * Custom Hooks Barrel Export
 *
 * Centralized export for all custom React hooks.
 * Import hooks from this file for clean, consistent imports.
 *
 * @example
 * ```tsx
 * import {
 *   useFormState,
 *   useAsync,
 *   useDebounce,
 *   usePersistedState,
 *   useStepper,
 * } from '@/hooks';
 * ```
 *
 * @module hooks
 */

// UI Hooks
export { useToggle, useDisclosure, useModal } from './ui';
export type { UseDisclosureReturn, UseModalReturn } from './ui';

// Form Hooks
export { useFormState, useFormValidation, useFormDirty, validators } from './forms';
export type {
  UseFormStateConfig,
  UseFormStateReturn,
  ValidationRule,
  ValidationSchema,
  UseFormValidationReturn,
  UseFormDirtyReturn,
} from './forms';

// Async Hooks
export {
  useAsync,
  useDebounce,
  useDebouncedCallback,
  useThrottle,
  useThrottledCallback,
} from './async';
export type { UseAsyncState, UseAsyncReturn } from './async';

// State Management Hooks
export { usePersistedState, useLocalStorage } from './state';
export type { UsePersistedStateOptions, UseLocalStorageReturn } from './state';

// Domain-Specific Hooks
export { useStepper, useAutoSave } from './domain';
export type {
  UseStepperConfig,
  UseStepperReturn,
  UseAutoSaveConfig,
  UseAutoSaveReturn,
} from './domain';

// Legacy/Existing Hooks (keep for backward compatibility)
export { useCodeStreaming } from './useCodeStreaming';
export { useCodeGeneration } from './useCodeGeneration';
