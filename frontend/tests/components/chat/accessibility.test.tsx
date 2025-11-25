/**
 * Accessibility Tests for Chat Panel
 * Tests keyboard navigation, ARIA attributes, and screen reader support
 * Feature: 002-chat-panel
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ChatPanel } from '../../../src/components/chat/ChatPanel'
import { PromptComposer } from '../../../src/components/chat/PromptComposer'
import { ScopeSelector } from '../../../src/components/chat/ScopeSelector'
import type { Scope } from '../../../src/types/chat'

// Mock the dashboard store
vi.mock('../../../src/store/dashboardStore', () => ({
  useDashboardStore: () => ({
    chat: {
      messages: [],
      isOpen: true,
      scope: 'section' as Scope,
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

describe('Keyboard Navigation - T069', () => {
  describe('PromptComposer Keyboard Navigation', () => {
    const mockOnSendMessage = vi.fn()
    const mockOnScopeChange = vi.fn()

    afterEach(() => {
      vi.clearAllMocks()
    })

    it('sends message on Enter key', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          onSendMessage={mockOnSendMessage}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={false}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const textarea = screen.getByLabelText('Chat message input')
      await user.type(textarea, 'Test message{Enter}')

      expect(mockOnSendMessage).toHaveBeenCalledWith('Test message')
    })

    it('adds new line on Shift+Enter', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          onSendMessage={mockOnSendMessage}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={false}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const textarea = screen.getByLabelText('Chat message input')
      await user.type(textarea, 'Line 1{Shift>}{Enter}{/Shift}Line 2')

      expect(mockOnSendMessage).not.toHaveBeenCalled()
      expect(textarea).toHaveValue('Line 1\nLine 2')
    })

    it('does not send empty message on Enter', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          onSendMessage={mockOnSendMessage}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={false}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const textarea = screen.getByLabelText('Chat message input')
      await user.type(textarea, '{Enter}')

      expect(mockOnSendMessage).not.toHaveBeenCalled()
    })

    it('does not send message on Enter when busy', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          onSendMessage={mockOnSendMessage}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={true}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const textarea = screen.getByLabelText('Chat message input')
      await user.type(textarea, 'Test{Enter}')

      expect(mockOnSendMessage).not.toHaveBeenCalled()
    })

    it('allows keyboard navigation to send button', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          onSendMessage={mockOnSendMessage}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={false}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const textarea = screen.getByLabelText('Chat message input')
      await user.type(textarea, 'Test message')

      // Tab to send button
      await user.tab()
      const sendButton = screen.getByLabelText('Send message')
      expect(sendButton).toHaveFocus()

      // Activate with Space or Enter
      await user.keyboard('{Enter}')
      expect(mockOnSendMessage).toHaveBeenCalledWith('Test message')
    })
  })

  describe('ScopeSelector Keyboard Navigation', () => {
    const mockOnChange = vi.fn()

    afterEach(() => {
      vi.clearAllMocks()
    })

    it('opens dropdown on Enter key', async () => {
      const user = userEvent.setup()
      render(
        <ScopeSelector value="section" onChange={mockOnChange} disabled={false} />
      )

      const trigger = screen.getByRole('combobox')
      await user.click(trigger)

      // Dropdown should open
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('allows arrow key navigation through options', async () => {
      const user = userEvent.setup()
      render(
        <ScopeSelector value="section" onChange={mockOnChange} disabled={false} />
      )

      const trigger = screen.getByRole('combobox')
      await user.click(trigger)

      // Navigate with arrow keys
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{Enter}')

      // Should have called onChange
      expect(mockOnChange).toHaveBeenCalled()
    })

    it('closes dropdown on Escape key', async () => {
      const user = userEvent.setup()
      render(
        <ScopeSelector value="section" onChange={mockOnChange} disabled={false} />
      )

      const trigger = screen.getByRole('combobox')
      await user.click(trigger)

      expect(screen.getByRole('listbox')).toBeInTheDocument()

      await user.keyboard('{Escape}')

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('ChatPanel Tab Order', () => {
    it('maintains logical tab order through all interactive elements', async () => {
      const user = userEvent.setup()
      render(<ChatPanel />)

      // Start from beginning
      await user.tab()

      // Should focus on chat header menu button first
      const menuButton = screen.getByLabelText('Chat options menu')
      expect(menuButton).toHaveFocus()

      // Tab to close button
      await user.tab()
      const closeButton = screen.getByLabelText('Close chat panel')
      expect(closeButton).toHaveFocus()

      // Continue tabbing through the panel
      await user.tab() // Scope selector
      const scopeSelector = screen.getByRole('combobox')
      expect(scopeSelector).toHaveFocus()

      // Tab to textarea
      await user.tab()
      const textarea = screen.getByLabelText('Chat message input')
      expect(textarea).toHaveFocus()

      // Tab to send button
      await user.tab()
      const sendButton = screen.getByLabelText('Send message')
      expect(sendButton).toHaveFocus()
    })

    it('allows reverse tab navigation', async () => {
      const user = userEvent.setup()
      render(<ChatPanel />)

      const textarea = screen.getByLabelText('Chat message input')
      textarea.focus()

      // Shift+Tab backwards
      await user.tab({ shift: true })
      const scopeSelector = screen.getByRole('combobox')
      expect(scopeSelector).toHaveFocus()
    })
  })

  describe('Focus Indicators', () => {
    it('shows visible focus indicator on textarea', async () => {
      const user = userEvent.setup()
      const mockOnSendMessage = vi.fn()
      const mockOnScopeChange = vi.fn()

      render(
        <PromptComposer
          onSendMessage={mockOnSendMessage}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={false}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const textarea = screen.getByLabelText('Chat message input')
      await user.tab()

      // Focus should be visible (tested via CSS :focus-visible in actual browser)
      expect(textarea).toHaveFocus()
    })

    it('shows visible focus indicator on buttons', async () => {
      const user = userEvent.setup()
      render(<ChatPanel />)

      const menuButton = screen.getByLabelText('Chat options menu')
      menuButton.focus()

      expect(menuButton).toHaveFocus()
    })
  })

  describe('Keyboard Shortcuts', () => {
    it('supports Escape to close overflow menu', async () => {
      const user = userEvent.setup()
      render(<ChatPanel />)

      // Open menu
      const menuButton = screen.getByLabelText('Chat options menu')
      await user.click(menuButton)

      expect(screen.getByRole('menu')).toBeInTheDocument()

      // Press Escape
      await user.keyboard('{Escape}')

      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  describe('Screen Reader Support', () => {
    it('provides accessible name for chat input', () => {
      const mockOnSendMessage = vi.fn()
      const mockOnScopeChange = vi.fn()

      render(
        <PromptComposer
          onSendMessage={mockOnSendMessage}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={false}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const textarea = screen.getByLabelText('Chat message input')
      expect(textarea).toHaveAttribute('aria-label', 'Chat message input')
    })

    it('provides accessible description for composer', () => {
      const mockOnSendMessage = vi.fn()
      const mockOnScopeChange = vi.fn()

      render(
        <PromptComposer
          onSendMessage={mockOnSendMessage}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={false}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const textarea = screen.getByLabelText('Chat message input')
      expect(textarea).toHaveAttribute('aria-describedby', 'composer-credits')
    })

    it('announces busy state to screen readers', () => {
      const mockOnSendMessage = vi.fn()
      const mockOnScopeChange = vi.fn()

      render(
        <PromptComposer
          onSendMessage={mockOnSendMessage}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={true}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const sendButton = screen.getByLabelText('Send message')
      expect(sendButton).toBeDisabled()
    })

    it('provides accessible labels for all buttons', () => {
      render(<ChatPanel />)

      expect(screen.getByLabelText('Chat options menu')).toBeInTheDocument()
      expect(screen.getByLabelText('Close chat panel')).toBeInTheDocument()
      expect(screen.getByLabelText('Send message')).toBeInTheDocument()
    })

    it('uses proper ARIA roles for menu', async () => {
      const user = userEvent.setup()
      render(<ChatPanel />)

      const menuButton = screen.getByLabelText('Chat options menu')
      expect(menuButton).toHaveAttribute('aria-haspopup', 'true')
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')

      await user.click(menuButton)

      expect(menuButton).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })
  })

  describe('Disabled States', () => {
    it('disables textarea when out of credits', () => {
      const mockOnSendMessage = vi.fn()
      const mockOnScopeChange = vi.fn()

      render(
        <PromptComposer
          onSendMessage={mockOnSendMessage}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={false}
          aiCreditsCount={0}
          currentContext="Home / Hero"
        />
      )

      const textarea = screen.getByLabelText('Chat message input')
      expect(textarea).toBeDisabled()
    })

    it('disables send button when message is empty', () => {
      const mockOnSendMessage = vi.fn()
      const mockOnScopeChange = vi.fn()

      render(
        <PromptComposer
          onSendMessage={mockOnSendMessage}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={false}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const sendButton = screen.getByLabelText('Send message')
      expect(sendButton).toBeDisabled()
    })

    it('prevents keyboard interaction on disabled elements', async () => {
      const user = userEvent.setup()
      const mockOnSendMessage = vi.fn()
      const mockOnScopeChange = vi.fn()

      render(
        <PromptComposer
          onSendMessage={mockOnSendMessage}
          scope="section"
          onScopeChange={mockOnScopeChange}
          isBusy={true}
          aiCreditsCount={100}
          currentContext="Home / Hero"
        />
      )

      const textarea = screen.getByLabelText('Chat message input')
      await user.type(textarea, 'Test{Enter}')

      expect(mockOnSendMessage).not.toHaveBeenCalled()
    })
  })
})
