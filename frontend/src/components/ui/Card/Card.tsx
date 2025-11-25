/**
 * Card Component
 *
 * Reusable card container with consistent styling and variants.
 * Used throughout the app for content grouping.
 *
 * @component
 * @example
 * ```tsx
 * <Card variant="outlined" padding="md">
 *   <h2>Card Title</h2>
 *   <p>Card content</p>
 * </Card>
 * ```
 */

import React from 'react';
import './Card.css';

export interface CardProps {
  /**
   * Visual variant of the card
   * @default 'default'
   */
  variant?: 'default' | 'outlined' | 'elevated';

  /**
   * Internal padding size
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Card content
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Click handler (makes card interactive)
   */
  onClick?: () => void;

  /**
   * Test ID for testing
   */
  'data-testid'?: string;
}

/**
 * Card component for content grouping
 */
export function Card({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  onClick,
  'data-testid': testId,
}: CardProps) {
  const classNames = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    onClick ? 'card--clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      className={classNames}
      onClick={onClick}
      data-testid={testId}
      {...(onClick && {
        type: 'button',
        role: 'button',
      })}
    >
      {children}
    </Tag>
  );
}
