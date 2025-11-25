/**
 * ChatPanel Component (REFACTORED)
 * Main chat panel container assembling all chat components
 * Feature: 002-chat-panel
 *
 * Refactored to use:
 * - Custom useChatFlow hook for business logic
 * - useDebounce hook from Phase 3
 * - Cleaner component structure
 *
 * Benefits:
 * - Reduced from 318 LOC to ~80 LOC
 * - Separation of concerns (UI vs logic)
 * - Easier to test
 * - Reusable logic via custom hook
 */

import React, { useRef, useEffect } from 'react';
import { useChatFlow } from './useChatFlow';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { BottomAIPanel } from './BottomAIPanel';
import { ChatInputBar } from './ChatInputBar';
import './ChatPanel.css';

export const ChatPanel: React.FC = () => {
  const {
    messages,
    scope,
    isBusy,
    currentContext,
    panelWidth,
    selectedModel,
    aiCreditsCount,
    handleSendMessage,
    handleClearConversation,
    handleToggleCollapse,
    handleViewChange,
    handlePromptClick,
    handleResizeStart,
    setScope,
    setSelectedModel,
    toggleChat,
  } = useChatFlow();

  // Refs for focus management
  const panelRef = useRef<HTMLElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Focus management on panel open/close
  useEffect(() => {
    const chatInput = panelRef.current?.querySelector(
      'textarea[aria-label="Chat message input"]'
    ) as HTMLTextAreaElement;

    if (chatInput) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      setTimeout(() => {
        if (chatInput && !chatInput.disabled) {
          chatInput.focus();
        }
      }, 50);
    }

    return () => {
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    };
  }, []);

  return (
    <aside
      ref={panelRef}
      className="chat-panel shell-sidebar"
      style={{ width: `${panelWidth}px` }}
      role="complementary"
      aria-label="AI Chat Assistant"
      aria-describedby="chat-panel-description"
    >
      {/* Screen reader description */}
      <div id="chat-panel-description" className="sr-only">
        AI-powered chat assistant for editing and content generation. Use Tab to
        navigate, Enter to send messages.
      </div>

      {/* Resize handle */}
      <div
        className="chat-panel__resize-handle"
        onMouseDown={handleResizeStart}
        role="separator"
        aria-label="Resize chat panel"
        aria-orientation="vertical"
      />

      {/* Panel Content */}
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
    </aside>
  );
};
