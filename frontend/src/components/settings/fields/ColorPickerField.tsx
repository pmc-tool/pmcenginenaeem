/**
 * Color Picker Field Component
 * Feature: 005-basic-ai-training
 * User Story 2: Visual Identity Section
 *
 * Allows users to select brand colors with hex validation
 */

import React, { useState, useEffect } from 'react'
import { validators } from '../../../utils/validation'
import './ColorPickerField.css'

interface ColorPickerFieldProps {
  id: string
  label: string
  value?: string
  onChange: (value: string) => void
  required?: boolean
  helperText?: string
}

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  id,
  label,
  value = '',
  onChange,
  required = false,
  helperText,
}) => {
  const [textValue, setTextValue] = useState(value || '')
  const [error, setError] = useState<string | null>(null)

  // Sync text value when prop changes
  useEffect(() => {
    setTextValue(value || '')
  }, [value])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = e.target.value
    setTextValue(hexColor)
    setError(null)
    onChange(hexColor)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.trim()
    setTextValue(inputValue)

    // Auto-add # if missing
    if (inputValue && !inputValue.startsWith('#')) {
      inputValue = '#' + inputValue
    }

    // Validate hex color
    if (inputValue && !validators.hexColor(inputValue)) {
      setError('Please enter a valid hex color (e.g., #EA2724)')
      return
    }

    // Normalize and update
    if (inputValue) {
      const normalized = validators.normalizeHexColor(inputValue)
      setTextValue(normalized)
      setError(null)
      onChange(normalized)
    } else {
      setError(null)
      onChange('')
    }
  }

  const handleTextBlur = () => {
    // Normalize on blur
    if (textValue) {
      const normalized = validators.normalizeHexColor(textValue)
      setTextValue(normalized)
      onChange(normalized)
    }
  }

  return (
    <div className="color-picker-field">
      <label htmlFor={id}>
        {label} {required && <span className="required">*</span>}
      </label>

      <div className="color-picker-input">
        <div className="color-swatch-wrapper">
          <input
            type="color"
            value={textValue || '#EA2724'}
            onChange={handleColorChange}
            className="color-swatch"
            aria-label={`${label} color picker`}
          />
        </div>

        <input
          id={id}
          type="text"
          value={textValue}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          placeholder="#EA2724"
          maxLength={7}
          className={`color-text-input ${error ? 'error' : ''}`}
        />
      </div>

      {error && <span className="error-message">{error}</span>}
      {helperText && !error && <span className="helper-text">{helperText}</span>}
    </div>
  )
}
