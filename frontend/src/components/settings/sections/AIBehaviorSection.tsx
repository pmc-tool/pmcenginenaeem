/**
 * AI Behavior Section (Section 6)
 * Feature: 005-basic-ai-training
 * User Story 6 (P2): AI Boundaries & Preferences
 */

import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTrainingStore } from '../../../stores/trainingStore'
import type { AIBehavior, RewriteStrength, SensitiveArea } from '../../../types/training'
import { AIBehaviorPreview } from '../AIBehaviorPreview'
import './SectionStyles.css'
import './AIBehaviorSection.css'

const REWRITE_STRENGTHS: { value: RewriteStrength; label: string; description: string }[] = [
  {
    value: 'light',
    label: 'Light',
    description: 'Minor tweaks - fix typos, improve clarity',
  },
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'Moderate changes - rewrite for better flow',
  },
  {
    value: 'heavy',
    label: 'Heavy',
    description: 'Major rewrites - completely rethink content',
  },
]

const SENSITIVE_AREAS: { value: SensitiveArea; label: string }[] = [
  { value: 'pricing', label: 'Pricing & Costs' },
  { value: 'legal', label: 'Legal Terms & Policies' },
  { value: 'testimonials', label: 'Testimonials & Reviews' },
  { value: 'other', label: 'Other (specify below)' },
]

export const AIBehaviorSection: React.FC = () => {
  const { currentProfile, updateSection } = useTrainingStore()
  const data = currentProfile?.section6_aiBehavior

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<AIBehavior>({
    defaultValues: data,
    mode: 'onBlur',
  })

  const watchedSensitiveAreas = watch('sensitiveAreas')

  // Watch all fields and update store on change
  useEffect(() => {
    const subscription = watch((value) => {
      updateSection('section6_aiBehavior', value as Partial<AIBehavior>)
    })
    return () => subscription.unsubscribe()
  }, [watch, updateSection])

  return (
    <section id="ai-behavior" className="training-section">
      <div className="section-header">
        <h2>AI Boundaries & Preferences</h2>
        <p className="section-description">
          Control how aggressively AI can modify your content and which areas should never
          be changed
        </p>
      </div>

      <div className="form-grid">
        {/* Rewrite Strength */}
        <div className="form-field form-field--full">
          <label htmlFor="rewriteStrength">
            Rewrite Strength <span className="required">*</span>
          </label>
          <p className="helper-text" style={{ marginBottom: '1rem' }}>
            How much freedom should AI have when rewriting content?
          </p>

          <div className="rewrite-options">
            {REWRITE_STRENGTHS.map((option) => (
              <label
                key={option.value}
                className={`rewrite-option ${
                  watch('rewriteStrength') === option.value ? 'rewrite-option--selected' : ''
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register('rewriteStrength', {
                    required: 'Please select a rewrite strength',
                  })}
                  className="rewrite-option__radio"
                />
                <div className="rewrite-option__content">
                  <span className="rewrite-option__label">{option.label}</span>
                  <span className="rewrite-option__description">{option.description}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.rewriteStrength && (
            <span className="error-message">{errors.rewriteStrength.message}</span>
          )}
        </div>

        {/* Sensitive Areas */}
        <div className="form-field form-field--full">
          <label>Sensitive Areas (Do Not Modify)</label>
          <p className="helper-text" style={{ marginBottom: '1rem' }}>
            Select areas that AI should never change without explicit permission
          </p>

          <div className="sensitive-areas">
            {SENSITIVE_AREAS.map((area) => (
              <label key={area.value} className="checkbox-label">
                <input
                  type="checkbox"
                  value={area.value}
                  {...register('sensitiveAreas')}
                  className="checkbox-input"
                />
                <span className="checkbox-text">{area.label}</span>
              </label>
            ))}
          </div>

          {/* Custom Sensitive Area Text */}
          {watchedSensitiveAreas?.includes('other') && (
            <div className="form-field" style={{ marginTop: '1rem' }}>
              <label htmlFor="customSensitiveText">
                Specify Other Sensitive Areas
              </label>
              <textarea
                id="customSensitiveText"
                rows={2}
                {...register('customSensitiveText', {
                  maxLength: {
                    value: 200,
                    message: 'Maximum 200 characters',
                  },
                })}
                placeholder="e.g., Medical disclaimers, Certifications, Awards"
                className={errors.customSensitiveText ? 'error' : ''}
              />
              {errors.customSensitiveText && (
                <span className="error-message">{errors.customSensitiveText.message}</span>
              )}
            </div>
          )}
        </div>

        {/* Always Keep Instructions */}
        <div className="form-field form-field--full">
          <label htmlFor="alwaysKeepInstructions">
            Always Keep (Optional)
          </label>
          <textarea
            id="alwaysKeepInstructions"
            rows={3}
            {...register('alwaysKeepInstructions', {
              maxLength: {
                value: 300,
                message: 'Maximum 300 characters',
              },
            })}
            placeholder="Specific elements, phrases, or formatting that should always be preserved (e.g., 'Keep the welcome message exactly as written', 'Never change the call-to-action button text')"
            className={errors.alwaysKeepInstructions ? 'error' : ''}
          />
          {errors.alwaysKeepInstructions && (
            <span className="error-message">{errors.alwaysKeepInstructions.message}</span>
          )}
          <span className="helper-text">
            Optional: Specific instructions for what AI should never modify
          </span>
        </div>

        {/* AI Behavior Preview */}
        <div className="form-field form-field--full">
          <AIBehaviorPreview />
        </div>
      </div>
    </section>
  )
}
