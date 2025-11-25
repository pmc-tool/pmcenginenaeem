/**
 * LoadingState Component
 *
 * Consistent loading indicator with optional message.
 * Use for async operations, data fetching, etc.
 *
 * @component
 * @example
 * ```tsx
 * <LoadingState message="Loading themes..." size="md" />
 * ```
 */

import React from 'react';
import './LoadingState.css';

export interface LoadingStateProps {
  /**
   * Loading message to display
   */
  message?: string;

  /**
   * Spinner size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Center the loading state in its container
   * @default true
   */
  centered?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Test ID for testing
   */
  'data-testid'?: string;
}

/**
 * Loading state component for async operations
 */
export function LoadingState({
  message,
  size = 'md',
  centered = true,
  className = '',
  'data-testid': testId,
}: LoadingStateProps) {
  const containerClasses = [
    'loading-state',
    centered ? 'loading-state--centered' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const spinnerClasses = ['loading-state__spinner', `loading-state__spinner--${size}`].join(' ');

  return (
    <div className={containerClasses} role="status" aria-live="polite" data-testid={testId}>
      <div className={spinnerClasses} aria-hidden="true">
        <div className="loading-state__spinner-circle" />
      </div>
      {message && <p className="loading-state__message">{message}</p>}
      <span className="sr-only">{message || 'Loading...'}</span>
    </div>
  );
}
