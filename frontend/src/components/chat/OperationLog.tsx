/**
 * OperationLog Component
 * Renders progressive AI operation logs showing step-by-step progression
 * Feature: 002-chat-panel
 *
 * Constitutional Compliance:
 * - FR-023: Shows progression logs ("Analyzing...", "Processing...", etc.)
 * - FR-024: Shows completion logs with summary
 * - FR-025: Includes "View change" links for navigation
 * - FR-028: Only human-readable messages (no stack traces)
 */

import React from 'react'
import type { OperationStatus } from '../../types/chat'
import './OperationLog.css'

export interface OperationLogProps {
  /** Unique operation identifier */
  operationId: string

  /** Current operation status */
  status: OperationStatus

  /** Array of log messages showing progression */
  messages: string[]

  /** Optional entity ID for "View change" link */
  relatedEntityId?: string

  /** Callback when "View change" is clicked */
  onViewChange?: (entityId: string) => void
}

export const OperationLog: React.FC<OperationLogProps> = ({
  operationId,
  status,
  messages,
  relatedEntityId,
  onViewChange,
}) => {
  const handleViewChange = (e: React.MouseEvent) => {
    e.preventDefault()
    if (relatedEntityId && onViewChange) {
      onViewChange(relatedEntityId)
    }
  }

  // Determine status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'running':
        return '⚙️'
      case 'success':
        return '✓'
      case 'error':
        return '⚠'
      default:
        return ''
    }
  }

  // Determine status label for screen readers
  const getStatusLabel = () => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'running':
        return 'Running'
      case 'success':
        return 'Completed successfully'
      case 'error':
        return 'Failed'
      default:
        return ''
    }
  }

  return (
    <div
      className={`operation-log operation-log--${status}`}
      role="log"
      aria-label={`Operation ${getStatusLabel()}`}
      data-operation-id={operationId}
    >
      {/* Status Indicator */}
      <div className="operation-log__status" aria-hidden="true">
        <span className="operation-log__status-icon">{getStatusIcon()}</span>
      </div>

      {/* Log Messages */}
      <div className="operation-log__messages">
        {messages.map((message, index) => (
          <div
            key={`${operationId}-msg-${index}`}
            className={`operation-log__message ${
              index === messages.length - 1 ? 'operation-log__message--latest' : ''
            }`}
          >
            {message}
          </div>
        ))}

        {/* View Change Link (shown on success with relatedEntityId) */}
        {status === 'success' && relatedEntityId && (
          <button
            type="button"
            className="operation-log__view-change"
            onClick={handleViewChange}
            aria-label="View changes in canvas and inspector"
          >
            View change →
          </button>
        )}
      </div>
    </div>
  )
}
