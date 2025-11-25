/**
 * SkipLinks - Keyboard Navigation Accessibility
 * Constitutional requirement: WCAG AA compliance
 * Allows keyboard users to skip to main content areas
 */

import React from 'react'
import './SkipLinks.css'

interface SkipLink {
  id: string
  label: string
  targetId: string
}

const skipLinks: SkipLink[] = [
  { id: 'skip-to-canvas', label: 'Skip to main content', targetId: 'canvas' },
  { id: 'skip-to-inspector', label: 'Skip to inspector', targetId: 'inspector' },
  { id: 'skip-to-pages', label: 'Skip to pages', targetId: 'page-sidebar' },
]

export const SkipLinks: React.FC = () => {
  const handleSkipClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="skip-links" aria-label="Skip links">
      {skipLinks.map((link) => (
        <a
          key={link.id}
          href={`#${link.targetId}`}
          className="skip-links__link"
          onClick={(e) => handleSkipClick(e, link.targetId)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}
