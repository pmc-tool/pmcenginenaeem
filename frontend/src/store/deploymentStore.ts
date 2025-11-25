// Deployment Store - Zustand state management for deployments
// Feature: 006-themes-and-deploy

import { create } from 'zustand';
import type { DeploymentSession } from '../types';

interface DeploymentState {
  // State: Map keyed by siteId (only one deployment per site)
  activeSessions: Map<string, DeploymentSession>;

  // UI state
  isDeployPanelOpen: boolean;
  currentSiteId: string | null;
  currentThemeId: string | null;

  // Actions
  createSession: (session: DeploymentSession) => void;
  updateSession: (siteId: string, updates: Partial<DeploymentSession>) => void;
  appendBuildLog: (siteId: string, logLine: string) => void;
  clearSession: (siteId: string) => void;
  getSessionBySite: (siteId: string) => DeploymentSession | undefined;

  // UI actions
  openDeployPanel: (siteId: string, themeId: string) => void;
  closeDeployPanel: () => void;

  // Cleanup
  cleanupOldSessions: () => void;
}

export const useDeploymentStore = create<DeploymentState>((set, get) => ({
  // Initial state
  activeSessions: new Map(),
  isDeployPanelOpen: false,
  currentSiteId: null,
  currentThemeId: null,

  // Session actions
  createSession: (session) =>
    set((state) => {
      const newSessions = new Map(state.activeSessions);
      newSessions.set(session.siteId, session);
      return {
        activeSessions: newSessions,
        isDeployPanelOpen: true,
        currentSiteId: session.siteId,
      };
    }),

  updateSession: (siteId, updates) =>
    set((state) => {
      const existing = state.activeSessions.get(siteId);
      if (!existing) return state;

      const newSessions = new Map(state.activeSessions);
      newSessions.set(siteId, {
        ...existing,
        ...updates,
      });

      return { activeSessions: newSessions };
    }),

  appendBuildLog: (siteId, logLine) =>
    set((state) => {
      const existing = state.activeSessions.get(siteId);
      if (!existing) return state;

      const newSessions = new Map(state.activeSessions);
      const newBuildLogs = [...existing.buildLogs, logLine];

      // Limit to max 1000 log lines to prevent memory bloat
      const MAX_LOGS = 1000;
      if (newBuildLogs.length > MAX_LOGS) {
        newBuildLogs.splice(0, newBuildLogs.length - MAX_LOGS);
      }

      newSessions.set(siteId, {
        ...existing,
        buildLogs: newBuildLogs,
      });

      return { activeSessions: newSessions };
    }),

  clearSession: (siteId) =>
    set((state) => {
      const newSessions = new Map(state.activeSessions);
      newSessions.delete(siteId);
      return { activeSessions: newSessions };
    }),

  getSessionBySite: (siteId) => {
    return get().activeSessions.get(siteId);
  },

  // UI actions
  openDeployPanel: (siteId, themeId) =>
    set({
      isDeployPanelOpen: true,
      currentSiteId: siteId,
      currentThemeId: themeId,
    }),

  closeDeployPanel: () =>
    set({
      isDeployPanelOpen: false,
      currentSiteId: null,
      currentThemeId: null,
    }),

  // Cleanup old sessions (24 hour retention policy)
  cleanupOldSessions: () => {
    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    set((state) => {
      const newSessions = new Map(state.activeSessions);

      for (const [siteId, session] of newSessions.entries()) {
        // Only cleanup completed sessions
        if (session.completedAt) {
          const completedTime = new Date(session.completedAt).getTime();
          if (now - completedTime > TWENTY_FOUR_HOURS) {
            newSessions.delete(siteId);
          }
        }
      }

      return { activeSessions: newSessions };
    });
  },
}));
