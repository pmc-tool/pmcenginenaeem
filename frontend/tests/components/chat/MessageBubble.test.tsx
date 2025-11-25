/**
 * MessageBubble Component Tests
 * Feature: 002-chat-panel
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MessageBubble } from '../../../src/components/chat/MessageBubble'
import type { ChatMessage } from '../../../src/types/chat'

describe('MessageBubble', () => {
  const mockOnToggleCollapse = vi.fn()

  const createMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
    id: 'msg-1',
    type: 'ai',
    text: 'Test message',
    scope: 'page',
    action: 'general',
    createdAt: Date.now(),
    isCollapsed: false,
    ...overrides,
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders user message with correct styling', () => {
      const message = createMessage({ type: 'user', text: 'User message' })
      const { container } = render(<MessageBubble message={message} />)

      expect(screen.getByText('User message')).toBeInTheDocument()
      const bubble = container.querySelector('.message-bubble--user')
      expect(bubble).toBeInTheDocument()
    })

    it('renders AI message with correct styling', () => {
      const message = createMessage({ type: 'ai', text: 'AI response' })
      const { container } = render(<MessageBubble message={message} />)

      expect(screen.getByText('AI response')).toBeInTheDocument()
      const bubble = container.querySelector('.message-bubble--ai')
      expect(bubble).toBeInTheDocument()
    })

    it('renders log message with correct styling', () => {
      const message = createMessage({ type: 'log', text: 'Operation log' })
      const { container } = render(<MessageBubble message={message} />)

      expect(screen.getByText('Operation log')).toBeInTheDocument()
      const bubble = container.querySelector('.message-bubble--log')
      expect(bubble).toBeInTheDocument()
    })

    it('displays timestamp', () => {
      const message = createMessage({ createdAt: Date.now() - 300000 }) // 5 min ago
      render(<MessageBubble message={message} />)

      // Should show relative time (e.g., "5 minutes ago")
      const timestamp = screen.getByText(/ago/i)
      expect(timestamp).toBeInTheDocument()
    })
  })

  describe('Scope and Action Badges', () => {
    it('displays scope badge for AI messages', () => {
      const message = createMessage({ type: 'ai', scope: 'section' })
      render(<MessageBubble message={message} />)

      expect(screen.getByText('SECTION')).toBeInTheDocument()
    })

    it('displays action badge for AI messages', () => {
      const message = createMessage({ type: 'ai', action: 'rewrite' })
      render(<MessageBubble message={message} />)

      expect(screen.getByText('rewrite')).toBeInTheDocument()
    })

    it('does not display action badge for general action', () => {
      const message = createMessage({ type: 'ai', action: 'general' })
      render(<MessageBubble message={message} />)

      expect(screen.queryByText('general')).not.toBeInTheDocument()
    })

    it('does not display badges for user messages', () => {
      const message = createMessage({ type: 'user', scope: 'page' })
      render(<MessageBubble message={message} />)

      expect(screen.queryByText('PAGE')).not.toBeInTheDocument()
    })
  })

  describe('Message Collapse/Expand - T066', () => {
    it('shows collapse button for long messages (>400 chars)', () => {
      const longText = 'a'.repeat(401)
      const message = createMessage({ text: longText })
      render(<MessageBubble message={message} onToggleCollapse={mockOnToggleCollapse} />)

      const toggleButton = screen.getByRole('button', { name: /show less/i })
      expect(toggleButton).toBeInTheDocument()
    })

    it('shows collapse button for messages with >8 lines', () => {
      const multilineText = Array(9).fill('Line of text').join('\n')
      const message = createMessage({ text: multilineText })
      render(<MessageBubble message={message} onToggleCollapse={mockOnToggleCollapse} />)

      const toggleButton = screen.getByRole('button', { name: /show less/i })
      expect(toggleButton).toBeInTheDocument()
    })

    it('does not show collapse button for short messages', () => {
      const message = createMessage({ text: 'Short message' })
      render(<MessageBubble message={message} onToggleCollapse={mockOnToggleCollapse} />)

      expect(screen.queryByRole('button', { name: /show/i })).not.toBeInTheDocument()
    })

    it('displays "Show more" when message is collapsed', () => {
      const longText = 'a'.repeat(401)
      const message = createMessage({ text: longText, isCollapsed: true })
      render(<MessageBubble message={message} onToggleCollapse={mockOnToggleCollapse} />)

      const toggleButton = screen.getByRole('button', { name: /show more/i })
      expect(toggleButton).toBeInTheDocument()
    })

    it('displays "Show less" when message is expanded', () => {
      const longText = 'a'.repeat(401)
      const message = createMessage({ text: longText, isCollapsed: false })
      render(<MessageBubble message={message} onToggleCollapse={mockOnToggleCollapse} />)

      const toggleButton = screen.getByRole('button', { name: /show less/i })
      expect(toggleButton).toBeInTheDocument()
    })

    it('calls onToggleCollapse when toggle button is clicked', async () => {
      const user = userEvent.setup()
      const longText = 'a'.repeat(401)
      const message = createMessage({ text: longText })
      render(<MessageBubble message={message} onToggleCollapse={mockOnToggleCollapse} />)

      const toggleButton = screen.getByRole('button', { name: /show less/i })
      await user.click(toggleButton)

      expect(mockOnToggleCollapse).toHaveBeenCalledTimes(1)
    })

    it('applies collapsed class when isCollapsed is true', () => {
      const longText = 'a'.repeat(401)
      const message = createMessage({ text: longText, isCollapsed: true })
      const { container } = render(<MessageBubble message={message} onToggleCollapse={mockOnToggleCollapse} />)

      const content = container.querySelector('.message-bubble__content--collapsed')
      expect(content).toBeInTheDocument()
    })

    it('does not apply collapsed class when isCollapsed is false', () => {
      const longText = 'a'.repeat(401)
      const message = createMessage({ text: longText, isCollapsed: false })
      const { container } = render(<MessageBubble message={message} onToggleCollapse={mockOnToggleCollapse} />)

      const content = container.querySelector('.message-bubble__content--collapsed')
      expect(content).not.toBeInTheDocument()
    })

    it('handles missing onToggleCollapse gracefully', () => {
      const longText = 'a'.repeat(401)
      const message = createMessage({ text: longText })

      // Should render without error even without callback
      expect(() => {
        render(<MessageBubble message={message} />)
      }).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes for log messages', () => {
      const message = createMessage({ type: 'log', text: 'Operation log' })
      const { container } = render(<MessageBubble message={message} />)

      const bubble = container.querySelector('.message-bubble--log')
      expect(bubble).toHaveAttribute('role', 'status')
      expect(bubble).toHaveAttribute('aria-live', 'polite')
    })

    it('does not have ARIA attributes for user/AI messages', () => {
      const message = createMessage({ type: 'user' })
      const { container } = render(<MessageBubble message={message} />)

      const bubble = container.querySelector('.message-bubble--user')
      expect(bubble).not.toHaveAttribute('role')
      expect(bubble).not.toHaveAttribute('aria-live')
    })

    it('has accessible toggle button label', () => {
      const longText = 'a'.repeat(401)
      const message = createMessage({ text: longText, isCollapsed: true })
      render(<MessageBubble message={message} onToggleCollapse={mockOnToggleCollapse} />)

      const toggleButton = screen.getByRole('button', { name: 'Show more' })
      expect(toggleButton).toHaveAttribute('aria-label', 'Show more')
    })

    it('updates ARIA label based on collapse state', () => {
      const longText = 'a'.repeat(401)
      const { rerender } = render(
        <MessageBubble message={createMessage({ text: longText, isCollapsed: false })} onToggleCollapse={mockOnToggleCollapse} />
      )

      let toggleButton = screen.getByRole('button', { name: 'Show less' })
      expect(toggleButton).toHaveAttribute('aria-label', 'Show less')

      rerender(
        <MessageBubble message={createMessage({ text: longText, isCollapsed: true })} onToggleCollapse={mockOnToggleCollapse} />
      )

      toggleButton = screen.getByRole('button', { name: 'Show more' })
      expect(toggleButton).toHaveAttribute('aria-label', 'Show more')
    })
  })

  describe('Timestamp Formatting', () => {
    it('shows relative time for recent messages (<24h)', () => {
      const message = createMessage({ createdAt: Date.now() - 300000 }) // 5 min ago
      render(<MessageBubble message={message} />)

      expect(screen.getByText(/ago/i)).toBeInTheDocument()
    })

    it('shows "Yesterday" for 24-48h old messages', () => {
      const message = createMessage({ createdAt: Date.now() - 36 * 60 * 60 * 1000 }) // 36h ago
      render(<MessageBubble message={message} />)

      expect(screen.getByText(/yesterday/i)).toBeInTheDocument()
    })

    it('shows day name for 2-7 day old messages', () => {
      const message = createMessage({ createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000 }) // 5 days ago
      render(<MessageBubble message={message} />)

      // Should show day name (e.g., "Monday at 3:15 PM")
      const timestamp = screen.getByText(/at \d{1,2}:\d{2}/i)
      expect(timestamp).toBeInTheDocument()
    })

    it('shows date for messages >7 days old', () => {
      const message = createMessage({ createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000 }) // 10 days ago
      render(<MessageBubble message={message} />)

      // Should show month and day (e.g., "Nov 10 at 2:45 PM")
      const timestamp = screen.getByText(/\w{3} \d{1,2} at \d{1,2}:\d{2}/i)
      expect(timestamp).toBeInTheDocument()
    })
  })

  describe('Text Content', () => {
    it('preserves whitespace and line breaks', () => {
      const message = createMessage({ text: 'Line 1\nLine 2\nLine 3' })
      const { container } = render(<MessageBubble message={message} />)

      const content = container.querySelector('.message-bubble__content')
      expect(content).toHaveStyle({ whiteSpace: 'pre-wrap' })
    })

    it('handles empty text gracefully', () => {
      const message = createMessage({ text: '' })

      expect(() => {
        render(<MessageBubble message={message} />)
      }).not.toThrow()
    })

    it('handles very long single-line text', () => {
      const longText = 'word '.repeat(200)
      const message = createMessage({ text: longText })

      expect(() => {
        render(<MessageBubble message={message} />)
      }).not.toThrow()
    })
  })
})
