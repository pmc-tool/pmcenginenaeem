/**
 * ToastContainer - Toast Notification Manager
 * Constitutional requirement: Bottom-right positioning, stacked vertically
 */

import React from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import { Toast } from './Toast'
import './ToastContainer.css'

export const ToastContainer: React.FC = () => {
  const toasts = useDashboardStore((state) => state.toasts)
  const removeToast = useDashboardStore((state) => state.removeToast)

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onDismiss={removeToast}
        />
      ))}
    </div>
  )
}
