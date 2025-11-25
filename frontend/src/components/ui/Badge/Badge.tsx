/**
 * Badge Component
 *
 * Small status indicator or label with semantic color variants.
 *
 * @component
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning" size="sm">Pending</Badge>
 * <Badge variant="error">Failed</Badge>
 * ```
 */

import React from 'react';
import './Badge.css';

export interface BadgeProps {
  /**
   * Semantic variant that determines color
   * @default 'default'
   */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary';

  /**
   * Badge size
   * @default 'md'
   */
  size?: 'sm' | 'md';

  /**
   * Badge content (usually short text)
   */
  children: React.ReactNode;

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
 * Badge component for status indicators and labels
 */
export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  'data-testid': testId,
}: BadgeProps) {
  const classNames = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} data-testid={testId}>
      {children}
    </span>
  );
}
