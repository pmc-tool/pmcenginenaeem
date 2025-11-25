/**
 * ChatHeader Component Tests
 * Feature: 002-chat-panel
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ChatHeader } from '../../../src/components/chat/ChatHeader'

describe('ChatHeader', () => {
  const mockOnClose = vi.fn()
  const mockOnClearConversation = vi.fn()

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders title correctly', () => {
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      expect(screen.getByText('Chat with PMC Engine')).toBeInTheDocument()
    })

    it('displays context when provided', () => {
      render(
        <ChatHeader
          currentContext="Section: Hero"
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      expect(screen.getByText(/Editing: Section: Hero/i)).toBeInTheDocument()
    })

    it('does not display context when empty', () => {
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      expect(screen.queryByText(/Editing:/i)).not.toBeInTheDocument()
    })

    it('renders close button', () => {
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      const closeButton = screen.getByLabelText('Close chat panel')
      expect(closeButton).toBeInTheDocument()
    })

    it('renders overflow menu button', () => {
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      const menuButton = screen.getByLabelText('Chat options menu')
      expect(menuButton).toBeInTheDocument()
    })
  })

  describe('Close Button', () => {
    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      const closeButton = screen.getByLabelText('Close chat panel')
      await user.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('has proper ARIA label', () => {
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      const closeButton = screen.getByLabelText('Close chat panel')
      expect(closeButton).toHaveAttribute('aria-label', 'Close chat panel')
    })
  })

  describe('Overflow Menu', () => {
    it('menu is initially closed', () => {
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('opens menu when menu button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      const menuButton = screen.getByLabelText('Chat options menu')
      await user.click(menuButton)

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })
    })

    it('closes menu when menu button is clicked again', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      const menuButton = screen.getByLabelText('Chat options menu')

      // Open menu
      await user.click(menuButton)
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      // Close menu
      await user.click(menuButton)
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })

    it('shows Clear conversation menu item', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      const menuButton = screen.getByLabelText('Chat options menu')
      await user.click(menuButton)

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /clear conversation/i })).toBeInTheDocument()
      })
    })

    it('closes menu when clicking outside', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <div>
          <ChatHeader
            currentContext=""
            onClose={mockOnClose}
            onClearConversation={mockOnClearConversation}
          />
        </div>
      )

      const menuButton = screen.getByLabelText('Chat options menu')
      await user.click(menuButton)

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      // Click outside
      await user.click(container)

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })

    it('has proper ARIA attributes', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      const menuButton = screen.getByLabelText('Chat options menu')

      // Initially collapsed
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      expect(menuButton).toHaveAttribute('aria-haspopup', 'true')

      // After opening
      await user.click(menuButton)

      await waitFor(() => {
        expect(menuButton).toHaveAttribute('aria-expanded', 'true')
      })
    })
  })

  describe('Clear Conversation Flow - T067', () => {
    it('opens confirmation dialog when clear is clicked', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      // Open menu
      const menuButton = screen.getByLabelText('Chat options menu')
      await user.click(menuButton)

      // Click clear conversation
      const clearButton = await screen.findByRole('menuitem', { name: /clear conversation/i })
      await user.click(clearButton)

      // Dialog should be visible
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    it('shows confirmation dialog title and description', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      // Open menu and click clear
      await user.click(screen.getByLabelText('Chat options menu'))
      const clearButton = await screen.findByRole('menuitem', { name: /clear conversation/i })
      await user.click(clearButton)

      // Check dialog content
      await waitFor(() => {
        expect(screen.getByText('Clear conversation?')).toBeInTheDocument()
        expect(screen.getByText(/delete all messages/i)).toBeInTheDocument()
      })
    })

    it('shows Cancel and Clear buttons in dialog', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      // Open menu and click clear
      await user.click(screen.getByLabelText('Chat options menu'))
      const clearButton = await screen.findByRole('menuitem', { name: /clear conversation/i })
      await user.click(clearButton)

      // Check dialog buttons
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
      })
    })

    it('calls onClearConversation when Clear is clicked in dialog', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      // Open menu and click clear
      await user.click(screen.getByLabelText('Chat options menu'))
      const clearButton = await screen.findByRole('menuitem', { name: /clear conversation/i })
      await user.click(clearButton)

      // Click Clear in dialog
      const confirmButton = await screen.findByRole('button', { name: 'Clear' })
      await user.click(confirmButton)

      await waitFor(() => {
        expect(mockOnClearConversation).toHaveBeenCalledTimes(1)
      })
    })

    it('closes dialog when Clear is clicked', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      // Open menu and click clear
      await user.click(screen.getByLabelText('Chat options menu'))
      const clearButton = await screen.findByRole('menuitem', { name: /clear conversation/i })
      await user.click(clearButton)

      // Click Clear in dialog
      const confirmButton = await screen.findByRole('button', { name: 'Clear' })
      await user.click(confirmButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('does not call onClearConversation when Cancel is clicked', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      // Open menu and click clear
      await user.click(screen.getByLabelText('Chat options menu'))
      const clearButton = await screen.findByRole('menuitem', { name: /clear conversation/i })
      await user.click(clearButton)

      // Click Cancel in dialog
      const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)

      await waitFor(() => {
        expect(mockOnClearConversation).not.toHaveBeenCalled()
      })
    })

    it('closes dialog when Cancel is clicked', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      // Open menu and click clear
      await user.click(screen.getByLabelText('Chat options menu'))
      const clearButton = await screen.findByRole('menuitem', { name: /clear conversation/i })
      await user.click(clearButton)

      // Click Cancel in dialog
      const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('closes dialog when X button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      // Open menu and click clear
      await user.click(screen.getByLabelText('Chat options menu'))
      const clearButton = await screen.findByRole('menuitem', { name: /clear conversation/i })
      await user.click(clearButton)

      // Click X button
      const closeButton = await screen.findByLabelText('Close dialog')
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('closes menu when clear conversation is clicked', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      // Open menu
      await user.click(screen.getByLabelText('Chat options menu'))
      expect(screen.getByRole('menu')).toBeInTheDocument()

      // Click clear conversation
      const clearButton = await screen.findByRole('menuitem', { name: /clear conversation/i })
      await user.click(clearButton)

      // Menu should be closed (dialog is open instead)
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('closes menu on Escape key', async () => {
      const user = userEvent.setup()
      render(
        <ChatHeader
          currentContext=""
          onClose={mockOnClose}
          onClearConversation={mockOnClearConversation}
        />
      )

      // Open menu
      await user.click(screen.getByLabelText('Chat options menu'))
      expect(screen.getByRole('menu')).toBeInTheDocument()

      // Press Escape
      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })
  })
})
