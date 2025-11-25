/**
 * DeployConfirmation Component
 *
 * Confirmation dialog shown before starting deployment.
 * Extracted from DeployPanel for better separation of concerns.
 */

import React from 'react';
import { Modal } from '../ui/Modal';

export interface DeployConfirmationProps {
  /**
   * Is confirmation dialog open
   */
  isOpen: boolean;

  /**
   * Callback when user confirms deployment
   */
  onConfirm: () => void;

  /**
   * Callback when user cancels
   */
  onCancel: () => void;
}

export const DeployConfirmation: React.FC<DeployConfirmationProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Deploy this theme?"
      size="md"
      showCloseButton={false}
    >
      <div className="deploy-confirmation">
        <p className="deploy-confirmation__note">
          We'll deploy this theme as the base for your site. You can change content later.
        </p>

        <div className="deploy-confirmation__actions">
          <button
            className="deploy-panel__btn deploy-panel__btn--primary"
            onClick={onConfirm}
            autoFocus
          >
            Yes, deploy
          </button>
          <button
            className="deploy-panel__btn deploy-panel__btn--secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
