/**
 * TextareaField UI Component - Multiline text input
 * Constitutional WCAG AA compliance
 */

import React from 'react'
import './FormFields.css'

export interface TextareaFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  maxLength?: number
  disabled?: boolean
  error?: string
  required?: boolean
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  disabled = false,
  error,
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
        {required && <span className="form-field__required" aria-label="required">*</span>}
      </label>
      <textarea
        id={id}
        className={`form-field__textarea ${error ? 'form-field__textarea--error' : ''}`}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {maxLength && (
        <span className="form-field__hint">
          {value.length} / {maxLength}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="form-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
