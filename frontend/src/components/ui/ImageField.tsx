/**
 * ImageField UI Component - Image upload/URL input with preview
 * Constitutional WCAG AA compliance
 */

import React, { useState, useRef } from 'react'
import { Button } from './Button'
import './ImageField.css'

export interface ImageValue {
  url: string
  alt: string
}

export interface ImageFieldProps {
  id: string
  label: string
  value: ImageValue
  onChange: (value: ImageValue) => void
  disabled?: boolean
  error?: string
  required?: boolean
  maxSizeKB?: number
}

export const ImageField: React.FC<ImageFieldProps> = ({
  id,
  label,
  value,
  onChange,
  disabled = false,
  error,
  required = false,
  maxSizeKB = 2048, // 2MB default
}) => {
  const [inputMode, setInputMode] = useState<'url' | 'upload'>(value.url ? 'url' : 'url')
  const [uploadError, setUploadError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUrlChange = (url: string) => {
    onChange({ ...value, url })
    setUploadError('')
  }

  const handleAltChange = (alt: string) => {
    onChange({ ...value, alt })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, GIF, WebP)')
      return
    }

    // Validate file size
    const fileSizeKB = file.size / 1024
    if (fileSizeKB > maxSizeKB) {
      setUploadError(`Image must be smaller than ${maxSizeKB}KB (current: ${Math.round(fileSizeKB)}KB)`)
      return
    }

    // Convert to base64 data URL for preview
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      onChange({
        url: dataUrl,
        alt: value.alt || file.name.replace(/\.[^/.]+$/, ''),
      })
      setUploadError('')
    }
    reader.onerror = () => {
      setUploadError('Failed to read image file')
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    onChange({ url: '', alt: '' })
    setUploadError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="image-field">
      <label htmlFor={id} className="image-field__label">
        {label}
        {required && <span className="image-field__required" aria-label="required">*</span>}
      </label>

      <div className="image-field__modes">
        <button
          type="button"
          className={`image-field__mode-button ${inputMode === 'url' ? 'image-field__mode-button--active' : ''}`}
          onClick={() => setInputMode('url')}
          disabled={disabled}
        >
          URL
        </button>
        <button
          type="button"
          className={`image-field__mode-button ${inputMode === 'upload' ? 'image-field__mode-button--active' : ''}`}
          onClick={() => setInputMode('upload')}
          disabled={disabled}
        >
          Upload
        </button>
      </div>

      {inputMode === 'url' ? (
        <div className="image-field__url-input">
          <input
            id={id}
            type="url"
            className={`image-field__input ${error || uploadError ? 'image-field__input--error' : ''}`}
            value={value.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            disabled={disabled}
            aria-required={required}
            aria-invalid={!!(error || uploadError)}
            aria-describedby={error || uploadError ? `${id}-error` : undefined}
          />
        </div>
      ) : (
        <div className="image-field__upload">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="image-field__file-input"
            disabled={disabled}
            aria-label={`Upload ${label.toLowerCase()}`}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleUploadClick}
            disabled={disabled}
            leftIcon={<span>📁</span>}
          >
            Choose File
          </Button>
          <span className="image-field__hint">
            Max {maxSizeKB}KB • JPG, PNG, GIF, WebP
          </span>
        </div>
      )}

      {value.url && (
        <div className="image-field__preview">
          <div className="image-field__preview-container">
            <img
              src={value.url}
              alt={value.alt || 'Preview'}
              className="image-field__preview-image"
              onError={() => setUploadError('Failed to load image')}
            />
            <button
              type="button"
              className="image-field__remove"
              onClick={handleRemove}
              disabled={disabled}
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
          <input
            type="text"
            className="image-field__alt-input"
            value={value.alt}
            onChange={(e) => handleAltChange(e.target.value)}
            placeholder="Image description (for accessibility)"
            disabled={disabled}
            aria-label="Image alt text"
          />
        </div>
      )}

      {(error || uploadError) && (
        <span id={`${id}-error`} className="image-field__error" role="alert">
          {error || uploadError}
        </span>
      )}
    </div>
  )
}
