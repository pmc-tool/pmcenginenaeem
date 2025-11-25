/**
 * Voice & Tone Section (Section 3)
 * Feature: 005-basic-ai-training
 * User Story 3 (P1): Voice & Tone Setup
 */

import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTrainingStore } from '../../../stores/trainingStore'
import { ToneSlider } from '../fields/ToneSlider'
import { WordListField } from '../fields/WordListField'
import type { VoiceTone } from '../../../types/training'
import './SectionStyles.css'

const EMOJI_OPTIONS = [
  { value: 'never', label: 'Never use emojis' },
  { value: 'rarely', label: 'Rarely (special occasions only)' },
  { value: 'sometimes', label: 'Sometimes (when appropriate)' },
  { value: 'often', label: 'Often (friendly tone)' },
]

export const VoiceToneSection: React.FC = () => {
  const { currentProfile, updateSection } = useTrainingStore()
  const data = currentProfile?.section3_voiceTone

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<VoiceTone>({
    defaultValues: data,
    mode: 'onBlur',
  })

  // Watch all fields and update store on change
  useEffect(() => {
    const subscription = watch((value) => {
      updateSection('section3_voiceTone', value as Partial<VoiceTone>)
    })
    return () => subscription.unsubscribe()
  }, [watch, updateSection])

  return (
    <section id="voice-tone" className="training-section">
      <div className="section-header">
        <h2>Voice & Tone</h2>
        <p className="section-description">
          Define how AI should communicate in your brand's voice - from formal to casual,
          playful to serious
        </p>
      </div>

      <div className="form-grid">
        {/* Formal/Casual Slider */}
        <div className="form-field form-field--full">
          <Controller
            name="formalCasualLevel"
            control={control}
            render={({ field }) => (
              <ToneSlider
                id="formalCasualLevel"
                label="Communication Style"
                leftLabel="Formal"
                rightLabel="Casual"
                value={field.value}
                onChange={field.onChange}
                helperText="How formal or casual should the AI sound?"
              />
            )}
          />
        </div>

        {/* Playful/Serious Slider */}
        <div className="form-field form-field--full">
          <Controller
            name="playfulSeriousLevel"
            control={control}
            render={({ field }) => (
              <ToneSlider
                id="playfulSeriousLevel"
                label="Personality"
                leftLabel="Playful"
                rightLabel="Serious"
                value={field.value}
                onChange={field.onChange}
                helperText="Should the tone be lighthearted or more serious?"
              />
            )}
          />
        </div>

        {/* Tone Description */}
        <div className="form-field form-field--full">
          <label htmlFor="toneDescription">Voice Description (Optional)</label>
          <textarea
            id="toneDescription"
            rows={3}
            {...register('toneDescription', {
              maxLength: {
                value: 300,
                message: 'Maximum 300 characters',
              },
            })}
            placeholder="Describe your brand voice in a few words (e.g., 'friendly and approachable', 'authoritative and trustworthy', 'energetic and innovative')"
            className={errors.toneDescription ? 'error' : ''}
          />
          {errors.toneDescription && (
            <span className="error-message">{errors.toneDescription.message}</span>
          )}
          <span className="helper-text">
            Optional: Provide additional context about your brand's voice
          </span>
        </div>

        {/* Emoji Usage */}
        <div className="form-field">
          <label htmlFor="emojiUsage">Emoji Usage</label>
          <select
            id="emojiUsage"
            {...register('emojiUsage')}
            className={errors.emojiUsage ? 'error' : ''}
          >
            {EMOJI_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.emojiUsage && (
            <span className="error-message">{errors.emojiUsage.message}</span>
          )}
          <span className="helper-text">How frequently should AI use emojis?</span>
        </div>

        {/* Words to Use */}
        <div className="form-field form-field--full">
          <Controller
            name="wordsToUse"
            control={control}
            render={({ field }) => (
              <WordListField
                id="wordsToUse"
                label="Preferred Words & Phrases"
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Type a word or phrase and press Enter (e.g., 'innovative', 'cutting-edge')"
                helperText="Words and phrases that align with your brand voice"
                maxItems={20}
              />
            )}
          />
        </div>

        {/* Words to Avoid */}
        <div className="form-field form-field--full">
          <Controller
            name="wordsToAvoid"
            control={control}
            render={({ field }) => (
              <WordListField
                id="wordsToAvoid"
                label="Words & Phrases to Avoid"
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Type a word or phrase and press Enter (e.g., 'cheap', 'revolutionary')"
                helperText="Words that don't match your brand or industry standards"
                maxItems={20}
              />
            )}
          />
        </div>
      </div>
    </section>
  )
}
