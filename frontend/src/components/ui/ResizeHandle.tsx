/**
 * ResizeHandle - Draggable handle for resizing panels
 * Constitutional WCAG AA compliance with keyboard support
 */

import React, { useRef, useState, useEffect } from 'react'
import './ResizeHandle.css'

export interface ResizeHandleProps {
  onResize: (width: number) => void
  minWidth: number
  maxWidth: number
  initialWidth: number
  orientation?: 'vertical' | 'horizontal'
  ariaLabel?: string
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  onResize,
  minWidth,
  maxWidth,
  initialWidth,
  orientation = 'vertical',
  ariaLabel = 'Resize panel',
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [width, setWidth] = useState(initialWidth)
  const handleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate new width based on mouse position
      const newWidth = orientation === 'vertical'
        ? window.innerWidth - e.clientX
        : e.clientY

      // Clamp width between min and max
      const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth)

      setWidth(clampedWidth)
      onResize(clampedWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    // Set cursor for entire document while dragging
    document.body.style.cursor = orientation === 'vertical' ? 'ew-resize' : 'ns-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, minWidth, maxWidth, onResize, orientation])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = 20 // 20px per keypress
    let newWidth = width

    switch (e.key) {
      case 'ArrowLeft':
        if (orientation === 'vertical') {
          newWidth = Math.min(width + step, maxWidth)
        }
        break
      case 'ArrowRight':
        if (orientation === 'vertical') {
          newWidth = Math.max(width - step, minWidth)
        }
        break
      case 'ArrowUp':
        if (orientation === 'horizontal') {
          newWidth = Math.max(width - step, minWidth)
        }
        break
      case 'ArrowDown':
        if (orientation === 'horizontal') {
          newWidth = Math.min(width + step, maxWidth)
        }
        break
      case 'Home':
        newWidth = minWidth
        break
      case 'End':
        newWidth = maxWidth
        break
      default:
        return
    }

    e.preventDefault()
    setWidth(newWidth)
    onResize(newWidth)
  }

  return (
    <div
      ref={handleRef}
      className={`resize-handle resize-handle--${orientation} ${isDragging ? 'resize-handle--dragging' : ''}`}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      role="separator"
      aria-label={ariaLabel}
      aria-valuenow={width}
      aria-valuemin={minWidth}
      aria-valuemax={maxWidth}
      aria-orientation={orientation}
      tabIndex={0}
    >
      <div className="resize-handle__indicator" />
    </div>
  )
}
