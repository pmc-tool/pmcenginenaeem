/**
 * Diff Utility Helpers
 * Feature: 003-ai-coding-mode
 * Helper functions for diff processing and display
 */

import type { DiffChange, DiffResult } from '../types/code';

/**
 * Count total lines added across all changes
 */
export function countAddedLines(changes: DiffChange[]): number {
  return changes.filter((c) => c.type === 'addition').length;
}

/**
 * Count total lines removed across all changes
 */
export function countRemovedLines(changes: DiffChange[]): number {
  return changes.filter((c) => c.type === 'deletion').length;
}

/**
 * Count total lines modified across all changes
 */
export function countModifiedLines(changes: DiffChange[]): number {
  return changes.filter((c) => c.type === 'modification').length;
}

/**
 * Extract only changed lines (excluding context)
 */
export function extractChangedLines(changes: DiffChange[]): DiffChange[] {
  return changes.filter((c) => c.type !== 'context');
}

/**
 * Get specific line from code by line number
 */
export function getLine(code: string, lineNumber: number): string | null {
  const lines = code.split('\n');
  if (lineNumber < 1 || lineNumber > lines.length) {
    return null;
  }
  return lines[lineNumber - 1];
}

/**
 * Get line range from code
 */
export function getLineRange(code: string, startLine: number, endLine: number): string[] {
  const lines = code.split('\n');
  return lines.slice(startLine - 1, endLine);
}

/**
 * Calculate diff statistics
 */
export function calculateDiffStats(result: DiffResult): {
  totalLines: number;
  changedLines: number;
  changePercentage: number;
} {
  const totalLines = result.oldLines.length;
  const changedLines = result.totalAdded + result.totalRemoved + result.totalModified;
  const changePercentage = totalLines > 0 ? (changedLines / totalLines) * 100 : 0;

  return {
    totalLines,
    changedLines,
    changePercentage: Math.round(changePercentage * 10) / 10, // Round to 1 decimal
  };
}

/**
 * Format diff change for display
 */
export function formatDiffChange(change: DiffChange): string {
  const prefix = {
    addition: '+ ',
    deletion: '- ',
    modification: '~ ',
    context: '  ',
  }[change.type];

  const content = change.newContent ?? change.oldContent ?? '';
  return `${prefix}${content}`;
}

/**
 * Check if diff is within size limits (max 500 changed lines per plan.md)
 */
export function isDiffWithinLimits(changes: DiffChange[]): boolean {
  const changedLines = extractChangedLines(changes);
  return changedLines.length <= 500;
}

/**
 * Group consecutive changes of same type into ranges
 */
export function groupChangesIntoRanges(changes: DiffChange[]): Array<{
  type: DiffChange['type'];
  startLine: number;
  endLine: number;
  lines: string[];
}> {
  const ranges: Array<{
    type: DiffChange['type'];
    startLine: number;
    endLine: number;
    lines: string[];
  }> = [];

  let currentRange: {
    type: DiffChange['type'];
    startLine: number;
    endLine: number;
    lines: string[];
  } | null = null;

  changes.forEach((change) => {
    const content = change.newContent ?? change.oldContent ?? '';

    if (currentRange && currentRange.type === change.type && change.lineNumber === currentRange.endLine + 1) {
      // Extend current range
      currentRange.endLine = change.lineNumber;
      currentRange.lines.push(content);
    } else {
      // Start new range
      if (currentRange) {
        ranges.push(currentRange);
      }
      currentRange = {
        type: change.type,
        startLine: change.lineNumber,
        endLine: change.lineNumber,
        lines: [content],
      };
    }
  });

  // Push final range
  if (currentRange) {
    ranges.push(currentRange);
  }

  return ranges;
}

/**
 * Truncate diff if too large for display
 */
export function truncateDiff(changes: DiffChange[], maxChanges: number = 100): {
  truncated: DiffChange[];
  isTruncated: boolean;
  originalCount: number;
} {
  const changedLines = extractChangedLines(changes);

  if (changedLines.length <= maxChanges) {
    return {
      truncated: changes,
      isTruncated: false,
      originalCount: changedLines.length,
    };
  }

  // Keep first maxChanges/2 and last maxChanges/2
  const firstHalf = Math.floor(maxChanges / 2);
  const secondHalf = maxChanges - firstHalf;

  const truncated = [
    ...changes.slice(0, firstHalf),
    {
      lineNumber: 0,
      type: 'context' as const,
      oldContent: `... ${changedLines.length - maxChanges} more changes ...`,
      newContent: `... ${changedLines.length - maxChanges} more changes ...`,
    },
    ...changes.slice(-secondHalf),
  ];

  return {
    truncated,
    isTruncated: true,
    originalCount: changedLines.length,
  };
}
