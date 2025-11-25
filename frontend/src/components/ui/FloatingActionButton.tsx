/**
 * FloatingActionButton (FAB) - Mobile Action Button
 *
 * Floating action button for primary mobile actions.
 * Positioned in bottom-right corner with elevation shadow.
 *
 * Features:
 * - 56x56px circular button (WCAG 2.1 AAA touch target)
 * - Fixed position in bottom-right corner
 * - 16px margin from edges
 * - Elevation shadow for depth
 * - Ripple effect on tap
 * - ARIA attributes for accessibility
 * - Safe area support for iOS
 */

import React from 'react'
import './FloatingActionButton.css'

interface FloatingActionButtonProps {
  onClick: () => void
  icon: React.ReactNode
  label: string
  variant?: 'primary' | 'secondary'
  className?: string
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  label,
  variant = 'primary',
  className = ''
}) => {
  return (
    <button
      className={`fab fab--${variant} ${className}`}
      onClick={onClick}
      aria-label={label}
      title={label}
      type="button"
    >
      <span className="fab__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}
