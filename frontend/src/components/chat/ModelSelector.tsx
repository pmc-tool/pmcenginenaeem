/**
 * ModelSelector Component
 * Allows users to select AI model (ChatGPT, Claude Sonnet, or Gemini)
 * Feature: 002-chat-panel
 */

import React, { useState, useRef, useEffect } from 'react'
import './ModelSelector.css'

export type AIModel = 'chatgpt' | 'claude' | 'gemini'

interface ModelOption {
  id: AIModel
  name: string
  description: string
  icon: string
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'GPT-4 by OpenAI',
    icon: '◐',
  },
  {
    id: 'claude',
    name: 'Claude Sonnet',
    description: 'Claude 3.5 Sonnet by Anthropic',
    icon: '◎',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Gemini Pro by Google',
    icon: '◆',
  },
]

interface ModelSelectorProps {
  selectedModel: AIModel
  onModelChange: (model: AIModel) => void
  disabled?: boolean
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = MODEL_OPTIONS.find((opt) => opt.id === selectedModel)

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

  const handleSelect = (model: AIModel) => {
    onModelChange(model)
    setIsOpen(false)
  }

  return (
    <div className="model-selector" ref={dropdownRef}>
      <button
        type="button"
        className="model-selector__trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label="Select AI model"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="model-selector__icon" aria-hidden="true">
          {selectedOption?.icon}
        </span>
        <span className="model-selector__name">{selectedOption?.name}</span>
        <span className="model-selector__chevron" aria-hidden="true">
          {isOpen ? '▴' : '▾'}
        </span>
      </button>

      {isOpen && (
        <div className="model-selector__dropdown" role="listbox">
          {MODEL_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`model-selector__option ${
                option.id === selectedModel ? 'model-selector__option--selected' : ''
              }`}
              onClick={() => handleSelect(option.id)}
              role="option"
              aria-selected={option.id === selectedModel}
            >
              <div className="model-selector__option-main">
                <span className="model-selector__option-icon" aria-hidden="true">
                  {option.icon}
                </span>
                <div className="model-selector__option-text">
                  <span className="model-selector__option-name">{option.name}</span>
                  <span className="model-selector__option-desc">{option.description}</span>
                </div>
              </div>
              {option.id === selectedModel && (
                <span className="model-selector__check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
