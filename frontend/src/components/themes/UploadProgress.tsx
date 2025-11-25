/**
 * UploadProgress - Progress indicator for theme upload
 * Feature: 006-themes-and-deploy (US2)
 *
 * Shows upload progress, validation state, and errors
 */

import React from 'react';
import type { UploadSession } from '../../types';
import './UploadProgress.css';

interface UploadProgressProps {
  session: UploadSession;
  onCancel?: (sessionId: string) => void;
  onRetry?: (sessionId: string) => void;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  session,
  onCancel,
  onRetry,
}) => {
  const getStatusText = () => {
    switch (session.validationState) {
      case 'pending':
        return 'Preparing upload...';
      case 'validating':
        return 'Validating theme files...';
      case 'success':
        return 'Upload complete!';
      case 'error':
        return 'Upload failed';
      default:
        return 'Uploading...';
    }
  };

  const getStatusIcon = () => {
    switch (session.validationState) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'validating':
        return '⟳';
      default:
        return '↑';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isInProgress = session.validationState === 'pending' || session.validationState === 'validating';
  const isComplete = session.validationState === 'success';
  const hasError = session.validationState === 'error';

  return (
    <div className={`upload-progress upload-progress--${session.validationState}`}>
      <div className="upload-progress__header">
        <div className="upload-progress__icon">{getStatusIcon()}</div>
        <div className="upload-progress__info">
          <div className="upload-progress__filename">{session.fileName}</div>
          <div className="upload-progress__status">{getStatusText()}</div>
        </div>
        <div className="upload-progress__size">{formatFileSize(session.fileSizeBytes)}</div>
      </div>

      {isInProgress && (
        <div className="upload-progress__bar-container">
          <div
            className="upload-progress__bar"
            style={{ width: `${session.progressPercent}%` }}
          />
        </div>
      )}

      {hasError && session.errorMessage && (
        <div className="upload-progress__error">
          <span className="upload-progress__error-message">{session.errorMessage}</span>
        </div>
      )}

      <div className="upload-progress__actions">
        {isInProgress && onCancel && (
          <button
            className="upload-progress__action-btn upload-progress__action-btn--cancel"
            onClick={() => onCancel(session.id)}
          >
            Cancel
          </button>
        )}

        {hasError && onRetry && (
          <button
            className="upload-progress__action-btn upload-progress__action-btn--retry"
            onClick={() => onRetry(session.id)}
          >
            Retry upload
          </button>
        )}

        {isComplete && (
          <span className="upload-progress__success-message">
            Theme ready to deploy
          </span>
        )}
      </div>
    </div>
  );
};
