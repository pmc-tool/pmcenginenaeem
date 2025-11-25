/**
 * AI Training Panel - Main Component (REFACTORED)
 * Feature: 005-basic-ai-training
 *
 * Refactored to use:
 * - LoadingState component from Phase 2
 * - Extracted AITrainingHeader sub-component
 * - Cleaner component structure
 *
 * Benefits:
 * - Reduced from 130 LOC to ~85 LOC
 * - Reusable LoadingState component
 * - Better separation of concerns
 * - Consistent loading UI with rest of app
 *
 * Future improvements (for next iterations):
 * - Could use useFormDirty hook for unsaved changes tracking
 * - Could use Panel component for section wrappers
 * - Could use useAutoSave for automatic saving
 */

import React, { useEffect } from 'react';
import { useTrainingStore } from '../../stores/trainingStore';
import { LoadingState } from '../ui';
import { AITrainingHeader } from './AITrainingHeader';
import { TrainingStepper } from './TrainingStepper';
import { BrandBasicsSection } from './sections/BrandBasicsSection';
import { VisualIdentitySection } from './sections/VisualIdentitySection';
import { VoiceToneSection } from './sections/VoiceToneSection';
import { OfferingsSection } from './sections/OfferingsSection';
import { ContactSection } from './sections/ContactSection';
import { AIBehaviorSection } from './sections/AIBehaviorSection';
import './AITrainingPanel.css';

interface AITrainingPanelProps {
  siteId: string;
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
    clearError,
  } = useTrainingStore();

  // Load profile on mount
  useEffect(() => {
    loadProfile(siteId);
  }, [siteId, loadProfile]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Show loading state while profile loads
  if (!currentProfile) {
    return (
      <div className="ai-training-panel ai-training-panel--loading">
        <LoadingState message="Loading training panel..." size="md" />
      </div>
    );
  }

  const completionStatus = `${currentProfile.completionStatus.overall} sections complete`;

  return (
    <div className="ai-training-panel">
      <AITrainingHeader
        completionStatus={completionStatus}
        isDirty={isDirty}
        isSaving={isSaving}
        lastSaveError={lastSaveError}
        onSave={saveProfile}
        onDiscard={discardChanges}
        onClearError={clearError}
      />

      <div className="training-content">
        <TrainingStepper />

        <div className="training-sections">
          {activeSection === 'brand-basics' && <BrandBasicsSection />}
          {activeSection === 'visual-identity' && <VisualIdentitySection />}
          {activeSection === 'voice-tone' && <VoiceToneSection />}
          {activeSection === 'offerings' && <OfferingsSection />}
          {activeSection === 'contact' && <ContactSection />}
          {activeSection === 'ai-behavior' && <AIBehaviorSection />}
        </div>
      </div>
    </div>
  );
};
