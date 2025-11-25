/**
 * TextField UI Component - Text input with label
 * Constitutional WCAG AA compliance
 */

import React from 'react'
import './FormFields.css'

export interface TextFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  disabled?: boolean
  error?: string
  required?: boolean
}

export const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  disabled = false,
  error,
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
        {required && <span className="form-field__required" aria-label="required">*</span>}
      </label>
      <input
        id={id}
        type="text"
        className={`form-field__input ${error ? 'form-field__input--error' : ''}`}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
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
