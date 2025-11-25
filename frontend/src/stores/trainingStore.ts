/**
 * Zustand store for AI Training Panel
 * Feature: 005-basic-ai-training
 */

import { create } from 'zustand'
import type { TrainingProfile, SectionId } from '../types/training'
import { trainingService } from '../services/trainingService'
import { calculateCompletionStatus } from '../utils/completionLogic'

interface TrainingStoreState {
  // Current profile being edited
  currentProfile: TrainingProfile | null
  originalProfile: TrainingProfile | null // For discard changes

  // UI state
  isDirty: boolean
  activeSection: SectionId
  isSaving: boolean
  lastSaveError: string | null

  // Actions
  loadProfile: (siteId: string) => void
  updateSection: <K extends keyof TrainingProfile>(
    section: K,
    data: Partial<TrainingProfile[K]>
  ) => void
  saveProfile: () => Promise<void>
  discardChanges: () => void
  setActiveSection: (section: SectionId) => void
  clearError: () => void
}

/**
 * Create empty training profile for new sites
 */
function createEmptyProfile(siteId: string): TrainingProfile {
  const now = new Date().toISOString()

  return {
    siteId,
    createdAt: now,
    lastUpdated: now,
    version: 1,
    completionStatus: {
      overall: '0/6',
      sections: {
        'brand-basics': 'not-started',
        'visual-identity': 'not-started',
        'voice-tone': 'not-started',
        offerings: 'not-started',
        contact: 'not-started',
        'ai-behavior': 'not-started'
      }
    },
    section1_brandBasics: {
      brandName: '',
      tagline: '',
      elevatorPitch: '',
      description: '',
      industry: '',
      location: ''
    },
    section2_visualIdentity: {
      primaryLogo: null,
      darkModeLogo: null,
      favicon: null,
      darkModeSupport: null,
      defaultMode: null,
      primaryColor: null,
      secondaryColor: null
    },
    section3_voiceTone: {
      formalCasualLevel: null,
      playfulSeriousLevel: null,
      toneDescription: '',
      emojiUsage: null,
      wordsToUse: [],
      wordsToAvoid: []
    },
    section4_offerings: {
      services: [],
      primaryCTA: ''
    },
    section5_contact: {
      email: null,
      phone: null,
      address: null,
      preferredMethod: null,
      socialLinks: []
    },
    section6_aiBehavior: {
      rewriteStrength: null,
      sensitiveAreas: [],
      customSensitiveText: '',
      alwaysKeepInstructions: ''
    }
  }
}

/**
 * Deep clone profile for immutability
 */
function cloneProfile(profile: TrainingProfile): TrainingProfile {
  return JSON.parse(JSON.stringify(profile))
}

export const useTrainingStore = create<TrainingStoreState>((set, get) => ({
  // Initial state
  currentProfile: null,
  originalProfile: null,
  isDirty: false,
  activeSection: 'brand-basics',
  isSaving: false,
  lastSaveError: null,

  // Load profile from storage or create new
  loadProfile: (siteId: string) => {
    const profile = trainingService.load(siteId)

    if (profile) {
      set({
        currentProfile: profile,
        originalProfile: cloneProfile(profile),
        isDirty: false,
        lastSaveError: null
      })
    } else {
      // Create new empty profile
      const newProfile = createEmptyProfile(siteId)
      set({
        currentProfile: newProfile,
        originalProfile: cloneProfile(newProfile),
        isDirty: false,
        lastSaveError: null
      })
    }
  },

  // Update a specific section
  updateSection: (section, data) => {
    const { currentProfile } = get()
    if (!currentProfile) return

    // Create updated profile with immutable update
    const updated: TrainingProfile = {
      ...currentProfile,
      [section]: {
        ...currentProfile[section],
        ...data
      }
    }

    // Recalculate completion status
    updated.completionStatus = calculateCompletionStatus(updated)

    set({
      currentProfile: updated,
      isDirty: true
    })
  },

  // Save profile to storage
  saveProfile: async () => {
    const { currentProfile } = get()
    if (!currentProfile) return

    set({ isSaving: true, lastSaveError: null })

    try {
      trainingService.save(currentProfile.siteId, currentProfile)

      set({
        originalProfile: cloneProfile(currentProfile),
        isDirty: false,
        isSaving: false,
        lastSaveError: null
      })
    } catch (error) {
      set({
        lastSaveError: error instanceof Error ? error.message : 'Failed to save',
        isSaving: false
      })
    }
  },

  // Discard unsaved changes
  discardChanges: () => {
    const { originalProfile } = get()
    if (originalProfile) {
      set({
        currentProfile: cloneProfile(originalProfile),
        isDirty: false,
        lastSaveError: null
      })
    }
  },

  // Set active section for navigation
  setActiveSection: (section) => {
    set({ activeSection: section })
  },

  // Clear last error
  clearError: () => {
    set({ lastSaveError: null })
  }
}))
