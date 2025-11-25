/**
 * TopBar - Persistent Top Navigation Bar
 * Contains: Logo, Site Name, Save Status, Preview Toggle, Publish, AI Credits, Help
 * Constitutional requirement: FR-001, always visible in edit mode
 */

import React, { useState, useEffect } from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import { useCodeStore } from '../../store/codeStore'
import { useBreakpoint } from '../../hooks/responsive'
import { Button } from '../ui/Button'
import { debounce } from '../../utils/debounce'
import './TopBar.css'

export const TopBar: React.FC = () => {
  // Responsive breakpoint detection
  const { isMobile } = useBreakpoint()

  const siteName = useDashboardStore((state) => state.topBar.siteName)
  const saveStatus = useDashboardStore((state) => state.shell.saveStatus)
  const saveText = useDashboardStore((state) => state.topBar.saveText)
  const isPreviewMode = useDashboardStore((state) => state.shell.isPreviewMode)
  const publishEnabled = useDashboardStore((state) => state.topBar.publishEnabled)
  const aiCreditsCount = useDashboardStore((state) => state.shell.aiCreditsCount)
  const isMobileMenuOpen = useDashboardStore((state) => state.shell.isMobileMenuOpen)

  const setSiteName = useDashboardStore((state) => state.setSiteName)
  const togglePreviewMode = useDashboardStore((state) => state.togglePreviewMode)
  const toggleHelpPanel = useDashboardStore((state) => state.toggleHelpPanel)
  const setSaveStatus = useDashboardStore((state) => state.setSaveStatus)
  const toggleMobileMenu = useDashboardStore((state) => state.toggleMobileMenu)

  // Code/Canvas toggle
  const viewMode = useCodeStore((state) => state.viewMode)
  const toggleViewMode = useCodeStore((state) => state.toggleViewMode)

  const [isEditingSiteName, setIsEditingSiteName] = useState(false)
  const [tempSiteName, setTempSiteName] = useState(siteName)

  // Auto-save simulation (debounced)
  const triggerAutoSave = React.useMemo(
    () =>
      debounce(() => {
        setSaveStatus('saving')
        // Simulate save delay
        setTimeout(() => {
          setSaveStatus('saved')
        }, 1000)
      }, 500),
    [setSaveStatus]
  )

  useEffect(() => {
    if (tempSiteName !== siteName) {
      triggerAutoSave()
    }
  }, [tempSiteName, siteName, triggerAutoSave])

  const handleSiteNameClick = () => {
    setIsEditingSiteName(true)
  }

  const handleSiteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSiteName(e.target.value)
  }

  const handleSiteNameBlur = () => {
    setIsEditingSiteName(false)
    setSiteName(tempSiteName)
  }

  const handleSiteNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingSiteName(false)
      setSiteName(tempSiteName)
    } else if (e.key === 'Escape') {
      setIsEditingSiteName(false)
      setTempSiteName(siteName)
    }
  }

  const aiCreditsLow = aiCreditsCount < 50

  return (
    <div className="shell-topbar topbar" data-mobile={isMobile}>
      <div className="topbar__left">
        {/* Hamburger menu button - only on mobile */}
        {isMobile && (
          <button
            className="topbar__hamburger touch-target"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {isMobileMenuOpen ? (
                // X icon when menu is open
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                // Hamburger icon when menu is closed
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        )}

        <div className="topbar__logo" aria-label="PMC Engine Editor">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="4" fill="#EA2724" />
            <path d="M8 8h16v16H8z" fill="white" fillOpacity="0.2" />
            <text x="16" y="22" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">
              PMC
            </text>
          </svg>
        </div>

        {/* Site name - hide input editing on mobile to save space */}
        {isEditingSiteName && !isMobile ? (
          <input
            type="text"
            className="topbar__site-name-input"
            value={tempSiteName}
            onChange={handleSiteNameChange}
            onBlur={handleSiteNameBlur}
            onKeyDown={handleSiteNameKeyDown}
            autoFocus
            aria-label="Edit site name"
          />
        ) : (
          <button
            className="topbar__site-name"
            onClick={!isMobile ? handleSiteNameClick : undefined}
            aria-label={isMobile ? `Site: ${siteName}` : `Site name: ${siteName}. Click to edit.`}
            disabled={isMobile}
          >
            {isMobile ? siteName.substring(0, 20) + (siteName.length > 20 ? '...' : '') : siteName}
          </button>
        )}

        {/* Save status - hide on mobile to save space */}
        {!isMobile && (
          <div
            className={`topbar__save-status topbar__save-status--${saveStatus}`}
            role="status"
            aria-live="polite"
          >
            {saveText}
          </div>
        )}
      </div>

      {/* Code/Canvas Toggle */}
      <div className="topbar__center">
        <div className="topbar__view-toggle" role="group" aria-label="View mode toggle">
          <button
            className={`topbar__view-toggle-option ${viewMode === 'canvas' ? 'topbar__view-toggle-option--active' : ''} ${isMobile ? 'touch-target' : ''}`}
            onClick={() => viewMode !== 'canvas' && toggleViewMode()}
            aria-label="Canvas view"
            aria-pressed={viewMode === 'canvas'}
          >
            {isMobile ? <span aria-hidden="true">▢</span> : <><span aria-hidden="true">▢</span> Canvas</>}
          </button>
          <button
            className={`topbar__view-toggle-option ${viewMode === 'code' ? 'topbar__view-toggle-option--active' : ''} ${isMobile ? 'touch-target' : ''}`}
            onClick={() => viewMode !== 'code' && toggleViewMode()}
            aria-label="Code view"
            aria-pressed={viewMode === 'code'}
          >
            {isMobile ? <span aria-hidden="true">‹/›</span> : <><span aria-hidden="true">‹/›</span> Code</>}
          </button>
        </div>
      </div>

      <div className="topbar__right">
        {/* Preview button - icon-only on mobile */}
        <Button
          variant="secondary"
          size="sm"
          onClick={togglePreviewMode}
          aria-label={isPreviewMode ? 'Exit preview mode' : 'Enter preview mode'}
          aria-pressed={isPreviewMode}
          className={isMobile ? 'touch-target' : ''}
        >
          {isMobile ? (isPreviewMode ? '←' : '👁') : (isPreviewMode ? '← Edit' : 'Preview →')}
        </Button>

        {/* Publish button - always visible but icon-only on mobile */}
        <Button
          variant="primary"
          size="sm"
          disabled={!publishEnabled}
          aria-label="Publish site"
          className={isMobile ? 'touch-target' : ''}
        >
          {isMobile ? '↑' : 'Publish'}
        </Button>

        {/* AI Credits - hide count text on mobile, show only icon */}
        {isMobile ? (
          <button
            className={`topbar__credits-icon-only touch-target ${aiCreditsLow ? 'topbar__credits--low' : ''}`}
            aria-label={`AI credits: ${aiCreditsCount}${aiCreditsLow ? ' (low balance)' : ''}`}
            onClick={toggleHelpPanel}
          >
            <span aria-hidden="true">✨</span>
          </button>
        ) : (
          <div
            className={`topbar__credits ${aiCreditsLow ? 'topbar__credits--low' : ''}`}
            role="status"
            aria-live="polite"
            aria-label={`AI credits: ${aiCreditsCount}${aiCreditsLow ? ' (low balance)' : ''}`}
          >
            <span className="topbar__credits-icon" aria-hidden="true">
              ✨
            </span>
            <span className="topbar__credits-count">{aiCreditsCount} credits</span>
          </div>
        )}

        {/* Help button - hide on mobile (accessible via mobile menu instead) */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleHelpPanel}
            aria-label="Toggle help panel"
            className="topbar__help-button"
          >
            ?
          </Button>
        )}
      </div>
    </div>
  )
}
