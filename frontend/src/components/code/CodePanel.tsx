/**
 * CodePanel Component
 * Feature: 003-ai-coding-mode
 * Main container for read-only Code Panel with CodeViewer integration
 * Implements User Story 1 from spec.md
 */

import { useEffect } from 'react';
import { useCodeStore } from '../../store/codeStore';
import { useCodeStreaming } from '../../hooks/useCodeStreaming';
import { CodeViewer } from './CodeViewer';
import { DiffPreview } from './DiffPreview';
import { StreamingIndicator } from './StreamingIndicator';
import { FileIcon } from './vscodeIcons';
import './CodePanel.css';

export function CodePanel() {
  const {
    codePanel,
    activeDiffId,
    isStreaming,
    streamingProgress,
    setCodePanelVisibility,
    updateCurrentCode,
    canUndo,
    canRedo,
    performUndo,
    performRedo,
  } = useCodeStore();

  // Enable live code streaming
  useCodeStreaming();

  const handleClose = () => {
    setCodePanelVisibility(false);
  };

  const handleCodeChange = (newCode: string) => {
    updateCurrentCode(newCode);
  };

  // Keyboard shortcuts for Undo/Redo (T072 from Phase 10)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Z / Ctrl+Z for Undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          performUndo();
        }
      }

      // Cmd+Shift+Z / Ctrl+Shift+Z for Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        if (canRedo) {
          performRedo();
        }
      }
    };

    if (codePanel.isVisible) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [codePanel.isVisible, canUndo, canRedo, performUndo, performRedo]);

  if (!codePanel.isVisible) {
    return null;
  }

  return (
    <aside
      className="code-panel"
      role="complementary"
      aria-label="Code Panel"
      aria-describedby="code-panel-description"
    >
      <div id="code-panel-description" className="sr-only">
        Code editor for the current page. You can edit code directly with a warning.
      </div>

      {/* Header */}
      <div className="code-panel__header">
        <div className="code-panel__title">
          <span className="code-panel__icon" aria-hidden="true">
            {'</>'}
          </span>
          <h2 className="code-panel__heading">Code Editor</h2>
        </div>

        <div className="code-panel__actions">
          {/* Undo/Redo buttons */}
          <button
            type="button"
            className="code-panel__action-btn"
            onClick={performUndo}
            disabled={!canUndo}
            aria-label="Undo last change (Cmd+Z)"
            title="Undo (Cmd+Z)"
          >
            ↶
          </button>

          <button
            type="button"
            className="code-panel__action-btn"
            onClick={performRedo}
            disabled={!canRedo}
            aria-label="Redo last undone change (Cmd+Shift+Z)"
            title="Redo (Cmd+Shift+Z)"
          >
            ↷
          </button>

          <div className="code-panel__divider" aria-hidden="true" />

          <button
            type="button"
            className="code-panel__close-btn"
            onClick={handleClose}
            aria-label="Close Code Panel"
          >
            ✕
          </button>
        </div>
      </div>

      {/* File path info */}
      {codePanel.filePath && (
        <div className="code-panel__file-info">
          <FileIcon
            filename={codePanel.filePath.split('/').pop() || ''}
            className="code-panel__file-icon"
          />
          <span className="code-panel__file-path">{codePanel.filePath}</span>
          <span className="code-panel__language">{codePanel.language}</span>
        </div>
      )}

      {/* Code viewer or Diff preview */}
      <div className="code-panel__content">
        {activeDiffId ? (
          /* Show diff preview when there's an active diff (T028-T031) */
          <DiffPreview diffId={activeDiffId} />
        ) : codePanel.currentCode ? (
          /* Show normal code viewer when no diff is active */
          <CodeViewer
            code={codePanel.currentCode}
            language={codePanel.language}
            highlightedRanges={codePanel.highlightedRanges}
            onChange={handleCodeChange}
          />
        ) : (
          /* Empty state */
          <div className="code-panel__empty">
            <p className="code-panel__empty-icon" aria-hidden="true">
              {'</>'}
            </p>
            <p className="code-panel__empty-text">No code to display</p>
            <p className="code-panel__empty-hint">
              Select a file from the explorer or ask me to generate code in Chat
            </p>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="code-panel__status">
        <span className="code-panel__status-item">
          {codePanel.currentCode.split('\n').length} lines
        </span>
        {codePanel.selectedLineStart !== null && (
          <span className="code-panel__status-item">
            Line {codePanel.selectedLineStart}
            {codePanel.selectedLineEnd !== codePanel.selectedLineStart &&
              `-${codePanel.selectedLineEnd}`}
          </span>
        )}
        {codePanel.isDirty && (
          <span className="code-panel__status-item code-panel__status-item--warning">
            Pending changes
          </span>
        )}
      </div>

      {/* Streaming Indicator */}
      <StreamingIndicator />
    </aside>
  );
}
