/**
 * useModal Hook
 *
 * Complete modal state management with optional data passing.
 * Useful for modals that need to display specific data or context.
 *
 * @module hooks/ui/useModal
 *
 * @example
 * ```tsx
 * interface UserData {
 *   id: string;
 *   name: string;
 * }
 *
 * const { isOpen, data, open, close } = useModal<UserData>();
 *
 * <button onClick={() => open({ id: '1', name: 'John' })}>
 *   View User
 * </button>
 *
 * <Modal isOpen={isOpen} onClose={close}>
 *   {data && <p>Name: {data.name}</p>}
 * </Modal>
 * ```
 */

import { useState, useCallback } from 'react';

export interface UseModalReturn<T> {
  /**
   * Whether the modal is currently open
   */
  isOpen: boolean;

  /**
   * Data passed to the modal (if any)
   */
  data: T | null;

  /**
   * Open the modal with optional data
   */
  open: (data?: T) => void;

  /**
   * Close the modal and clear data
   */
  close: () => void;
}

/**
 * Hook for modal state management with data passing
 *
 * @template T - Type of data to pass to the modal
 * @returns Object with modal state and control functions
 */
export function useModal<T = unknown>(): UseModalReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((modalData?: T) => {
    if (modalData !== undefined) {
      setData(modalData);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Clear data after animation completes
    setTimeout(() => setData(null), 300);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
  };
}
