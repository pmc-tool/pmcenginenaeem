/**
 * DeployPanel - Main deployment UI panel
 * Feature: 006-themes-and-deploy (US3)
 *
 * Shows deployment progress with:
 * - Step-by-step status
 * - Terminal logs (collapsible)
 * - Success/error states
 * - Integration with Chat for errors
 * - Ultra-fast 3.5-second deployment flow
 */

import React, { useEffect } from 'react';
import { useDeploymentStore } from '../../store/deploymentStore';
import { useThemesStore } from '../../store/themesStore';
import { useDashboardStore } from '../../store/dashboardStore';
import { deploymentService } from '../../services/deploymentService';
import { DeploymentSteps } from './DeploymentSteps';
import { TerminalLog } from './TerminalLog';
import { DeploymentError } from './DeploymentError';
import './DeployPanel.css';

interface DeployPanelProps {
  themeId: string;
  siteId: string;
  userId: string;
}

export const DeployPanel: React.FC<DeployPanelProps> = ({ themeId, siteId, userId }) => {
  const session = useDeploymentStore((state) => state.getSessionBySite(siteId));
  const updateSession = useDeploymentStore((state) => state.updateSession);
  const createSession = useDeploymentStore((state) => state.createSession);
  const closeDeployPanel = useDeploymentStore((state) => state.closeDeployPanel);
  const updateTheme = useThemesStore((state) => state.updateTheme);
  const togglePreviewMode = useDashboardStore((state) => state.togglePreviewMode);
  const toggleChat = useDashboardStore((state) => state.toggleChat);

  const [showConfirmation, setShowConfirmation] = React.useState(true);
  const [logsExpanded, setLogsExpanded] = React.useState(false);

  // Start deployment when component mounts (after confirmation)
  useEffect(() => {
    if (!session) {
      // Session will be created when user confirms
      return;
    }

    // If session exists and is in_progress, it's already running
    if (session.finalState === 'in_progress') {
      return;
    }
  }, [session]);

  const handleConfirmDeploy = async () => {
    setShowConfirmation(false);

    // Update theme status to deploying
    updateTheme(themeId, { deploymentStatus: 'deploying' });

    // Track if session has been created
    let sessionCreated = false;

    // Start deployment
    const finalSession = await deploymentService.mockDeployment(themeId, siteId, userId, (updatedSession) => {
      // Update session in store on each progress callback
      // Check if session exists by querying the store directly instead of using stale closure
      const existingSession = useDeploymentStore.getState().getSessionBySite(siteId);

      if (existingSession || sessionCreated) {
        updateSession(siteId, updatedSession);
      } else {
        createSession(updatedSession);
        sessionCreated = true;
      }
    });

    // Update theme status based on final state
    if (finalSession.finalState === 'failed') {
      updateTheme(themeId, { deploymentStatus: 'failed' });
    } else if (finalSession.finalState === 'success') {
      updateTheme(themeId, { deploymentStatus: 'active' });
    }
  };

  const handleClose = () => {
    closeDeployPanel();
  };

  const handleGoToPreview = () => {
    // Update theme to active status
    updateTheme(themeId, { deploymentStatus: 'active' });

    // Switch to preview mode
    togglePreviewMode();

    // Close deploy panel
    closeDeployPanel();
  };

  const handleEditWithAI = () => {
    const store = useDashboardStore.getState();

    // Close deploy panel
    closeDeployPanel();

    // Close AI Training panel if open to prevent conflicts
    if (store.shell.isAITrainingOpen) {
      store.setAITrainingOpen(false);
    }

    // Set chat tab active in left rail
    store.setActiveLeftRailTab('chat');

    // Open chat panel if not already open
    if (!store.chat.isOpen) {
      toggleChat();
    }

    // Wait for chat to open, then simulate sending "demo code" for AI coding mode
    setTimeout(() => {
      const chatInput = document.querySelector('textarea[aria-label="Chat message input"]') as HTMLTextAreaElement;
      if (chatInput) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value'
        )?.set;

        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(chatInput, 'demo code');

          const inputEvent = new Event('input', { bubbles: true });
          chatInput.dispatchEvent(inputEvent);

          const changeEvent = new Event('change', { bubbles: true });
          chatInput.dispatchEvent(changeEvent);

          chatInput.focus();

          setTimeout(() => {
            const sendButton = document.querySelector('button[aria-label="Send message"]') as HTMLButtonElement;
            if (sendButton && !sendButton.disabled) {
              sendButton.click();
            }
          }, 150);
        }
      }
    }, 400);
  };

  const handleOpenAIHelp = () => {
    const store = useDashboardStore.getState();

    // Close deploy panel first
    closeDeployPanel();

    // Close AI Training panel if open to prevent conflicts
    if (store.shell.isAITrainingOpen) {
      store.setAITrainingOpen(false);
    }

    // Set chat tab active in left rail
    store.setActiveLeftRailTab('chat');

    // Open chat panel if not already open
    if (!store.chat.isOpen) {
      toggleChat();
    }

    // Wait for chat to open, then simulate sending "demo code"
    setTimeout(() => {
      // Find the chat input textarea and set its value
      const chatInput = document.querySelector('textarea[aria-label="Chat message input"]') as HTMLTextAreaElement;
      if (chatInput) {
        // Create a native setter to bypass React's value control
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value'
        )?.set;

        if (nativeInputValueSetter) {
          // Set the value using the native setter
          nativeInputValueSetter.call(chatInput, 'demo code');

          // Trigger both input and change events for React to detect the change
          const inputEvent = new Event('input', { bubbles: true });
          chatInput.dispatchEvent(inputEvent);

          const changeEvent = new Event('change', { bubbles: true });
          chatInput.dispatchEvent(changeEvent);

          // Focus the input
          chatInput.focus();

          // Find and click the send button after React state updates
          setTimeout(() => {
            const sendButton = document.querySelector('button[aria-label="Send message"]') as HTMLButtonElement;
            if (sendButton && !sendButton.disabled) {
              sendButton.click();
            }
          }, 150);
        }
      }
    }, 400);
  };

  const handleRetryDeployment = async () => {
    // Reset to in_progress state
    setShowConfirmation(false);

    // Update theme status to deploying
    updateTheme(themeId, { deploymentStatus: 'deploying' });

    // Track if session has been created
    let sessionCreated = false;

    // Start deployment again
    const finalSession = await deploymentService.mockDeployment(themeId, siteId, userId, (updatedSession) => {
      // Check if session exists by querying the store directly instead of using stale closure
      const existingSession = useDeploymentStore.getState().getSessionBySite(siteId);

      if (existingSession || sessionCreated) {
        updateSession(siteId, updatedSession);
      } else {
        createSession(updatedSession);
        sessionCreated = true;
      }
    });

    // Update theme status based on final state
    if (finalSession.finalState === 'failed') {
      updateTheme(themeId, { deploymentStatus: 'failed' });
    } else if (finalSession.finalState === 'success') {
      updateTheme(themeId, { deploymentStatus: 'active' });
    }
  };

  const handleViewLogs = () => {
    // Expand logs
    setLogsExpanded(true);
  };

  // Show confirmation before starting deployment
  if (showConfirmation) {
    return (
      <>
        {/* Overlay backdrop */}
        <div className="deploy-panel-overlay" onClick={handleClose} aria-hidden="true" />

        <div className="deploy-panel deploy-panel--confirmation">
          <div className="deploy-panel__confirmation-content">
            <h2 className="deploy-panel__title">Deploy this theme?</h2>
            <p className="deploy-panel__confirmation-note">
              We'll deploy this theme as the base for your site. You can change content later.
            </p>
            <div className="deploy-panel__confirmation-actions">
              <button
                className="deploy-panel__btn deploy-panel__btn--primary"
                onClick={handleConfirmDeploy}
              >
                Yes, deploy
              </button>
              <button
                className="deploy-panel__btn deploy-panel__btn--secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    return null;
  }

  const isInProgress = session.finalState === 'in_progress';
  const isSuccess = session.finalState === 'success';
  const isFailed = session.finalState === 'failed';

  return (
    <>
      {/* Overlay backdrop */}
      <div className="deploy-panel-overlay" aria-hidden="true" />

      <aside
        className="deploy-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="deploy-panel-title"
        tabIndex={-1}
      >
        <div className="deploy-panel__header">
          <h2 className="deploy-panel__title" id="deploy-panel-title">
            {isInProgress && 'Setting up your site'}
            {isSuccess && 'Your site is live!'}
            {isFailed && 'Deployment failed'}
          </h2>
          <button
            className="deploy-panel__close-btn"
            onClick={handleClose}
            aria-label="Minimize deployment panel"
            title={isInProgress ? 'Minimize (deployment continues in background)' : 'Close'}
          >
            ✕
          </button>
        </div>

        <div className="deploy-panel__content">
          {/* Live region for status announcements */}
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {isInProgress && `Deployment in progress: ${session.currentStep}`}
            {isSuccess && 'Deployment completed successfully'}
            {isFailed && 'Deployment failed'}
          </div>

          {/* Step progress */}
          <DeploymentSteps steps={session.steps} currentStep={session.currentStep} />

          {/* Terminal logs */}
          <TerminalLog
            logs={session.buildLogs}
            expanded={logsExpanded}
            onToggle={() => setLogsExpanded(!logsExpanded)}
            autoExpand={isFailed}
          />

          {/* Success state */}
          {isSuccess && (
            <div className="deploy-panel__success">
              <p className="deploy-panel__success-message">
                Your site is live in Preview mode. You can now explore and edit it.
              </p>
              <div className="deploy-panel__success-actions">
                <button
                  className="deploy-panel__btn deploy-panel__btn--primary"
                  onClick={handleGoToPreview}
                >
                  Go to Preview
                </button>
                <button
                  className="deploy-panel__btn deploy-panel__btn--secondary deploy-panel__btn--ai"
                  onClick={handleEditWithAI}
                  title="Edit your site with AI assistance"
                >
                  <span className="deploy-panel__btn-icon" aria-hidden="true">✨</span>
                  Edit with AI
                </button>
              </div>
            </div>
          )}

          {/* Error state */}
          {isFailed && session.errorDetails && (
            <DeploymentError
              error={session.errorDetails}
              buildLogs={session.buildLogs}
              onOpenChat={handleOpenAIHelp}
              onRetry={handleRetryDeployment}
              onViewLogs={handleViewLogs}
            />
          )}
        </div>
      </aside>
    </>
  );
};
