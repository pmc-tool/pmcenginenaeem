/**
 * ChatInputBar Component
 * Fixed bottom input bar for chat messages (textarea + send button only)
 * Feature: 002-chat-panel
 */

import React, { useState, useRef, KeyboardEvent } from 'react'
import './ChatInputBar.css'

interface ChatInputBarProps {
  onSendMessage: (text: string) => void
  isBusy: boolean
  aiCreditsCount: number
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  isBusy,
  aiCreditsCount,
}) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = message.trim()
    if (!trimmed || isBusy || aiCreditsCount === 0) return

    onSendMessage(trimmed)
    setMessage('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    // Shift+Enter adds new line - default behavior
  }

  // Auto-resize textarea as user types
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setMessage(newValue)

    // Auto-resize
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  const isDisabled = isBusy || aiCreditsCount === 0

  return (
    <div className="chat-input-bar">
      {/* Message Input */}
      <div className="chat-input-bar__input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-input-bar__textarea"
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={
            aiCreditsCount === 0
              ? 'Out of credits - purchase more to continue'
              : 'Ask PMC anything...'
          }
          disabled={isDisabled}
          aria-label="Chat message input"
          rows={1}
        />

        <button
          type="button"
          className="chat-input-bar__send"
          onClick={handleSend}
          disabled={isDisabled || !message.trim()}
          aria-label="Send message"
          title="Send message (Enter)"
        >
          {isBusy ? (
            <span className="chat-input-bar__spinner" aria-hidden="true">
              ⏳
            </span>
          ) : (
            <span aria-hidden="true">→</span>
          )}
        </button>
      </div>

      {/* Keyboard Hint */}
      <div className="chat-input-bar__footer">
        <span className="chat-input-bar__hint">
          Press <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line
        </span>
      </div>
    </div>
  )
}
