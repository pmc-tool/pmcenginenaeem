/**
 * ScopeSelector Component
 * Dropdown to select AI operation scope (Field/Section/Page/Feature)
 * Feature: 002-chat-panel
 */

import React, { useState, useRef, useEffect } from 'react'
import type { Scope } from '../../types/chat'
import './ScopeSelector.css'

interface ScopeSelectorProps {
  value: Scope
  onChange: (scope: Scope) => void
  disabled?: boolean
}

const SCOPE_OPTIONS: Array<{
  value: Scope
  label: string
  description: string
  icon: string
}> = [
  {
    value: 'field',
    label: 'Field',
    description: 'Edit a single field (e.g., headline, button text)',
    icon: '📝',
  },
  {
    value: 'section',
    label: 'Section',
    description: 'Edit an entire section (e.g., hero, features)',
    icon: '📦',
  },
  {
    value: 'page',
    label: 'Page',
    description: 'Edit the whole page (e.g., About, Contact)',
    icon: '📄',
  },
  {
    value: 'feature',
    label: 'Feature',
    description: 'Cross-page changes (e.g., update all CTAs)',
    icon: '🌐',
  },
]

export const ScopeSelector: React.FC<ScopeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = SCOPE_OPTIONS.find((opt) => opt.value === value)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (scope: Scope) => {
    onChange(scope)
    setIsOpen(false)
  }

  return (
    <div className="scope-selector" ref={dropdownRef}>
      <button
        type="button"
        className="scope-selector__button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label="Select AI operation scope"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title={selectedOption?.description}
      >
        <span className="scope-selector__icon" aria-hidden="true">
          {selectedOption?.icon}
        </span>
        <span className="scope-selector__label">{selectedOption?.label}</span>
        <span className="scope-selector__chevron" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className="scope-selector__dropdown" role="listbox" aria-label="Scope options">
          {SCOPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`scope-selector__option ${
                option.value === value ? 'scope-selector__option--selected' : ''
              }`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={option.value === value}
            >
              <div className="scope-selector__option-header">
                <span className="scope-selector__option-icon" aria-hidden="true">
                  {option.icon}
                </span>
                <span className="scope-selector__option-label">{option.label}</span>
                {option.value === value && (
                  <span className="scope-selector__checkmark" aria-hidden="true">
                    ✓
                  </span>
                )}
              </div>
              <p className="scope-selector__option-description">{option.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
