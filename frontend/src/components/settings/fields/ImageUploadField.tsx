/**
 * Image Upload Field Component
 * Feature: 005-basic-ai-training
 * User Story 2: Visual Identity Section
 *
 * Allows users to upload logo and images for AI training
 */

import React, { useState, useRef } from 'react'
import { validators } from '../../../utils/validation'
import './ImageUploadField.css'

interface ImageUploadFieldProps {
  id: string
  label: string
  value?: { url: string; alt: string } | null
  onChange: (value: { url: string; alt: string } | null) => void
  required?: boolean
  helperText?: string
  accept?: string
  maxSizeMB?: number
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  id,
  label,
  value,
  onChange,
  required = false,
  helperText,
  accept = 'image/png,image/jpeg,image/jpg,image/webp,image/svg+xml',
  maxSizeMB = 2,
}) => {
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(value?.url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const fileTypeError = validators.fileType(file, accept.split(','))
    if (fileTypeError) {
      setError(fileTypeError)
      return
    }

    // Validate file size
    const fileSizeError = validators.fileSize(file, maxSizeMB)
    if (fileSizeError) {
      setError(fileSizeError)
      return
    }

    // Clear any previous errors
    setError(null)

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)
      onChange({
        url: dataUrl,
        alt: file.name,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="image-upload-field">
      <label htmlFor={id}>
        {label} {required && <span className="required">*</span>}
      </label>

      <div className="image-upload-area">
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt={value?.alt || 'Preview'} />
            <div className="image-preview__actions">
              <button
                type="button"
                onClick={handleClick}
                className="btn-change"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            className="upload-placeholder"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Click to upload</span>
            <span className="upload-hint">
              PNG, JPG, WebP or SVG (max {maxSizeMB}MB)
            </span>
          </button>
        )}

        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="file-input"
          aria-label={label}
        />
      </div>

      {error && <span className="error-message">{error}</span>}
      {helperText && !error && <span className="helper-text">{helperText}</span>}
    </div>
  )
}
