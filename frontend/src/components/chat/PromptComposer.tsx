/**
 * PromptComposer Component
 * Message input with send functionality and quick action chips
 * Feature: 002-chat-panel
 */

import React, { useState, useRef, KeyboardEvent, useCallback } from 'react'
import type { Scope } from '../../types/chat'
import { ScopeSelector } from './ScopeSelector'
import { QuickActionChips, type QuickAction } from './QuickActionChips'
import './PromptComposer.css'

interface PromptComposerProps {
  onSendMessage: (text: string) => void
  scope: Scope
  onScopeChange: (scope: Scope) => void
  isBusy: boolean
  aiCreditsCount: number
  currentContext: string
}

export const PromptComposer: React.FC<PromptComposerProps> = ({
  onSendMessage,
  scope,
  onScopeChange,
  isBusy,
  aiCreditsCount,
  currentContext,
}) => {
  const [message, setMessage] = useState('')
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null)
  const [composerHeight, setComposerHeight] = useState(280) // Default height
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const composerRef = useRef<HTMLDivElement>(null)

  // Calculate responsive opacity and scale for chips based on height
  // Full visibility at 280px+, gradually fades out as height decreases to 200px
  const getChipsStyle = () => {
    const maxHeight = 280 // Full visibility
    const minHeight = 200 // Start fading out

    if (composerHeight >= maxHeight) {
      return { opacity: 1, transform: 'scaleY(1)' }
    } else if (composerHeight <= minHeight) {
      return { opacity: 0, transform: 'scaleY(0)' }
    } else {
      // Linear interpolation between min and max
      const ratio = (composerHeight - minHeight) / (maxHeight - minHeight)
      return {
        opacity: ratio,
        transform: `scaleY(${ratio})`,
      }
    }
  }

  const handleSend = () => {
    const trimmed = message.trim()
    if (!trimmed || isBusy || aiCreditsCount === 0) return

    onSendMessage(trimmed)
    setMessage('')
    setSelectedChipId(null) // Clear chip selection after sending

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends message (FR-036)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    // Shift+Enter adds new line (FR-037) - default behavior, no action needed
  }

  // Auto-resize textarea as user types
  // T053: Deselect chip when user manually edits text
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setMessage(newValue)

    // Deselect chip if user modifies text after clicking a chip
    if (selectedChipId && newValue !== message) {
      setSelectedChipId(null)
    }

    // Auto-resize
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  // T052: Handle quick action chip click
  const handleChipClick = (action: QuickAction) => {
    setMessage(action.prompt)
    setSelectedChipId(action.id)

    // Focus textarea
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const isDisabled = isBusy || aiCreditsCount === 0

  // Handle composer resize
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()

    const startY = e.clientY
    const startHeight = composerHeight

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY // Reversed because dragging up increases height
      const newHeight = Math.max(200, Math.min(600, startHeight + deltaY))
      setComposerHeight(newHeight)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'ns-resize'
    document.body.style.userSelect = 'none'
  }, [composerHeight])

  return (
    <div ref={composerRef} className="prompt-composer" style={{ height: `${composerHeight}px` }}>
      {/* Resize handle */}
      <div
        className="prompt-composer__resize-handle"
        onMouseDown={handleResizeStart}
        role="separator"
        aria-label="Resize prompt composer"
        aria-orientation="horizontal"
      />

      {/* Scope Selector & Context Chip */}
      <div className="prompt-composer__header">
        <ScopeSelector
          value={scope}
          onChange={onScopeChange}
          disabled={isBusy}
        />

        {currentContext && (
          <div className="prompt-composer__context" title={`Target: ${currentContext}`}>
            <span className="prompt-composer__context-label">Target:</span>
            <span className="prompt-composer__context-value">{currentContext}</span>
          </div>
        )}
      </div>

      {/* Quick Action Chips - T050 - Responsive visibility based on height */}
      <div className="prompt-composer__chips-wrapper">
        <div
          className="prompt-composer__chips-inner"
          style={getChipsStyle()}
        >
          <QuickActionChips
            scope={scope}
            selectedChipId={selectedChipId}
            disabled={isDisabled}
            onChipClick={handleChipClick}
          />
        </div>
      </div>

      {/* Message Input */}
      <div className="prompt-composer__input-wrapper">
        <textarea
          ref={textareaRef}
          className="prompt-composer__textarea"
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={
            aiCreditsCount === 0
              ? 'Out of credits - purchase more to continue'
              : 'Ask PMC Engine anything...'
          }
          disabled={isDisabled}
          aria-label="Chat message input"
          aria-describedby="composer-credits"
          rows={1}
        />

        <button
          type="button"
          className="prompt-composer__send"
          onClick={handleSend}
          disabled={isDisabled || !message.trim()}
          aria-label="Send message"
          title="Send message (Enter)"
        >
          {isBusy ? (
            <span className="prompt-composer__spinner" aria-hidden="true">
              ⏳
            </span>
          ) : (
            <span aria-hidden="true">→</span>
          )}
        </button>
      </div>

      {/* Keyboard Hint */}
      <div className="prompt-composer__footer">
        <span className="prompt-composer__hint">
          Press <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line
        </span>
      </div>
    </div>
  )
}
