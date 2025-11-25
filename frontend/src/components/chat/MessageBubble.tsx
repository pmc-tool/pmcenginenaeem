/**
 * MessageBubble Component
 * Renders individual chat messages (user, AI, log)
 * Feature: 002-chat-panel
 */

import React from 'react'
import type { ChatMessage } from '../../types/chat'
import { formatTimestamp } from '../../utils/formatTimestamp'
import './MessageBubble.css'

interface MessageBubbleProps {
  message: ChatMessage
  onToggleCollapse?: () => void
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onToggleCollapse,
}) => {
  const { type, text, scope, action, createdAt, isCollapsed } = message

  // Determine if message should show collapse button (>8 lines or >400 chars)
  const shouldShowCollapse = text.length > 400 || text.split('\n').length > 8

  return (
    <div
      className={`message-bubble message-bubble--${type}`}
      role={type === 'log' ? 'status' : undefined}
      aria-live={type === 'log' ? 'polite' : undefined}
    >
      {/* Message Content */}
      <div className={`message-bubble__content ${isCollapsed && shouldShowCollapse ? 'message-bubble__content--collapsed' : ''}`}>
        {text}
      </div>

      {/* Metadata Row */}
      <div className="message-bubble__meta">
        <span className="message-bubble__timestamp">
          {formatTimestamp(createdAt)}
        </span>

        {/* Scope Badge (for AI messages) */}
        {type === 'ai' && scope && (
          <span className="message-bubble__scope" title={`Scope: ${scope}`}>
            {scope.toUpperCase()}
          </span>
        )}

        {/* Action Badge (for AI messages with specific actions) */}
        {type === 'ai' && action && action !== 'general' && (
          <span className="message-bubble__action" title={`Action: ${action}`}>
            {action}
          </span>
        )}
      </div>

      {/* Collapse/Expand Button */}
      {shouldShowCollapse && (
        <button
          type="button"
          className="message-bubble__toggle"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Show more' : 'Show less'}
        >
          {isCollapsed ? 'Show more' : 'Show less'}
        </button>
      )}
    </div>
  )
}
