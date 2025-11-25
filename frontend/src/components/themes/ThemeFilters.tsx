/**
 * ThemeFilters - Search and filter controls for themes
 * Feature: 006-themes-and-deploy (US1)
 */

import React from 'react';
import { useThemesStore } from '../../store/themesStore';

export const ThemeFilters: React.FC = () => {
  const activeFilter = useThemesStore((state) => state.activeFilter);
  const searchQuery = useThemesStore((state) => state.searchQuery);
  const selectedTags = useThemesStore((state) => state.selectedTags);
  const setActiveFilter = useThemesStore((state) => state.setActiveFilter);
  const setSearchQuery = useThemesStore((state) => state.setSearchQuery);
  const toggleTag = useThemesStore((state) => state.toggleTag);
  const clearFilters = useThemesStore((state) => state.clearFilters);

  const availableTags = ['saas', 'portfolio', 'blog', 'landing', 'creative'];

  const hasActiveFilters = activeFilter !== 'all' || searchQuery !== '' || selectedTags.length > 0;

  return (
    <div className="theme-filters" style={filterStyles.container}>
      <div className="theme-filters__controls" style={filterStyles.controlsRow}>
        <div className="theme-filters__source" style={filterStyles.sourceFilters}>
          <button
            className={`theme-filters__source-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
            style={activeFilter === 'all' ? filterStyles.activeButton : filterStyles.button}
          >
            All
          </button>
          <button
            className={`theme-filters__source-btn ${activeFilter === 'purchased' ? 'active' : ''}`}
            onClick={() => setActiveFilter('purchased')}
            style={activeFilter === 'purchased' ? filterStyles.activeButton : filterStyles.button}
          >
            Purchased
          </button>
          <button
            className={`theme-filters__source-btn ${activeFilter === 'uploaded' ? 'active' : ''}`}
            onClick={() => setActiveFilter('uploaded')}
            style={activeFilter === 'uploaded' ? filterStyles.activeButton : filterStyles.button}
          >
            Uploaded
          </button>
        </div>

        <div className="theme-filters__tags" style={filterStyles.tagFilters}>
          {availableTags.map((tag) => (
            <button
              key={tag}
              className={`theme-filters__tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
              onClick={() => toggleTag(tag)}
              style={selectedTags.includes(tag) ? filterStyles.activeTag : filterStyles.tag}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="theme-filters__search-wrapper" style={filterStyles.searchWrapper}>
          <input
            type="text"
            className="theme-filters__search-input"
            placeholder="Search themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={filterStyles.searchInput}
            aria-label="Search themes"
          />
          {hasActiveFilters && (
            <button
              className="theme-filters__clear-btn"
              onClick={clearFilters}
              style={filterStyles.clearButton}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Inline styles for MVP (can be moved to CSS file later)
const filterStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  controlsRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sourceFilters: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  button: {
    padding: '8px 16px',
    background: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#000000',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  },
  activeButton: {
    padding: '8px 16px',
    background: '#EA2724',
    border: '1px solid #EA2724',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#FFFFFF',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  },
  tagFilters: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
    flex: 1,
  },
  tag: {
    padding: '6px 14px',
    background: '#F5F5F5',
    border: '1px solid transparent',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#666666',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  },
  activeTag: {
    padding: '6px 14px',
    background: '#FFFFFF',
    border: '1px solid #EA2724',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#EA2724',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  },
  searchWrapper: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexShrink: 0,
  },
  searchInput: {
    width: '220px',
    padding: '8px 14px',
    border: '1px solid #E0E0E0',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 150ms ease',
  },
  clearButton: {
    padding: '8px 14px',
    background: '#F5F5F5',
    border: '1px solid #E0E0E0',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 150ms ease',
    whiteSpace: 'nowrap' as const,
  },
};
