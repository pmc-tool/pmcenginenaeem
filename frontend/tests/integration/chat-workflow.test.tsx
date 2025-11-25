/**
 * Chat Workflow Integration Tests
 * Tests complete user workflows for chat panel interactions
 * Feature: 002-chat-panel
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ChatPanel } from '../../src/components/chat/ChatPanel'

// Mock the dashboard store
vi.mock('../../src/store/dashboardStore', () => ({
  useDashboardStore: () => ({
    chat: {
      messages: [],
      isOpen: true,
      scope: 'section',
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

// Mock the mock AI service
vi.mock('../../src/services/mockAI', () => ({
  generateMockResponse: vi.fn().mockResolvedValue({
    type: 'ai',
    text: 'I have processed your request.',
    scope: 'section',
    action: 'general',
    isCollapsed: false,
  }),
  simulateOperation: vi.fn(async function* () {
    yield {
      type: 'log',
      text: 'Analyzing section...',
      scope: 'section',
      isCollapsed: false,
      operationLog: {
        operationId: 'op-test-123',
        status: 'running',
        messages: ['Analyzing section...'],
      },
    }
    yield {
      type: 'log',
      text: 'Complete!',
      scope: 'section',
      isCollapsed: false,
      operationLog: {
        operationId: 'op-test-123',
        status: 'success',
        messages: ['Analyzing section...', 'Complete!'],
      },
    }
  }),
}))

describe('Chat Workflow - Scope Selection Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays current scope and context in composer', () => {
    render(<ChatPanel />)

    // Should show scope selector with "Section"
    expect(screen.getByRole('button', { name: /scope/i })).toHaveTextContent('Section')

    // Should show current context
    expect(screen.getByText('Home / Hero')).toBeInTheDocument()
  })

  it('allows user to change scope via dropdown', async () => {
    const user = userEvent.setup()
    const { useDashboardStore } = await import('../../src/store/dashboardStore')
    const mockStore = useDashboardStore()

    render(<ChatPanel />)

    // Find and click scope selector
    const scopeButton = screen.getByRole('button', { name: /scope/i })
    await user.click(scopeButton)

    // Select "Page" from dropdown
    const pageOption = screen.getByText('Page')
    await user.click(pageOption)

    // Verify setScope was called with 'page'
    expect(mockStore.setScope).toHaveBeenCalledWith('page')
  })

  it('completes full workflow: select scope, send message, receive AI response', async () => {
    const user = userEvent.setup()
    const { useDashboardStore } = await import('../../src/store/dashboardStore')
    const mockStore = useDashboardStore()

    render(<ChatPanel />)

    // Step 1: Change scope to "Page"
    const scopeButton = screen.getByRole('button', { name: /scope/i })
    await user.click(scopeButton)
    await user.click(screen.getByText('Page'))

    // Step 2: Type message in composer
    const textarea = screen.getByRole('textbox', { name: /chat message input/i })
    await user.type(textarea, 'Improve this page')

    // Step 3: Send message
    const sendButton = screen.getByRole('button', { name: /send message/i })
    await user.click(sendButton)

    // Verify message was added
    expect(mockStore.addMessage).toHaveBeenCalled()

    // Verify busy state was set
    expect(mockStore.setBusy).toHaveBeenCalledWith(true)

    // Wait for AI response processing
    await waitFor(() => {
      expect(mockStore.setBusy).toHaveBeenCalledWith(false)
    })
  })

  it('shows scope badge in AI responses', async () => {
    const user = userEvent.setup()
    const { useDashboardStore } = await import('../../src/store/dashboardStore')

    // Mock store with AI message containing scope
    vi.mocked(useDashboardStore).mockReturnValue({
      chat: {
        messages: [
          {
            id: 'msg-1',
            type: 'ai',
            text: 'I have processed your request.',
            scope: 'page',
            action: 'improve',
            createdAt: Date.now(),
            isCollapsed: false,
          },
        ],
        isOpen: true,
        scope: 'page',
        isBusy: false,
        currentContext: 'About Page',
        panelWidth: 420,
      },
      shell: {
        selectedPageId: 'page-about',
        selectedSectionId: null,
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
    } as any)

    render(<ChatPanel />)

    // Should show scope badge
    expect(screen.getByText('PAGE')).toBeInTheDocument()
  })

  it('updates context chip when selection changes', async () => {
    const { useDashboardStore } = await import('../../src/store/dashboardStore')
    const mockStore = useDashboardStore()

    // Initial render
    const { rerender } = render(<ChatPanel />)
    expect(screen.getByText('Home / Hero')).toBeInTheDocument()

    // Simulate selection change
    vi.mocked(useDashboardStore).mockReturnValue({
      ...mockStore,
      chat: {
        ...mockStore.chat,
        currentContext: 'About / Team',
      },
      shell: {
        selectedPageId: 'page-about',
        selectedSectionId: 'section-team',
      },
    } as any)

    // Rerender with new context
    rerender(<ChatPanel />)

    // Context should update
    await waitFor(() => {
      expect(screen.getByText('About / Team')).toBeInTheDocument()
    })
  })

  it('displays operation logs during AI processing', async () => {
    const user = userEvent.setup()
    const { useDashboardStore } = await import('../../src/store/dashboardStore')

    // Mock store with operation log message
    vi.mocked(useDashboardStore).mockReturnValue({
      chat: {
        messages: [
          {
            id: 'msg-log-1',
            type: 'log',
            text: 'Analyzing section...',
            scope: 'section',
            createdAt: Date.now(),
            isCollapsed: false,
            operationLog: {
              operationId: 'op-123',
              status: 'running',
              messages: ['Analyzing section...', 'Processing content...'],
            },
          },
        ],
        isOpen: true,
        scope: 'section',
        isBusy: true,
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
    } as any)

    render(<ChatPanel />)

    // Should show operation log messages
    expect(screen.getByText('Analyzing section...')).toBeInTheDocument()
    expect(screen.getByText('Processing content...')).toBeInTheDocument()
  })

  it('disables composer when busy', async () => {
    const { useDashboardStore } = await import('../../src/store/dashboardStore')

    vi.mocked(useDashboardStore).mockReturnValue({
      chat: {
        messages: [],
        isOpen: true,
        scope: 'section',
        isBusy: true, // Set to busy
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
    } as any)

    render(<ChatPanel />)

    // Textarea should be disabled
    const textarea = screen.getByRole('textbox', { name: /chat message input/i })
    expect(textarea).toBeDisabled()

    // Send button should be disabled
    const sendButton = screen.getByRole('button', { name: /send message/i })
    expect(sendButton).toBeDisabled()
  })

  it('handles "View change" click in operation logs', async () => {
    const user = userEvent.setup()
    const { useDashboardStore } = await import('../../src/store/dashboardStore')
    const mockStore = useDashboardStore()

    // Mock store with completed operation log
    vi.mocked(useDashboardStore).mockReturnValue({
      chat: {
        messages: [
          {
            id: 'msg-log-1',
            type: 'log',
            text: 'Complete!',
            scope: 'section',
            createdAt: Date.now(),
            isCollapsed: false,
            relatedEntityId: 'section-hero',
            operationLog: {
              operationId: 'op-123',
              status: 'success',
              messages: ['Complete!'],
            },
          },
        ],
        isOpen: true,
        scope: 'section',
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
      setSelectedPage: mockStore.setSelectedPage,
      setSelectedSection: mockStore.setSelectedSection,
      setInspectorActiveTab: mockStore.setInspectorActiveTab,
    } as any)

    render(<ChatPanel />)

    // Find and click "View change" button
    const viewChangeButton = screen.getByRole('button', { name: /view change/i })
    await user.click(viewChangeButton)

    // Should call setSelectedSection with entity ID
    expect(mockStore.setSelectedSection).toHaveBeenCalledWith('section-hero')

    // Should open inspector content tab
    expect(mockStore.setInspectorActiveTab).toHaveBeenCalledWith('content')
  })
})

describe('Chat Workflow - Quick Action Chips Integration (US3)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays quick action chips based on current scope', () => {
    const { useDashboardStore } = vi.mocked(
      require('../../src/store/dashboardStore')
    )

    vi.mocked(useDashboardStore).mockReturnValue({
      chat: {
        messages: [],
        isOpen: true,
        scope: 'section',
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
    } as any)

    render(<ChatPanel />)

    // Should show quick action chips for section scope
    expect(screen.getByText('Rewrite section')).toBeInTheDocument()
    expect(screen.getByText('Improve headline')).toBeInTheDocument()
  })

  it('fills composer with prompt when chip is clicked', async () => {
    const user = userEvent.setup()
    const { useDashboardStore } = vi.mocked(
      require('../../src/store/dashboardStore')
    )

    vi.mocked(useDashboardStore).mockReturnValue({
      chat: {
        messages: [],
        isOpen: true,
        scope: 'section',
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
    } as any)

    render(<ChatPanel />)

    // Click a quick action chip
    const chip = screen.getByText('Improve headline')
    await user.click(chip)

    // Composer should be filled with the prompt
    const textarea = screen.getByRole('textbox', { name: /chat message input/i })
    expect(textarea).toHaveValue(
      expect.stringContaining('Improve this headline')
    )

    // Chip should be highlighted
    expect(chip).toHaveClass('quick-action-chip--selected')
  })

  it('deselects chip when user edits text', async () => {
    const user = userEvent.setup()
    const { useDashboardStore } = vi.mocked(
      require('../../src/store/dashboardStore')
    )

    vi.mocked(useDashboardStore).mockReturnValue({
      chat: {
        messages: [],
        isOpen: true,
        scope: 'section',
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
    } as any)

    render(<ChatPanel />)

    // Click a chip
    const chip = screen.getByText('Improve headline')
    await user.click(chip)

    // Chip should be selected
    expect(chip).toHaveClass('quick-action-chip--selected')

    // Edit the text
    const textarea = screen.getByRole('textbox', { name: /chat message input/i })
    await user.type(textarea, ' and make it catchy')

    // Chip should be deselected
    await waitFor(() => {
      expect(chip).not.toHaveClass('quick-action-chip--selected')
    })
  })

  it('shows different chips for different scopes', () => {
    const { useDashboardStore } = vi.mocked(
      require('../../src/store/dashboardStore')
    )

    // Render with field scope
    vi.mocked(useDashboardStore).mockReturnValue({
      chat: {
        messages: [],
        isOpen: true,
        scope: 'field',
        isBusy: false,
        currentContext: 'Headline',
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
    } as any)

    const { rerender } = render(<ChatPanel />)

    // Field scope should NOT show "Rewrite section"
    expect(screen.queryByText('Rewrite section')).not.toBeInTheDocument()

    // Change to page scope
    vi.mocked(useDashboardStore).mockReturnValue({
      chat: {
        messages: [],
        isOpen: true,
        scope: 'page',
        isBusy: false,
        currentContext: 'Home Page',
        panelWidth: 420,
      },
      shell: {
        selectedPageId: 'page-home',
        selectedSectionId: null,
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
    } as any)

    rerender(<ChatPanel />)

    // Page scope SHOULD show "Rewrite section"
    expect(screen.getByText('Rewrite section')).toBeInTheDocument()
  })

  it('hides chips when composer is busy', () => {
    const { useDashboardStore } = vi.mocked(
      require('../../src/store/dashboardStore')
    )

    vi.mocked(useDashboardStore).mockReturnValue({
      chat: {
        messages: [],
        isOpen: true,
        scope: 'section',
        isBusy: true, // Busy state
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
    } as any)

    render(<ChatPanel />)

    // Chips should not be visible when busy
    expect(screen.queryByText('Rewrite section')).not.toBeInTheDocument()
    expect(screen.queryByText('Improve headline')).not.toBeInTheDocument()
  })
})

// T068: Integration tests for long message handling
describe('Long Message Handling - T068', () => {
  it('displays collapse button for long AI response (>400 chars)', () => {
    const longText = 'This is a very long AI response. '.repeat(50) // >400 chars
    const longMessage = {
      id: 'msg-long',
      type: 'ai' as const,
      text: longText,
      scope: 'section' as const,
      action: 'general' as const,
      createdAt: Date.now(),
      isCollapsed: false,
    }

    vi.mock('../../src/store/dashboardStore', () => ({
      useDashboardStore: () => ({
        chat: {
          messages: [longMessage],
          isOpen: true,
          scope: 'section',
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
      } as any),
    }))

    render(<ChatPanel />)

    // Should show "Show less" button for expanded long message
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument()
  })

  it('displays collapse button for multiline message (>8 lines)', () => {
    const multilineText = Array(10).fill('Line of text in AI response').join('\n')
    const multilineMessage = {
      id: 'msg-multiline',
      type: 'ai' as const,
      text: multilineText,
      scope: 'page' as const,
      action: 'generate' as const,
      createdAt: Date.now(),
      isCollapsed: false,
    }

    vi.mock('../../src/store/dashboardStore', () => ({
      useDashboardStore: () => ({
        chat: {
          messages: [multilineMessage],
          isOpen: true,
          scope: 'page',
          isBusy: false,
          currentContext: 'Home',
          panelWidth: 420,
        },
        shell: {
          selectedPageId: 'page-home',
          selectedSectionId: null,
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
      } as any),
    }))

    render(<ChatPanel />)

    // Should show "Show less" button for expanded multiline message
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument()
  })

  it('does not show collapse button for short messages', () => {
    const shortMessage = {
      id: 'msg-short',
      type: 'ai' as const,
      text: 'Short AI response',
      scope: 'field' as const,
      action: 'improve' as const,
      createdAt: Date.now(),
      isCollapsed: false,
    }

    vi.mock('../../src/store/dashboardStore', () => ({
      useDashboardStore: () => ({
        chat: {
          messages: [shortMessage],
          isOpen: true,
          scope: 'field',
          isBusy: false,
          currentContext: 'Home / Hero / Headline',
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
      } as any),
    }))

    render(<ChatPanel />)

    // Should not show collapse button for short message
    expect(screen.queryByRole('button', { name: /show/i })).not.toBeInTheDocument()
  })

  it('handles conversation with mix of long and short messages', () => {
    const messages = [
      {
        id: 'msg-1',
        type: 'user' as const,
        text: 'Can you help me with this section?',
        scope: 'section' as const,
        action: 'general' as const,
        createdAt: Date.now() - 60000,
        isCollapsed: false,
      },
      {
        id: 'msg-2',
        type: 'ai' as const,
        text: 'Here is a detailed explanation. '.repeat(50), // Long response
        scope: 'section' as const,
        action: 'explain' as const,
        createdAt: Date.now() - 30000,
        isCollapsed: false,
      },
      {
        id: 'msg-3',
        type: 'user' as const,
        text: 'Thanks!',
        scope: 'section' as const,
        action: 'general' as const,
        createdAt: Date.now(),
        isCollapsed: false,
      },
    ]

    vi.mock('../../src/store/dashboardStore', () => ({
      useDashboardStore: () => ({
        chat: {
          messages,
          isOpen: true,
          scope: 'section',
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
      } as any),
    }))

    render(<ChatPanel />)

    // Should show all messages
    expect(screen.getByText('Can you help me with this section?')).toBeInTheDocument()
    expect(screen.getByText(/Here is a detailed explanation/)).toBeInTheDocument()
    expect(screen.getByText('Thanks!')).toBeInTheDocument()

    // Should only show collapse button for the long AI message
    const collapseButtons = screen.getAllByRole('button', { name: /show less/i })
    expect(collapseButtons).toHaveLength(1)
  })

  it('shows collapsed state correctly for long messages', () => {
    const longText = 'This is a very long AI response that is collapsed. '.repeat(50)
    const collapsedMessage = {
      id: 'msg-collapsed',
      type: 'ai' as const,
      text: longText,
      scope: 'page' as const,
      action: 'generate' as const,
      createdAt: Date.now(),
      isCollapsed: true, // Message is collapsed
    }

    vi.mock('../../src/store/dashboardStore', () => ({
      useDashboardStore: () => ({
        chat: {
          messages: [collapsedMessage],
          isOpen: true,
          scope: 'page',
          isBusy: false,
          currentContext: 'Home',
          panelWidth: 420,
        },
        shell: {
          selectedPageId: 'page-home',
          selectedSectionId: null,
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
      } as any),
    }))

    render(<ChatPanel />)

    // Should show "Show more" button for collapsed message
    expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument()
  })

  it('handles conversation with 100+ messages including long ones', () => {
    // Generate 100 messages with mix of short and long
    const messages = Array.from({ length: 100 }, (_, i) => ({
      id: `msg-${i}`,
      type: (i % 2 === 0 ? 'user' : 'ai') as 'user' | 'ai',
      text: i % 10 === 0 ? 'Long message. '.repeat(50) : `Message ${i}`,
      scope: 'section' as const,
      action: 'general' as const,
      createdAt: Date.now() - (100 - i) * 1000,
      isCollapsed: i % 10 === 0 ? true : false, // Collapse every 10th message
    }))

    vi.mock('../../src/store/dashboardStore', () => ({
      useDashboardStore: () => ({
        chat: {
          messages,
          isOpen: true,
          scope: 'section',
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
      } as any),
    }))

    const { container } = render(<ChatPanel />)

    // Should render all messages
    const messageBubbles = container.querySelectorAll('.message-bubble')
    expect(messageBubbles.length).toBe(100)

    // Should have collapse buttons for long messages (every 10th message = 10 total)
    const collapseButtons = screen.getAllByRole('button', { name: /show more/i })
    expect(collapseButtons.length).toBe(10)
  })
})
