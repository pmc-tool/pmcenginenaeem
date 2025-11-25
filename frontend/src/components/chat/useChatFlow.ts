/**
 * Chat Flow Hook
 *
 * Custom hook to manage chat panel logic.
 * Extracted from ChatPanel to separate business logic from UI.
 */

import { useCallback, useEffect, useRef } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { useCodeStore } from '../../store/codeStore';
import { useCodeGeneration } from '../../hooks/useCodeGeneration';
import { useDebounce } from '../../hooks';
import { simulateOperation, generateMockResponse } from '../../services/mockAI';
import { demoFileChanges } from '../../utils/demoStreaming';
import type { ChatMessage } from '../../types/chat';

export interface UseChatFlowReturn {
  /**
   * All chat messages
   */
  messages: ChatMessage[];

  /**
   * Current chat scope
   */
  scope: string;

  /**
   * Is chat busy processing
   */
  isBusy: boolean;

  /**
   * Current context string
   */
  currentContext: string | null;

  /**
   * Panel width in pixels
   */
  panelWidth: number;

  /**
   * Selected AI model
   */
  selectedModel: string;

  /**
   * AI credits count
   */
  aiCreditsCount: number;

  /**
   * Send a chat message
   */
  handleSendMessage: (text: string) => Promise<void>;

  /**
   * Clear all messages
   */
  handleClearConversation: () => void;

  /**
   * Toggle message collapse state
   */
  handleToggleCollapse: (messageId: string) => void;

  /**
   * View change (focus on page/section)
   */
  handleViewChange: (entityId: string) => void;

  /**
   * Handle prompt click from suggestions
   */
  handlePromptClick: (prompt: string) => void;

  /**
   * Start panel resize
   */
  handleResizeStart: (e: React.MouseEvent) => void;

  /**
   * Set chat scope
   */
  setScope: (scope: string) => void;

  /**
   * Set selected model
   */
  setSelectedModel: (model: string) => void;

  /**
   * Toggle chat panel
   */
  toggleChat: () => void;
}

/**
 * Hook to manage chat flow
 */
export function useChatFlow(): UseChatFlowReturn {
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
  } = useDashboardStore();

  const { messages, scope, isBusy, currentContext, panelWidth, selectedModel } = chat;
  const { selectedPageId, selectedSectionId } = shell;

  const aiCreditsCount = 250;

  const { processMessage: processCodeMessage } = useCodeGeneration();
  const startMultiFileStream = useCodeStore((state) => state.startMultiFileStream);

  // Debounced context update
  const debouncedUpdateContext = useCallback(
    (pageId: string | null, sectionId: string | null) => {
      let context = '';
      if (sectionId) {
        context = `Section ${sectionId}`;
      } else if (pageId) {
        context = `Page ${pageId}`;
      }
      setCurrentContext(context);
    },
    [setCurrentContext]
  );

  const debouncedContextValue = useDebounce(
    { pageId: selectedPageId, sectionId: selectedSectionId },
    100
  );

  useEffect(() => {
    debouncedUpdateContext(
      debouncedContextValue.pageId,
      debouncedContextValue.sectionId
    );
  }, [debouncedContextValue, debouncedUpdateContext]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      const userMessage: Omit<ChatMessage, 'id' | 'createdAt'> = {
        type: 'user',
        text,
        scope,
        isCollapsed: false,
      };
      addMessage(userMessage);
      setBusy(true);

      try {
        // Check for demo code trigger
        if (text.toLowerCase().trim() === 'demo code') {
          startMultiFileStream(demoFileChanges);

          const aiResponse: Omit<ChatMessage, 'id' | 'createdAt'> = {
            type: 'ai',
            text: "✨ Starting AI code generation demo...\n\nI'll create a complete authentication system with:\n- Login form component\n- Authentication hook\n- Auth service\n- Type definitions\n\nWatch the code editor for live streaming!",
            scope,
            isCollapsed: false,
          };
          addMessage(aiResponse);
          setBusy(false);
          return;
        }

        const codeResult = processCodeMessage(text, scope, currentContext || '');

        if (codeResult.wasCodeCommand) {
          console.log('Code generation started:', codeResult.operationId);
        } else {
          const operationGenerator = simulateOperation(
            text,
            scope,
            currentContext || 'unknown'
          );

          for await (const logMessage of operationGenerator) {
            addMessage(logMessage);
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          const aiResponse = await generateMockResponse(text, scope);
          addMessage(aiResponse);
        }
      } catch (error) {
        const errorMessage: Omit<ChatMessage, 'id' | 'createdAt'> = {
          type: 'log',
          text: 'An error occurred while processing your request. Please try again.',
          scope,
          isCollapsed: false,
        };
        addMessage(errorMessage);
        console.error('Chat error:', error);
      } finally {
        setBusy(false);
      }
    },
    [scope, currentContext, addMessage, setBusy, processCodeMessage, startMultiFileStream]
  );

  const handleClearConversation = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  const handleToggleCollapse = useCallback(
    (messageId: string) => {
      const messageIndex = messages.findIndex((msg) => msg.id === messageId);
      if (messageIndex === -1) return;

      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        isCollapsed: !updatedMessages[messageIndex].isCollapsed,
      };

      clearMessages();
      updatedMessages.forEach((msg) => {
        const { id, createdAt, ...messageData } = msg;
        addMessage(messageData);
      });
    },
    [messages, clearMessages, addMessage]
  );

  const handleViewChange = useCallback(
    (entityId: string) => {
      if (entityId.startsWith('page-')) {
        setSelectedPage(entityId);
        setInspectorActiveTab('content');
      } else if (entityId.startsWith('section-')) {
        setSelectedSection(entityId);
        setInspectorActiveTab('content');
      }
    },
    [setSelectedPage, setSelectedSection, setInspectorActiveTab]
  );

  const handlePromptClick = useCallback(
    (prompt: string) => {
      handleSendMessage(prompt);
    },
    [handleSendMessage]
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      const startX = e.clientX;
      const startWidth = panelWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = Math.max(280, Math.min(600, startWidth + deltaX));
        setChatPanelWidth(newWidth);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    },
    [panelWidth, setChatPanelWidth]
  );

  return {
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
  };
}
