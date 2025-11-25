/**
 * ThemesPage - Main themes management page
 * Feature: 006-themes-and-deploy (US1)
 * 4 demo themes with 2nd theme (E-commerce) set to fail
 */

import React, { useEffect } from 'react';
import { useThemesStore } from '../../store/themesStore';
import { themeService } from '../../services/themeService';
import { MyThemesList } from './MyThemesList';
import { ThemeFilters } from './ThemeFilters';
import { UploadArea } from './UploadArea';
import { UploadProgress } from './UploadProgress';
import './ThemesPage.css';

export const ThemesPage: React.FC = () => {
  const themes = useThemesStore((state) => state.themes);
  const setThemes = useThemesStore((state) => state.setThemes);
  const setLoading = useThemesStore((state) => state.setLoading);
  const setError = useThemesStore((state) => state.setError);
  const isLoading = useThemesStore((state) => state.isLoading);
  const error = useThemesStore((state) => state.error);
  const uploadSessions = useThemesStore((state) => state.uploadSessions);
  const removeUploadSession = useThemesStore((state) => state.removeUploadSession);

  // Mock siteId and userId for MVP
  const currentSiteId = 'site-001';
  const currentUserId = 'user-001';

  // Load purchased themes on mount
  useEffect(() => {
    loadPurchasedThemes();
  }, []);

  const loadPurchasedThemes = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const purchasedThemes = await themeService.fetchPurchasedThemes(
        currentUserId,
        currentSiteId,
        forceRefresh
      );

      setThemes(purchasedThemes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load themes');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadPurchasedThemes(true);
  };

  return (
    <div className="themes-page">
      <header className="themes-page__header">
        <UploadArea siteId={currentSiteId} userId={currentUserId} />
      </header>

      {error && (
        <div className="themes-page__error" role="alert">
          {error}
        </div>
      )}

      {/* Filters Section */}
      <div className="themes-page__filters">
        <ThemeFilters />
      </div>

      {/* Active Upload Sessions */}
      {uploadSessions.length > 0 && (
        <section className="themes-page__uploads">
          <h2 className="themes-page__section-title">Active Uploads</h2>
          {uploadSessions.map((session) => (
            <UploadProgress
              key={session.id}
              session={session}
              onCancel={removeUploadSession}
            />
          ))}
        </section>
      )}

      <section className="themes-page__content">
        <MyThemesList themes={themes} isLoading={isLoading} />
      </section>
    </div>
  );
};
