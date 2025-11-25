/**
 * DeploymentNotification - Bottom notification bar for minimized deployment
 * Feature: 006-themes-and-deploy
 *
 * Shows deployment progress when panel is minimized
 * Clickable to reopen the deployment panel
 */

import React from 'react';
import type { DeploymentSession } from '../../types';
import './DeploymentNotification.css';

interface DeploymentNotificationProps {
  session: DeploymentSession;
  onOpen: () => void;
}

export const DeploymentNotification: React.FC<DeploymentNotificationProps> = ({
  session,
  onOpen,
}) => {
  const isInProgress = session.finalState === 'in_progress';
  const isSuccess = session.finalState === 'success';
  const isFailed = session.finalState === 'failed';

  // Don't show if deployment is complete and successful
  if (isSuccess) {
    return null;
  }

  const getStatusText = () => {
    if (isInProgress) {
      const stepLabels: Record<string, string> = {
        detecting_stack: 'Detecting tech stack',
        preparing_env: 'Preparing environment',
        building: 'Building your site',
        deploying: 'Deploying',
        done: 'Finalizing',
      };
      return stepLabels[session.currentStep] || session.currentStep;
    }
    if (isFailed) {
      return 'Deployment failed';
    }
    return 'Deployment complete';
  };

  const getIcon = () => {
    if (isInProgress) {
      return (
        <div className="deployment-notification__spinner">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
            <path d="M14 8a6 6 0 0 1-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      );
    }
    if (isFailed) {
      return <span className="deployment-notification__icon deployment-notification__icon--error">⚠️</span>;
    }
    return <span className="deployment-notification__icon deployment-notification__icon--success">✓</span>;
  };

  return (
    <div
      className={`deployment-notification ${
        isFailed ? 'deployment-notification--error' : ''
      } ${isInProgress ? 'deployment-notification--progress' : ''}`}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      {getIcon()}
      <span className="deployment-notification__text">{getStatusText()}</span>
      <span className="deployment-notification__action">Click to {isFailed ? 'view details' : 'view'}</span>
    </div>
  );
};
