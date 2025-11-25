/**
 * useToggle Hook
 *
 * Simple hook for managing boolean toggle state with convenient helpers.
 *
 * @module hooks/ui/useToggle
 *
 * @example
 * ```tsx
 * const [isOpen, toggle, setOpen, setClosed] = useToggle(false);
 *
 * <button onClick={toggle}>Toggle</button>
 * <button onClick={setOpen}>Open</button>
 * <button onClick={setClosed}>Close</button>
 * ```
 */

import { useState, useCallback } from 'react';

/**
 * Hook for boolean toggle state with convenient helpers
 *
 * @param initialValue - Initial boolean value (default: false)
 * @returns Tuple of [value, toggle, setTrue, setFalse]
 */
export function useToggle(
  initialValue = false
): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse];
}
