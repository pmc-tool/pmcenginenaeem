/**
 * Panel Component
 *
 * Collapsible panel with header, content, and optional actions.
 * Perfect for settings sections, inspector tabs, and grouped content.
 *
 * @component
 * @example
 * ```tsx
 * <Panel
 *   title="Account Settings"
 *   subtitle="Manage your account preferences"
 *   collapsible
 *   actions={<button>Edit</button>}
 * >
 *   <p>Panel content goes here</p>
 * </Panel>
 * ```
 */

import React, { useState } from 'react';
import { useToggle } from '../../../hooks/ui';
import './Panel.css';

export interface PanelProps {
  /**
   * Panel title
   */
  title: string;

  /**
   * Optional subtitle or description
   */
  subtitle?: string;

  /**
   * Panel content
   */
  children: React.ReactNode;

  /**
   * Optional action buttons in header
   */
  actions?: React.ReactNode;

  /**
   * Whether panel can be collapsed
   * @default false
   */
  collapsible?: boolean;

  /**
   * Initially collapsed state (only if collapsible)
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Panel padding
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';

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
 * Panel component for grouped content with optional collapse
 */
export function Panel({
  title,
  subtitle,
  children,
  actions,
  collapsible = false,
  defaultCollapsed = false,
  padding = 'md',
  className = '',
  'data-testid': testId,
}: PanelProps) {
  const [isCollapsed, toggle, , setExpanded] = useToggle(defaultCollapsed);

  const containerClasses = [
    'panel',
    isCollapsed ? 'panel--collapsed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const contentClasses = [
    'panel__content',
    `panel__content--padding-${padding}`,
  ].join(' ');

  const handleHeaderClick = () => {
    if (collapsible) {
      toggle();
    }
  };

  return (
    <div className={containerClasses} data-testid={testId}>
      <div
        className={`panel__header ${collapsible ? 'panel__header--clickable' : ''}`}
        onClick={handleHeaderClick}
        role={collapsible ? 'button' : undefined}
        aria-expanded={collapsible ? !isCollapsed : undefined}
        tabIndex={collapsible ? 0 : undefined}
        onKeyDown={(e) => {
          if (collapsible && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <div className="panel__header-content">
          <div className="panel__header-text">
            <h3 className="panel__title">{title}</h3>
            {subtitle && <p className="panel__subtitle">{subtitle}</p>}
          </div>

          {collapsible && (
            <div className="panel__collapse-icon" aria-hidden="true">
              {isCollapsed ? '▶' : '▼'}
            </div>
          )}
        </div>

        {actions && <div className="panel__actions">{actions}</div>}
      </div>

      {!isCollapsed && (
        <div className={contentClasses}>
          {children}
        </div>
      )}
    </div>
  );
}
