/**
 * DraggablePromptPanel Component
 * Bottom sheet-style draggable panel for prompt suggestions
 * Similar to Apple Maps / Google Maps bottom sheets
 * Feature: 002-chat-panel
 *
 * States:
 * - Full (4 buttons) - 280px height
 * - Medium (2 buttons) - 160px height
 * - Collapsed (0 buttons) - 60px height (minimal bar)
 */

import React, { useState, useRef, useCallback, useEffect } from 'react'
import type { Scope } from '../../types/chat'
import { QuickActionChips, type QuickAction } from './QuickActionChips'
import './DraggablePromptPanel.css'

export type PanelState = 'full' | 'medium' | 'collapsed'

interface DraggablePromptPanelProps {
  scope: Scope
  selectedChipId: string | null
  disabled: boolean
  onChipClick: (action: QuickAction) => void
}

// Panel height configurations
const PANEL_HEIGHTS = {
  full: 280,      // Shows 4 buttons
  medium: 160,    // Shows 2 buttons
  collapsed: 60,  // Shows 0 buttons (minimal bar)
}

const VISIBLE_CHIPS = {
  full: 4,
  medium: 2,
  collapsed: 0,
}

export const DraggablePromptPanel: React.FC<DraggablePromptPanelProps> = ({
  scope,
  selectedChipId,
  disabled,
  onChipClick,
}) => {
  const [panelState, setPanelState] = useState<PanelState>('full')
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [currentHeight, setCurrentHeight] = useState(PANEL_HEIGHTS.full)
  const panelRef = useRef<HTMLDivElement>(null)

  // Calculate which buttons should be visible based on current height
  const getVisibleChipCount = useCallback(() => {
    if (currentHeight >= PANEL_HEIGHTS.medium + 40) {
      return VISIBLE_CHIPS.full // 4 buttons
    } else if (currentHeight >= PANEL_HEIGHTS.collapsed + 40) {
      return VISIBLE_CHIPS.medium // 2 buttons
    } else {
      return VISIBLE_CHIPS.collapsed // 0 buttons
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

  const visibleChipCount = getVisibleChipCount()

  return (
    <div
      ref={panelRef}
      className={`draggable-prompt-panel draggable-prompt-panel--${panelState} ${
        isDragging ? 'draggable-prompt-panel--dragging' : ''
      }`}
      style={{
        height: isDragging ? `${currentHeight}px` : `${PANEL_HEIGHTS[panelState]}px`,
      }}
    >
      {/* Drag Handle */}
      <div
        className="draggable-prompt-panel__handle"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        role="button"
        aria-label="Drag to resize prompt panel"
        tabIndex={0}
      >
        <div className="draggable-prompt-panel__handle-bar" />
      </div>

      {/* Content Area */}
      <div className="draggable-prompt-panel__content">
        {visibleChipCount > 0 && (
          <div className="draggable-prompt-panel__chips">
            <QuickActionChips
              scope={scope}
              selectedChipId={selectedChipId}
              disabled={disabled}
              onChipClick={onChipClick}
              maxVisible={visibleChipCount}
            />
          </div>
        )}
      </div>
    </div>
  )
}
