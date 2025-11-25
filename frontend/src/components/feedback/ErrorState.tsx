/**
 * ErrorState Component
 *
 * Friendly error state with retry action and optional details.
 *
 * @component
 * @example
 * ```tsx
 * <ErrorState
 *   title="Failed to load themes"
 *   message="We couldn't connect to the server. Please try again."
 *   retry={handleRetry}
 *   details={error.stack}
 * />
 * ```
 */

import React, { useState } from 'react';
import './ErrorState.css';

export interface ErrorStateProps {
  /**
   * Error title
   */
  title: string;

  /**
   * User-friendly error message
   */
  message: string;

  /**
   * Retry callback
   */
  retry?: () => void;

  /**
   * Technical error details (collapsed by default)
   */
  details?: string;

  /**
   * Show error details by default
   * @default false
   */
  showDetails?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Test ID for testing
   */
  'data-testid'?: testId;
}

/**
 * Error state component for displaying errors with retry option
 */
export function ErrorState({
  title,
  message,
  retry,
  details,
  showDetails: initialShowDetails = false,
  className = '',
  'data-testid': testId,
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(initialShowDetails);

  const containerClasses = ['error-state', className].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} role="alert" data-testid={testId}>
      <div className="error-state__icon" aria-hidden="true">
        ⚠️
      </div>

      <h3 className="error-state__title">{title}</h3>

      <p className="error-state__message">{message}</p>

      <div className="error-state__actions">
        {retry && (
          <button
            type="button"
            className="error-state__retry"
            onClick={retry}
          >
            Try Again
          </button>
        )}

        {details && (
          <button
            type="button"
            className="error-state__toggle-details"
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        )}
      </div>

      {details && showDetails && (
        <pre className="error-state__details">
          <code>{details}</code>
        </pre>
      )}
    </div>
  );
}
