/**
 * LeftRail - Navigation Rail
 * Contains: Chat, Pages, Settings icons + Chat Prompt Box
 * Constitutional requirement: FR-002, 60px width
 */

import React from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import { useCodeStore } from '../../store/codeStore'
import { useTrainingStore } from '../../stores/trainingStore'
import { useBreakpoint } from '../../hooks/responsive'
import { MobileDrawer } from './MobileDrawer'
import type { LeftRailTab } from '../../store/dashboardStore'
import './LeftRail.css'

export const LeftRail: React.FC = () => {
  // Responsive breakpoint detection
  const { isMobile } = useBreakpoint()

  const activeTab = useDashboardStore((state) => state.shell.activeLeftRailTab)
  const setActiveTab = useDashboardStore((state) => state.setActiveLeftRailTab)
  const toggleChat = useDashboardStore((state) => state.toggleChat)
  const isChatOpen = useDashboardStore((state) => state.chat.isOpen)
  const isAITrainingOpen = useDashboardStore((state) => state.shell.isAITrainingOpen)
  const setAITrainingOpen = useDashboardStore((state) => state.setAITrainingOpen)
  const isMobileMenuOpen = useDashboardStore((state) => state.shell.isMobileMenuOpen)
  const toggleMobileMenu = useDashboardStore((state) => state.toggleMobileMenu)
  const viewMode = useCodeStore((state) => state.viewMode)

  // Check for unsaved changes in AI Training
  const isDirty = useTrainingStore((state) => state.isDirty)
  const discardChanges = useTrainingStore((state) => state.discardChanges)

  // Dynamic tabs based on view mode
  const tabs: Array<{ id: LeftRailTab; label: string; icon: string }> = [
    { id: 'chat', label: 'Chat', icon: '◐' },
    { id: 'pages', label: viewMode === 'code' ? 'Files' : 'Pages', icon: viewMode === 'code' ? '⋮' : '☰' },
    { id: 'themes', label: 'Themes', icon: '🎨' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ]

  const handleTabClick = (tabId: LeftRailTab) => {
    // Close AI Training panel when switching AWAY from settings tab
    if (isAITrainingOpen && tabId !== 'settings') {
      // Check for unsaved changes
      if (isDirty) {
        const confirmed = window.confirm(
          'You have unsaved changes in AI Training. Are you sure you want to leave? Your changes will be lost.'
        )
        if (!confirmed) {
          return // Don't switch tabs
        }
        // User confirmed, discard changes
        discardChanges()
      }
      setAITrainingOpen(false)
    }

    if (tabId === 'chat') {
      // Close other sidebars first
      if (activeTab !== null) {
        setActiveTab(null)
      }
      // Toggle chat panel
      toggleChat()
    } else {
      // Close chat if it's open
      if (isChatOpen) {
        toggleChat()
      }
      // Toggle the clicked tab
      setActiveTab(activeTab === tabId ? null : tabId)
    }

    // Close mobile menu drawer after tab selection on mobile
    if (isMobile && isMobileMenuOpen) {
      toggleMobileMenu()
    }
  }

  // Left rail content (same for desktop and mobile, just wrapped differently)
  const leftRailContent = (
    <nav className="shell-leftrail leftrail" aria-label="Main navigation">
      <div className="leftrail__tabs">
        {tabs.map((tab) => {
          // Chat uses its own state (isChatOpen), others use activeTab
          const isActive = tab.id === 'chat' ? isChatOpen : activeTab === tab.id

          return (
            <button
              key={tab.id}
              className={`leftrail__tab ${isActive ? 'leftrail__tab--active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              aria-label={tab.label}
              aria-pressed={isActive}
              title={tab.label}
            >
              <span className="leftrail__icon" aria-hidden="true">
                {tab.icon}
              </span>
              <span className="leftrail__label">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Profile Avatar at Bottom */}
      <div className="leftrail__profile">
        <button
          className="leftrail__profile-btn"
          aria-label="User Profile"
          title="Profile"
        >
          <div className="leftrail__avatar" aria-hidden="true">
            <img
              src="https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=EA2724"
              alt="User avatar"
              className="leftrail__avatar-img"
            />
          </div>
        </button>
      </div>
    </nav>
  )

  // On mobile, wrap in MobileDrawer; on desktop, render directly
  if (isMobile) {
    return (
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={toggleMobileMenu}>
        {leftRailContent}
      </MobileDrawer>
    )
  }

  return leftRailContent
}
