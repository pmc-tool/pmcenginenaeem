/**
 * AI Behavior Preview Component
 * Shows how current training settings affect AI responses
 * Feature: 005-basic-ai-training (Enhancement)
 */

import React, { useState } from 'react'
import { useTrainingStore } from '../../stores/trainingStore'
import { buildAIContext } from '../../services/aiContextService'
import './AIBehaviorPreview.css'

const SAMPLE_PROMPTS = [
  {
    id: 'homepage',
    label: 'Homepage Hero',
    prompt: 'Write a hero section headline for my homepage',
  },
  {
    id: 'about',
    label: 'About Us',
    prompt: 'Write a brief about us section',
  },
  {
    id: 'cta',
    label: 'Call-to-Action',
    prompt: 'Write a compelling call-to-action button',
  },
]

export const AIBehaviorPreview: React.FC = () => {
  const currentProfile = useTrainingStore((state) => state.currentProfile)
  const [selectedPrompt, setSelectedPrompt] = useState(SAMPLE_PROMPTS[0].id)
  const [showContext, setShowContext] = useState(false)

  if (!currentProfile) return null

  const aiContext = buildAIContext(currentProfile)
  const hasContext = aiContext.length > 0

  // Get selected prompt details
  const prompt = SAMPLE_PROMPTS.find((p) => p.id === selectedPrompt)

  // Calculate context strength
  const contextStrength = calculateContextStrength(currentProfile)

  return (
    <div className="ai-behavior-preview">
      <div className="preview-header">
        <h3 className="preview-title">AI Behavior Preview</h3>
        <p className="preview-description">
          See how your training affects AI-generated content
        </p>
      </div>

      <div className="preview-content">
        {/* Prompt Selector */}
        <div className="preview-section">
          <label className="preview-label">Sample Prompt</label>
          <div className="prompt-selector">
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPrompt(p.id)}
                className={`prompt-btn ${selectedPrompt === p.id ? 'prompt-btn--active' : ''}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Context Strength Indicator */}
        <div className="preview-section">
          <label className="preview-label">Training Completeness</label>
          <div className="context-strength">
            <div className="context-strength-bar">
              <div
                className={`context-strength-fill context-strength-fill--${contextStrength.level}`}
                style={{ width: `${contextStrength.percentage}%` }}
              />
            </div>
            <div className="context-strength-info">
              <span className="context-strength-percentage">
                {contextStrength.percentage}%
              </span>
              <span className="context-strength-label">
                {contextStrength.label}
              </span>
            </div>
          </div>
        </div>

        {/* AI Response Preview */}
        <div className="preview-section">
          <label className="preview-label">AI Response Preview</label>
          <div className="response-preview">
            {hasContext ? (
              <>
                <div className="response-preview-prompt">
                  <strong>Prompt:</strong> {prompt?.prompt}
                </div>
                <div className="response-preview-output">
                  {generatePreviewResponse(currentProfile, prompt?.id || 'homepage')}
                </div>
                <div className="response-preview-note">
                  <strong>Note:</strong> This is a simulated response based on your training.
                  Actual AI responses may vary.
                </div>
              </>
            ) : (
              <div className="response-preview-empty">
                <p>Complete more training sections to see AI behavior preview.</p>
                <p className="helper-text">
                  AI needs at least basic brand information to generate meaningful content.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Context Viewer Toggle */}
        {hasContext && (
          <div className="preview-section">
            <button
              onClick={() => setShowContext(!showContext)}
              className="context-toggle-btn"
            >
              {showContext ? '▼' : '▶'} View Training Context
              <span className="context-toggle-hint">
                ({aiContext.split('\n').length - 2} items)
              </span>
            </button>

            {showContext && (
              <div className="context-viewer">
                <pre className="context-viewer-content">{aiContext}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Calculate context strength based on completed sections
 */
function calculateContextStrength(profile: any): {
  percentage: number
  level: 'low' | 'medium' | 'high'
  label: string
} {
  const sections = [
    profile.section1_brandBasics.brandName ? 1 : 0,
    profile.section2_visualIdentity.primaryColor ? 1 : 0,
    profile.section3_voiceTone.formalCasualLevel !== null ? 1 : 0,
    profile.section4_offerings.services.length > 0 ? 1 : 0,
    profile.section5_contact.email ? 1 : 0,
    profile.section6_aiBehavior.rewriteStrength ? 1 : 0,
  ]

  const completed = sections.filter(Boolean).length
  const percentage = Math.round((completed / 6) * 100)

  let level: 'low' | 'medium' | 'high' = 'low'
  let label = 'Minimal Context'

  if (percentage >= 67) {
    level = 'high'
    label = 'Rich Context'
  } else if (percentage >= 34) {
    level = 'medium'
    label = 'Moderate Context'
  }

  return { percentage, level, label }
}

/**
 * Generate a preview response based on training profile
 */
function generatePreviewResponse(profile: any, promptId: string): string {
  const brand = profile.section1_brandBasics
  const tone = profile.section3_voiceTone
  const offerings = profile.section4_offerings
  const behavior = profile.section6_aiBehavior

  // Determine tone style
  const isFormal = tone.formalCasualLevel !== null && tone.formalCasualLevel <= 2
  const isCasual = tone.formalCasualLevel !== null && tone.formalCasualLevel >= 4

  // Generate response based on prompt type
  switch (promptId) {
    case 'homepage':
      if (!brand.brandName) return 'Need brand name to generate preview'
      const toneWord = isFormal ? 'premier' : isCasual ? 'awesome' : 'leading'
      return `${brand.brandName}: ${brand.tagline || `Your ${toneWord} solution for ${brand.industry || 'success'}`}`

    case 'about':
      if (!brand.description) return 'Need business description to generate preview'
      const aboutTone = isFormal
        ? `${brand.brandName} is a professional ${brand.industry} company`
        : isCasual
          ? `Hey! We're ${brand.brandName}, and we're all about`
          : `${brand.brandName} is`
      return `${aboutTone} ${brand.description.substring(0, 100)}...`

    case 'cta':
      const ctaText = offerings.primaryCTA || 'Get Started'
      const urgency =
        behavior.rewriteStrength === 'heavy'
          ? ' Now'
          : behavior.rewriteStrength === 'light'
            ? ''
            : ' Today'
      return `${ctaText}${urgency}`

    default:
      return 'Select a prompt to see preview'
  }
}
