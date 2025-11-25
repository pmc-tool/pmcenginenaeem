/**
 * QuickActionChips Component Tests
 * Feature: 002-chat-panel
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { QuickActionChips } from '../../../src/components/chat/QuickActionChips'
import type { Scope } from '../../../src/types/chat'

describe('QuickActionChips', () => {
  const mockOnChipClick = vi.fn()

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders chips for the current scope', () => {
    render(
      <QuickActionChips
        scope="section"
        selectedChipId={null}
        disabled={false}
        onChipClick={mockOnChipClick}
      />
    )

    // Section scope should show these chips
    expect(screen.getByText('Rewrite section')).toBeInTheDocument()
    expect(screen.getByText('Improve headline')).toBeInTheDocument()
    expect(screen.getByText('Shorten content')).toBeInTheDocument()
  })

  it('filters chips based on scope', () => {
    const { rerender } = render(
      <QuickActionChips
        scope="field"
        selectedChipId={null}
        disabled={false}
        onChipClick={mockOnChipClick}
      />
    )

    // Field scope should NOT show "Rewrite section"
    expect(screen.queryByText('Rewrite section')).not.toBeInTheDocument()

    // But should show chips that apply to field
    expect(screen.getByText('Improve headline')).toBeInTheDocument()
    expect(screen.getByText('Shorten content')).toBeInTheDocument()

    // Change to page scope
    rerender(
      <QuickActionChips
        scope="page"
        selectedChipId={null}
        disabled={false}
        onChipClick={mockOnChipClick}
      />
    )

    // Page scope should show different chips
    expect(screen.getByText('Rewrite section')).toBeInTheDocument()
    expect(screen.getByText('Generate FAQs')).toBeInTheDocument()
  })

  it('calls onChipClick when a chip is clicked', async () => {
    const user = userEvent.setup()
    render(
      <QuickActionChips
        scope="section"
        selectedChipId={null}
        disabled={false}
        onChipClick={mockOnChipClick}
      />
    )

    const chip = screen.getByText('Improve headline')
    await user.click(chip)

    expect(mockOnChipClick).toHaveBeenCalledTimes(1)
    expect(mockOnChipClick).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'improve-headline',
        label: 'Improve headline',
        prompt: expect.any(String),
      })
    )
  })

  it('highlights selected chip', () => {
    render(
      <QuickActionChips
        scope="section"
        selectedChipId="improve-headline"
        disabled={false}
        onChipClick={mockOnChipClick}
      />
    )

    const selectedChip = screen.getByText('Improve headline')
    expect(selectedChip).toHaveClass('quick-action-chip--selected')

    const otherChip = screen.getByText('Rewrite section')
    expect(otherChip).not.toHaveClass('quick-action-chip--selected')
  })

  it('disables all chips when disabled prop is true', () => {
    render(
      <QuickActionChips
        scope="section"
        selectedChipId={null}
        disabled={true}
        onChipClick={mockOnChipClick}
      />
    )

    // Should render nothing when disabled
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
  })

  it('has proper ARIA attributes', () => {
    render(
      <QuickActionChips
        scope="section"
        selectedChipId="improve-headline"
        disabled={false}
        onChipClick={mockOnChipClick}
      />
    )

    const group = screen.getByRole('group', { name: /quick actions/i })
    expect(group).toBeInTheDocument()

    const selectedChip = screen.getByText('Improve headline')
    expect(selectedChip).toHaveAttribute('aria-pressed', 'true')
    expect(selectedChip).toHaveAttribute('aria-label')

    const unselectedChip = screen.getByText('Rewrite section')
    expect(unselectedChip).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows contextually relevant chips for different scopes', () => {
    const scopes: Scope[] = ['field', 'section', 'page', 'feature']

    scopes.forEach((scope) => {
      const { unmount } = render(
        <QuickActionChips
          scope={scope}
          selectedChipId={null}
          disabled={false}
          onChipClick={mockOnChipClick}
        />
      )

      // All scopes should have at least one chip
      const chips = screen.getAllByRole('button')
      expect(chips.length).toBeGreaterThan(0)

      unmount()
    })
  })

  it('renders with proper button types', () => {
    render(
      <QuickActionChips
        scope="section"
        selectedChipId={null}
        disabled={false}
        onChipClick={mockOnChipClick}
      />
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('type', 'button')
    })
  })

  it('includes prompt text in action object', async () => {
    const user = userEvent.setup()
    render(
      <QuickActionChips
        scope="section"
        selectedChipId={null}
        disabled={false}
        onChipClick={mockOnChipClick}
      />
    )

    const chip = screen.getByText('Generate FAQs')
    await user.click(chip)

    expect(mockOnChipClick).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('FAQ'),
      })
    )
  })

  it('supports all predefined quick actions', () => {
    render(
      <QuickActionChips
        scope="page"
        selectedChipId={null}
        disabled={false}
        onChipClick={mockOnChipClick}
      />
    )

    // Check that common actions are available for page scope
    expect(screen.getByText('Rewrite section')).toBeInTheDocument()
    expect(screen.getByText('Generate FAQs')).toBeInTheDocument()
    expect(screen.getByText('Shorten content')).toBeInTheDocument()
    expect(screen.getByText('Expand details')).toBeInTheDocument()
  })
})
