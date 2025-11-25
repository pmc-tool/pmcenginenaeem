/**
 * HelpPanel - Contextual Help Overlay
 * Constitutional requirement: 250ms slide-in from right, Escape to close
 */

import React, { useEffect } from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import { Button } from '../ui/Button'
import './HelpPanel.css'

export const HelpPanel: React.FC = () => {
  const isOpen = useDashboardStore((state) => state.shell.isHelpPanelOpen)
  const mode = useDashboardStore((state) => state.shell.mode)
  const toggleHelpPanel = useDashboardStore((state) => state.toggleHelpPanel)

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        toggleHelpPanel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, toggleHelpPanel])

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      const panel = document.querySelector('.help-panel') as HTMLElement
      if (panel) {
        panel.focus()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const getContextualHelp = () => {
    switch (mode) {
      case 'wizard':
        return {
          title: 'Wizard Mode Help',
          sections: [
            {
              heading: 'Getting Started',
              content: 'Follow the step-by-step wizard to set up your site quickly and easily.',
            },
            {
              heading: 'Navigation',
              content: 'Use the Next and Previous buttons to move through the wizard steps.',
            },
          ],
        }
      case 'edit':
        return {
          title: 'Edit Mode Help',
          sections: [
            {
              heading: 'Editing Content',
              content: 'Click on any section in the canvas to edit its content in the Inspector panel.',
            },
            {
              heading: 'Keyboard Shortcuts',
              content: (
                <ul>
                  <li><kbd>Cmd+P</kbd> / <kbd>Ctrl+P</kbd> - Toggle preview mode</li>
                  <li><kbd>Escape</kbd> - Exit preview mode or close help panel</li>
                  <li><kbd>Tab</kbd> - Navigate between fields and sections</li>
                  <li><kbd>Arrow Keys</kbd> - Navigate pages in sidebar</li>
                </ul>
              ),
            },
            {
              heading: 'Pages & Sections',
              content: 'Use the Pages icon in the left rail to open the page sidebar. Expand pages to see and edit their sections.',
            },
            {
              heading: 'Inspector Tabs',
              content: (
                <ul>
                  <li><strong>Content</strong> - Edit text, images, and section fields</li>
                  <li><strong>AI Assistant</strong> - Get AI-powered content suggestions</li>
                  <li><strong>Settings</strong> - Configure page and section settings</li>
                  <li><strong>Logic & Data</strong> - Manage dynamic content and data sources</li>
                  <li><strong>Advanced</strong> - Developer options and custom code</li>
                </ul>
              ),
            },
          ],
        }
      case 'preview':
        return {
          title: 'Preview Mode Help',
          sections: [
            {
              heading: 'Full-Screen Preview',
              content: 'You are viewing your site as your visitors will see it.',
            },
            {
              heading: 'Exit Preview',
              content: 'Press Escape or click the "← Edit" button to return to editing mode.',
            },
          ],
        }
      case 'settings':
        return {
          title: 'Settings Mode Help',
          sections: [
            {
              heading: 'Site Settings',
              content: 'Configure global site settings, SEO, integrations, and more.',
            },
          ],
        }
      default:
        return {
          title: 'Help',
          sections: [
            {
              heading: 'Welcome',
              content: 'Use this help panel to learn about the PMC Engine Editor features.',
            },
          ],
        }
    }
  }

  const helpContent = getContextualHelp()

  return (
    <>
      {/* Overlay backdrop */}
      <div className="help-panel-overlay" onClick={toggleHelpPanel} aria-hidden="true" />

      {/* Help panel */}
      <aside
        className="help-panel"
        role="dialog"
        aria-label="Help panel"
        aria-modal="true"
        tabIndex={-1}
      >
        <div className="help-panel__header">
          <h2 className="help-panel__title">{helpContent.title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleHelpPanel}
            aria-label="Close help panel"
            className="help-panel__close"
          >
            ✕
          </Button>
        </div>

        <div className="help-panel__content">
          {helpContent.sections.map((section, index) => (
            <section key={index} className="help-panel__section">
              <h3 className="help-panel__section-heading">{section.heading}</h3>
              <div className="help-panel__section-content">
                {typeof section.content === 'string' ? <p>{section.content}</p> : section.content}
              </div>
            </section>
          ))}

          <section className="help-panel__section help-panel__section--footer">
            <h3 className="help-panel__section-heading">Need More Help?</h3>
            <p>
              Visit our{' '}
              <a href="https://docs.pmcengine.com" target="_blank" rel="noopener noreferrer">
                documentation
              </a>{' '}
              or{' '}
              <a href="https://support.pmcengine.com" target="_blank" rel="noopener noreferrer">
                contact support
              </a>
              .
            </p>
          </section>
        </div>
      </aside>
    </>
  )
}
