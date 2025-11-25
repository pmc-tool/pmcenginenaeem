/**
 * Dashboard Store - Global State Management
 * Uses Zustand with persist middleware for auto-save
 * Implements <100ms synchronization requirement per spec
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatState, ChatMessage, Scope } from '../types/chat'

// Shell State Types
export type Mode = 'wizard' | 'edit' | 'preview' | 'settings'
export type LeftRailTab = 'chat' | 'pages' | 'themes' | 'settings' | null
export type InspectorTab = 'content' | 'ai' | 'settings' | 'logic' | 'advanced'
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'failed'
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

export interface ShellState {
  mode: Mode
  activeLeftRailTab: LeftRailTab
  pageSidebarVisible: boolean
  inspectorActiveTab: InspectorTab
  selectedPageId: string | null
  selectedSectionId: string | null
  saveStatus: SaveStatus
  aiCreditsCount: number
  isPreviewMode: boolean
  isHelpPanelOpen: boolean
  isAITrainingOpen: boolean
  isMobileMenuOpen: boolean // Mobile hamburger menu state
}

export interface TopBarState {
  siteName: string
  logoUrl: string | null
  saveText: string
  publishEnabled: boolean
}

export interface PageSidebarState {
  expandedPageIds: Set<string>
  draggedItemId: string | null
}

export interface InspectorState {
  panelWidth: number
  isLoading: boolean
  isCollapsed: boolean
}

export interface CanvasState {
  currentPageId: string | null
  scrollPosition: { x: number; y: number }
  hoveredSectionId: string | null
  zoom: number
}

// Combined Dashboard State
export interface DashboardState {
  shell: ShellState
  topBar: TopBarState
  pageSidebar: PageSidebarState
  inspector: InspectorState
  canvas: CanvasState
  chat: ChatState
  toasts: Toast[]
}

// Actions
export interface DashboardActions {
  // Shell actions
  setMode: (mode: Mode) => void
  setActiveLeftRailTab: (tab: LeftRailTab) => void
  togglePageSidebar: () => void
  setInspectorActiveTab: (tab: InspectorTab) => void
  setSelectedPage: (pageId: string | null) => void
  setSelectedSection: (sectionId: string | null) => void
  setSaveStatus: (status: SaveStatus) => void
  setAiCredits: (count: number) => void
  togglePreviewMode: () => void
  toggleHelpPanel: () => void
  setAITrainingOpen: (open: boolean) => void
  toggleMobileMenu: () => void // Mobile hamburger menu toggle

  // TopBar actions
  setSiteName: (name: string) => void
  setLogoUrl: (url: string | null) => void
  setPublishEnabled: (enabled: boolean) => void

  // PageSidebar actions
  togglePageExpanded: (pageId: string) => void
  setDraggedItem: (itemId: string | null) => void

  // Inspector actions
  setInspectorWidth: (width: number) => void
  setInspectorLoading: (loading: boolean) => void
  toggleInspectorCollapse: () => void

  // Canvas actions
  setCurrentPage: (pageId: string | null) => void
  setCanvasScrollPosition: (position: { x: number; y: number }) => void
  setHoveredSection: (sectionId: string | null) => void
  setZoom: (zoom: number) => void

  // Content editing actions
  updateSectionField: (sectionId: string, fieldPath: string, value: unknown) => void

  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void

  // Chat actions
  toggleChat: () => void
  addMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => void
  removeMessage: (messageId: string) => void
  setScope: (scope: Scope) => void
  setBusy: (busy: boolean) => void
  clearMessages: () => void
  setChatPanelWidth: (width: number) => void
  setCurrentContext: (context: string) => void
  setSelectedModel: (model: import('../types/chat').AIModel) => void
}

// Initial State
const initialState: DashboardState = {
  shell: {
    mode: 'edit',
    activeLeftRailTab: 'pages', // Default to pages/files tab active
    pageSidebarVisible: false,
    inspectorActiveTab: 'content',
    selectedPageId: null,
    selectedSectionId: null,
    saveStatus: 'saved',
    aiCreditsCount: 1000,
    isPreviewMode: false,
    isHelpPanelOpen: false,
    isAITrainingOpen: false,
    isMobileMenuOpen: false,
  },
  topBar: {
    siteName: 'Untitled Site',
    logoUrl: null,
    saveText: 'All changes saved',
    publishEnabled: false,
  },
  pageSidebar: {
    expandedPageIds: new Set<string>(),
    draggedItemId: null,
  },
  inspector: {
    panelWidth: 360, // Default from constitution
    isLoading: false,
    isCollapsed: false,
  },
  canvas: {
    currentPageId: null,
    scrollPosition: { x: 0, y: 0 },
    hoveredSectionId: null,
    zoom: 1,
  },
  chat: {
    messages: [],
    isOpen: false,
    scope: 'section', // Default scope per FR-031
    isBusy: false,
    currentContext: '',
    panelWidth: 420, // Mid-range between 360-600px
    selectedModel: 'claude', // Default to Claude Sonnet
  },
  toasts: [],
}

// Create Store
export const useDashboardStore = create<DashboardState & DashboardActions>()(
  persist(
    (set) => ({
      ...initialState,

      // Shell actions
      setMode: (mode) =>
        set((state) => ({ shell: { ...state.shell, mode } })),

      setActiveLeftRailTab: (tab) =>
        set((state) => ({
          shell: { ...state.shell, activeLeftRailTab: tab },
          // Auto-toggle page sidebar when Pages tab clicked
          ...(tab === 'pages'
            ? { shell: { ...state.shell, activeLeftRailTab: tab, pageSidebarVisible: !state.shell.pageSidebarVisible } }
            : {}),
        })),

      togglePageSidebar: () =>
        set((state) => ({
          shell: { ...state.shell, pageSidebarVisible: !state.shell.pageSidebarVisible },
        })),

      setInspectorActiveTab: (tab) =>
        set((state) => ({
          shell: { ...state.shell, inspectorActiveTab: tab },
        })),

      setSelectedPage: (pageId) =>
        set((state) => ({
          shell: { ...state.shell, selectedPageId: pageId, selectedSectionId: null },
          canvas: { ...state.canvas, currentPageId: pageId },
        })),

      setSelectedSection: (sectionId) =>
        set((state) => ({
          shell: { ...state.shell, selectedSectionId: sectionId },
        })),

      setSaveStatus: (status) =>
        set((state) => ({
          shell: { ...state.shell, saveStatus: status },
          topBar: {
            ...state.topBar,
            saveText:
              status === 'saving'
                ? 'Saving...'
                : status === 'saved'
                ? 'All changes saved'
                : status === 'failed'
                ? 'Failed to save'
                : 'Unsaved changes',
          },
        })),

      setAiCredits: (count) =>
        set((state) => ({
          shell: { ...state.shell, aiCreditsCount: count },
        })),

      togglePreviewMode: () =>
        set((state) => ({
          shell: { ...state.shell, isPreviewMode: !state.shell.isPreviewMode },
        })),

      toggleHelpPanel: () =>
        set((state) => ({
          shell: { ...state.shell, isHelpPanelOpen: !state.shell.isHelpPanelOpen },
        })),

      toggleMobileMenu: () =>
        set((state) => ({
          shell: { ...state.shell, isMobileMenuOpen: !state.shell.isMobileMenuOpen },
        })),

      setAITrainingOpen: (open) =>
        set((state) => ({
          shell: { ...state.shell, isAITrainingOpen: open },
        })),

      // TopBar actions
      setSiteName: (name) =>
        set((state) => ({
          topBar: { ...state.topBar, siteName: name },
        })),

      setLogoUrl: (url) =>
        set((state) => ({
          topBar: { ...state.topBar, logoUrl: url },
        })),

      setPublishEnabled: (enabled) =>
        set((state) => ({
          topBar: { ...state.topBar, publishEnabled: enabled },
        })),

      // PageSidebar actions
      togglePageExpanded: (pageId) =>
        set((state) => {
          const expandedPageIds = new Set(state.pageSidebar.expandedPageIds)
          if (expandedPageIds.has(pageId)) {
            expandedPageIds.delete(pageId)
          } else {
            expandedPageIds.add(pageId)
          }
          return {
            pageSidebar: { ...state.pageSidebar, expandedPageIds },
          }
        }),

      setDraggedItem: (itemId) =>
        set((state) => ({
          pageSidebar: { ...state.pageSidebar, draggedItemId: itemId },
        })),

      // Inspector actions
      setInspectorWidth: (width) =>
        set((state) => ({
          inspector: { ...state.inspector, panelWidth: width },
        })),

      setInspectorLoading: (loading) =>
        set((state) => ({
          inspector: { ...state.inspector, isLoading: loading },
        })),

      toggleInspectorCollapse: () =>
        set((state) => ({
          inspector: { ...state.inspector, isCollapsed: !state.inspector.isCollapsed },
        })),

      // Canvas actions
      setCurrentPage: (pageId) =>
        set((state) => ({
          canvas: { ...state.canvas, currentPageId: pageId },
        })),

      setCanvasScrollPosition: (position) =>
        set((state) => ({
          canvas: { ...state.canvas, scrollPosition: position },
        })),

      setHoveredSection: (sectionId) =>
        set((state) => ({
          canvas: { ...state.canvas, hoveredSectionId: sectionId },
        })),

      setZoom: (zoom) =>
        set((state) => ({
          canvas: { ...state.canvas, zoom },
        })),

      // Toast actions
      addToast: (toast) =>
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id: `toast-${Date.now()}-${Math.random()}` }],
        })),

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),

      // Chat actions
      toggleChat: () =>
        set((state) => ({
          chat: { ...state.chat, isOpen: !state.chat.isOpen },
        })),

      addMessage: (message) =>
        set((state) => ({
          chat: {
            ...state.chat,
            messages: [
              ...state.chat.messages,
              {
                ...message,
                id: crypto.randomUUID(),
                createdAt: Date.now(),
              },
            ],
          },
        })),

      removeMessage: (messageId) =>
        set((state) => ({
          chat: {
            ...state.chat,
            messages: state.chat.messages.filter((msg) => msg.id !== messageId),
          },
        })),

      setScope: (scope) =>
        set((state) => ({
          chat: { ...state.chat, scope },
        })),

      setBusy: (busy) =>
        set((state) => ({
          chat: { ...state.chat, isBusy: busy },
        })),

      clearMessages: () =>
        set((state) => ({
          chat: {
            ...state.chat,
            messages: [],
            isBusy: false,
            scope: 'section', // Reset to default
          },
        })),

      setChatPanelWidth: (width) =>
        set((state) => ({
          chat: {
            ...state.chat,
            panelWidth: Math.min(600, Math.max(360, width)), // Constrain to 360-600px
          },
        })),

      setCurrentContext: (context) =>
        set((state) => ({
          chat: { ...state.chat, currentContext: context },
        })),

      setSelectedModel: (model) =>
        set((state) => ({
          chat: { ...state.chat, selectedModel: model },
        })),
    }),
    {
      name: 'pmc-dashboard-storage',
      // Persist to localStorage for now (IndexedDB integration in future iteration)
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const { state } = JSON.parse(str)
          // Convert expandedPageIds back to Set
          if (state.pageSidebar?.expandedPageIds) {
            state.pageSidebar.expandedPageIds = new Set(state.pageSidebar.expandedPageIds)
          }
          return { state }
        },
        setItem: (name, value) => {
          const { state } = value
          // Convert Set to Array for JSON serialization
          const serializedState = {
            ...state,
            pageSidebar: {
              ...state.pageSidebar,
              expandedPageIds: Array.from(state.pageSidebar.expandedPageIds),
            },
          }
          localStorage.setItem(name, JSON.stringify({ state: serializedState }))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      // Partition keys for fine-grained persistence
      // NOTE: Chat state is intentionally excluded (FR-049: no persistence)
      partialize: (state) => ({
        shell: state.shell,
        topBar: state.topBar,
        pageSidebar: state.pageSidebar,
        inspector: state.inspector,
        canvas: state.canvas,
        // chat: excluded - ephemeral only per FR-049
      }),
    }
  )
)
