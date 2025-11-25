/**
 * OperationLog Component Tests
 * Feature: 002-chat-panel
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { OperationLog } from '../../../src/components/chat/OperationLog'
import type { OperationStatus } from '../../../src/types/chat'

describe('OperationLog', () => {
  it('renders with operation messages', () => {
    render(
      <OperationLog
        operationId="op-123"
        status="running"
        messages={['Analyzing section...', 'Processing content...']}
      />
    )

    expect(screen.getByText('Analyzing section...')).toBeInTheDocument()
    expect(screen.getByText('Processing content...')).toBeInTheDocument()
  })

  it('displays pending status icon', () => {
    const { container } = render(
      <OperationLog
        operationId="op-123"
        status="pending"
        messages={['Pending...']}
      />
    )

    // Check for pending class
    const log = container.querySelector('.operation-log--pending')
    expect(log).toBeInTheDocument()
  })

  it('displays running status icon with animation', () => {
    const { container } = render(
      <OperationLog
        operationId="op-123"
        status="running"
        messages={['Processing...']}
      />
    )

    // Check for running class
    const log = container.querySelector('.operation-log--running')
    expect(log).toBeInTheDocument()
  })

  it('displays success status icon', () => {
    const { container } = render(
      <OperationLog
        operationId="op-123"
        status="success"
        messages={['Complete!']}
      />
    )

    // Check for success class
    const log = container.querySelector('.operation-log--success')
    expect(log).toBeInTheDocument()
  })

  it('displays error status icon', () => {
    const { container } = render(
      <OperationLog
        operationId="op-123"
        status="error"
        messages={['Operation failed']}
      />
    )

    // Check for error class
    const log = container.querySelector('.operation-log--error')
    expect(log).toBeInTheDocument()
  })

  it('shows "View change" link only on success with entityId', () => {
    const onViewChange = vi.fn()
    render(
      <OperationLog
        operationId="op-123"
        status="success"
        messages={['Complete!']}
        relatedEntityId="section-hero"
        onViewChange={onViewChange}
      />
    )

    const viewChangeButton = screen.getByRole('button', { name: /view change/i })
    expect(viewChangeButton).toBeInTheDocument()
  })

  it('does not show "View change" link when status is not success', () => {
    const onViewChange = vi.fn()
    render(
      <OperationLog
        operationId="op-123"
        status="running"
        messages={['Processing...']}
        relatedEntityId="section-hero"
        onViewChange={onViewChange}
      />
    )

    const viewChangeButton = screen.queryByRole('button', { name: /view change/i })
    expect(viewChangeButton).not.toBeInTheDocument()
  })

  it('does not show "View change" link when entityId is missing', () => {
    const onViewChange = vi.fn()
    render(
      <OperationLog
        operationId="op-123"
        status="success"
        messages={['Complete!']}
        onViewChange={onViewChange}
      />
    )

    const viewChangeButton = screen.queryByRole('button', { name: /view change/i })
    expect(viewChangeButton).not.toBeInTheDocument()
  })

  it('calls onViewChange when "View change" is clicked', async () => {
    const user = userEvent.setup()
    const onViewChange = vi.fn()
    render(
      <OperationLog
        operationId="op-123"
        status="success"
        messages={['Complete!']}
        relatedEntityId="section-hero"
        onViewChange={onViewChange}
      />
    )

    const viewChangeButton = screen.getByRole('button', { name: /view change/i })
    await user.click(viewChangeButton)

    expect(onViewChange).toHaveBeenCalledWith('section-hero')
    expect(onViewChange).toHaveBeenCalledTimes(1)
  })

  it('renders multiple messages in order', () => {
    const messages = [
      'Analyzing section...',
      'Processing content...',
      'Updating fields...',
      'Complete!'
    ]

    render(
      <OperationLog
        operationId="op-123"
        status="success"
        messages={messages}
      />
    )

    const messageElements = screen.getAllByText(/.*\.\.\..*|Complete!/i)
    expect(messageElements).toHaveLength(4)

    // Check order
    messages.forEach((msg, index) => {
      expect(messageElements[index]).toHaveTextContent(msg)
    })
  })

  it('highlights the latest message', () => {
    const { container } = render(
      <OperationLog
        operationId="op-123"
        status="running"
        messages={['Analyzing...', 'Processing...', 'Finalizing...']}
      />
    )

    // Last message should have the latest class
    const latestMessages = container.querySelectorAll('.operation-log__message--latest')
    expect(latestMessages).toHaveLength(1)

    // It should be the last message
    expect(latestMessages[0]).toHaveTextContent('Finalizing...')
  })

  it('has proper ARIA attributes for accessibility', () => {
    render(
      <OperationLog
        operationId="op-123"
        status="running"
        messages={['Processing...']}
      />
    )

    const log = screen.getByRole('log')
    expect(log).toBeInTheDocument()
    expect(log).toHaveAttribute('aria-label')
  })

  it('includes operation ID in data attribute', () => {
    const { container } = render(
      <OperationLog
        operationId="op-test-456"
        status="running"
        messages={['Processing...']}
      />
    )

    const log = container.querySelector('[data-operation-id="op-test-456"]')
    expect(log).toBeInTheDocument()
  })

  it('renders with empty messages array', () => {
    const { container } = render(
      <OperationLog
        operationId="op-123"
        status="pending"
        messages={[]}
      />
    )

    const log = container.querySelector('.operation-log')
    expect(log).toBeInTheDocument()

    // No messages should be displayed
    const messageElements = container.querySelectorAll('.operation-log__message')
    expect(messageElements).toHaveLength(0)
  })

  it('handles long message text without breaking layout', () => {
    const longMessage = 'This is a very long operation message that contains a lot of text and should be handled gracefully by the component without breaking the layout or causing overflow issues.'

    render(
      <OperationLog
        operationId="op-123"
        status="running"
        messages={[longMessage]}
      />
    )

    expect(screen.getByText(longMessage)).toBeInTheDocument()
  })
})
