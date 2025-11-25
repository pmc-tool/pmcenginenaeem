/**
 * Form Dirty Tracking Hook
 *
 * Tracks whether a form has been modified from its initial state.
 * Useful for warning users before leaving pages with unsaved changes.
 *
 * @example
 * ```tsx
 * const { isDirty, markClean, reset } = useFormDirty(initialValues, currentValues);
 *
 * useEffect(() => {
 *   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
 *     if (isDirty) {
 *       e.preventDefault();
 *       e.returnValue = '';
 *     }
 *   };
 *   window.addEventListener('beforeunload', handleBeforeUnload);
 *   return () => window.removeEventListener('beforeunload', handleBeforeUnload);
 * }, [isDirty]);
 * ```
 */

import { useMemo, useCallback, useRef } from 'react';

export interface UseFormDirtyReturn {
  /**
   * Is the form dirty (modified from initial values)
   */
  isDirty: boolean;

  /**
   * Which fields are dirty
   */
  dirtyFields: Set<string>;

  /**
   * Mark form as clean (sets new baseline)
   */
  markClean: () => void;

  /**
   * Check if a specific field is dirty
   */
  isFieldDirty: (fieldName: string) => boolean;

  /**
   * Get changed values only
   */
  getChangedValues: () => Record<string, any>;
}

/**
 * Deep equality check for form values
 */
function isEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!isEqual(a[key], b[key])) return false;
  }

  return true;
}

/**
 * Hook to track form dirty state
 */
export function useFormDirty<T extends Record<string, any>>(
  initialValues: T,
  currentValues: T
): UseFormDirtyReturn {
  const baselineRef = useRef<T>(initialValues);

  const dirtyFields = useMemo(() => {
    const fields = new Set<string>();

    Object.keys(currentValues).forEach((key) => {
      if (!isEqual(currentValues[key], baselineRef.current[key])) {
        fields.add(key);
      }
    });

    return fields;
  }, [currentValues]);

  const isDirty = dirtyFields.size > 0;

  const markClean = useCallback(() => {
    baselineRef.current = { ...currentValues };
  }, [currentValues]);

  const isFieldDirty = useCallback(
    (fieldName: string): boolean => {
      return dirtyFields.has(fieldName);
    },
    [dirtyFields]
  );

  const getChangedValues = useCallback((): Record<string, any> => {
    const changed: Record<string, any> = {};

    dirtyFields.forEach((fieldName) => {
      changed[fieldName] = currentValues[fieldName];
    });

    return changed;
  }, [dirtyFields, currentValues]);

  return {
    isDirty,
    dirtyFields,
    markClean,
    isFieldDirty,
    getChangedValues,
  };
}
