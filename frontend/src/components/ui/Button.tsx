/**
 * Button UI Primitive - Constitutional design compliant
 * Includes WCAG AA accessibility, focus states, and ARIA support
 */

import React from 'react'
import './Button.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'button',
      `button--${variant}`,
      `button--${size}`,
      isLoading && 'button--loading',
      disabled && 'button--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <span className="button__spinner" aria-hidden="true">
            ⏳
          </span>
        )}
        {!isLoading && leftIcon && (
          <span className="button__icon button__icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className="button__text">{children}</span>
        {!isLoading && rightIcon && (
          <span className="button__icon button__icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
