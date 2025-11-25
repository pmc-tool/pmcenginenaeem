/**
 * Tone Slider Component
 * Feature: 005-basic-ai-training
 * User Story 3: Voice & Tone Section
 *
 * 1-5 scale slider for tone characteristics (formal/casual, playful/serious)
 */

import React from 'react'
import './ToneSlider.css'

interface ToneSliderProps {
  id: string
  label: string
  leftLabel: string
  rightLabel: string
  value: number | null
  onChange: (value: number) => void
  helperText?: string
}

export const ToneSlider: React.FC<ToneSliderProps> = ({
  id,
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
  helperText,
}) => {
  const currentValue = value ?? 3 // Default to middle (3) if null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  // Get label for current value
  const getValueLabel = (val: number): string => {
    switch (val) {
      case 1:
        return leftLabel
      case 2:
        return `Slightly ${leftLabel.toLowerCase()}`
      case 3:
        return 'Balanced'
      case 4:
        return `Slightly ${rightLabel.toLowerCase()}`
      case 5:
        return rightLabel
      default:
        return 'Balanced'
    }
  }

  return (
    <div className="tone-slider-field">
      <label htmlFor={id} className="tone-slider-label">
        {label}
      </label>

      <div className="tone-slider-container">
        <span className="tone-label tone-label--left">{leftLabel}</span>

        <div className="tone-slider-wrapper">
          <input
            id={id}
            type="range"
            min="1"
            max="5"
            step="1"
            value={currentValue}
            onChange={handleChange}
            className="tone-slider"
            aria-label={label}
            aria-valuemin={1}
            aria-valuemax={5}
            aria-valuenow={currentValue}
            aria-valuetext={getValueLabel(currentValue)}
          />
          <div className="tone-slider-track">
            <div className="tone-slider-marks">
              <span className="mark"></span>
              <span className="mark"></span>
              <span className="mark"></span>
              <span className="mark"></span>
              <span className="mark"></span>
            </div>
          </div>
          <div className="tone-slider-value">
            {getValueLabel(currentValue)}
          </div>
        </div>

        <span className="tone-label tone-label--right">{rightLabel}</span>
      </div>

      {helperText && <span className="helper-text">{helperText}</span>}
    </div>
  )
}
