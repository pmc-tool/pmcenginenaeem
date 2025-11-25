/**
 * Icon UI Primitive - ARIA-compliant icon component
 * Supports both decorative and semantic icons
 */

import React from 'react'
import './Icon.css'

export type IconName =
  | 'chat'
  | 'pages'
  | 'settings'
  | 'help'
  | 'preview'
  | 'publish'
  | 'credits'
  | 'chevron-right'
  | 'chevron-down'
  | 'drag-handle'
  | 'close'
  | 'check'
  | 'warning'
  | 'error'
  | 'info'

export interface IconProps {
  name: IconName
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  'aria-label'?: string
  'aria-hidden'?: boolean
}

const iconMap: Record<IconName, string> = {
  chat: '◐',
  pages: '☰',
  settings: '⚙',
  help: '?',
  preview: '◉',
  publish: '↗',
  credits: '★',
  'chevron-right': '›',
  'chevron-down': '▾',
  'drag-handle': '⋮⋮',
  close: '×',
  check: '✓',
  warning: '⚠',
  error: '✕',
  info: 'ℹ',
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = !ariaLabel,
}) => {
  const classNames = ['icon', `icon--${size}`, className].filter(Boolean).join(' ')

  return (
    <span
      className={classNames}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      {iconMap[name]}
    </span>
  )
}
