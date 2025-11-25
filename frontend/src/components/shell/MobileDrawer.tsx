/**
 * MobileDrawer - Slide-in Drawer Overlay for Mobile Navigation
 *
 * Wraps the left rail content in a drawer that slides in from the left on mobile.
 * Includes backdrop overlay, close on outside tap, and swipe-to-close gesture.
 *
 * Features:
 * - 280px width drawer
 * - Slides in from left with 250ms transition
 * - Semi-transparent backdrop (rgba(0,0,0,0.5))
 * - Close on backdrop tap
 * - Swipe left to close gesture
 * - Focus trap when open
 * - ARIA attributes for accessibility
 */

import React, { useEffect, useRef } from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import './MobileDrawer.css'

interface MobileDrawerProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ children, isOpen, onClose }) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const touchCurrentX = useRef<number>(0)

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Focus trap: move focus to drawer when opened
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const firstFocusable = drawerRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      firstFocusable?.focus()
    }
  }, [isOpen])

  // Handle touch gestures for swipe-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchCurrentX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX
    const diff = touchCurrentX.current - touchStartX.current

    // Only allow swipe left (negative diff)
    if (diff < 0 && drawerRef.current) {
      const translate = Math.max(diff, -280) // Max swipe is drawer width
      drawerRef.current.style.transform = `translateX(${translate}px)`
    }
  }

  const handleTouchEnd = () => {
    const diff = touchCurrentX.current - touchStartX.current

    // If swiped left more than 100px, close the drawer
    if (diff < -100) {
      onClose()
    }

    // Reset transform
    if (drawerRef.current) {
      drawerRef.current.style.transform = ''
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
      className="mobile-drawer-overlay"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={drawerRef}
        className="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        id="mobile-nav-drawer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}
