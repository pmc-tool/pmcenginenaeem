/**
 * Canvas - Live Site Preview Area
 * Constitutional requirement: FR-004, "Canvas is Sacred" - shows high-fidelity live preview
 */

import React, { useEffect, useRef } from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import { useContentStore } from '../../store/contentStore'
import { useThemesStore } from '../../store/themesStore'
import { useBreakpoint } from '../../hooks/responsive'
import { FloatingActionButton } from '../ui/FloatingActionButton'
import './Canvas.css'

export const Canvas: React.FC = () => {
  // Responsive breakpoint detection
  const { isMobile } = useBreakpoint()

  const selectedPageId = useDashboardStore((state) => state.shell.selectedPageId)
  const selectedSectionId = useDashboardStore((state) => state.shell.selectedSectionId)
  const hoveredSectionId = useDashboardStore((state) => state.canvas.hoveredSectionId)
  const isPreviewMode = useDashboardStore((state) => state.shell.isPreviewMode)
  const setHoveredSection = useDashboardStore((state) => state.setHoveredSection)
  const setSelectedSection = useDashboardStore((state) => state.setSelectedSection)

  const getPageById = useContentStore((state) => state.getPageById)
  const getSectionById = useContentStore((state) => state.getSectionById)

  // Get active theme for preview
  const getActiveTheme = useThemesStore((state) => state.getActiveTheme)
  const currentSiteId = 'site-001' // Mock siteId (should match ThemesPage)
  const activeTheme = getActiveTheme(currentSiteId)

  const selectedPage = selectedPageId ? getPageById(selectedPageId) : null
  const selectedSection = selectedSectionId ? getSectionById(selectedSectionId) : null

  // Show preview exit hint for 3 seconds when entering preview mode
  const [showPreviewHint, setShowPreviewHint] = React.useState(false)

  React.useEffect(() => {
    if (isPreviewMode) {
      setShowPreviewHint(true)
      const timer = setTimeout(() => setShowPreviewHint(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isPreviewMode])

  // If in preview mode and there's an active theme, show the deployed site
  if (isPreviewMode && activeTheme) {
    // For MVP, we'll show a mock preview. In production, this would be the actual deployed URL
    const previewUrl = 'https://example.com' // Mock deployed site URL

    return (
      <main id="canvas" className="shell-canvas canvas canvas--preview" aria-label="Site preview" tabIndex={-1}>
        {showPreviewHint && (
          <div className="canvas__preview-hint" role="status">
            Press <kbd>Esc</kbd> to exit preview mode
          </div>
        )}
        <iframe
          src={previewUrl}
          className="canvas__preview-iframe"
          title="Deployed site preview"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </main>
    )
  }

  // Scroll to selected section
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    if (selectedSectionId && sectionRefs.current[selectedSectionId]) {
      sectionRefs.current[selectedSectionId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [selectedSectionId])

  if (!selectedPage) {
    return (
      <main id="canvas" className="shell-canvas canvas" aria-label="Site preview" tabIndex={-1}>
        {isPreviewMode && showPreviewHint && (
          <div className="canvas__preview-hint" role="status">
            Press <kbd>Esc</kbd> to exit preview mode
          </div>
        )}
        <div className="canvas__welcome">
          <div className="canvas__welcome-content">
            <h1 className="canvas__welcome-title">Welcome to PMC Engine Editor</h1>
            <p className="canvas__welcome-description">
              Your AI-first site editor for PMC Engine themes.
            </p>
            <div className="canvas__welcome-guide">
              <h2 className="canvas__guide-title">Quick Start Guide</h2>
              <ol className="canvas__guide-steps">
                <li>
                  Click the <strong>Pages</strong> icon in the left rail to open the page sidebar
                </li>
                <li>
                  Select a page to start editing
                </li>
                <li>
                  Use the <strong>Inspector</strong> panel on the right to edit content
                </li>
                <li>
                  Click <strong>Preview</strong> in the top bar to see your site fullscreen
                </li>
                <li>
                  Use the <strong>AI Assistant</strong> tab for intelligent content generation
                </li>
                <li>
                  Click the <strong>Settings</strong> icon in the left rail to access <strong>AI Training</strong>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main id="canvas" className="shell-canvas canvas" aria-label="Site preview" tabIndex={-1}>
      {isPreviewMode && showPreviewHint && (
        <div className="canvas__preview-hint" role="status">
          Press <kbd>Esc</kbd> to exit preview mode
        </div>
      )}
      <div className="canvas__page">
        <div className="canvas__sections">
          {selectedPage.sections.length === 0 ? (
            <div className="canvas__empty">
              <p>No sections yet. Add your first section to get started.</p>
            </div>
          ) : (
            selectedPage.sections.map((section) => {
              const isSelected = selectedSectionId === section.id
              const isHovered = hoveredSectionId === section.id

              return (
                <section
                  key={section.id}
                  ref={(el) => {
                    sectionRefs.current[section.id] = el
                  }}
                  className={`canvas__section ${isSelected ? 'canvas__section--selected' : ''} ${isHovered ? 'canvas__section--hovered' : ''}`}
                  data-section-type={section.type}
                  onClick={() => !isPreviewMode && setSelectedSection(section.id)}
                  onMouseEnter={() => !isPreviewMode && setHoveredSection(section.id)}
                  onMouseLeave={() => !isPreviewMode && setHoveredSection(null)}
                  role={isPreviewMode ? undefined : 'button'}
                  tabIndex={isPreviewMode ? undefined : 0}
                  aria-label={`${section.title} section`}
                  onKeyDown={(e) => {
                    if (!isPreviewMode && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      setSelectedSection(section.id)
                    }
                  }}
                >
                  <div className="canvas__section-preview">
                    <div className="canvas__section-header">
                      <h2 className="canvas__section-title">{section.title}</h2>
                      <span className="canvas__section-type">{section.type}</span>
                    </div>
                    <div className="canvas__section-content">
                      {renderSectionPreview(section)}
                    </div>
                  </div>
                </section>
              )
            })
          )}
        </div>
      </div>

      {/* Floating Action Button (FAB) on mobile when section is selected */}
      {isMobile && selectedSectionId && !isPreviewMode && (
        <FloatingActionButton
          onClick={() => {
            // Inspector will auto-open via BottomSheet when section is selected
            // This FAB can be used to scroll back to selected section or provide quick actions
            const selectedElement = sectionRefs.current[selectedSectionId]
            if (selectedElement) {
              selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
          }}
          icon="✏"
          label="Edit section"
          variant="primary"
        />
      )}
    </main>
  )
}

// Helper function to render section preview based on type
function renderSectionPreview(section: any): React.ReactNode {
  const fields = section.fields

  switch (section.type) {
    case 'hero':
      const bgImage = fields.backgroundImage as { url?: string; alt?: string } | undefined
      return (
        <div
          className="preview preview--hero"
          style={{
            backgroundImage: bgImage?.url ? `url(${bgImage.url})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="preview--hero__overlay">
            <h1>{fields.heading}</h1>
            <p>{fields.subheading}</p>
            <button>{fields.ctaText}</button>
          </div>
        </div>
      )

    case 'features':
      return (
        <div className="preview preview--features">
          <h2>{fields.heading}</h2>
          <div className="preview__grid">
            {fields.features?.map((feature: any, idx: number) => (
              <div key={idx} className="preview__feature">
                <span className="preview__icon preview__icon--badge">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'cta':
      return (
        <div className="preview preview--cta">
          <h2>{fields.heading}</h2>
          <button>{fields.buttonText}</button>
        </div>
      )

    case 'content':
      return (
        <div className="preview preview--content">
          <h2>{fields.heading}</h2>
          <div
            className="preview__rich-content"
            dangerouslySetInnerHTML={{ __html: fields.content as string }}
          />
        </div>
      )

    case 'form':
      return (
        <div className="preview preview--form">
          <h2>{fields.heading}</h2>
          <form>
            {fields.fields?.map((field: string) => (
              <input key={field} type="text" placeholder={field} />
            ))}
            <button type="submit">{fields.submitText}</button>
          </form>
        </div>
      )

    default:
      return (
        <div className="preview preview--default">
          <p>Section type: {section.type}</p>
          <pre>{JSON.stringify(fields, null, 2)}</pre>
        </div>
      )
  }
}
