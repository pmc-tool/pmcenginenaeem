/**
 * ScopeSelector Component Tests
 * Feature: 002-chat-panel
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ScopeSelector } from '../../../src/components/chat/ScopeSelector'
import type { Scope } from '../../../src/types/chat'

describe('ScopeSelector', () => {
  it('renders with current scope value', () => {
    const onChange = vi.fn()
    render(<ScopeSelector value="section" onChange={onChange} disabled={false} />)

    // Find the button (scope selector trigger)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Section')
  })

  it('displays all four scope options when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ScopeSelector value="section" onChange={onChange} disabled={false} />)

    // Click to open dropdown
    const button = screen.getByRole('button')
    await user.click(button)

    // Check all four scope options appear
    expect(screen.getByText('Field')).toBeInTheDocument()
    expect(screen.getByText('Section')).toBeInTheDocument()
    expect(screen.getByText('Page')).toBeInTheDocument()
    expect(screen.getByText('Feature')).toBeInTheDocument()
  })

  it('calls onChange when a different scope is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ScopeSelector value="section" onChange={onChange} disabled={false} />)

    // Open dropdown
    const button = screen.getByRole('button')
    await user.click(button)

    // Select "Page" option
    const pageOption = screen.getByText('Page')
    await user.click(pageOption)

    // Verify onChange was called with 'page'
    expect(onChange).toHaveBeenCalledWith('page')
  })

  it('does not call onChange when current scope is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ScopeSelector value="section" onChange={onChange} disabled={false} />)

    // Open dropdown
    const button = screen.getByRole('button')
    await user.click(button)

    // Select same scope
    const sectionOption = screen.getByText('Section')
    await user.click(sectionOption)

    // onChange should not be called for same value
    expect(onChange).not.toHaveBeenCalled()
  })

  it('is disabled when disabled prop is true', () => {
    const onChange = vi.fn()
    render(<ScopeSelector value="section" onChange={onChange} disabled={true} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('supports all four scope values', () => {
    const scopes: Scope[] = ['field', 'section', 'page', 'feature']
    const onChange = vi.fn()

    scopes.forEach((scope) => {
      const { unmount } = render(
        <ScopeSelector value={scope} onChange={onChange} disabled={false} />
      )

      const button = screen.getByRole('button')
      const capitalizedScope = scope.charAt(0).toUpperCase() + scope.slice(1)
      expect(button).toHaveTextContent(capitalizedScope)

      unmount()
    })
  })

  it('has proper accessibility attributes', () => {
    const onChange = vi.fn()
    render(<ScopeSelector value="section" onChange={onChange} disabled={false} />)

    const button = screen.getByRole('button')

    // Should have aria-label
    expect(button).toHaveAttribute('aria-label')

    // Should be keyboard accessible
    expect(button).toHaveAttribute('type', 'button')
  })

  it('closes dropdown after selection', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ScopeSelector value="section" onChange={onChange} disabled={false} />)

    // Open dropdown
    const button = screen.getByRole('button')
    await user.click(button)

    // Options should be visible
    expect(screen.getByText('Page')).toBeInTheDocument()

    // Select an option
    await user.click(screen.getByText('Page'))

    // Wait a bit for dropdown to close
    await new Promise(resolve => setTimeout(resolve, 100))

    // Options should no longer be visible (dropdown closed)
    expect(screen.queryByText('Field')).not.toBeInTheDocument()
  })
})
