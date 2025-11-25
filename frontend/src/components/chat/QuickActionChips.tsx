/**
 * QuickActionChips Component
 * Contextual one-click shortcuts for common AI tasks
 * Feature: 002-chat-panel
 *
 * Constitutional Compliance:
 * - FR-038: Shows contextual chips based on selected element
 * - FR-039: Chips fill composer with predefined prompts
 * - FR-040: Chips deselect when user edits text
 */

import React from 'react'
import type { Scope } from '../../types/chat'
import './QuickActionChips.css'

export interface QuickAction {
  id: string
  label: string
  prompt: string
  scopes: Scope[] // Which scopes this action applies to
}

// Predefined quick actions
const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'rewrite-section',
    label: 'Rewrite section',
    prompt: 'Rewrite this section with more compelling and engaging content',
    scopes: ['section', 'page'],
  },
  {
    id: 'improve-headline',
    label: 'Improve headline',
    prompt: 'Improve this headline to be more engaging and compelling',
    scopes: ['field', 'section'],
  },
  {
    id: 'generate-faqs',
    label: 'Generate FAQs',
    prompt: 'Generate a comprehensive FAQ section',
    scopes: ['section', 'page', 'feature'],
  },
  {
    id: 'shorten-content',
    label: 'Shorten content',
    prompt: 'Shorten this content while preserving key messages',
    scopes: ['field', 'section', 'page'],
  },
  {
    id: 'expand-details',
    label: 'Expand details',
    prompt: 'Expand this content with more details and examples',
    scopes: ['field', 'section', 'page'],
  },
  {
    id: 'fix-grammar',
    label: 'Fix grammar',
    prompt: 'Fix any grammar, spelling, or clarity issues',
    scopes: ['field', 'section', 'page'],
  },
  {
    id: 'validate-email',
    label: 'Create email validator',
    prompt: 'Create a function to validate email addresses',
    scopes: ['feature'],
  },
  {
    id: 'open-code-editor',
    label: 'Open code editor',
    prompt: 'Open the code editor to view and edit the code',
    scopes: ['field', 'section', 'page', 'feature'],
  },
]

export interface QuickActionChipsProps {
  /** Current scope */
  scope: Scope

  /** Currently selected chip ID */
  selectedChipId: string | null

  /** Whether composer is busy */
  disabled: boolean

  /** Callback when chip is clicked */
  onChipClick: (action: QuickAction) => void

  /** Maximum number of visible chips (for draggable panel) */
  maxVisible?: number
}

export const QuickActionChips: React.FC<QuickActionChipsProps> = ({
  scope,
  selectedChipId,
  disabled,
  onChipClick,
  maxVisible,
}) => {
  // Filter actions based on current scope
  const availableActions = QUICK_ACTIONS.filter((action) =>
    action.scopes.includes(scope)
  )

  // Limit to maxVisible if specified
  const visibleActions = maxVisible
    ? availableActions.slice(0, maxVisible)
    : availableActions

  // Don't show if no actions available or disabled
  if (visibleActions.length === 0 || disabled) {
    return null
  }

  return (
    <div className="quick-action-chips" role="group" aria-label="Quick actions">
      {visibleActions.map((action) => (
        <button
          key={action.id}
          type="button"
          className={`quick-action-chip ${
            selectedChipId === action.id ? 'quick-action-chip--selected' : ''
          }`}
          onClick={() => onChipClick(action)}
          disabled={disabled}
          aria-label={`Quick action: ${action.label}`}
          aria-pressed={selectedChipId === action.id}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}
