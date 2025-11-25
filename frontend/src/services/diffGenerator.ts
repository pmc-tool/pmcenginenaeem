/**
 * Diff Generator Service
 * Feature: 003-ai-coding-mode
 * Uses Myers' diff algorithm via diff library
 * Source: research.md
 */

import * as Diff from 'diff';
import type { DiffChange, DiffResult } from '../types/code';

/**
 * Generate line-by-line diff between old and new code
 * Uses Myers' diff algorithm (via diff library)
 * Performance target: <500ms for 1000-line files
 */
export function generateDiff(oldCode: string, newCode: string): DiffResult {
  const diffResult = Diff.diffLines(oldCode, newCode);

  const oldLines: string[] = [];
  const newLines: string[] = [];
  const changes: DiffChange[] = [];

  let oldLineNumber = 1;
  let newLineNumber = 1;
  let totalAdded = 0;
  let totalRemoved = 0;
  let totalModified = 0;

  diffResult.forEach((part) => {
    // Split by newline but keep empty lines
    const lines = part.value.split('\n');

    // Remove last empty line if the part ends with newline
    if (lines[lines.length - 1] === '') {
      lines.pop();
    }

    if (part.added) {
      // Lines added in new code
      lines.forEach((line) => {
        newLines.push(line);
        changes.push({
          lineNumber: newLineNumber++,
          type: 'addition',
          oldContent: null,
          newContent: line,
        });
        totalAdded++;
      });
    } else if (part.removed) {
      // Lines removed from old code
      lines.forEach((line) => {
        oldLines.push(line);
        changes.push({
          lineNumber: oldLineNumber,
          type: 'deletion',
          oldContent: line,
          newContent: null,
        });
        oldLineNumber++;
        totalRemoved++;
      });
    } else {
      // Context lines (unchanged)
      lines.forEach((line) => {
        oldLines.push(line);
        newLines.push(line);
        changes.push({
          lineNumber: newLineNumber++,
          type: 'context',
          oldContent: line,
          newContent: line,
        });
        oldLineNumber++;
      });
    }
  });

  // Detect modifications (line removed followed by line added)
  for (let i = 0; i < changes.length - 1; i++) {
    const current = changes[i];
    const next = changes[i + 1];

    if (
      current.type === 'deletion' &&
      next.type === 'addition' &&
      current.oldContent !== null &&
      next.newContent !== null
    ) {
      // Mark as modification instead of separate deletion + addition
      changes[i] = {
        ...current,
        type: 'modification',
        newContent: next.newContent,
      };

      // Remove the next addition since it's now part of modification
      changes.splice(i + 1, 1);

      totalModified++;
      totalAdded--;
      totalRemoved--;
    }
  }

  return {
    oldLines,
    newLines,
    changes,
    totalAdded,
    totalRemoved,
    totalModified,
  };
}

/**
 * Generate plain-language summary of changes
 * Implements FR-019: explain what changed
 */
export function generateChangeSummary(changes: DiffChange[], targetName: string): string {
  const additions = changes.filter((c) => c.type === 'addition').length;
  const deletions = changes.filter((c) => c.type === 'deletion').length;
  const modifications = changes.filter((c) => c.type === 'modification').length;

  const parts: string[] = [];

  if (modifications > 0) {
    parts.push(`${modifications} line${modifications > 1 ? 's' : ''} modified`);
  }
  if (additions > 0) {
    parts.push(`${additions} line${additions > 1 ? 's' : ''} added`);
  }
  if (deletions > 0) {
    parts.push(`${deletions} line${deletions > 1 ? 's' : ''} removed`);
  }

  if (parts.length === 0) {
    return `No changes to ${targetName}`;
  }

  const summary = parts.join(', ');
  return `${targetName}: ${summary}`;
}

/**
 * Extract specific changed lines for highlighting
 * Used to update CodePanelState.highlightedRanges
 */
export function extractHighlightedRanges(
  changes: DiffChange[]
): Array<{ startLine: number; endLine: number; type: 'addition' | 'deletion' | 'modification' }> {
  const ranges: Array<{ startLine: number; endLine: number; type: 'addition' | 'deletion' | 'modification' }> = [];

  let currentRange: { startLine: number; endLine: number; type: 'addition' | 'deletion' | 'modification' } | null =
    null;

  changes.forEach((change) => {
    if (change.type === 'context') {
      // End current range if exists
      if (currentRange) {
        ranges.push(currentRange);
        currentRange = null;
      }
      return;
    }

    const changeType = change.type as 'addition' | 'deletion' | 'modification';

    if (currentRange && currentRange.type === changeType && change.lineNumber === currentRange.endLine + 1) {
      // Extend current range
      currentRange.endLine = change.lineNumber;
    } else {
      // Start new range
      if (currentRange) {
        ranges.push(currentRange);
      }
      currentRange = {
        startLine: change.lineNumber,
        endLine: change.lineNumber,
        type: changeType,
      };
    }
  });

  // Push final range
  if (currentRange) {
    ranges.push(currentRange);
  }

  return ranges;
}
