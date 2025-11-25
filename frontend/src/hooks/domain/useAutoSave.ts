/**
 * Auto-Save Hook
 *
 * Automatically saves form/editor state after a period of inactivity.
 * Provides visual feedback and manual save option.
 *
 * @example
 * ```tsx
 * const autoSave = useAutoSave({
 *   data: editorContent,
 *   onSave: async (content) => {
 *     await saveToServer(content);
 *   },
 *   delay: 2000,
 * });
 *
 * <textarea value={content} onChange={handleChange} />
 * {autoSave.isSaving && <span>Saving...</span>}
 * {autoSave.lastSaved && <span>Saved at {autoSave.lastSaved}</span>}
 * ```
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseAutoSaveConfig<T> {
  /**
   * Data to auto-save
   */
  data: T;

  /**
   * Save function (async)
   */
  onSave: (data: T) => Promise<void>;

  /**
   * Delay before auto-saving (ms)
   * @default 2000
   */
  delay?: number;

  /**
   * Enable/disable auto-save
   * @default true
   */
  enabled?: boolean;

  /**
   * Called when save succeeds
   */
  onSuccess?: () => void;

  /**
   * Called when save fails
   */
  onError?: (error: Error) => void;

  /**
   * Custom equality check
   * @default JSON.stringify comparison
   */
  isEqual?: (a: T, b: T) => boolean;
}

export interface UseAutoSaveReturn {
  /**
   * Is currently saving
   */
  isSaving: boolean;

  /**
   * Last save timestamp
   */
  lastSaved: Date | null;

  /**
   * Last error if save failed
   */
  error: Error | null;

  /**
   * Has unsaved changes
   */
  hasUnsavedChanges: boolean;

  /**
   * Manually trigger save
   */
  saveNow: () => Promise<void>;

  /**
   * Cancel pending save
   */
  cancelPendingSave: () => void;
}

/**
 * Default equality check using JSON.stringify
 */
function defaultIsEqual<T>(a: T, b: T): boolean {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return a === b;
  }
}

/**
 * Hook for auto-saving data
 */
export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true,
  onSuccess,
  onError,
  isEqual = defaultIsEqual,
}: UseAutoSaveConfig<T>): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<T>(data);
  const isSavingRef = useRef(false);

  const hasUnsavedChanges = !isEqual(data, lastSavedDataRef.current);

  const saveNow = useCallback(async () => {
    // Don't save if already saving
    if (isSavingRef.current) {
      return;
    }

    // Don't save if no changes
    if (isEqual(data, lastSavedDataRef.current)) {
      return;
    }

    setIsSaving(true);
    isSavingRef.current = true;
    setError(null);

    try {
      await onSave(data);

      lastSavedDataRef.current = data;
      setLastSaved(new Date());
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
      isSavingRef.current = false;
    }
  }, [data, onSave, isEqual, onSuccess, onError]);

  const cancelPendingSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Auto-save when data changes
  useEffect(() => {
    if (!enabled) {
      cancelPendingSave();
      return;
    }

    // Don't schedule save if no changes
    if (isEqual(data, lastSavedDataRef.current)) {
      return;
    }

    // Cancel any pending save
    cancelPendingSave();

    // Schedule new save
    timeoutRef.current = setTimeout(() => {
      saveNow();
    }, delay);

    return () => {
      cancelPendingSave();
    };
  }, [data, delay, enabled, isEqual, saveNow, cancelPendingSave]);

  // Save before unmount if there are unsaved changes
  useEffect(() => {
    return () => {
      if (hasUnsavedChanges && enabled && !isSavingRef.current) {
        // Attempt to save synchronously on unmount
        // Note: This may not complete if async, consider using beforeunload
        onSave(data).catch(console.error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isSaving,
    lastSaved,
    error,
    hasUnsavedChanges,
    saveNow,
    cancelPendingSave,
  };
}
