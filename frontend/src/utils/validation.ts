/**
 * Validation utilities for AI Training Panel
 * Feature: 005-basic-ai-training
 */

export const validators = {
  /**
   * Validate email format (RFC 5322 simplified)
   */
  email: (value: string): boolean => {
    if (!value) return true // Optional field
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  },

  /**
   * Validate phone number (lenient format)
   * Allows +, -, spaces, parentheses, 7-20 chars
   */
  phone: (value: string): boolean => {
    if (!value) return true // Optional field
    const cleaned = value.replace(/[\s\-().+]/g, '')
    return cleaned.length >= 7 && cleaned.length <= 20 && /^\d+$/.test(cleaned)
  },

  /**
   * Validate URL format (must start with http:// or https://)
   */
  url: (value: string): boolean => {
    if (!value) return true // Optional field
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  },

  /**
   * Validate hex color format (#RRGGBB)
   */
  hexColor: (value: string): boolean => {
    if (!value) return true // Optional field
    return /^#[0-9A-Fa-f]{6}$/.test(value)
  },

  /**
   * Normalize hex color (add # prefix if missing)
   */
  normalizeHexColor: (value: string): string => {
    if (!value) return ''
    const cleaned = value.trim().toUpperCase()
    if (/^[0-9A-F]{6}$/.test(cleaned)) {
      return `#${cleaned}`
    }
    return cleaned
  },

  /**
   * Check if value is required (not empty)
   */
  required: (value: unknown): boolean => {
    if (typeof value === 'string') return value.trim().length > 0
    return value != null && value !== ''
  },

  /**
   * Check maximum length
   */
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max
  },

  /**
   * Check minimum length
   */
  minLength: (value: string, min: number): boolean => {
    return value.length >= min
  },

  /**
   * Validate file type (for uploads)
   */
  fileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type)
  },

  /**
   * Validate file size (in bytes)
   */
  fileSize: (file: File, maxSize: number): boolean => {
    return file.size <= maxSize
  }
}

/**
 * Error messages for validation failures
 */
export const validationMessages = {
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a complete URL starting with https://',
  hexColor: 'Please enter a valid hex color (e.g., #EA2724)',
  required: (fieldName: string) => `${fieldName} is required`,
  maxLength: (max: number) => `Maximum ${max} characters allowed`,
  minLength: (min: number) => `Minimum ${min} characters required`,
  fileType: (types: string) => `Please upload ${types} files only`,
  fileSize: (maxMB: number) => `File size exceeds ${maxMB}MB limit`
}
