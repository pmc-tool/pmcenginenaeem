/**
 * Visual Identity Section (Section 2)
 * Feature: 005-basic-ai-training
 * User Story 2 (P1): Visual Identity Setup
 */

import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTrainingStore } from '../../../stores/trainingStore'
import { ImageUploadField } from '../fields/ImageUploadField'
import { ColorPickerField } from '../fields/ColorPickerField'
import type { VisualIdentity } from '../../../types/training'
import './SectionStyles.css'

export const VisualIdentitySection: React.FC = () => {
  const { currentProfile, updateSection } = useTrainingStore()
  const data = currentProfile?.section2_visualIdentity

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<VisualIdentity>({
    defaultValues: data,
    mode: 'onBlur',
  })

  // Watch all fields and update store on change
  useEffect(() => {
    const subscription = watch((value) => {
      updateSection('section2_visualIdentity', value as Partial<VisualIdentity>)
    })
    return () => subscription.unsubscribe()
  }, [watch, updateSection])

  return (
    <section id="visual-identity" className="training-section">
      <div className="section-header">
        <h2>Visual Identity</h2>
        <p className="section-description">
          Upload your logo and define brand colors to help AI maintain visual consistency
        </p>
      </div>

      <div className="form-grid">
        {/* Primary Logo Upload - Simplified for MVP */}
        <div className="form-field form-field--full">
          <label htmlFor="primaryLogo">
            Primary Logo
          </label>
          <p className="helper-text" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            Upload your main logo (PNG, SVG recommended for best quality)
          </p>
          <p className="helper-text" style={{ margin: '0 0 1rem', fontSize: '11px', color: '#999' }}>
            Note: Full file upload with storage is coming soon. For now, you can describe your logo in the Brand Basics section.
          </p>
        </div>

        {/* Primary Color */}
        <div className="form-field">
          <Controller
            name="primaryColor"
            control={control}
            render={({ field }) => (
              <ColorPickerField
                id="primaryColor"
                label="Primary Brand Color"
                value={field.value || ''}
                onChange={field.onChange}
                helperText="Your main brand color (e.g., buttons, links)"
              />
            )}
          />
        </div>

        {/* Secondary Color */}
        <div className="form-field">
          <Controller
            name="secondaryColor"
            control={control}
            render={({ field }) => (
              <ColorPickerField
                id="secondaryColor"
                label="Secondary Color"
                value={field.value || ''}
                onChange={field.onChange}
                helperText="Supporting color for accents and highlights"
              />
            )}
          />
        </div>
      </div>
    </section>
  )
}
