/**
 * EmptyState Component
 *
 * Friendly empty state with icon, title, description, and optional action.
 *
 * @component
 * @example
 * ```tsx
 * <EmptyState
 *   icon="📁"
 *   title="No themes found"
 *   description="Upload a theme or purchase one from the marketplace."
 *   action={<button onClick={handleUpload}>Upload Theme</button>}
 * />
 * ```
 */

import React from 'react';
import './EmptyState.css';

export interface EmptyStateProps {
  /**
   * Icon or emoji to display
   */
  icon?: React.ReactNode;

  /**
   * Main title
   */
  title: string;

  /**
   * Supporting description
   */
  description?: string;

  /**
   * Optional action button or element
   */
  action?: React.ReactNode;

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
 * Empty state component for when there's no data to display
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
  'data-testid': testId,
}: EmptyStateProps) {
  const containerClasses = ['empty-state', className].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} data-testid={testId}>
      {icon && <div className="empty-state__icon" aria-hidden="true">{icon}</div>}

      <h3 className="empty-state__title">{title}</h3>

      {description && <p className="empty-state__description">{description}</p>}

      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
