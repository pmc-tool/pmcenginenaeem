/**
 * Type definitions for AI Training Panel
 * Feature: 005-basic-ai-training
 */

export type SectionId =
  | 'brand-basics'
  | 'visual-identity'
  | 'voice-tone'
  | 'offerings'
  | 'contact'
  | 'ai-behavior'

export type CompletionState = 'not-started' | 'partial' | 'complete'

export type DarkModeOption = 'light-only' | 'dark-only' | 'both'

export type EmojiPreference = 'never' | 'sometimes' | 'often' | null

export type ContactMethod = 'call' | 'whatsapp' | 'email' | 'form'

export type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'pinterest'
  | 'other'

export type RewriteStrength = 'light' | 'balanced' | 'heavy'

export type SensitiveArea = 'pricing' | 'legal' | 'testimonials' | 'other'

// File data for uploads
export interface FileData {
  name: string
  type: string
  size: number
  dataUrl: string // Base64 data URL for MVP localStorage
  uploadedAt: string
}

// Section 1: Brand Basics
export interface BrandBasics {
  brandName: string
  tagline: string
  elevatorPitch: string
  description: string
  industry: string
  location: string
}

// Section 2: Visual Identity
export interface VisualIdentity {
  primaryLogo: FileData | null
  darkModeLogo: FileData | null
  favicon: FileData | null
  darkModeSupport: DarkModeOption | null
  defaultMode: 'light' | 'dark' | null
  primaryColor: string | null
  secondaryColor: string | null
}

// Section 3: Voice & Tone
export interface VoiceTone {
  formalCasualLevel: number | null // 1-5 scale
  playfulSeriousLevel: number | null // 1-5 scale
  toneDescription: string
  emojiUsage: EmojiPreference
  wordsToUse: string[]
  wordsToAvoid: string[]
}

// Section 4: Offerings
export interface Service {
  id: string // UUID
  name: string
  description: string
  order: number
}

export interface Offerings {
  services: Service[]
  primaryCTA: string
}

// Section 5: Contact
export interface SocialLink {
  id: string // UUID
  platform: SocialPlatform
  url: string
  order: number
}

export interface Contact {
  email: string | null
  phone: string | null
  address: string | null
  preferredMethod: ContactMethod | null
  socialLinks: SocialLink[]
}

// Section 6: AI Behavior
export interface AIBehavior {
  rewriteStrength: RewriteStrength | null
  sensitiveAreas: SensitiveArea[]
  customSensitiveText: string
  alwaysKeepInstructions: string
}

// Root Training Profile
export interface TrainingProfile {
  // Meta
  siteId: string
  createdAt: string
  lastUpdated: string
  version: number

  // Completion tracking
  completionStatus: {
    overall: string // "X/6" format
    sections: Record<SectionId, CompletionState>
  }

  // Section data
  section1_brandBasics: BrandBasics
  section2_visualIdentity: VisualIdentity
  section3_voiceTone: VoiceTone
  section4_offerings: Offerings
  section5_contact: Contact
  section6_aiBehavior: AIBehavior
}
