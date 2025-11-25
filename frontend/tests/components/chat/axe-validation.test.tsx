/**
 * Axe Accessibility Validation Tests
 * Automated WCAG compliance testing for all chat components
 * Feature: 002-chat-panel
 * Task: T073
 */

import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ChatPanel } from '../../../src/components/chat/ChatPanel'
import { ChatHeader } from '../../../src/components/chat/ChatHeader'
import { MessageList } from '../../../src/components/chat/MessageList'
import { MessageBubble } from '../../../src/components/chat/MessageBubble'
import { OperationLog } from '../../../src/components/chat/OperationLog'
import { PromptComposer } from '../../../src/components/chat/PromptComposer'
import { ScopeSelector } from '../../../src/components/chat/ScopeSelector'
import type { ChatMessage } from '../../../src/types/chat'

// Mock the dashboard store
vi.mock('../../../src/store/dashboardStore', () => ({
  useDashboardStore: () => ({
    chat: {
      messages: [
        {
          id: 'msg-1',
          type: 'user' as const,
          text: 'Test user message',
          scope: 'section' as const,
          isCollapsed: false,
          createdAt: new Date('2025-01-15T10:00:00Z'),
        },
        {
          id: 'msg-2',
          type: 'ai' as const,
          text: 'Test AI response',
          scope: 'section' as const,
          isCollapsed: false,
          createdAt: new Date('2025-01-15T10:00:05Z'),
        },
        {
          id: 'msg-3',
          type: 'log' as const,
          text: 'Processing request...',
          scope: 'section' as const,
          isCollapsed: false,
          createdAt: new Date('2025-01-15T10:00:03Z'),
          status: 'running' as const,
          logs: ['Starting operation', 'Processing data'],
        },
      ],
      isOpen: true,
      scope: 'section' as const,
      isBusy: false,
      currentContext: 'Home / Hero',
      panelWidth: 420,
    },
    shell: {
      selectedPageId: 'page-home',
      selectedSectionId: 'section-hero',
    },
    toggleChat: vi.fn(),
    addMessage: vi.fn(),
    setScope: vi.fn(),
    setBusy: vi.fn(),
    clearMessages: vi.fn(),
    setChatPanelWidth: vi.fn(),
    setCurrentContext: vi.fn(),
    setSelectedPage: vi.fn(),
    setSelectedSection: vi.fn(),
    setInspectorActiveTab: vi.fn(),
  }),
}))

describe('Axe Accessibility Validation - T073', () => {
  describe('ChatPanel', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<ChatPanel />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper landmark role', async () => {
      const { container } = render(<ChatPanel />)
      const aside = container.querySelector('aside')
      expect(aside).toHaveAttribute('role', 'complementary')

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('ChatHeader', () => {
    it('should have no accessibility violations', async () => {
      const mockOnClose = vi.fn()
      const mockOnClear = vi.fn()

      const { container } = render(
        <ChatHeader
          currentContext="Home / Hero"
          onClose={mockOnClose}
          onClearConversation={mockOnClear}
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have accessible menu button', async () => {
      const mockOnClose = vi.fn()
      const mockOnClear = vi.fn()

      const { container } = render(
        <ChatHeader
          currentContext="Home / Hero"
          onClose={mockOnClose}
          onClearConversation={mockOnClear}
        />
      )

      const menuButton = container.querySelector('[aria-haspopup="true"]')
      expect(menuButton).toHaveAttribute('aria-label', 'Chat options menu')

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have accessible close button', async () => {
      const mockOnClose = vi.fn()
      const mockOnClear = vi.fn()

      const { container } = render(
        <ChatHeader
          currentContext="Home / Hero"
          onClose={mockOnClose}
          onClearConversation={mockOnClear}
        />
      )

      const closeButton = container.querySelector('[aria-label="Close chat panel"]')
      expect(closeButton).toBeTruthy()

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('MessageList', () => {
    it('should have no accessibility violations', async () => {
      const mockOnToggle = vi.fn()
      const mockOnViewChange = vi.fn()

      const messages: ChatMessage[] = [
        {
          id: 'msg-1',
          type: 'user',
          text: 'Test message',
          scope: 'section',
          isCollapsed: false,
          createdAt: new Date(),
        },
        {
          id: 'msg-2',
          type: 'ai',
          text: 'AI response',
          scope: 'section',
          isCollapsed: false,
          createdAt: new Date(),
        },
      ]

      const { container } = render(
        <MessageList
          messages={messages}
          onToggleCollapse={mockOnToggle}
          onViewChange={mockOnViewChange}
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('MessageBubble', () => {
    it('should have no accessibility violations for user message', async () => {
      const message: ChatMessage = {
        id: 'msg-1',
        type: 'user',
        text: 'Test user message',
        scope: 'section',
        isCollapsed: false,
        createdAt: new Date(),
      }

      const { container } = render(
        <MessageBubble message={message} onToggleCollapse={vi.fn()} />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations for AI message', async () => {
      const message: ChatMessage = {
        id: 'msg-2',
        type: 'ai',
        text: 'Test AI response',
        scope: 'section',
        isCollapsed: false,
        createdAt: new Date(),
      }

      const { container } = render(
        <MessageBubble message={message} onToggleCollapse={vi.fn()} />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('OperationLog', () => {
    it('should have no accessibility violations for pending status', async () => {
      const { container } = render(
        <OperationLog
          operationId="log-1"
          status="pending"
          messages={['Preparing operation...']}
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations for running status', async () => {
      const { container } = render(
        <OperationLog
          operationId="log-2"
          status="running"
          messages={['Processing...', 'Analyzing content...']}
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations for success status', async () => {
      const { container } = render(
        <OperationLog
          operationId="log-3"
          status="success"
          messages={['Operation completed']}
          relatedEntityId="page-123"
          onViewChange={vi.fn()}
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations for error status', async () => {
      const { container } = render(
        <OperationLog
          operationId="log-4"
          status="error"
          messages={['Error occurred', 'Please try again']}
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('PromptComposer', () => {
    it('should have no accessibility violations', async () => {
      const mockOnSend = vi.fn()
      const mockOnScopeChange = vi.fn()

      const { container } = render(
        <PromptComposer
          onSendMessage={mockOnSend}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={false}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have accessible textarea', async () => {
      const mockOnSend = vi.fn()
      const mockOnScopeChange = vi.fn()

      const { container } = render(
        <PromptComposer
          onSendMessage={mockOnSend}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={false}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const textarea = container.querySelector('textarea')
      expect(textarea).toHaveAttribute('aria-label', 'Chat message input')
      expect(textarea).toHaveAttribute('aria-describedby', 'composer-credits')

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have accessible send button', async () => {
      const mockOnSend = vi.fn()
      const mockOnScopeChange = vi.fn()

      const { container } = render(
        <PromptComposer
          onSendMessage={mockOnSend}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={false}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const sendButton = container.querySelector('[aria-label="Send message"]')
      expect(sendButton).toBeTruthy()

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no violations when disabled (out of credits)', async () => {
      const mockOnSend = vi.fn()
      const mockOnScopeChange = vi.fn()

      const { container } = render(
        <PromptComposer
          onSendMessage={mockOnSend}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={false}
          aiCreditsCount={0}
          currentContext="Home / Hero"
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no violations when busy', async () => {
      const mockOnSend = vi.fn()
      const mockOnScopeChange = vi.fn()

      const { container } = render(
        <PromptComposer
          onSendMessage={mockOnSend}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={true}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have accessible credits display', async () => {
      const mockOnSend = vi.fn()
      const mockOnScopeChange = vi.fn()

      const { container } = render(
        <PromptComposer
          onSendMessage={mockOnSend}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={false}
          aiCreditsCount={25}
          currentContext="Home / Hero"
        />
      )

      const creditsDisplay = container.querySelector('#composer-credits')
      expect(creditsDisplay).toBeTruthy()

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('ScopeSelector', () => {
    it('should have no accessibility violations', async () => {
      const mockOnChange = vi.fn()

      const { container } = render(
        <ScopeSelector value="section" onChange={mockOnChange} disabled={false} />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no violations when disabled', async () => {
      const mockOnChange = vi.fn()

      const { container } = render(
        <ScopeSelector value="section" onChange={mockOnChange} disabled={true} />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Color Contrast', () => {
    it('should pass color contrast requirements for all components', async () => {
      const { container } = render(<ChatPanel />)

      // Axe checks for WCAG AA color contrast (4.5:1 for normal text, 3:1 for large text)
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      })

      expect(results).toHaveNoViolations()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should have proper tab order for all focusable elements', async () => {
      const { container } = render(<ChatPanel />)

      // Axe checks for proper tabindex usage
      const results = await axe(container, {
        rules: {
          tabindex: { enabled: true },
        },
      })

      expect(results).toHaveNoViolations()
    })
  })

  describe('Screen Reader Support', () => {
    it('should have proper ARIA labels for all interactive elements', async () => {
      const { container } = render(<ChatPanel />)

      const results = await axe(container, {
        rules: {
          'aria-allowed-attr': { enabled: true },
          'aria-required-attr': { enabled: true },
          'aria-valid-attr': { enabled: true },
          'aria-valid-attr-value': { enabled: true },
        },
      })

      expect(results).toHaveNoViolations()
    })

    it('should have proper region roles', async () => {
      const { container } = render(<ChatPanel />)

      const results = await axe(container, {
        rules: {
          region: { enabled: true },
        },
      })

      expect(results).toHaveNoViolations()
    })
  })

  describe('Form Elements', () => {
    it('should have proper labels for all form elements', async () => {
      const { container } = render(<ChatPanel />)

      const results = await axe(container, {
        rules: {
          label: { enabled: true },
          'label-content-name-mismatch': { enabled: true },
        },
      })

      expect(results).toHaveNoViolations()
    })
  })

  describe('Images and Icons', () => {
    it('should have alt text or aria-labels for all icons', async () => {
      const { container } = render(<ChatPanel />)

      const results = await axe(container, {
        rules: {
          'image-alt': { enabled: true },
          'aria-hidden-focus': { enabled: true },
        },
      })

      expect(results).toHaveNoViolations()
    })
  })

  describe('Heading Structure', () => {
    it('should have proper heading hierarchy', async () => {
      const { container } = render(<ChatPanel />)

      const results = await axe(container, {
        rules: {
          'heading-order': { enabled: true },
        },
      })

      expect(results).toHaveNoViolations()
    })
  })

  describe('Link and Button Accessibility', () => {
    it('should have accessible names for all links and buttons', async () => {
      const { container } = render(<ChatPanel />)

      const results = await axe(container, {
        rules: {
          'link-name': { enabled: true },
          'button-name': { enabled: true },
        },
      })

      expect(results).toHaveNoViolations()
    })
  })
})
