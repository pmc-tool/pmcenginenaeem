/**
 * Training profile persistence service
 * Feature: 005-basic-ai-training
 * MVP: localStorage implementation, backend-ready for future migration
 */

import type { TrainingProfile } from '../types/training'

export interface TrainingService {
  load(siteId: string): TrainingProfile | null
  save(siteId: string, profile: TrainingProfile): void
  delete(siteId: string): void
}

/**
 * localStorage implementation (MVP)
 * Stores training profiles per-site with key pattern: pmc_training_{siteId}
 */
export const localStorageService: TrainingService = {
  load(siteId: string): TrainingProfile | null {
    try {
      const key = `pmc_training_${siteId}`
      const raw = localStorage.getItem(key)

      if (!raw) return null

      const profile = JSON.parse(raw) as TrainingProfile

      // TODO: Add version migration logic here when schema changes
      // if (profile.version < CURRENT_VERSION) {
      //   return migrateProfile(profile)
      // }

      return profile
    } catch (error) {
      console.error('Failed to load training profile:', error)
      return null
    }
  },

  save(siteId: string, profile: TrainingProfile): void {
    try {
      const key = `pmc_training_${siteId}`

      // Update timestamp
      profile.lastUpdated = new Date().toISOString()

      // Serialize and save
      const serialized = JSON.stringify(profile)
      localStorage.setItem(key, serialized)
    } catch (error) {
      // Handle quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error(
          'Storage quota exceeded. Please remove large files (logos/favicon) to free up space.'
        )
      }
      throw error
    }
  },

  delete(siteId: string): void {
    const key = `pmc_training_${siteId}`
    localStorage.removeItem(key)
  }
}

// Export default service (can be swapped for API service in future)
export const trainingService = localStorageService

/**
 * Future API implementation (same interface)
 * Uncomment and use when backend is ready
 */
/*
export const apiService: TrainingService = {
  async load(siteId: string): Promise<TrainingProfile | null> {
    const res = await fetch(`/api/sites/${siteId}/training`)
    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error('Failed to load training profile')
    }
    return res.json()
  },

  async save(siteId: string, profile: TrainingProfile): Promise<void> {
    const res = await fetch(`/api/sites/${siteId}/training`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    })

    if (!res.ok) {
      throw new Error('Failed to save training profile')
    }
  },

  async delete(siteId: string): Promise<void> {
    const res = await fetch(`/api/sites/${siteId}/training`, {
      method: 'DELETE'
    })

    if (!res.ok) {
      throw new Error('Failed to delete training profile')
    }
  }
}
*/
