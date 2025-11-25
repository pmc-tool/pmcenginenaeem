/**
 * DiffControls Component
 * Feature: 003-ai-coding-mode
 * Accept/Reject buttons for diff preview
 * Implements FR-009 from spec.md
 */

import { useCodeStore } from '../../store/codeStore';
import type { DiffStatus } from '../../types/code';
import './DiffControls.css';

export interface DiffControlsProps {
  diffId: string;
  isValid: boolean;
  status: DiffStatus;
}

export function DiffControls({ diffId, isValid, status }: DiffControlsProps) {
  const acceptDiff = useCodeStore((state) => state.acceptDiff);
  const rejectDiff = useCodeStore((state) => state.rejectDiff);

  const handleAccept = () => {
    if (isValid && status === 'pending') {
      acceptDiff(diffId);
    }
  };

  const handleReject = () => {
    if (status === 'pending') {
      rejectDiff(diffId);
    }
  };

  // If already responded, show status
  if (status === 'accepted') {
    return (
      <div className="diff-controls diff-controls--accepted" role="status">
        <span className="diff-controls__status-icon" aria-hidden="true">✓</span>
        <span className="diff-controls__status-text">
          Changes accepted and applied
        </span>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="diff-controls diff-controls--rejected" role="status">
        <span className="diff-controls__status-icon" aria-hidden="true">✕</span>
        <span className="diff-controls__status-text">
          Changes rejected
        </span>
      </div>
    );
  }

  // Pending status - show action buttons
  return (
    <div className="diff-controls" role="group" aria-label="Diff actions">
      {!isValid && (
        <p className="diff-controls__warning" role="alert">
          <span aria-hidden="true">⚠️</span>
          Cannot accept changes - validation errors must be fixed first
        </p>
      )}

      <div className="diff-controls__buttons">
        <button
          type="button"
          className="diff-controls__button diff-controls__button--reject"
          onClick={handleReject}
          aria-label="Reject changes"
        >
          <span className="diff-controls__button-icon" aria-hidden="true">✕</span>
          Reject
        </button>

        <button
          type="button"
          className="diff-controls__button diff-controls__button--accept"
          onClick={handleAccept}
          disabled={!isValid}
          aria-label={isValid ? 'Accept and apply changes' : 'Accept disabled - validation errors exist'}
        >
          <span className="diff-controls__button-icon" aria-hidden="true">✓</span>
          Accept & Apply
        </button>
      </div>

      <p className="diff-controls__hint">
        Review the changes carefully before accepting. You can undo after applying.
      </p>
    </div>
  );
}
