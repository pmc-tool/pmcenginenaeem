/**
 * BottomAIPanel Component
 * Unified draggable bottom sheet containing header + suggestions
 * Similar to Apple Maps / Google Maps bottom sheets
 * Feature: 002-chat-panel
 *
 * Layout (top to bottom, all in one panel):
 * 1. Drag handle (top edge)
 * 2. Header row (Scope selector + Target label)
 * 3. Prompt suggestions (4/2/0 buttons based on state)
 *
 * States:
 * - Full (280px) - Shows 4 buttons in 2×2 grid
 * - Medium (180px) - Shows 2 buttons (top row only)
 * - Collapsed (80px) - Shows 0 buttons (header only)
 */

import React, { useState, useRef, useCallback, useEffect } from 'react'
import type { Scope } from '../../types/chat'
import { ScopeSelector } from './ScopeSelector'
import './BottomAIPanel.css'

export type PanelState = 'full' | 'medium' | 'collapsed'

interface BottomAIPanelProps {
  scope: Scope
  onScopeChange: (scope: Scope) => void
  currentContext: string
  disabled: boolean
  onPromptClick: (prompt: string) => void
}

// Panel height configurations
const PANEL_HEIGHTS = {
  full: 175,      // Shows 4 buttons (2×2 grid)
  medium: 120,    // Shows 2 buttons (top row)
  collapsed: 65,  // Shows 0 buttons (header only)
}

// Quick action prompts
const QUICK_PROMPTS = [
  { id: 'code-editor', label: 'Open code editor', prompt: 'Open the code editor to view and edit the code' },
  { id: 'improve', label: 'Improve headline', prompt: 'Improve this headline to be more engaging and compelling' },
  { id: 'faqs', label: 'Generate FAQs', prompt: 'Generate a comprehensive FAQ section' },
  { id: 'shorten', label: 'Shorten content', prompt: 'Shorten this content while preserving key messages' },
]

export const BottomAIPanel: React.FC<BottomAIPanelProps> = ({
  scope,
  onScopeChange,
  currentContext,
  disabled,
  onPromptClick,
}) => {
  const [panelState, setPanelState] = useState<PanelState>('full')
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [currentHeight, setCurrentHeight] = useState(PANEL_HEIGHTS.full)
  const panelRef = useRef<HTMLDivElement>(null)

  // Calculate which buttons should be visible based on current height
  const getVisibleButtonCount = useCallback(() => {
    if (currentHeight >= PANEL_HEIGHTS.medium + 40) {
      return 4 // Full: all 4 buttons
    } else if (currentHeight >= PANEL_HEIGHTS.collapsed + 40) {
      return 2 // Medium: top row only
    } else {
      return 0 // Collapsed: no buttons
    }
  }, [currentHeight])

  // Snap to nearest state
  const snapToNearestState = useCallback((height: number) => {
    const midFullMedium = (PANEL_HEIGHTS.full + PANEL_HEIGHTS.medium) / 2
    const midMediumCollapsed = (PANEL_HEIGHTS.medium + PANEL_HEIGHTS.collapsed) / 2

    let newState: PanelState
    if (height >= midFullMedium) {
      newState = 'full'
    } else if (height >= midMediumCollapsed) {
      newState = 'medium'
    } else {
      newState = 'collapsed'
    }

    setPanelState(newState)
    setCurrentHeight(PANEL_HEIGHTS[newState])
  }, [])

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setDragStartY(clientY)
  }, [])

  // Handle drag move
  useEffect(() => {
    if (!isDragging) return

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const deltaY = clientY - dragStartY

      // Calculate new height (dragging down = smaller height)
      const startHeight = PANEL_HEIGHTS[panelState]
      const newHeight = Math.max(
        PANEL_HEIGHTS.collapsed,
        Math.min(PANEL_HEIGHTS.full, startHeight - deltaY)
      )

      setCurrentHeight(newHeight)
    }

    const handleEnd = () => {
      setIsDragging(false)
      snapToNearestState(currentHeight)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove, { passive: false })
    document.addEventListener('touchend', handleEnd)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, dragStartY, panelState, currentHeight, snapToNearestState])

  const visibleButtonCount = getVisibleButtonCount()
  const visiblePrompts = QUICK_PROMPTS.slice(0, visibleButtonCount)

  return (
    <div
      ref={panelRef}
      className={`bottom-ai-panel bottom-ai-panel--${panelState} ${
        isDragging ? 'bottom-ai-panel--dragging' : ''
      }`}
      style={{
        height: isDragging ? `${currentHeight}px` : `${PANEL_HEIGHTS[panelState]}px`,
      }}
    >
      {/* Drag Handle */}
      <div
        className="bottom-ai-panel__handle"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        role="button"
        aria-label="Drag to resize AI panel"
        tabIndex={0}
      >
        <div className="bottom-ai-panel__handle-bar" />
      </div>

      {/* Header Row (Scope + Context) */}
      <div className="bottom-ai-panel__header">
        <ScopeSelector
          value={scope}
          onChange={onScopeChange}
          disabled={disabled}
        />

        {currentContext && (
          <div className="bottom-ai-panel__context" title={`Target: ${currentContext}`}>
            <span className="bottom-ai-panel__context-label">Target:</span>
            <span className="bottom-ai-panel__context-value">{currentContext}</span>
          </div>
        )}
      </div>

      {/* Prompt Suggestions (2×2 grid) */}
      {visibleButtonCount > 0 && (
        <div className="bottom-ai-panel__suggestions">
          {visiblePrompts.map((item) => (
            <button
              key={item.id}
              type="button"
              className="bottom-ai-panel__prompt-btn"
              onClick={() => onPromptClick(item.prompt)}
              disabled={disabled}
              aria-label={item.label}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
