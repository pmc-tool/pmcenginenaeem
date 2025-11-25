/**
 * Settings Sidebar
 * Shows when Settings icon is clicked in left rail
 */

import React from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import { useTrainingStore } from '../../stores/trainingStore'
import { useBreakpoint } from '../../hooks/responsive'
import { BottomSheet } from './BottomSheet'
import { AITrainingPanel } from '../settings/AITrainingPanel'
import './SettingsSidebar.css'

interface SettingsSidebarProps {
  visible: boolean
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ visible }) => {
  // Responsive breakpoint detection
  const { isMobile } = useBreakpoint()

  const isAITrainingOpen = useDashboardStore((state) => state.shell.isAITrainingOpen)
  const setAITrainingOpen = useDashboardStore((state) => state.setAITrainingOpen)
  const setActiveLeftRailTab = useDashboardStore((state) => state.setActiveLeftRailTab)

  // Check for unsaved changes in AI Training
  const isDirty = useTrainingStore((state) => state.isDirty)
  const discardChanges = useTrainingStore((state) => state.discardChanges)

  const handleBackClick = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to go back? Your changes will be lost.'
      )
      if (!confirmed) {
        return // Don't go back
      }
      // User confirmed, discard changes
      discardChanges()
    }
    setAITrainingOpen(false)
  }

  if (!visible) return null

  // Settings content - AI Training Panel
  const aiTrainingContent = (
    <>
      <div className="settings-sidebar__back">
        <button
          onClick={handleBackClick}
          className="settings-sidebar__back-btn"
        >
          ← Back to Settings
        </button>
      </div>
      <div className="settings-sidebar__panel">
        <AITrainingPanel siteId="demo_site_001" />
      </div>
    </>
  )

  // Settings content - Main menu
  const settingsMenuContent = (
    <>
      <div className="settings-sidebar__header">
        <h2 className="settings-sidebar__title">Settings</h2>
      </div>

      <div className="settings-sidebar__content">
        <div className="settings-sidebar__section">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setAITrainingOpen(true)
            }}
            className="settings-sidebar__item"
          >
            <span className="settings-sidebar__item-icon">🤖</span>
            <div className="settings-sidebar__item-content">
              <h3 className="settings-sidebar__item-title">AI Training</h3>
              <p className="settings-sidebar__item-description">
                Help AI understand your brand and business
              </p>
            </div>
            <span className="settings-sidebar__item-arrow">→</span>
          </button>
        </div>

        <div className="settings-sidebar__section">
          <div className="settings-sidebar__item settings-sidebar__item--disabled">
            <span className="settings-sidebar__item-icon">⚙</span>
            <div className="settings-sidebar__item-content">
              <h3 className="settings-sidebar__item-title">Site Settings</h3>
              <p className="settings-sidebar__item-description">
                General configuration and preferences
              </p>
            </div>
            <span className="settings-sidebar__item-badge">Coming Soon</span>
          </div>
        </div>

        <div className="settings-sidebar__section">
          <div className="settings-sidebar__item settings-sidebar__item--disabled">
            <span className="settings-sidebar__item-icon">🎨</span>
            <div className="settings-sidebar__item-content">
              <h3 className="settings-sidebar__item-title">Theme Settings</h3>
              <p className="settings-sidebar__item-description">
                Customize colors, fonts, and styles
              </p>
            </div>
            <span className="settings-sidebar__item-badge">Coming Soon</span>
          </div>
        </div>

        <div className="settings-sidebar__section">
          <div className="settings-sidebar__item settings-sidebar__item--disabled">
            <span className="settings-sidebar__item-icon">🔌</span>
            <div className="settings-sidebar__item-content">
              <h3 className="settings-sidebar__item-title">Integrations</h3>
              <p className="settings-sidebar__item-description">
                Connect third-party services and APIs
              </p>
            </div>
            <span className="settings-sidebar__item-badge">Coming Soon</span>
          </div>
        </div>
      </div>
    </>
  )

  // On mobile, render as bottom sheet
  if (isMobile) {
    return (
      <BottomSheet
        isOpen={visible}
        onClose={() => setActiveLeftRailTab(null)}
        snapPoint="full"
        title={isAITrainingOpen ? "AI Training" : "Settings"}
      >
        <div className={`settings-sidebar settings-sidebar--mobile ${isAITrainingOpen ? 'settings-sidebar--training' : ''}`} aria-label={isAITrainingOpen ? "AI Training Panel" : "Settings"}>
          {isAITrainingOpen ? aiTrainingContent : settingsMenuContent}
        </div>
      </BottomSheet>
    )
  }

  // Desktop: render as sidebar
  if (isAITrainingOpen) {
    return (
      <aside
        className="shell-sidebar settings-sidebar settings-sidebar--training"
        aria-label="AI Training Panel"
      >
        {aiTrainingContent}
      </aside>
    )
  }

  return (
    <aside
      className="shell-sidebar settings-sidebar"
      aria-label="Settings"
    >
      {settingsMenuContent}
    </aside>
  )
}
