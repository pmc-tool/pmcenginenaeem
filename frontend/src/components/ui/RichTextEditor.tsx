/**
 * RichTextEditor - WYSIWYG content editor using TipTap
 * Constitutional WCAG AA compliance with keyboard shortcuts
 */

import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from './Button'
import './RichTextEditor.css'

export interface RichTextEditorProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  required?: boolean
  maxLength?: number
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'Start writing...',
  disabled = false,
  error,
  required = false,
  maxLength,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor__content',
        'aria-label': label,
        'aria-required': required.toString(),
        'aria-invalid': !!error ? 'true' : 'false',
      },
    },
  })

  const handleBold = () => {
    editor?.chain().focus().toggleBold().run()
  }

  const handleItalic = () => {
    editor?.chain().focus().toggleItalic().run()
  }

  const handleBulletList = () => {
    editor?.chain().focus().toggleBulletList().run()
  }

  const handleOrderedList = () => {
    editor?.chain().focus().toggleOrderedList().run()
  }

  const handleHeading2 = () => {
    editor?.chain().focus().toggleHeading({ level: 2 }).run()
  }

  const handleHeading3 = () => {
    editor?.chain().focus().toggleHeading({ level: 3 }).run()
  }

  const handleLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run()
    }
  }

  const handleClearFormatting = () => {
    editor?.chain().focus().clearNodes().unsetAllMarks().run()
  }

  if (!editor) {
    return null
  }

  const characterCount = editor.storage.characterCount?.characters() || 0
  const isOverLimit = maxLength && characterCount > maxLength

  return (
    <div className="rich-text-editor">
      <label htmlFor={id} className="rich-text-editor__label">
        {label}
        {required && <span className="rich-text-editor__required" aria-label="required">*</span>}
      </label>

      <div className={`rich-text-editor__container ${error ? 'rich-text-editor__container--error' : ''} ${disabled ? 'rich-text-editor__container--disabled' : ''}`}>
        <div className="rich-text-editor__toolbar" role="toolbar" aria-label="Formatting options">
          <div className="rich-text-editor__toolbar-group">
            <button
              type="button"
              onClick={handleBold}
              className={`rich-text-editor__button ${editor.isActive('bold') ? 'rich-text-editor__button--active' : ''}`}
              disabled={disabled}
              title="Bold (Cmd+B)"
              aria-label="Bold"
            >
              <strong>B</strong>
            </button>

            <button
              type="button"
              onClick={handleItalic}
              className={`rich-text-editor__button ${editor.isActive('italic') ? 'rich-text-editor__button--active' : ''}`}
              disabled={disabled}
              title="Italic (Cmd+I)"
              aria-label="Italic"
            >
              <em>I</em>
            </button>
          </div>

          <div className="rich-text-editor__toolbar-separator" />

          <div className="rich-text-editor__toolbar-group">
            <button
              type="button"
              onClick={handleHeading2}
              className={`rich-text-editor__button ${editor.isActive('heading', { level: 2 }) ? 'rich-text-editor__button--active' : ''}`}
              disabled={disabled}
              title="Heading 2"
              aria-label="Heading 2"
            >
              H2
            </button>

            <button
              type="button"
              onClick={handleHeading3}
              className={`rich-text-editor__button ${editor.isActive('heading', { level: 3 }) ? 'rich-text-editor__button--active' : ''}`}
              disabled={disabled}
              title="Heading 3"
              aria-label="Heading 3"
            >
              H3
            </button>
          </div>

          <div className="rich-text-editor__toolbar-separator" />

          <div className="rich-text-editor__toolbar-group">
            <button
              type="button"
              onClick={handleBulletList}
              className={`rich-text-editor__button ${editor.isActive('bulletList') ? 'rich-text-editor__button--active' : ''}`}
              disabled={disabled}
              title="Bullet List"
              aria-label="Bullet list"
            >
              •
            </button>

            <button
              type="button"
              onClick={handleOrderedList}
              className={`rich-text-editor__button ${editor.isActive('orderedList') ? 'rich-text-editor__button--active' : ''}`}
              disabled={disabled}
              title="Numbered List"
              aria-label="Numbered list"
            >
              1.
            </button>
          </div>

          <div className="rich-text-editor__toolbar-separator" />

          <div className="rich-text-editor__toolbar-group">
            <button
              type="button"
              onClick={handleLink}
              className={`rich-text-editor__button ${editor.isActive('link') ? 'rich-text-editor__button--active' : ''}`}
              disabled={disabled}
              title="Insert Link"
              aria-label="Insert link"
            >
              🔗
            </button>

            <button
              type="button"
              onClick={handleClearFormatting}
              className="rich-text-editor__button"
              disabled={disabled}
              title="Clear Formatting"
              aria-label="Clear formatting"
            >
              ×
            </button>
          </div>
        </div>

        <EditorContent editor={editor} />
      </div>

      <div className="rich-text-editor__footer">
        {maxLength && (
          <span className={`rich-text-editor__character-count ${isOverLimit ? 'rich-text-editor__character-count--over' : ''}`}>
            {characterCount} / {maxLength}
          </span>
        )}
        {error && (
          <span className="rich-text-editor__error" role="alert">
            {error}
          </span>
        )}
      </div>

      <div className="rich-text-editor__hint">
        Keyboard shortcuts: <strong>Cmd+B</strong> Bold, <strong>Cmd+I</strong> Italic
      </div>
    </div>
  )
}
