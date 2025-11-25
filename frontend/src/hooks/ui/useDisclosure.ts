/**
 * useDisclosure Hook
 *
 * Hook for managing component visibility (modals, dropdowns, panels, etc.)
 * with semantic naming and controlled state.
 *
 * @module hooks/ui/useDisclosure
 *
 * @example
 * ```tsx
 * const { isOpen, open, close, toggle } = useDisclosure();
 *
 * <button onClick={open}>Open Modal</button>
 * <Modal isOpen={isOpen} onClose={close}>
 *   <button onClick={close}>Close</button>
 * </Modal>
 * ```
 */

import { useState, useCallback } from 'react';

export interface UseDisclosureReturn {
  /**
   * Whether the component is currently visible
   */
  isOpen: boolean;

  /**
   * Show the component
   */
  open: () => void;

  /**
   * Hide the component
   */
  close: () => void;

  /**
   * Toggle visibility
   */
  toggle: () => void;
}

/**
 * Hook for component visibility state
 *
 * @param initialState - Initial visibility state (default: false)
 * @returns Object with isOpen state and control functions
 */
export function useDisclosure(initialState = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
