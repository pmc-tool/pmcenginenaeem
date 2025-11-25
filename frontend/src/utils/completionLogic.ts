/**
 * Completion logic for training panel sections
 * Feature: 005-basic-ai-training
 */

import type {
  TrainingProfile,
  SectionId,
  CompletionState,
  BrandBasics,
  VisualIdentity,
  VoiceTone,
  Offerings,
  Contact,
  AIBehavior
} from '../types/training'

/**
 * Get completion state for Section 1: Brand Basics
 * Complete when: brandName + elevatorPitch + description + industry all filled
 */
function getBrandBasicsCompletion(data: BrandBasics): CompletionState {
  const required = [data.brandName, data.elevatorPitch, data.description, data.industry]
  const filled = required.filter(Boolean).length

  if (filled === 0) return 'not-started'
  if (filled < 4) return 'partial'
  return 'complete'
}

/**
 * Get completion state for Section 2: Visual Identity
 * Complete when: at least one brand color is defined
 * MVP simplified: File uploads coming in later phase
 */
function getVisualIdentityCompletion(data: VisualIdentity): CompletionState {
  const hasColors = !!(data.primaryColor || data.secondaryColor)

  if (!hasColors) return 'not-started'

  // Complete if at least primary color is set
  if (data.primaryColor) return 'complete'

  return 'partial'
}

/**
 * Get completion state for Section 3: Voice & Tone
 * Complete when: both sliders set OR (toneDescription + wordsToUse has items)
 */
function getVoiceToneCompletion(data: VoiceTone): CompletionState {
  const hasToneSettings = data.formalCasualLevel !== null || data.playfulSeriousLevel !== null
  const hasDescription = data.toneDescription.length > 0
  const hasWordLists = data.wordsToUse.length > 0 || data.wordsToAvoid.length > 0

  if (!hasToneSettings && !hasDescription && !hasWordLists) {
    return 'not-started'
  }

  const bothSlidersSet = data.formalCasualLevel !== null && data.playfulSeriousLevel !== null
  const descriptionWithWords = hasDescription && hasWordLists

  if (bothSlidersSet || descriptionWithWords) {
    return 'complete'
  }

  return 'partial'
}

/**
 * Get completion state for Section 4: Offerings
 * Complete when: 3+ services with descriptions AND CTA provided
 */
function getOfferingsCompletion(data: Offerings): CompletionState {
  const hasServices = data.services.length > 0
  const hasCTA = data.primaryCTA.length > 0

  if (!hasServices && !hasCTA) return 'not-started'

  const servicesWithDesc = data.services.filter(
    (s) => s.name && s.description
  ).length
  const isComplete = servicesWithDesc >= 3 && hasCTA

  if (isComplete) return 'complete'
  return 'partial'
}

/**
 * Get completion state for Section 5: Contact
 * Complete when: email AND (phone OR socialLinks exist)
 */
function getContactCompletion(data: Contact): CompletionState {
  const hasAny = !!(
    data.email ||
    data.phone ||
    data.address ||
    data.socialLinks.length > 0
  )

  if (!hasAny) return 'not-started'

  const isComplete = !!(data.email && (data.phone || data.socialLinks.length > 0))
  if (isComplete) return 'complete'

  return 'partial'
}

/**
 * Get completion state for Section 6: AI Behavior
 * Complete when: rewriteStrength set AND (sensitiveAreas OR alwaysKeepInstructions)
 */
function getAIBehaviorCompletion(data: AIBehavior): CompletionState {
  const hasSettings =
    data.rewriteStrength ||
    data.sensitiveAreas.length > 0 ||
    data.alwaysKeepInstructions.length > 0

  if (!hasSettings) return 'not-started'

  const isComplete = !!(
    data.rewriteStrength &&
    (data.sensitiveAreas.length > 0 || data.alwaysKeepInstructions.length > 0)
  )

  if (isComplete) return 'complete'
  return 'partial'
}

/**
 * Get completion state for a specific section
 */
export function getSectionCompletion(
  section: SectionId,
  profile: TrainingProfile
): CompletionState {
  switch (section) {
    case 'brand-basics':
      return getBrandBasicsCompletion(profile.section1_brandBasics)
    case 'visual-identity':
      return getVisualIdentityCompletion(profile.section2_visualIdentity)
    case 'voice-tone':
      return getVoiceToneCompletion(profile.section3_voiceTone)
    case 'offerings':
      return getOfferingsCompletion(profile.section4_offerings)
    case 'contact':
      return getContactCompletion(profile.section5_contact)
    case 'ai-behavior':
      return getAIBehaviorCompletion(profile.section6_aiBehavior)
    default:
      return 'not-started'
  }
}

/**
 * Calculate overall completion status for entire profile
 * Returns "X/6" format (e.g., "3/6")
 */
export function getOverallCompletion(profile: TrainingProfile): string {
  const sections: SectionId[] = [
    'brand-basics',
    'visual-identity',
    'voice-tone',
    'offerings',
    'contact',
    'ai-behavior'
  ]

  const completed = sections.filter(
    (section) => getSectionCompletion(section, profile) === 'complete'
  ).length

  return `${completed}/6`
}

/**
 * Calculate complete completion status object for profile
 */
export function calculateCompletionStatus(profile: TrainingProfile) {
  const sections: SectionId[] = [
    'brand-basics',
    'visual-identity',
    'voice-tone',
    'offerings',
    'contact',
    'ai-behavior'
  ]

  const sectionStatus: Record<SectionId, CompletionState> = {
    'brand-basics': getSectionCompletion('brand-basics', profile),
    'visual-identity': getSectionCompletion('visual-identity', profile),
    'voice-tone': getSectionCompletion('voice-tone', profile),
    offerings: getSectionCompletion('offerings', profile),
    contact: getSectionCompletion('contact', profile),
    'ai-behavior': getSectionCompletion('ai-behavior', profile)
  }

  return {
    overall: getOverallCompletion(profile),
    sections: sectionStatus
  }
}
