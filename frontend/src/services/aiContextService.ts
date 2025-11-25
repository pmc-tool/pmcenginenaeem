/**
 * AI Context Integration Service
 * Feature: 005-basic-ai-training
 * Builds training context for AI system prompts
 */

import type { TrainingProfile } from '../types/training'
import { trainingService } from './trainingService'

/**
 * Sanitize user input to prevent prompt injection
 * Removes code blocks, special tokens, and markdown headers
 */
function sanitizeForAI(input: string): string {
  if (!input) return ''

  return (
    input
      .replace(/```/g, '') // Remove code blocks
      .replace(/<\|.*?\|>/g, '') // Remove special tokens
      .replace(/###/g, '') // Remove markdown headers
      .slice(0, 500) // Truncate to reasonable length
  )
}

/**
 * Build AI context string from training profile
 * Only includes non-empty sections to keep prompt concise
 */
export function buildAIContext(profile: TrainingProfile): string {
  const sections: string[] = []

  // Section 1: Brand Basics
  const brand = profile.section1_brandBasics
  if (brand.brandName) {
    sections.push(`Brand: ${sanitizeForAI(brand.brandName)}`)

    if (brand.tagline) {
      sections.push(`Tagline: ${sanitizeForAI(brand.tagline)}`)
    }

    if (brand.elevatorPitch) {
      sections.push(`Elevator Pitch: ${sanitizeForAI(brand.elevatorPitch)}`)
    }

    if (brand.description) {
      sections.push(`Description: ${sanitizeForAI(brand.description)}`)
    }

    if (brand.industry) {
      sections.push(`Industry: ${sanitizeForAI(brand.industry)}`)
    }

    if (brand.location) {
      sections.push(`Location: ${sanitizeForAI(brand.location)}`)
    }
  }

  // Section 2: Visual Identity
  const visual = profile.section2_visualIdentity
  if (visual.primaryColor || visual.secondaryColor) {
    const colors = []
    if (visual.primaryColor) colors.push(`primary: ${visual.primaryColor}`)
    if (visual.secondaryColor) colors.push(`secondary: ${visual.secondaryColor}`)
    sections.push(`Brand Colors: ${colors.join(', ')}`)
  }

  if (visual.primaryLogo) {
    sections.push('Logo: Uploaded (available in visual identity)')
  }

  if (visual.darkModeSupport) {
    sections.push(`Dark Mode: ${visual.darkModeSupport}`)
  }

  // Section 3: Voice & Tone
  const tone = profile.section3_voiceTone
  if (tone.formalCasualLevel !== null) {
    const toneDesc =
      tone.formalCasualLevel <= 2
        ? 'formal and professional'
        : tone.formalCasualLevel >= 4
          ? 'casual and friendly'
          : 'balanced'
    sections.push(`Tone: ${toneDesc}`)
  }

  if (tone.playfulSeriousLevel !== null) {
    const styleDesc =
      tone.playfulSeriousLevel <= 2
        ? 'playful'
        : tone.playfulSeriousLevel >= 4
          ? 'serious'
          : 'balanced'
    sections.push(`Style: ${styleDesc}`)
  }

  if (tone.toneDescription) {
    sections.push(`Voice Description: ${sanitizeForAI(tone.toneDescription)}`)
  }

  if (tone.emojiUsage && tone.emojiUsage !== 'never') {
    sections.push(`Emoji Usage: ${tone.emojiUsage}`)
  }

  if (tone.wordsToUse.length > 0) {
    sections.push(`Preferred Words: ${tone.wordsToUse.slice(0, 10).join(', ')}`)
  }

  if (tone.wordsToAvoid.length > 0) {
    sections.push(`Words to Avoid: ${tone.wordsToAvoid.slice(0, 10).join(', ')}`)
  }

  // Section 4: Offerings
  const offerings = profile.section4_offerings
  if (offerings.services.length > 0) {
    const serviceList = offerings.services
      .slice(0, 5) // Top 5 services
      .map((s) => s.name)
      .join(', ')
    sections.push(`Services/Products: ${serviceList}`)
  }

  if (offerings.primaryCTA) {
    sections.push(`Primary CTA: "${sanitizeForAI(offerings.primaryCTA)}"`)
  }

  // Section 5: Contact
  const contact = profile.section5_contact
  if (contact.email) {
    sections.push(`Contact Email: ${contact.email}`)
  }

  if (contact.phone) {
    sections.push(`Contact Phone: ${contact.phone}`)
  }

  if (contact.preferredMethod) {
    sections.push(`Preferred Contact: ${contact.preferredMethod}`)
  }

  if (contact.socialLinks.length > 0) {
    const platforms = contact.socialLinks.map((link) => link.platform).join(', ')
    sections.push(`Social Media: ${platforms}`)
  }

  // Section 6: AI Behavior
  const behavior = profile.section6_aiBehavior
  if (behavior.rewriteStrength) {
    sections.push(`Rewrite Preference: ${behavior.rewriteStrength} edits`)
  }

  if (behavior.sensitiveAreas.length > 0) {
    const areas = behavior.sensitiveAreas
      .map((area) =>
        area === 'other' && behavior.customSensitiveText
          ? behavior.customSensitiveText
          : area
      )
      .join(', ')
    sections.push(
      `Sensitive Areas (DO NOT MODIFY without explicit permission): ${areas}`
    )
  }

  if (behavior.alwaysKeepInstructions) {
    sections.push(
      `Always Keep: ${sanitizeForAI(behavior.alwaysKeepInstructions)}`
    )
  }

  // Return formatted context or empty string
  if (sections.length === 0) return ''

  return `\n\n## Site Training Context\n${sections.join('\n')}\n`
}

/**
 * Inject training context for a specific site
 * Loads profile from storage and builds context string
 * Returns empty string if no profile exists
 */
export function injectTrainingContext(siteId: string): string {
  const profile = trainingService.load(siteId)
  if (!profile) return ''

  return buildAIContext(profile)
}

/**
 * Check if training profile exists for site
 */
export function hasTrainingProfile(siteId: string): boolean {
  const profile = trainingService.load(siteId)
  return profile !== null
}

/**
 * Get completion status for site (without loading full profile)
 */
export function getTrainingCompletion(siteId: string): string {
  const profile = trainingService.load(siteId)
  return profile?.completionStatus.overall || '0/6'
}
