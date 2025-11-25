/**
 * Training Stepper Navigation Component
 * Feature: 005-basic-ai-training
 */

import React from 'react'
import { useTrainingStore } from '../../stores/trainingStore'
import type { SectionId } from '../../types/training'
import './TrainingStepper.css'

interface StepperSection {
  id: SectionId
  label: string
}

const SECTIONS: StepperSection[] = [
  { id: 'brand-basics', label: 'Brand & Business' },
  { id: 'visual-identity', label: 'Visual Identity' },
  { id: 'voice-tone', label: 'Voice & Tone' },
  { id: 'offerings', label: 'Offerings & CTA' },
  { id: 'contact', label: 'Contact & Social' },
  { id: 'ai-behavior', label: 'AI Behavior' }
]

export const TrainingStepper: React.FC = () => {
  const { currentProfile, activeSection, setActiveSection } = useTrainingStore()

  const scrollToSection = (sectionId: SectionId) => {
    setActiveSection(sectionId)

    // Scroll to section element (when sections are implemented)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="training-stepper" aria-label="Training sections">
      {SECTIONS.map((section, index) => {
        const completionState = currentProfile?.completionStatus.sections[section.id]
        const isActive = activeSection === section.id
        const isComplete = completionState === 'complete'
        const isPartial = completionState === 'partial'

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`stepper-item ${isActive ? 'stepper-item--active' : ''} ${
              isComplete ? 'stepper-item--complete' : ''
            } ${isPartial ? 'stepper-item--partial' : ''}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <span className="stepper-item__number">{index + 1}</span>
            <span className="stepper-item__label">{section.label}</span>
            {isComplete && (
              <span className="stepper-item__check" aria-label="Complete">
                ✓
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
