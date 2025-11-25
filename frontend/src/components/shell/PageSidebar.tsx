/**
 * PageSidebar - Page/Section Navigator
 * Constitutional requirement: FR-003, collapsible, 280px width
 */

import React, { useCallback, useState } from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import { useContentStore } from '../../store/contentStore'
import { useBreakpoint } from '../../hooks/responsive'
import { Icon } from '../ui/Icon'
import { BottomSheet } from './BottomSheet'
import './PageSidebar.css'

interface PageSidebarProps {
  visible: boolean
}

export const PageSidebar: React.FC<PageSidebarProps> = ({ visible }) => {
  // Responsive breakpoint detection
  const { isMobile } = useBreakpoint()

  const [sidebarWidth, setSidebarWidth] = useState(280)
  const selectedPageId = useDashboardStore((state) => state.shell.selectedPageId)
  const selectedSectionId = useDashboardStore((state) => state.shell.selectedSectionId)
  const expandedPageIds = useDashboardStore((state) => state.pageSidebar.expandedPageIds)

  const setSelectedPage = useDashboardStore((state) => state.setSelectedPage)
  const setSelectedSection = useDashboardStore((state) => state.setSelectedSection)
  const togglePageExpanded = useDashboardStore((state) => state.togglePageExpanded)
  const setActiveLeftRailTab = useDashboardStore((state) => state.setActiveLeftRailTab)

  const pages = useContentStore((state) => state.site.pages)

  // Handle minimize
  const handleMinimize = () => {
    setActiveLeftRailTab(null)
  }

  // Handle resize
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      const startX = e.clientX
      const startWidth = sidebarWidth

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX
        const newWidth = Math.max(200, Math.min(500, startWidth + deltaX))
        setSidebarWidth(newWidth)
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    },
    [sidebarWidth]
  )

  const handlePageClick = (pageId: string) => {
    togglePageExpanded(pageId)
    setSelectedPage(pageId)
  }

  const handleSectionClick = (pageId: string, sectionId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    if (selectedPageId !== pageId) {
      setSelectedPage(pageId)
    }
    setSelectedSection(sectionId)

    // Close bottom sheet on mobile after selection
    if (isMobile) {
      setActiveLeftRailTab(null)
    }
  }

  const handlePageKeyDown = (pageId: string, event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        handlePageClick(pageId)
        break
      case 'ArrowRight':
        event.preventDefault()
        if (!expandedPageIds.has(pageId)) {
          togglePageExpanded(pageId)
        }
        break
      case 'ArrowLeft':
        event.preventDefault()
        if (expandedPageIds.has(pageId)) {
          togglePageExpanded(pageId)
        }
        break
    }
  }

  const handleSectionKeyDown = (pageId: string, sectionId: string, event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      event.stopPropagation()
      if (selectedPageId !== pageId) {
        setSelectedPage(pageId)
      }
      setSelectedSection(sectionId)
    }
  }

  // Pages list content (shared between desktop sidebar and mobile bottom sheet)
  const pagesListContent = pages.length === 0 ? (
    <p className="pagesidebar__empty">No pages yet. Create your first page to get started.</p>
  ) : (
    <ul className="pagesidebar__list" role="tree">
      {pages.map((page) => {
        const isExpanded = expandedPageIds.has(page.id)
        const isSelected = selectedPageId === page.id
        const hasSections = page.sections.length > 0

        return (
          <li key={page.id} className="pagesidebar__item" role="treeitem" aria-expanded={isExpanded}>
            <button
              className={`pagesidebar__page ${isSelected ? 'pagesidebar__page--selected' : ''}`}
              onClick={() => handlePageClick(page.id)}
              onKeyDown={(e) => handlePageKeyDown(page.id, e)}
              aria-label={`${page.title} page${hasSections ? `, ${page.sections.length} sections` : ''}`}
            >
              {hasSections && (
                <Icon
                  name={isExpanded ? 'chevron-down' : 'chevron-right'}
                  size="sm"
                  className="pagesidebar__chevron"
                  aria-hidden="true"
                />
              )}
              <span className="pagesidebar__page-title">{page.title}</span>
              {!page.metadata.published && (
                <span className="pagesidebar__badge pagesidebar__badge--draft">Draft</span>
              )}
            </button>

            {isExpanded && hasSections && (
              <ul className="pagesidebar__sections" role="group">
                {page.sections.map((section) => {
                  const isSectionSelected = selectedSectionId === section.id
                  return (
                    <li key={section.id} role="treeitem">
                      <button
                        className={`pagesidebar__section ${isSectionSelected ? 'pagesidebar__section--selected' : ''}`}
                        onClick={(e) => handleSectionClick(page.id, section.id, e)}
                        onKeyDown={(e) => handleSectionKeyDown(page.id, section.id, e)}
                        aria-label={`${section.title} section`}
                      >
                        <span className="pagesidebar__section-title">{section.title}</span>
                        <span className="pagesidebar__section-type">{section.type}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )

  // On mobile, render as bottom sheet
  if (isMobile) {
    return (
      <BottomSheet
        isOpen={visible}
        onClose={handleMinimize}
        snapPoint="half"
        title="Pages"
      >
        <nav className="pagesidebar__content pagesidebar__content--mobile">
          {pagesListContent}
        </nav>
      </BottomSheet>
    )
  }

  // On desktop, render as sidebar
  return (
    <aside
      id="page-sidebar"
      className="shell-sidebar pagesidebar"
      style={{ width: `${sidebarWidth}px` }}
      data-visible={visible}
      aria-label="Pages and sections"
      aria-hidden={!visible}
      tabIndex={-1}
    >
      {/* Resize handle - desktop only */}
      <div
        className="pagesidebar__resize-handle"
        onMouseDown={handleResizeStart}
        role="separator"
        aria-label="Resize page sidebar"
        aria-orientation="vertical"
      />

      <div className="pagesidebar__header">
        <h2 className="pagesidebar__title">Pages</h2>
        <button
          type="button"
          className="pagesidebar__minimize"
          onClick={handleMinimize}
          aria-label="Minimize page sidebar"
          title="Minimize (Esc)"
        >
          <span aria-hidden="true">−</span>
        </button>
      </div>
      <nav className="pagesidebar__content">
        {pagesListContent}
      </nav>
    </aside>
  )
}
