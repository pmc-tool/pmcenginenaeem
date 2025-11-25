/**
 * SettingsTab - Page and Section Settings
 * Configure metadata, visibility, and advanced options
 */

import React, { useState } from 'react'
import { AITrainingPanel } from '../settings/AITrainingPanel'
import './SettingsTab.css'

export const SettingsTab: React.FC = () => {
  const [showAITraining, setShowAITraining] = useState(false)

  if (showAITraining) {
    return (
      <div className="settings-tab" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1000 }}>
          <button
            onClick={() => setShowAITraining(false)}
            style={{
              padding: '0.5rem 1rem',
              background: '#EA2724',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            ← Back to Settings
          </button>
        </div>
        <AITrainingPanel siteId="demo_site_001" />
      </div>
    )
  }

  return (
    <div className="settings-tab">
      <div className="settings-tab__content">
        <div className="settings-tab__section">
          <h3 className="settings-tab__section-title">AI Training</h3>
          <p className="settings-tab__section-description">
            Help AI understand your brand and business to generate more accurate,
            on-brand content.
          </p>
          <button
            onClick={() => setShowAITraining(true)}
            className="settings-tab__button settings-tab__button--primary"
          >
            Open AI Training Panel
          </button>
        </div>

        <div className="settings-tab__section">
          <h3 className="settings-tab__section-title">Page Settings</h3>
          <p className="settings-tab__hint">
            Manage visibility, SEO metadata, custom CSS, and other advanced configuration options.
          </p>
          <p className="settings-tab__hint" style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
            Coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}
