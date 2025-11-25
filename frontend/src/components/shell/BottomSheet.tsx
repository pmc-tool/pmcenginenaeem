/**
 * BottomSheet - Slide-up Sheet Overlay for Mobile Content
 *
 * Bottom sheet pattern for mobile that slides up from bottom of screen.
 * Used for pages list, settings, and other secondary content on mobile.
 *
 * Features:
 * - Slides up from bottom with 250ms transition
 * - Semi-transparent backdrop (rgba(0,0,0,0.5))
 * - Snap points: collapsed (60px), half (50vh), full (90vh)
 * - Close on backdrop tap
 * - Swipe down to close gesture
 * - Focus trap when open
 * - ARIA attributes for accessibility
 * - Safe area support for iOS notch
 */

import React, { useEffect, useRef, useState } from 'react'
import './BottomSheet.css'

export type SnapPoint = 'collapsed' | 'half' | 'full'

interface BottomSheetProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  snapPoint?: SnapPoint
  onSnapPointChange?: (snapPoint: SnapPoint) => void
  title?: string
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  isOpen,
  onClose,
  snapPoint = 'half',
  onSnapPointChange,
  title = 'Content'
}) => {
  const sheetRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef<number>(0)
  const touchCurrentY = useRef<number>(0)
  const [currentSnap, setCurrentSnap] = useState<SnapPoint>(snapPoint)

  // Sync internal snap state with prop
  useEffect(() => {
    setCurrentSnap(snapPoint)
  }, [snapPoint])

  // Handle Escape key to close sheet
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when sheet is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Focus trap: move focus to sheet when opened
  useEffect(() => {
    if (isOpen && sheetRef.current) {
      const firstFocusable = sheetRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      firstFocusable?.focus()
    }
  }, [isOpen])

  // Handle touch gestures for swipe-to-close and snap points
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
    touchCurrentY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentY.current = e.touches[0].clientY
    const diff = touchCurrentY.current - touchStartY.current

    // Only allow swipe down (positive diff)
    if (diff > 0 && sheetRef.current) {
      const translate = Math.min(diff, 600) // Max swipe is 600px
      sheetRef.current.style.transform = `translateY(${translate}px)`
    }
  }

  const handleTouchEnd = () => {
    const diff = touchCurrentY.current - touchStartY.current

    // If swiped down more than 150px, close or snap to lower point
    if (diff > 150) {
      if (currentSnap === 'full') {
        // Snap to half
        setCurrentSnap('half')
        onSnapPointChange?.('half')
      } else if (currentSnap === 'half') {
        // Close
        onClose()
      } else {
        // Already collapsed, close
        onClose()
      }
    } else if (diff < -150) {
      // Swiped up, snap to higher point
      if (currentSnap === 'collapsed') {
        setCurrentSnap('half')
        onSnapPointChange?.('half')
      } else if (currentSnap === 'half') {
        setCurrentSnap('full')
        onSnapPointChange?.('full')
      }
    }

    // Reset transform
    if (sheetRef.current) {
      sheetRef.current.style.transform = ''
    }
  }

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="bottom-sheet-overlay"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={sheetRef}
        className={`bottom-sheet bottom-sheet--${currentSnap}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        id="mobile-bottom-sheet"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle indicator */}
        <div className="bottom-sheet__handle-bar" aria-hidden="true">
          <div className="bottom-sheet__handle" />
        </div>

        {/* Header with title and close button */}
        <div className="bottom-sheet__header">
          <h2 className="bottom-sheet__title">{title}</h2>
          <button
            className="bottom-sheet__close"
            onClick={onClose}
            aria-label="Close"
            title="Close (Esc)"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {/* Content area */}
        <div className="bottom-sheet__content">
          {children}
        </div>
      </div>
    </div>
  )
}
