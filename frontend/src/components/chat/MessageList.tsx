/**
 * MessageList Component
 * Scrollable message history with auto-scroll behavior
 * Feature: 002-chat-panel
 */

import React, { useEffect, useRef } from 'react'
import type { ChatMessage } from '../../types/chat'
import { MessageBubble } from './MessageBubble'
import { OperationLog } from './OperationLog'
import './MessageList.css'

interface MessageListProps {
  messages: ChatMessage[]
  onToggleCollapse?: (messageId: string) => void
  onViewChange?: (entityId: string) => void
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onToggleCollapse,
  onViewChange,
}) => {
  const listRef = useRef<HTMLDivElement>(null)
  const prevMessageCountRef = useRef(messages.length)

  // Auto-scroll to bottom when new message is added (FR-021)
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current && listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
    prevMessageCountRef.current = messages.length
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <div className="message-list message-list--empty">
        <div className="message-list__empty-state">
          <p>No messages yet.</p>
          <p className="message-list__empty-hint">
            Start a conversation with PMC Engine AI.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={listRef}
      className="message-list"
      role="log"
      aria-live="polite"
      aria-label="Chat message history"
    >
      {messages.map((message) => {
        // Render OperationLog for log messages with operation data (FR-023, FR-024, FR-025)
        if (message.type === 'log' && message.operationLog) {
          return (
            <OperationLog
              key={message.id}
              operationId={message.operationLog.operationId}
              status={message.operationLog.status}
              messages={message.operationLog.messages}
              relatedEntityId={message.relatedEntityId}
              onViewChange={onViewChange}
            />
          )
        }

        // Render MessageBubble for all other messages
        return (
          <MessageBubble
            key={message.id}
            message={message}
            onToggleCollapse={
              onToggleCollapse
                ? () => onToggleCollapse(message.id)
                : undefined
            }
          />
        )
      })}
    </div>
  )
}
