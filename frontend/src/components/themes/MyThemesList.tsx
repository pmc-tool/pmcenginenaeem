/**
 * MyThemesList - Unified list of purchased and uploaded themes
 * Feature: 006-themes-and-deploy (US1)
 */

import React, { useMemo } from 'react';
import type { Theme } from '../../types';
import { useThemesStore } from '../../store/themesStore';
import { useDeploymentStore } from '../../store/deploymentStore';
import { ThemeCard } from './ThemeCard';
import { ThemeSkeleton } from './ThemeSkeleton';
import './MyThemesList.css';

interface MyThemesListProps {
  themes: Theme[];
  isLoading: boolean;
}

export const MyThemesList: React.FC<MyThemesListProps> = ({ themes, isLoading }) => {
  const activeFilter = useThemesStore((state) => state.activeFilter);
  const searchQuery = useThemesStore((state) => state.searchQuery);
  const selectedTags = useThemesStore((state) => state.selectedTags);
  const openDeployPanel = useDeploymentStore((state) => state.openDeployPanel);

  // Filter themes based on active filters
  const filteredThemes = useMemo(() => {
    return themes.filter((theme) => {
      // Filter by source
      if (activeFilter !== 'all' && theme.source !== activeFilter) {
        return false;
      }

      // Filter by search query (name or description)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = theme.name.toLowerCase().includes(query);
        const matchesDescription = theme.description?.toLowerCase().includes(query);

        if (!matchesName && !matchesDescription) {
          return false;
        }
      }

      // Filter by selected tags
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some((tag) => theme.tags?.includes(tag));
        if (!hasMatchingTag) {
          return false;
        }
      }

      return true;
    });
  }, [themes, activeFilter, searchQuery, selectedTags]);

  const handleDeploy = (themeId: string) => {
    // Find the theme to get its siteId
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) {
      console.error('Theme not found:', themeId);
      return;
    }

    // Open deploy panel with the theme's siteId
    openDeployPanel(theme.siteId, themeId);
  };

  if (isLoading) {
    return (
      <div className="my-themes-list">
        <h2 className="my-themes-list__title">My Themes</h2>
        <div className="my-themes-list__grid">
          {[...Array(6)].map((_, i) => (
            <ThemeSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (filteredThemes.length === 0 && themes.length === 0) {
    return (
      <div className="my-themes-list my-themes-list--empty">
        <div className="my-themes-list__empty-state">
          <p className="my-themes-list__empty-title">No themes yet</p>
          <p className="my-themes-list__empty-description">
            Purchased themes from PackMyCode will appear here, or you can upload your own PMC
            Engine-compatible theme.
          </p>
        </div>
      </div>
    );
  }

  if (filteredThemes.length === 0) {
    return (
      <div className="my-themes-list my-themes-list--empty">
        <div className="my-themes-list__empty-state">
          <p className="my-themes-list__empty-title">No themes match your filters</p>
          <p className="my-themes-list__empty-description">
            Try adjusting your search or filters to see more themes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-themes-list">
      <h2 className="my-themes-list__title">
        My Themes ({filteredThemes.length})
      </h2>

      <div className="my-themes-list__grid">
        {filteredThemes.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} onDeploy={handleDeploy} />
        ))}
      </div>
    </div>
  );
};
