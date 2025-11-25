/**
 * DiffPreview Component
 * Feature: 003-ai-coding-mode
 * Side-by-side diff display with Monaco DiffEditor
 * Implements FR-007, FR-008, FR-019 from spec.md
 */

import { DiffEditor } from '@monaco-editor/react';
import { useCodeStore } from '../../store/codeStore';
import { DiffControls } from './DiffControls';
import type { DiffPreview as DiffPreviewType } from '../../types/code';
import './DiffPreview.css';

export interface DiffPreviewProps {
  diffId: string;
}

export function DiffPreview({ diffId }: DiffPreviewProps) {
  const diffPreviews = useCodeStore((state) => state.diffPreviews);
  const diff = diffPreviews[diffId];

  if (!diff) {
    return null;
  }

  return (
    <div className="diff-preview" role="region" aria-label="Code change preview">
      {/* Header with summary */}
      <div className="diff-preview__header">
        <div className="diff-preview__summary">
          <h3 className="diff-preview__title">Proposed Changes</h3>
          <p className="diff-preview__description">{diff.summary}</p>
        </div>

        {/* Validation status */}
        {!diff.isValid && (
          <div className="diff-preview__validation-error" role="alert">
            <span className="diff-preview__error-icon" aria-hidden="true">⚠️</span>
            <div className="diff-preview__error-content">
              <strong>Validation Failed</strong>
              {diff.validationErrors.map((error, index) => (
                <p key={index} className="diff-preview__error-message">
                  {error.line && `Line ${error.line}: `}
                  {error.message}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Diff statistics */}
      <div className="diff-preview__stats">
        <span className="diff-preview__stat diff-preview__stat--addition">
          +{diff.changes.filter((c) => c.type === 'addition').length} added
        </span>
        <span className="diff-preview__stat diff-preview__stat--deletion">
          -{diff.changes.filter((c) => c.type === 'deletion').length} removed
        </span>
        <span className="diff-preview__stat diff-preview__stat--modification">
          ~{diff.changes.filter((c) => c.type === 'modification').length} modified
        </span>
      </div>

      {/* Side-by-side diff editor */}
      <div className="diff-preview__editor">
        <DiffEditor
          height="400px"
          language="typescript"
          original={diff.oldCode}
          modified={diff.newCode}
          theme="vs-light"
          options={{
            readOnly: true,
            renderSideBySide: true,
            enableSplitViewResizing: false,
            renderOverviewRuler: false,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: 'on',
          }}
        />
      </div>

      {/* Plain-language explanation */}
      <div className="diff-preview__explanation">
        <h4 className="diff-preview__explanation-title">What's changing?</h4>
        <p className="diff-preview__explanation-text">
          {generateDetailedExplanation(diff)}
        </p>
      </div>

      {/* Accept/Reject controls */}
      <DiffControls
        diffId={diffId}
        isValid={diff.isValid}
        status={diff.status}
      />
    </div>
  );
}

/**
 * Generate detailed plain-language explanation of changes
 * Implements FR-019: plain-language explanations
 */
function generateDetailedExplanation(diff: DiffPreviewType): string {
  const { changes, scope } = diff;

  const additions = changes.filter((c) => c.type === 'addition');
  const deletions = changes.filter((c) => c.type === 'deletion');
  const modifications = changes.filter((c) => c.type === 'modification');

  const parts: string[] = [];

  if (modifications.length > 0) {
    parts.push(
      `${modifications.length} line${modifications.length > 1 ? 's were' : ' was'} modified in ${scope.targetName}`
    );
  }

  if (additions.length > 0) {
    parts.push(
      `${additions.length} new line${additions.length > 1 ? 's were' : ' was'} added`
    );
  }

  if (deletions.length > 0) {
    parts.push(
      `${deletions.length} line${deletions.length > 1 ? 's were' : ' was'} removed`
    );
  }

  if (parts.length === 0) {
    return `No changes detected in ${scope.targetName}.`;
  }

  const explanation = parts.join(', ');
  return `${explanation}. The changes affect the file "${scope.filePath}".`;
}
