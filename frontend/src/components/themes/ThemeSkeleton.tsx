/**
 * ThemeSkeleton - Loading skeleton for theme cards
 * Feature: 006-themes-and-deploy (Polish)
 */

import React from 'react';
import './ThemeSkeleton.css';

export const ThemeSkeleton: React.FC = () => {
  return (
    <div className="theme-skeleton">
      <div className="theme-skeleton__thumbnail" />
      <div className="theme-skeleton__content">
        <div className="theme-skeleton__title" />
        <div className="theme-skeleton__description" />
        <div className="theme-skeleton__meta">
          <div className="theme-skeleton__tag" />
          <div className="theme-skeleton__tag" />
        </div>
      </div>
      <div className="theme-skeleton__footer">
        <div className="theme-skeleton__button" />
      </div>
    </div>
  );
};
