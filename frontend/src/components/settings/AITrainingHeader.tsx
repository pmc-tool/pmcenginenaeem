/**
 * AITrainingHeader Component
 *
 * Header for AI Training Panel with save/discard actions.
 * Extracted from AITrainingPanel for better separation of concerns.
 */

import React from 'react';
import { ErrorState } from '../ui';

export interface AITrainingHeaderProps {
  /**
   * Completion status text (e.g., "3/6 sections complete")
   */
  completionStatus: string;

  /**
   * Has unsaved changes
   */
  isDirty: boolean;

  /**
   * Is currently saving
   */
  isSaving: boolean;

  /**
   * Last save error (if any)
   */
  lastSaveError: string | null;

  /**
   * Callback when save is clicked
   */
  onSave: () => void;

  /**
   * Callback when discard is clicked
   */
  onDiscard: () => void;

  /**
   * Callback when error is dismissed
   */
  onClearError: () => void;
}

export const AITrainingHeader: React.FC<AITrainingHeaderProps> = ({
  completionStatus,
  isDirty,
  isSaving,
  lastSaveError,
  onSave,
  onDiscard,
  onClearError,
}) => {
  return (
    <header className="training-header">
      <div className="training-header__info">
        <h1>AI Training</h1>
        <p>Help AI understand your brand and business</p>
        <span className="completion-badge">{completionStatus}</span>
      </div>

      <div className="training-header__actions">
        {lastSaveError && (
          <div className="save-error">
            <span>{lastSaveError}</span>
            <button
              onClick={onClearError}
              className="btn-clear-error"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <button
          onClick={onDiscard}
          disabled={!isDirty || isSaving}
          className="btn btn--secondary"
        >
          Discard Changes
        </button>

        <button
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className="btn btn--primary"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </header>
  );
};
