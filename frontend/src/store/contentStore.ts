/**
 * Content Store - Manages site, page, and section data
 * Separate from dashboard UI state for clearer separation of concerns
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Site, Page, Section } from '../types/content'
import { mockSite } from '../data/mockData'

export interface ContentState {
  site: Site
}

export interface ContentActions {
  // Page actions
  addPage: (page: Omit<Page, 'id'>) => void
  updatePage: (pageId: string, updates: Partial<Page>) => void
  deletePage: (pageId: string) => void
  reorderPages: (pageIds: string[]) => void

  // Section actions
  addSection: (pageId: string, section: Omit<Section, 'id' | 'pageId'>) => void
  updateSection: (sectionId: string, updates: Partial<Section>) => void
  deleteSection: (sectionId: string) => void
  reorderSections: (pageId: string, sectionIds: string[]) => void

  // Field updates
  updateSectionField: (sectionId: string, fieldPath: string, value: unknown) => void

  // Site actions
  updateSite: (updates: Partial<Omit<Site, 'id' | 'pages'>>) => void

  // Utilities
  getPageById: (pageId: string) => Page | undefined
  getSectionById: (sectionId: string) => Section | undefined
}

export const useContentStore = create<ContentState & ContentActions>()(
  persist(
    (set, get) => ({
      site: mockSite,

      // Page actions
      addPage: (page) =>
        set((state) => ({
          site: {
            ...state.site,
            pages: [
              ...state.site.pages,
              {
                ...page,
                id: `page-${Date.now()}`,
              } as Page,
            ],
          },
        })),

      updatePage: (pageId, updates) =>
        set((state) => ({
          site: {
            ...state.site,
            pages: state.site.pages.map((page) =>
              page.id === pageId
                ? {
                    ...page,
                    ...updates,
                    metadata: {
                      ...page.metadata,
                      updatedAt: new Date().toISOString(),
                    },
                  }
                : page
            ),
          },
        })),

      deletePage: (pageId) =>
        set((state) => ({
          site: {
            ...state.site,
            pages: state.site.pages.filter((page) => page.id !== pageId),
          },
        })),

      reorderPages: (pageIds) =>
        set((state) => {
          const pageMap = new Map(state.site.pages.map((p) => [p.id, p]))
          return {
            site: {
              ...state.site,
              pages: pageIds
                .map((id, index) => {
                  const page = pageMap.get(id)
                  return page ? { ...page, order: index } : null
                })
                .filter((p): p is Page => p !== null),
            },
          }
        }),

      // Section actions
      addSection: (pageId, section) =>
        set((state) => ({
          site: {
            ...state.site,
            pages: state.site.pages.map((page) =>
              page.id === pageId
                ? {
                    ...page,
                    sections: [
                      ...page.sections,
                      {
                        ...section,
                        id: `section-${Date.now()}`,
                        pageId,
                        metadata: {
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        },
                      } as Section,
                    ],
                  }
                : page
            ),
          },
        })),

      updateSection: (sectionId, updates) =>
        set((state) => ({
          site: {
            ...state.site,
            pages: state.site.pages.map((page) => ({
              ...page,
              sections: page.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      ...updates,
                      metadata: {
                        ...section.metadata,
                        updatedAt: new Date().toISOString(),
                      },
                    }
                  : section
              ),
            })),
          },
        })),

      deleteSection: (sectionId) =>
        set((state) => ({
          site: {
            ...state.site,
            pages: state.site.pages.map((page) => ({
              ...page,
              sections: page.sections.filter((section) => section.id !== sectionId),
            })),
          },
        })),

      reorderSections: (pageId, sectionIds) =>
        set((state) => ({
          site: {
            ...state.site,
            pages: state.site.pages.map((page) => {
              if (page.id !== pageId) return page
              const sectionMap = new Map(page.sections.map((s) => [s.id, s]))
              return {
                ...page,
                sections: sectionIds
                  .map((id, index) => {
                    const section = sectionMap.get(id)
                    return section ? { ...section, order: index } : null
                  })
                  .filter((s): s is Section => s !== null),
              }
            }),
          },
        })),

      // Field updates
      updateSectionField: (sectionId, fieldPath, value) =>
        set((state) => ({
          site: {
            ...state.site,
            pages: state.site.pages.map((page) => ({
              ...page,
              sections: page.sections.map((section) => {
                if (section.id !== sectionId) return section

                // Handle nested field paths (e.g., "features.0.title")
                const pathParts = fieldPath.split('.')
                const updatedFields = { ...section.fields }
                let current: any = updatedFields

                for (let i = 0; i < pathParts.length - 1; i++) {
                  const part = pathParts[i]
                  if (!current[part]) {
                    current[part] = {}
                  }
                  current = current[part]
                }

                current[pathParts[pathParts.length - 1]] = value

                return {
                  ...section,
                  fields: updatedFields,
                  metadata: {
                    ...section.metadata,
                    updatedAt: new Date().toISOString(),
                  },
                }
              }),
            })),
          },
        })),

      // Site actions
      updateSite: (updates) =>
        set((state) => ({
          site: {
            ...state.site,
            ...updates,
            metadata: {
              ...state.site.metadata,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      // Utilities
      getPageById: (pageId) => {
        return get().site.pages.find((p) => p.id === pageId)
      },

      getSectionById: (sectionId) => {
        for (const page of get().site.pages) {
          const section = page.sections.find((s) => s.id === sectionId)
          if (section) return section
        }
        return undefined
      },
    }),
    {
      name: 'pmc-content-storage',
    }
  )
)
