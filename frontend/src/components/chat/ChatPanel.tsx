/**
 * ChatPanel Component
 * Main chat panel container assembling all chat components
 * Feature: 002-chat-panel
 */

import React, { useCallback, useEffect, useRef } from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import { useCodeStore } from '../../store/codeStore'
import { useCodeGeneration } from '../../hooks/useCodeGeneration'
import { useBreakpoint } from '../../hooks/responsive'
import { BottomSheet } from '../shell/BottomSheet'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { BottomAIPanel } from './BottomAIPanel'
import { ChatInputBar } from './ChatInputBar'
import { simulateOperation, generateMockResponse } from '../../services/mockAI'
import { debounce } from '../../utils/debounce'
import { demoFileChanges } from '../../utils/demoStreaming'
import type { ChatMessage } from '../../types/chat'
import './ChatPanel.css'

export const ChatPanel: React.FC = () => {
  // Responsive breakpoint detection
  const { isMobile } = useBreakpoint()

  const {
    chat,
    shell,
    toggleChat,
    addMessage,
    setScope,
    setBusy,
    clearMessages,
    setChatPanelWidth,
    setCurrentContext,
    setSelectedModel,
    setSelectedPage,
    setSelectedSection,
    setInspectorActiveTab,
  } = useDashboardStore()

  const { messages, scope, isBusy, currentContext, panelWidth, selectedModel } = chat
  const { selectedPageId, selectedSectionId } = shell

  // Mock AI credits (hardcoded for now - will be replaced in US4)
  const aiCreditsCount = 250

  // Code generation hook (003-ai-coding-mode)
  const { processMessage: processCodeMessage } = useCodeGeneration()

  // Multi-file streaming hook
  const startMultiFileStream = useCodeStore((state) => state.startMultiFileStream)

  // Refs for focus management (T072)
  const panelRef = useRef<HTMLElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)


  // T072: Focus management on panel open/close
  useEffect(() => {
    // When panel opens, save current focus and move focus to panel
    if (chat.isOpen && panelRef.current) {
      previousActiveElementRef.current = document.activeElement as HTMLElement

      // Focus the panel itself first
      const chatInput = panelRef.current.querySelector('textarea[aria-label="Chat message input"]') as HTMLTextAreaElement
      if (chatInput && !chatInput.disabled) {
        // Small delay to ensure panel is fully rendered
        setTimeout(() => {
          chatInput.focus()
        }, 50)
      }
    }

    // When panel closes, restore focus to previous element
    if (!chat.isOpen && previousActiveElementRef.current) {
      previousActiveElementRef.current.focus()
      previousActiveElementRef.current = null
    }
  }, [chat.isOpen])

  // Create debounced context updater (T040: 100ms debounce per requirement)
  const debouncedUpdateContextRef = useRef(
    debounce((pageId: string | null, sectionId: string | null) => {
      // Format context based on selection
      // TODO: In real implementation, fetch page/section names from data store
      let context = ''
      if (sectionId) {
        context = `Section ${sectionId}`
      } else if (pageId) {
        context = `Page ${pageId}`
      }
      setCurrentContext(context)
    }, 100)
  )

  // Sync current context when selection changes (T040: FR-040)
  useEffect(() => {
    debouncedUpdateContextRef.current(selectedPageId, selectedSectionId)
  }, [selectedPageId, selectedSectionId])

  // Handle sending a message (FR-019)
  const handleSendMessage = useCallback(
    async (text: string) => {
      // Add user message
      const userMessage: Omit<ChatMessage, 'id' | 'createdAt'> = {
        type: 'user',
        text,
        scope,
        isCollapsed: false,
      }
      addMessage(userMessage)

      // Set busy state
      setBusy(true)

      try {
        // Check for demo code trigger
        if (text.toLowerCase().trim() === 'demo code') {
          // Trigger multi-file streaming demo
          startMultiFileStream(demoFileChanges)

          // Add AI response
          const aiResponse: Omit<ChatMessage, 'id' | 'createdAt'> = {
            type: 'ai',
            text: '✨ Starting AI code generation demo...\n\nI\'ll create a complete authentication system with:\n- Login form component\n- Authentication hook\n- Auth service\n- Type definitions\n\nWatch the code editor for live streaming!',
            scope,
            isCollapsed: false,
          }
          addMessage(aiResponse)

          setBusy(false)
          return
        }

        // Check if this is a code-related command (T026-T027)
        const codeResult = processCodeMessage(text, scope, currentContext || '')

        if (codeResult.wasCodeCommand) {
          // Code generation is now in progress via the hook
          // The hook handles all progress updates and messages
          console.log('Code generation started:', codeResult.operationId)
        } else {
          // Not a code command - process as normal chat message
          // Simulate operation with progressive logs (FR-022, FR-023, FR-024)
          const operationGenerator = simulateOperation(
            text,
            scope,
            currentContext || 'unknown'
          )

          for await (const logMessage of operationGenerator) {
            addMessage(logMessage)
            // Small delay between logs for better UX
            await new Promise((resolve) => setTimeout(resolve, 100))
          }

          // Generate AI response (FR-020)
          const aiResponse = await generateMockResponse(text, scope)
          addMessage(aiResponse)
        }
      } catch (error) {
        // Error handling (FR-025)
        const errorMessage: Omit<ChatMessage, 'id' | 'createdAt'> = {
          type: 'log',
          text: 'An error occurred while processing your request. Please try again.',
          scope,
          isCollapsed: false,
        }
        addMessage(errorMessage)
        console.error('Chat error:', error)
      } finally {
        // Clear busy state
        setBusy(false)
      }
    },
    [scope, currentContext, addMessage, setBusy, processCodeMessage, startMultiFileStream]
  )

  // Handle clearing conversation (FR-026)
  const handleClearConversation = useCallback(() => {
    clearMessages()
  }, [clearMessages])

  // Handle toggling message collapse state (FR-018)
  const handleToggleCollapse = useCallback(
    (messageId: string) => {
      // Find and update the specific message
      const messageIndex = messages.findIndex((msg) => msg.id === messageId)
      if (messageIndex === -1) return

      const updatedMessages = [...messages]
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        isCollapsed: !updatedMessages[messageIndex].isCollapsed,
      }

      // Clear all messages and re-add with updated state
      clearMessages()
      updatedMessages.forEach((msg) => {
        const { id, createdAt, ...messageData } = msg
        addMessage(messageData)
      })
    },
    [messages, clearMessages, addMessage]
  )

  // Handle "View change" link clicks (FR-026, T041)
  const handleViewChange = useCallback(
    (entityId: string) => {
      // Parse entity ID to determine type (page or section)
      // Assuming format: "page-{id}" or "section-{id}"
      if (entityId.startsWith('page-')) {
        // Focus page
        setSelectedPage(entityId)
        setInspectorActiveTab('content')
      } else if (entityId.startsWith('section-')) {
        // Focus section
        setSelectedSection(entityId)
        setInspectorActiveTab('content')

        // TODO: Scroll canvas to the section
        // This would require access to canvas scroll methods
        // For now, just selecting the section will highlight it
      }

      // Note: Canvas scrolling will be implemented when Canvas component
      // provides a scroll API. For now, selecting the entity is sufficient.
    },
    [setSelectedPage, setSelectedSection, setInspectorActiveTab]
  )

  // Handle prompt click from BottomAIPanel
  const handlePromptClick = useCallback((prompt: string) => {
    handleSendMessage(prompt)
  }, [handleSendMessage])

  // Handle panel resize (FR-014)
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      const startX = e.clientX
      const startWidth = panelWidth

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX
        const newWidth = Math.max(280, Math.min(600, startWidth + deltaX))
        setChatPanelWidth(newWidth)
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    },
    [panelWidth, setChatPanelWidth]
  )

  // Chat panel content (shared between desktop and mobile)
  const chatPanelContent = (
    <>
      <div id="chat-panel-description" className="sr-only">
        AI-powered chat assistant for editing and content generation. Use Tab to navigate, Enter to send messages.
      </div>

      <div className="chat-panel__content">
        <ChatHeader
          currentContext={currentContext}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          onClose={toggleChat}
          onClearConversation={handleClearConversation}
        />

        <MessageList
          messages={messages}
          onToggleCollapse={handleToggleCollapse}
          onViewChange={handleViewChange}
        />

        <BottomAIPanel
          scope={scope}
          onScopeChange={setScope}
          currentContext={currentContext}
          disabled={isBusy || aiCreditsCount === 0}
          onPromptClick={handlePromptClick}
        />

        <ChatInputBar
          onSendMessage={handleSendMessage}
          isBusy={isBusy}
          aiCreditsCount={aiCreditsCount}
        />
      </div>
    </>
  )

  // On mobile, render as bottom sheet
  if (isMobile) {
    return (
      <BottomSheet
        isOpen={chat.isOpen}
        onClose={toggleChat}
        snapPoint="full"
        title="AI Chat"
      >
        <div ref={panelRef} className="chat-panel chat-panel--mobile" role="complementary" aria-label="AI Chat Assistant">
          {chatPanelContent}
        </div>
      </BottomSheet>
    )
  }

  // Desktop: render as sidebar panel
  return (
    <aside
      ref={panelRef}
      className="chat-panel shell-sidebar"
      style={{ width: `${panelWidth}px` }}
      role="complementary"
      aria-label="AI Chat Assistant"
      aria-describedby="chat-panel-description"
    >
      {/* Resize handle - desktop only */}
      <div
        className="chat-panel__resize-handle"
        onMouseDown={handleResizeStart}
        role="separator"
        aria-label="Resize chat panel"
        aria-orientation="vertical"
      />

      {chatPanelContent}
    </aside>
  )
}
