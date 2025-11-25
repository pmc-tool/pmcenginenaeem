/**
 * Word List Field Component
 * Feature: 005-basic-ai-training
 * User Story 3: Voice & Tone Section
 *
 * Allows users to add/remove words or phrases from a list
 */

import React, { useState, KeyboardEvent } from 'react'
import './WordListField.css'

interface WordListFieldProps {
  id: string
  label: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  helperText?: string
  maxItems?: number
}

export const WordListField: React.FC<WordListFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'Type a word or phrase and press Enter',
  helperText,
  maxItems = 20,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addWord()
    }
  }

  const addWord = () => {
    const trimmed = inputValue.trim()

    // Validation
    if (!trimmed) {
      setError('Please enter a word or phrase')
      return
    }

    if (trimmed.length > 50) {
      setError('Maximum 50 characters per item')
      return
    }

    if (value.includes(trimmed)) {
      setError('This word is already in the list')
      return
    }

    if (value.length >= maxItems) {
      setError(`Maximum ${maxItems} items allowed`)
      return
    }

    // Add to list
    onChange([...value, trimmed])
    setInputValue('')
    setError(null)
  }

  const removeWord = (index: number) => {
    const newList = value.filter((_, i) => i !== index)
    onChange(newList)
    setError(null)
  }

  return (
    <div className="word-list-field">
      <label htmlFor={id}>{label}</label>

      <div className="word-list-input-wrapper">
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`word-list-input ${error ? 'error' : ''}`}
          maxLength={50}
        />
        <button
          type="button"
          onClick={addWord}
          className="btn-add-word"
          aria-label="Add word"
        >
          + Add
        </button>
      </div>

      {error && <span className="error-message">{error}</span>}
      {helperText && !error && <span className="helper-text">{helperText}</span>}

      {value.length > 0 && (
        <div className="word-list-tags">
          {value.map((word, index) => (
            <span key={index} className="word-tag">
              <span className="word-tag-text">{word}</span>
              <button
                type="button"
                onClick={() => removeWord(index)}
                className="word-tag-remove"
                aria-label={`Remove ${word}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <div className="word-list-empty">
          No items added yet. Type above and press Enter to add.
        </div>
      )}

      {value.length > 0 && (
        <div className="word-list-count">
          {value.length} / {maxItems} items
        </div>
      )}
    </div>
  )
}
