/**
 * Shell - Root Dashboard Container
 * Implements persistent 5-region layout per constitutional requirements
 * Maintains consistency across all states (wizard, edit, preview, settings)
 */

import React from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import { useCodeStore } from '../../store/codeStore'
import { useContentStore } from '../../store/contentStore'
import { useBreakpoint } from '../../hooks/responsive'
import { TopBar } from './TopBar'
import { LeftRail } from './LeftRail'
import { PageSidebar } from './PageSidebar'
import { SettingsSidebar } from './SettingsSidebar'
import { Canvas } from './Canvas'
import { Inspector } from './Inspector'
import { ChatPanel } from '../chat/ChatPanel'
import { CodePanel } from '../code/CodePanel'
import { FileExplorerSidebar } from '../code/FileExplorerSidebar'
import { HelpPanel } from '../overlays/HelpPanel'
import { SkipLinks } from '../ui/SkipLinks'
import { ToastContainer } from '../ui/ToastContainer'
import { ThemesPage } from '../themes/ThemesPage'
import { DeployPanel } from '../deployment/DeployPanel'
import { DeploymentNotification } from '../deployment/DeploymentNotification'
import { useDeploymentStore } from '../../store/deploymentStore'
import '../../styles/layout.css'
import '../../styles/responsive.css'

export const Shell: React.FC = () => {
  // Responsive breakpoint detection
  const { current: breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint()

  const isPreviewMode = useDashboardStore((state) => state.shell.isPreviewMode)
  const activeLeftRailTab = useDashboardStore((state) => state.shell.activeLeftRailTab)
  const isChatOpen = useDashboardStore((state) => state.chat.isOpen)
  const isAITrainingOpen = useDashboardStore((state) => state.shell.isAITrainingOpen)
  const isMobileMenuOpen = useDashboardStore((state) => state.shell.isMobileMenuOpen)
  const selectedPageId = useDashboardStore((state) => state.shell.selectedPageId)
  const togglePreviewMode = useDashboardStore((state) => state.togglePreviewMode)
  const toggleChat = useDashboardStore((state) => state.toggleChat)
  const setSelectedPage = useDashboardStore((state) => state.setSelectedPage)

  // Check view mode (canvas or code)
  const viewMode = useCodeStore((state) => state.viewMode)

  // Get deployment panel state
  const isDeployPanelOpen = useDeploymentStore((state) => state.isDeployPanelOpen)
  const currentSiteId = useDeploymentStore((state) => state.currentSiteId)
  const currentThemeId = useDeploymentStore((state) => state.currentThemeId)
  const getSessionBySite = useDeploymentStore((state) => state.getSessionBySite)
  const openDeployPanel = useDeploymentStore((state) => state.openDeployPanel)

  // Get active deployment session
  const activeSession = currentSiteId ? getSessionBySite(currentSiteId) : undefined

  // Get pages from content store
  const pages = useContentStore((state) => state.site.pages)

  // Initialize first page on mount if no page is selected
  React.useEffect(() => {
    if (!selectedPageId && pages.length > 0) {
      setSelectedPage(pages[0].id)
    }
  }, [selectedPageId, pages, setSelectedPage])

  // Determine if page/file sidebar should be visible
  // In code mode: file explorer shows when pages tab is active, settings when settings tab is active
  // In canvas mode: page sidebar shows when pages tab is active, settings when settings tab is active
  const showPagesSidebar = activeLeftRailTab === 'pages' && viewMode === 'canvas' && !isChatOpen
  const showSettingsSidebar = activeLeftRailTab === 'settings' && !isChatOpen
  const showFileExplorer = viewMode === 'code' && activeLeftRailTab === 'pages' && !isChatOpen && !isAITrainingOpen
  const showThemesPage = activeLeftRailTab === 'themes' && !isChatOpen

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close chat or exit preview mode (FR-017)
      if (e.key === 'Escape') {
        if (isChatOpen && !isPreviewMode) {
          toggleChat()
        } else if (isPreviewMode) {
          togglePreviewMode()
        }
      }

      // Cmd+P (Mac) or Ctrl+P (Windows/Linux) to toggle preview mode
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault()
        togglePreviewMode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPreviewMode, isChatOpen, togglePreviewMode, toggleChat])

  return (
    <div
      className={`shell ${isChatOpen ? 'shell--chat-open' : ''}`}
      data-preview-mode={isPreviewMode}
      data-view-mode={viewMode}
      data-ai-training-open={isAITrainingOpen}
      data-mobile-menu-open={isMobileMenuOpen}
      data-breakpoint={breakpoint}
      data-mobile={isMobile}
      data-tablet={isTablet}
      data-desktop={isDesktop}
    >
      {!isPreviewMode && <SkipLinks />}
      {!isPreviewMode && <TopBar />}
      {!isPreviewMode && <LeftRail />}

      {/* Sidebar: Chat, File Explorer, Page Sidebar, or Settings Sidebar */}
      {!isPreviewMode && isChatOpen && <ChatPanel />}
      {!isPreviewMode && showFileExplorer && <FileExplorerSidebar />}
      {!isPreviewMode && showPagesSidebar && <PageSidebar visible={true} />}
      {!isPreviewMode && showSettingsSidebar && <SettingsSidebar visible={true} />}

      {/* Main Area: Canvas OR Code Panel OR Themes Page (never multiple) */}
      {/* Hide Canvas when AI Training is open or Themes is active */}
      {viewMode === 'canvas' && !isAITrainingOpen && !showThemesPage && <Canvas />}
      {/* Hide Code Panel when AI Training is open or Themes is active */}
      {viewMode === 'code' && !isAITrainingOpen && !showThemesPage && <CodePanel />}
      {/* Show Themes Page when themes tab is active */}
      {!isPreviewMode && showThemesPage && <ThemesPage />}

      {/* Inspector visible in Canvas mode */}
      {/* Hide Inspector when AI Training is open or Themes is active */}
      {!isPreviewMode && viewMode === 'canvas' && !isAITrainingOpen && !showThemesPage && <Inspector />}

      <HelpPanel />
      <ToastContainer />

      {/* Deploy Panel Modal */}
      {isDeployPanelOpen && currentSiteId && currentThemeId && (
        <DeployPanel
          themeId={currentThemeId}
          siteId={currentSiteId}
          userId="user-123"
        />
      )}

      {/* Deployment Notification (shown when panel is minimized and deployment is active) */}
      {!isDeployPanelOpen && activeSession && currentSiteId && currentThemeId && (
        <DeploymentNotification
          session={activeSession}
          onOpen={() => openDeployPanel(currentSiteId, currentThemeId)}
        />
      )}
    </div>
  )
}
