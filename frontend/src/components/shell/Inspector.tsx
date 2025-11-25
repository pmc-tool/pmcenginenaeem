/**
 * Inspector - Right Panel with Tabs
 * Constitutional requirement: FR-005, 5 tabs (Content, AI Assistant, Settings, Logic & Data, Advanced)
 * Inspector is Source of Truth for all structured editing
 */

import React from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import type { InspectorTab } from '../../store/dashboardStore'
import { useBreakpoint } from '../../hooks/responsive'
import { ResizeHandle } from '../ui/ResizeHandle'
import { BottomSheet } from './BottomSheet'
import { ContentTab } from '../inspector/ContentTab'
import { AIAssistantTab } from '../inspector/AIAssistantTab'
import { SettingsTab } from '../inspector/SettingsTab'
import { LogicDataTab } from '../inspector/LogicDataTab'
import { AdvancedTab } from '../inspector/AdvancedTab'
import './Inspector.css'

const tabs: Array<{ id: InspectorTab; label: string; priority?: 'low' }> = [
  { id: 'content', label: 'Content' },
  { id: 'ai', label: 'AI Assistant' },
  { id: 'settings', label: 'Settings' },
  { id: 'logic', label: 'Logic & Data' },
  { id: 'advanced', label: 'Advanced', priority: 'low' },
]

export const Inspector: React.FC = () => {
  // Responsive breakpoint detection
  const { isMobile } = useBreakpoint()

  const activeTab = useDashboardStore((state) => state.shell.inspectorActiveTab)
  const setActiveTab = useDashboardStore((state) => state.setInspectorActiveTab)
  const selectedSectionId = useDashboardStore((state) => state.shell.selectedSectionId)
  const inspectorWidth = useDashboardStore((state) => state.inspector.panelWidth)
  const setInspectorWidth = useDashboardStore((state) => state.setInspectorWidth)
  const isCollapsed = useDashboardStore((state) => state.inspector.isCollapsed)
  const toggleCollapse = useDashboardStore((state) => state.toggleInspectorCollapse)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return <ContentTab selectedSectionId={selectedSectionId} />
      case 'ai':
        return <AIAssistantTab />
      case 'settings':
        return <SettingsTab />
      case 'logic':
        return <LogicDataTab />
      case 'advanced':
        return <AdvancedTab />
      default:
        return null
    }
  }

  // Inspector content (tabs and panel) - shared between desktop and mobile
  const inspectorContent = (
    <>
      <div className="inspector__tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`inspector__tab ${activeTab === tab.id ? 'inspector__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            data-priority={tab.priority}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="inspector__content" role="tabpanel" id={`panel-${activeTab}`}>
        {renderTabContent()}
      </div>
    </>
  )

  // On mobile, render as full-screen bottom sheet
  if (isMobile) {
    // Inspector is always "open" on mobile when a section is selected
    // It's shown/hidden by the Shell component based on selection state
    return (
      <BottomSheet
        isOpen={selectedSectionId !== null}
        onClose={() => {}} // No-op - inspector closed via section deselection, not directly
        snapPoint="full"
        title="Inspector"
      >
        <div className="inspector inspector--mobile">
          {inspectorContent}
        </div>
      </BottomSheet>
    )
  }

  // Desktop: if collapsed, show minimal expand button
  if (isCollapsed) {
    return (
      <aside
        id="inspector"
        className="shell-inspector inspector inspector--collapsed"
        aria-label="Inspector panel (collapsed)"
        tabIndex={-1}
        style={{ width: '48px' }}
      >
        <button
          type="button"
          className="inspector__expand-btn"
          onClick={toggleCollapse}
          aria-label="Expand inspector panel"
          title="Expand inspector (show panel)"
        >
          <span aria-hidden="true">←</span>
        </button>
      </aside>
    )
  }

  // Desktop: full inspector panel
  return (
    <aside id="inspector" className="shell-inspector inspector" aria-label="Inspector panel" tabIndex={-1} style={{ width: `${inspectorWidth}px` }}>
      <div className="inspector__resize-area">
        <ResizeHandle
          onResize={setInspectorWidth}
          minWidth={280}
          maxWidth={600}
          initialWidth={inspectorWidth}
          orientation="vertical"
          ariaLabel="Resize inspector panel"
        />
        <button
          type="button"
          className="inspector__collapse-btn"
          onClick={toggleCollapse}
          aria-label="Collapse inspector panel"
          title="Collapse inspector"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {inspectorContent}
    </aside>
  )
}
