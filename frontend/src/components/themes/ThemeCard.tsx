/**
 * ThemeCard - Individual theme display card
 * Feature: 006-themes-and-deploy (US1)
 */

import React from 'react';
import type { Theme } from '../../types';
import './ThemeCard.css';

interface ThemeCardProps {
  theme: Theme;
  onDeploy?: (themeId: string) => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme, onDeploy }) => {
  const isActive = theme.deploymentStatus === 'active';
  const isDeploying = theme.deploymentStatus === 'deploying';
  const isFailed = theme.deploymentStatus === 'failed';

  const handleDeployClick = () => {
    if (onDeploy && !isDeploying) {
      onDeploy(theme.id);
    }
  };

  return (
    <article
      className={`theme-card ${isActive ? 'theme-card--active' : ''}`}
      aria-label={`${theme.name} theme`}
    >
      {theme.thumbnailUrl && (
        <div className="theme-card__thumbnail">
          <img
            src={theme.thumbnailUrl}
            alt={`${theme.name} preview`}
            loading="lazy"
          />
        </div>
      )}

      <div className="theme-card__content">
        <div className="theme-card__header">
          <h3 className="theme-card__name">{theme.name}</h3>
          <div className="theme-card__badges">
            {isActive && (
              <span className="theme-card__badge theme-card__badge--active">
                Active on this site
              </span>
            )}
            {theme.source === 'uploaded' && (
              <span className="theme-card__badge theme-card__badge--uploaded">
                Uploaded theme
              </span>
            )}
            {isFailed && (
              <span className="theme-card__badge theme-card__badge--failed">
                Failed
              </span>
            )}
          </div>
        </div>

        {theme.description && (
          <p className="theme-card__description">{theme.description}</p>
        )}

        <div className="theme-card__meta">
          <span className="theme-card__framework">{theme.framework}</span>
          <span className="theme-card__version">v{theme.version}</span>
        </div>

        {theme.tags && theme.tags.length > 0 && (
          <div className="theme-card__tags">
            {theme.tags.map((tag) => (
              <span key={tag} className="theme-card__tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="theme-card__actions">
          {!isActive && (
            <button
              className="theme-card__deploy-btn"
              onClick={handleDeployClick}
              disabled={isDeploying}
              aria-label={`Deploy ${theme.name} theme`}
              aria-busy={isDeploying}
            >
              {isDeploying ? 'Deploying...' : 'Use this theme'}
            </button>
          )}
          {isActive && (
            <button
              className="theme-card__deploy-btn theme-card__deploy-btn--secondary"
              onClick={handleDeployClick}
              aria-label={`Re-deploy ${theme.name} theme`}
            >
              Re-deploy
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
