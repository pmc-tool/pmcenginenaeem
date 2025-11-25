/**
 * Deployment Flow Hook
 *
 * Custom hook to manage deployment flow logic.
 * Extracted from DeployPanel to separate business logic from UI.
 */

import { useState, useCallback } from 'react';
import { useDeploymentStore } from '../../store/deploymentStore';
import { useThemesStore } from '../../store/themesStore';
import { useDashboardStore } from '../../store/dashboardStore';
import { deploymentService } from '../../services/deploymentService';

export interface UseDeploymentFlowParams {
  themeId: string;
  siteId: string;
  userId: string;
}

export interface UseDeploymentFlowReturn {
  /**
   * Deployment session for this site
   */
  session: ReturnType<typeof useDeploymentStore>['getSessionBySite'] extends (id: string) => infer R ? R : never;

  /**
   * Is showing confirmation dialog
   */
  showConfirmation: boolean;

  /**
   * Are logs expanded
   */
  logsExpanded: boolean;

  /**
   * Toggle logs expansion
   */
  toggleLogs: () => void;

  /**
   * Start deployment after confirmation
   */
  confirmDeploy: () => Promise<void>;

  /**
   * Close the deploy panel
   */
  closePanel: () => void;

  /**
   * Go to preview mode
   */
  goToPreview: () => void;

  /**
   * Edit with AI (open chat with demo)
   */
  editWithAI: () => void;

  /**
   * Open AI help in chat
   */
  openAIHelp: () => void;

  /**
   * Retry failed deployment
   */
  retryDeployment: () => Promise<void>;

  /**
   * Expand logs panel
   */
  viewLogs: () => void;
}

/**
 * Hook to manage deployment flow
 */
export function useDeploymentFlow({
  themeId,
  siteId,
  userId,
}: UseDeploymentFlowParams): UseDeploymentFlowReturn {
  const getSessionBySite = useDeploymentStore((state) => state.getSessionBySite);
  const updateSession = useDeploymentStore((state) => state.updateSession);
  const createSession = useDeploymentStore((state) => state.createSession);
  const closeDeployPanel = useDeploymentStore((state) => state.closeDeployPanel);
  const updateTheme = useThemesStore((state) => state.updateTheme);
  const togglePreviewMode = useDashboardStore((state) => state.togglePreviewMode);
  const toggleChat = useDashboardStore((state) => state.toggleChat);

  const session = getSessionBySite(siteId);

  const [showConfirmation, setShowConfirmation] = useState(true);
  const [logsExpanded, setLogsExpanded] = useState(false);

  const toggleLogs = useCallback(() => {
    setLogsExpanded((prev) => !prev);
  }, []);

  const runDeployment = useCallback(async () => {
    updateTheme(themeId, { deploymentStatus: 'deploying' });

    let sessionCreated = false;

    const finalSession = await deploymentService.mockDeployment(
      themeId,
      siteId,
      userId,
      (updatedSession) => {
        const existingSession = useDeploymentStore.getState().getSessionBySite(siteId);

        if (existingSession || sessionCreated) {
          updateSession(siteId, updatedSession);
        } else {
          createSession(updatedSession);
          sessionCreated = true;
        }
      }
    );

    // Update theme status based on final state
    if (finalSession.finalState === 'failed') {
      updateTheme(themeId, { deploymentStatus: 'failed' });
    } else if (finalSession.finalState === 'success') {
      updateTheme(themeId, { deploymentStatus: 'active' });
    }
  }, [themeId, siteId, userId, updateTheme, updateSession, createSession]);

  const confirmDeploy = useCallback(async () => {
    setShowConfirmation(false);
    await runDeployment();
  }, [runDeployment]);

  const closePanel = useCallback(() => {
    closeDeployPanel();
  }, [closeDeployPanel]);

  const goToPreview = useCallback(() => {
    updateTheme(themeId, { deploymentStatus: 'active' });
    togglePreviewMode();
    closeDeployPanel();
  }, [themeId, updateTheme, togglePreviewMode, closeDeployPanel]);

  const openChatWithDemo = useCallback((demoText: string) => {
    const store = useDashboardStore.getState();

    closeDeployPanel();

    if (store.shell.isAITrainingOpen) {
      store.setAITrainingOpen(false);
    }

    store.setActiveLeftRailTab('chat');

    if (!store.chat.isOpen) {
      toggleChat();
    }

    setTimeout(() => {
      const chatInput = document.querySelector(
        'textarea[aria-label="Chat message input"]'
      ) as HTMLTextAreaElement;

      if (chatInput) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value'
        )?.set;

        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(chatInput, demoText);

          const inputEvent = new Event('input', { bubbles: true });
          chatInput.dispatchEvent(inputEvent);

          const changeEvent = new Event('change', { bubbles: true });
          chatInput.dispatchEvent(changeEvent);

          chatInput.focus();

          setTimeout(() => {
            const sendButton = document.querySelector(
              'button[aria-label="Send message"]'
            ) as HTMLButtonElement;
            if (sendButton && !sendButton.disabled) {
              sendButton.click();
            }
          }, 150);
        }
      }
    }, 400);
  }, [closeDeployPanel, toggleChat]);

  const editWithAI = useCallback(() => {
    openChatWithDemo('demo code');
  }, [openChatWithDemo]);

  const openAIHelp = useCallback(() => {
    openChatWithDemo('demo code');
  }, [openChatWithDemo]);

  const retryDeployment = useCallback(async () => {
    setShowConfirmation(false);
    await runDeployment();
  }, [runDeployment]);

  const viewLogs = useCallback(() => {
    setLogsExpanded(true);
  }, []);

  return {
    session,
    showConfirmation,
    logsExpanded,
    toggleLogs,
    confirmDeploy,
    closePanel,
    goToPreview,
    editWithAI,
    openAIHelp,
    retryDeployment,
    viewLogs,
  };
}
