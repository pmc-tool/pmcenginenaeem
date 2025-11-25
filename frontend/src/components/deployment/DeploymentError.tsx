/**
 * DeploymentError - Error display with recovery options
 * Feature: 006-themes-and-deploy (US4)
 *
 * Shows error details and provides options to:
 * - Open Chat for AI troubleshooting
 * - View detailed logs
 * - Retry deployment
 */

import React from 'react';
import type { ErrorDetails } from '../../types';
import './DeploymentError.css';

interface DeploymentErrorProps {
  error: ErrorDetails;
  buildLogs: string[];
  onOpenChat: () => void;
  onRetry: () => void;
  onViewLogs: () => void;
}

export const DeploymentError: React.FC<DeploymentErrorProps> = ({
  error,
  buildLogs,
  onOpenChat,
  onRetry,
  onViewLogs,
}) => {
  const getStepLabel = (step: string) => {
    const labels: Record<string, string> = {
      detecting_stack: 'Detecting tech stack',
      preparing_env: 'Preparing build environment',
      building: 'Building your site',
      deploying: 'Deploying to PMC Engine',
    };
    return labels[step] || step;
  };

  return (
    <div className="deployment-error">
      <div className="deployment-error__header">
        <div className="deployment-error__icon">⚠️</div>
        <div className="deployment-error__title">Deployment failed</div>
      </div>

      <div className="deployment-error__content">
        <div className="deployment-error__step">
          Failed during: <strong>{getStepLabel(error.failingStep)}</strong>
        </div>

        <div className="deployment-error__message">
          {error.errorMessage}
        </div>

        {error.errorSnippet && (
          <div className="deployment-error__snippet">
            <div className="deployment-error__snippet-title">Error details:</div>
            <pre className="deployment-error__snippet-code">{error.errorSnippet}</pre>
          </div>
        )}

        {error.suggestedAction && (
          <div className="deployment-error__suggestion">
            <div className="deployment-error__suggestion-icon">💡</div>
            <div className="deployment-error__suggestion-text">
              {error.suggestedAction}
            </div>
          </div>
        )}
      </div>

      <div className="deployment-error__actions">
        <button
          className="deployment-error__action-btn deployment-error__action-btn--primary"
          onClick={onRetry}
        >
          Re-deploy
        </button>

        <button
          className="deployment-error__action-btn deployment-error__action-btn--ai"
          onClick={onOpenChat}
          title="Get AI help to fix this"
        >
          <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg
              className="deployment-error__ai-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0.5L14.59 8.41L22.5 11L14.59 13.59L12 21.5L9.41 13.59L1.5 11L9.41 8.41L12 0.5Z"/>
              <path d="M19 14L20.35 18.15L24.5 19.5L20.35 20.85L19 25L17.65 20.85L13.5 19.5L17.65 18.15L19 14Z" opacity="0.7"/>
            </svg>
            Fix with AI
          </span>
        </button>
      </div>

      <div className="deployment-error__help-text">
        Our AI can analyze the error logs and guide you through fixing common deployment issues.
      </div>
    </div>
  );
};
