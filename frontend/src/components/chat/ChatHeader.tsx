/**
 * ChatHeader Component
 * Header with title, context, overflow menu, and close button
 * Feature: 002-chat-panel
 */

import React, { useState, useRef, useEffect } from 'react'
import { ConfirmDialog } from './ConfirmDialog'
import { ModelSelector, type AIModel } from './ModelSelector'
import './ChatHeader.css'

interface ChatHeaderProps {
  currentContext: string
  selectedModel: AIModel
  onModelChange: (model: AIModel) => void
  onClose: () => void
  onClearConversation: () => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentContext,
  selectedModel,
  onModelChange,
  onClose,
  onClearConversation,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside (FR-027 - dropdown behavior)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const handleClearClick = () => {
    setIsMenuOpen(false)
    setIsConfirmOpen(true)
  }

  const handleConfirmClear = () => {
    onClearConversation()
  }

  return (
    <>
      <div className="chat-header">
        <div className="chat-header__main">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={onModelChange}
          />

          <div className="chat-header__actions">
            {/* Overflow Menu */}
            <div className="chat-header__menu-wrapper" ref={menuRef}>
              <button
                type="button"
                className="chat-header__menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Chat options menu"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
              >
                <span aria-hidden="true">⋮</span>
              </button>

              {isMenuOpen && (
                <div
                  className="chat-header__menu-dropdown"
                  role="menu"
                  aria-label="Chat options"
                >
                  <button
                    type="button"
                    className="chat-header__menu-item"
                    onClick={handleClearClick}
                    role="menuitem"
                  >
                    <span aria-hidden="true">🗑️</span>
                    <span>Clear conversation</span>
                  </button>
                </div>
              )}
            </div>

            {/* Minimize Button */}
            <button
              type="button"
              className="chat-header__close"
              onClick={onClose}
              aria-label="Minimize chat panel"
              title="Minimize chat (Esc)"
            >
              <span aria-hidden="true">−</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmClear}
        title="Clear conversation?"
        description="This will delete all messages in the current chat. This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  )
}
