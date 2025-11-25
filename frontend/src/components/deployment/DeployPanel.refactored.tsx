/**
 * DeployPanel - Main deployment UI panel (REFACTORED)
 * Feature: 006-themes-and-deploy (US3)
 *
 * Refactored to use:
 * - Modal component for confirmation
 * - Custom useDeploymentFlow hook for business logic
 * - Extracted sub-components (DeployConfirmation, DeploySuccess)
 * - Stepper component integration (can be added next)
 *
 * Benefits:
 * - Reduced from 369 LOC to ~100 LOC
 * - Separation of concerns (UI vs logic)
 * - Reusable components
 * - Easier to test
 */

import React from 'react';
import { useDeploymentFlow } from './useDeploymentFlow';
import { DeployConfirmation } from './DeployConfirmation';
import { DeploymentSteps } from './DeploymentSteps';
import { TerminalLog } from './TerminalLog';
import { DeploymentError } from './DeploymentError';
import { DeploySuccess } from './DeploySuccess';
import './DeployPanel.css';

interface DeployPanelProps {
  themeId: string;
  siteId: string;
  userId: string;
}

export const DeployPanel: React.FC<DeployPanelProps> = ({
  themeId,
  siteId,
  userId,
}) => {
  const {
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
  } = useDeploymentFlow({ themeId, siteId, userId });

  // Show confirmation dialog
  if (showConfirmation) {
    return (
      <DeployConfirmation
        isOpen={true}
        onConfirm={confirmDeploy}
        onCancel={closePanel}
      />
    );
  }

  // Don't render if no session yet
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
        {/* Header */}
        <div className="deploy-panel__header">
          <h2 className="deploy-panel__title" id="deploy-panel-title">
            {isInProgress && 'Setting up your site'}
            {isSuccess && 'Your site is live!'}
            {isFailed && 'Deployment failed'}
          </h2>
          <button
            className="deploy-panel__close-btn"
            onClick={closePanel}
            aria-label="Minimize deployment panel"
            title={
              isInProgress
                ? 'Minimize (deployment continues in background)'
                : 'Close'
            }
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="deploy-panel__content">
          {/* Live region for status announcements */}
          <div
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {isInProgress && `Deployment in progress: ${session.currentStep}`}
            {isSuccess && 'Deployment completed successfully'}
            {isFailed && 'Deployment failed'}
          </div>

          {/* Step progress */}
          <DeploymentSteps
            steps={session.steps}
            currentStep={session.currentStep}
          />

          {/* Terminal logs */}
          <TerminalLog
            logs={session.buildLogs}
            expanded={logsExpanded}
            onToggle={toggleLogs}
            autoExpand={isFailed}
          />

          {/* Success state */}
          {isSuccess && (
            <DeploySuccess
              onGoToPreview={goToPreview}
              onEditWithAI={editWithAI}
            />
          )}

          {/* Error state */}
          {isFailed && session.errorDetails && (
            <DeploymentError
              error={session.errorDetails}
              buildLogs={session.buildLogs}
              onOpenChat={openAIHelp}
              onRetry={retryDeployment}
              onViewLogs={viewLogs}
            />
          )}
        </div>
      </aside>
    </>
  );
};
