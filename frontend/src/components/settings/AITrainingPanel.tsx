/**
 * AI Training Panel - Main Component
 * Feature: 005-basic-ai-training
 */

import React, { useEffect } from 'react'
import { useTrainingStore } from '../../stores/trainingStore'
import { TrainingStepper } from './TrainingStepper'
import { BrandBasicsSection } from './sections/BrandBasicsSection'
import { VisualIdentitySection } from './sections/VisualIdentitySection'
import { VoiceToneSection } from './sections/VoiceToneSection'
import { OfferingsSection } from './sections/OfferingsSection'
import { ContactSection } from './sections/ContactSection'
import { AIBehaviorSection } from './sections/AIBehaviorSection'
import './AITrainingPanel.css'

interface AITrainingPanelProps {
  siteId: string
}

export const AITrainingPanel: React.FC<AITrainingPanelProps> = ({ siteId }) => {
  const {
    currentProfile,
    isDirty,
    activeSection,
    isSaving,
    lastSaveError,
    loadProfile,
    saveProfile,
    discardChanges,
    clearError
  } = useTrainingStore()

  // Load profile on mount
  useEffect(() => {
    loadProfile(siteId)
  }, [siteId, loadProfile])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  if (!currentProfile) {
    return (
      <div className="ai-training-panel ai-training-panel--loading">
        <div className="loading-spinner">Loading training panel...</div>
      </div>
    )
  }

  return (
    <div className="ai-training-panel">
      {/* Header */}
      <header className="training-header">
        <div className="training-header__info">
          <h1>AI Training</h1>
          <p>Help AI understand your brand and business</p>
          <span className="completion-badge">
            {currentProfile.completionStatus.overall} sections complete
          </span>
        </div>

        <div className="training-header__actions">
          {lastSaveError && (
            <div className="save-error">
              <span>{lastSaveError}</span>
              <button
                onClick={clearError}
                className="btn-clear-error"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          <button
            onClick={discardChanges}
            disabled={!isDirty || isSaving}
            className="btn btn--secondary"
          >
            Discard Changes
          </button>

          <button
            onClick={saveProfile}
            disabled={!isDirty || isSaving}
            className="btn btn--primary"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="training-content">
        <TrainingStepper />

        <div className="training-sections">
          {/* Section 1: Brand Basics */}
          {activeSection === 'brand-basics' && <BrandBasicsSection />}

          {/* Section 2: Visual Identity */}
          {activeSection === 'visual-identity' && <VisualIdentitySection />}

          {/* Section 3: Voice & Tone */}
          {activeSection === 'voice-tone' && <VoiceToneSection />}

          {/* Section 4: Offerings */}
          {activeSection === 'offerings' && <OfferingsSection />}

          {/* Section 5: Contact */}
          {activeSection === 'contact' && <ContactSection />}

          {/* Section 6: AI Behavior */}
          {activeSection === 'ai-behavior' && <AIBehaviorSection />}
        </div>
      </div>
    </div>
  )
}
