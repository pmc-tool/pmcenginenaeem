/**
 * Toast - Notification System
 * Constitutional requirement: Non-intrusive user feedback
 * Displays temporary notifications with auto-dismiss
 */

import React, { useEffect } from 'react'
import './Toast.css'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  type: ToastType
  message: string
  duration?: number
  onDismiss: (id: string) => void
}

export const Toast: React.FC<ToastProps> = ({ id, type, message, duration = 5000, onDismiss }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onDismiss])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
        return 'ℹ'
    }
  }

  const getAriaLabel = () => {
    switch (type) {
      case 'success':
        return 'Success notification'
      case 'error':
        return 'Error notification'
      case 'warning':
        return 'Warning notification'
      case 'info':
        return 'Information notification'
    }
  }

  return (
    <div
      className={`toast toast--${type}`}
      role="status"
      aria-live="polite"
      aria-label={getAriaLabel()}
    >
      <div className="toast__icon" aria-hidden="true">
        {getIcon()}
      </div>
      <div className="toast__message">{message}</div>
      <button
        className="toast__close"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  )
}
