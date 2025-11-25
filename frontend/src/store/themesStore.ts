// Themes Store - Zustand state management for themes
// Feature: 006-themes-and-deploy

import { create } from 'zustand';
import type { Theme, UploadSession } from '../types';

interface ThemesState {
  // State
  themes: Theme[];
  uploadSessions: UploadSession[];
  activeFilter: 'all' | 'purchased' | 'uploaded';
  searchQuery: string;
  selectedTags: string[];
  isLoading: boolean;
  error: string | null;

  // Theme actions
  addTheme: (theme: Theme) => void;
  updateTheme: (id: string, updates: Partial<Theme>) => void;
  deleteTheme: (id: string) => void;
  setThemes: (themes: Theme[]) => void;
  getActiveTheme: (siteId: string) => Theme | undefined;

  // Upload session actions
  createUploadSession: (session: UploadSession) => void;
  updateUploadSession: (id: string, updates: Partial<UploadSession>) => void;
  removeUploadSession: (id: string) => void;
  cleanupCompletedSessions: () => void;

  // Filter actions
  setActiveFilter: (filter: 'all' | 'purchased' | 'uploaded') => void;
  setSearchQuery: (query: string) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;

  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useThemesStore = create<ThemesState>((set, get) => ({
  // Initial state
  themes: [],
  uploadSessions: [],
  activeFilter: 'all',
  searchQuery: '',
  selectedTags: [],
  isLoading: false,
  error: null,

  // Theme actions
  addTheme: (theme) =>
    set((state) => ({
      themes: [theme, ...state.themes], // Add to top of list
    })),

  updateTheme: (id, updates) =>
    set((state) => ({
      themes: state.themes.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)),
    })),

  deleteTheme: (id) =>
    set((state) => ({
      themes: state.themes.filter((t) => t.id !== id),
    })),

  setThemes: (themes) => set({ themes }),

  getActiveTheme: (siteId) => {
    const { themes } = get();
    return themes.find((t) => t.siteId === siteId && t.deploymentStatus === 'active');
  },

  // Upload session actions
  createUploadSession: (session) =>
    set((state) => ({
      uploadSessions: [...state.uploadSessions, session],
    })),

  updateUploadSession: (id, updates) =>
    set((state) => ({
      uploadSessions: state.uploadSessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),

  removeUploadSession: (id) =>
    set((state) => ({
      uploadSessions: state.uploadSessions.filter((s) => s.id !== id),
    })),

  cleanupCompletedSessions: () => {
    const now = Date.now();
    const FIVE_MINUTES = 5 * 60 * 1000;

    set((state) => ({
      uploadSessions: state.uploadSessions.filter((session) => {
        // Keep sessions that are not completed
        if (!session.completedAt) return true;

        // Remove sessions completed more than 5 minutes ago
        const completedTime = new Date(session.completedAt).getTime();
        return now - completedTime < FIVE_MINUTES;
      }),
    }));
  },

  // Filter actions
  setActiveFilter: (filter) => set({ activeFilter: filter }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleTag: (tag) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag],
    })),

  clearFilters: () =>
    set({
      activeFilter: 'all',
      searchQuery: '',
      selectedTags: [],
    }),

  // Utility actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
