/**
 * Content Type Definitions
 * Page and Section data structures per data-model.md
 */

export interface Section {
  id: string
  pageId: string
  type: string // e.g., 'hero', 'features', 'testimonials', 'cta'
  title: string
  order: number
  fields: Record<string, unknown>
  metadata: {
    createdAt: string
    updatedAt: string
  }
}

export interface Page {
  id: string
  title: string
  slug: string
  order: number
  sections: Section[]
  metadata: {
    createdAt: string
    updatedAt: string
    published: boolean
  }
}

export interface Site {
  id: string
  name: string
  logoUrl: string | null
  pages: Page[]
  metadata: {
    createdAt: string
    updatedAt: string
  }
}

// Field type definitions for content editing
export interface TextField {
  type: 'text'
  label: string
  value: string
  placeholder?: string
  maxLength?: number
}

export interface TextareaField {
  type: 'textarea'
  label: string
  value: string
  placeholder?: string
  rows?: number
}

export interface ImageField {
  type: 'image'
  label: string
  value: {
    url: string
    alt: string
  }
}

export interface SelectField {
  type: 'select'
  label: string
  value: string
  options: Array<{ label: string; value: string }>
}

export type ContentField = TextField | TextareaField | ImageField | SelectField

// Schema definition for section types
export interface SectionSchema {
  type: string
  label: string
  icon: string
  fields: Record<string, Omit<ContentField, 'value'>>
}
