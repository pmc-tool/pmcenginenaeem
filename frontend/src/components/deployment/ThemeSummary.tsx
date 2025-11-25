/**
 * ThemeSummary - Inspector panel view after successful deployment
 * Feature: 006-themes-and-deploy (US3)
 *
 * Shows:
 * - Active theme name and thumbnail
 * - Quick action links
 * - Deployment metadata
 */

import React from 'react';
import type { ThemeSummary as ThemeSummaryType, QuickAction } from '../../types';

interface ThemeSummaryProps {
  summary: ThemeSummaryType;
}

export const ThemeSummary: React.FC<ThemeSummaryProps> = ({ summary }) => {
  const handleQuickAction = (action: QuickAction) => {
    if (action.action === 'navigate') {
      // TODO: Implement navigation to target path
      console.log('Navigate to:', action.target);
    } else if (action.action === 'command') {
      // TODO: Execute command
      console.log('Execute command:', action.target);
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="theme-summary" style={summaryStyles.container}>
      <h3 style={summaryStyles.title}>Active Theme</h3>

      {summary.activeThemeThumbnail && (
        <div style={summaryStyles.thumbnail}>
          <img
            src={summary.activeThemeThumbnail}
            alt={summary.activeThemeName}
            style={summaryStyles.thumbnailImage}
          />
        </div>
      )}

      <div style={summaryStyles.name}>{summary.activeThemeName}</div>

      <div style={summaryStyles.meta}>
        <div style={summaryStyles.metaItem}>
          <span style={summaryStyles.metaLabel}>Deployed:</span>
          <span style={summaryStyles.metaValue}>
            {new Date(summary.deployedAt).toLocaleDateString()}
          </span>
        </div>
        <div style={summaryStyles.metaItem}>
          <span style={summaryStyles.metaLabel}>Duration:</span>
          <span style={summaryStyles.metaValue}>
            {formatDuration(summary.deploymentDuration)}
          </span>
        </div>
      </div>

      <div style={summaryStyles.quickActions}>
        <div style={summaryStyles.quickActionsTitle}>Quick Actions</div>
        {summary.quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleQuickAction(action)}
            style={summaryStyles.quickActionButton}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Inline styles for MVP
const summaryStyles = {
  container: {
    padding: '16px',
    borderRadius: '8px',
    background: 'var(--color-surface, #ffffff)',
    border: '1px solid var(--color-border, #e5e7eb)',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-text-primary, #111827)',
    margin: '0 0 16px 0',
  },
  thumbnail: {
    width: '100%',
    height: '120px',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '12px',
    background: 'var(--color-canvas-bg, #f9fafb)',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  name: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-text-primary, #111827)',
    marginBottom: '12px',
  },
  meta: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--color-border, #e5e7eb)',
  },
  metaItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  metaLabel: {
    color: 'var(--color-text-secondary, #6b7280)',
  },
  metaValue: {
    color: 'var(--color-text-primary, #111827)',
    fontWeight: 500,
  },
  quickActions: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  quickActionsTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-text-secondary, #6b7280)',
    marginBottom: '4px',
  },
  quickActionButton: {
    padding: '10px 14px',
    background: 'var(--color-button-secondary-bg, #f3f4f6)',
    border: '1px solid var(--color-border, #e5e7eb)',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--color-text-primary, #111827)',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.15s ease',
  },
};
