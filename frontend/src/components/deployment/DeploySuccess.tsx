/**
 * DeploySuccess Component
 *
 * Success state UI shown after successful deployment.
 * Extracted from DeployPanel for better separation of concerns.
 */

import React from 'react';

export interface DeploySuccessProps {
  /**
   * Callback when "Go to Preview" is clicked
   */
  onGoToPreview: () => void;

  /**
   * Callback when "Edit with AI" is clicked
   */
  onEditWithAI: () => void;
}

export const DeploySuccess: React.FC<DeploySuccessProps> = ({
  onGoToPreview,
  onEditWithAI,
}) => {
  return (
    <div className="deploy-panel__success">
      <p className="deploy-panel__success-message">
        Your site is live in Preview mode. You can now explore and edit it.
      </p>

      <div className="deploy-panel__success-actions">
        <button
          className="deploy-panel__btn deploy-panel__btn--primary"
          onClick={onGoToPreview}
        >
          Go to Preview
        </button>
        <button
          className="deploy-panel__btn deploy-panel__btn--secondary deploy-panel__btn--ai"
          onClick={onEditWithAI}
          title="Edit your site with AI assistance"
        >
          <span className="deploy-panel__btn-icon" aria-hidden="true">
            ✨
          </span>
          Edit with AI
        </button>
      </div>
    </div>
  );
};
