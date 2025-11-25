/**
 * ConfirmDialog Component
 * Accessible confirmation dialog using Radix UI primitives
 * Feature: 002-chat-panel
 */

import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import './ConfirmDialog.css'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'default'
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="confirm-dialog__overlay" />
        <Dialog.Content className="confirm-dialog__content">
          <Dialog.Title className="confirm-dialog__title">{title}</Dialog.Title>
          <Dialog.Description className="confirm-dialog__description">
            {description}
          </Dialog.Description>

          <div className="confirm-dialog__actions">
            <Dialog.Close asChild>
              <button type="button" className="confirm-dialog__button confirm-dialog__button--cancel">
                {cancelText}
              </button>
            </Dialog.Close>
            <button
              type="button"
              className={`confirm-dialog__button confirm-dialog__button--confirm confirm-dialog__button--${variant}`}
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>

          <Dialog.Close asChild>
            <button type="button" className="confirm-dialog__close" aria-label="Close dialog">
              <span aria-hidden="true">✕</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
