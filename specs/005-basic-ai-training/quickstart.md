# Quickstart: Basic Site AI Training Panel

**Feature**: 005-basic-ai-training
**Date**: 2025-01-18
**Purpose**: Step-by-step implementation guide for developers

---

## Overview

This guide walks through building the AI Training Panel from scratch, following the architecture defined in [plan.md](plan.md), [data-model.md](data-model.md), and [research.md](research.md).

**Estimated Time**: 12-16 hours for core implementation + 4-6 hours for tests

---

## Prerequisites

- PMC Engine dashboard shell running (001-dashboard-shell)
- Node.js 20+ with npm
- Familiarity with React 18, TypeScript, Zustand

**Dependencies to Install**:
```bash
cd frontend
npm install react-hook-form@7 @radix-ui/react-popover @radix-ui/react-label
npm install --save-dev @types/react-hook-form
```

---

## Implementation Phases

### Phase 1: Data Layer (2-3 hours)

#### 1.1 Define TypeScript Types

Create `frontend/src/types/training.ts`:

```typescript
export interface TrainingProfile {
  siteId: string
  createdAt: string
  lastUpdated: string
  version: number
  completionStatus: {
    overall: string
    sections: Record<SectionId, CompletionState>
  }
  section1_brandBasics: BrandBasics
  section2_visualIdentity: VisualIdentity
  section3_voiceTone: VoiceTone
  section4_offerings: Offerings
  section5_contact: Contact
  section6_aiBehavior: AIBehavior
}

export type SectionId =
  | 'brand-basics'
  | 'visual-identity'
  | 'voice-tone'
  | 'offerings'
  | 'contact'
  | 'ai-behavior'

export type CompletionState = 'not-started' | 'partial' | 'complete'

// ... Define all section interfaces (see data-model.md)
export interface BrandBasics { ... }
export interface VisualIdentity { ... }
// etc.
```

**Reference**: Full type definitions in [data-model.md](data-model.md)

#### 1.2 Create Training Service

Create `frontend/src/services/trainingService.ts`:

```typescript
import type { TrainingProfile } from '../types/training'

export interface TrainingService {
  load(siteId: string): TrainingProfile | null
  save(siteId: string, profile: TrainingProfile): void
  delete(siteId: string): void
}

// localStorage implementation (MVP)
export const localStorageService: TrainingService = {
  load(siteId) {
    try {
      const raw = localStorage.getItem(`pmc_training_${siteId}`)
      if (!raw) return null
      const profile = JSON.parse(raw)
      // TODO: Add version migration logic here
      return profile
    } catch (error) {
      console.error('Failed to load training profile:', error)
      return null
    }
  },

  save(siteId, profile) {
    try {
      profile.lastUpdated = new Date().toISOString()
      localStorage.setItem(`pmc_training_${siteId}`, JSON.stringify(profile))
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please remove large files.')
      }
      throw error
    }
  },

  delete(siteId) {
    localStorage.removeItem(`pmc_training_${siteId}`)
  }
}

// Default export for dependency injection
export const trainingService = localStorageService
```

#### 1.3 Create Zustand Store

Create `frontend/src/stores/trainingStore.ts`:

```typescript
import { create } from 'zustand'
import type { TrainingProfile, SectionId } from '../types/training'
import { trainingService } from '../services/trainingService'
import { getSectionCompletion, getOverallCompletion } from '../utils/completionLogic'

interface TrainingStoreState {
  currentProfile: TrainingProfile | null
  originalProfile: TrainingProfile | null
  isDirty: boolean
  activeSection: SectionId
  isSaving: boolean
  lastSaveError: string | null

  loadProfile: (siteId: string) => void
  updateSection: <K extends keyof TrainingProfile>(
    section: K,
    data: Partial<TrainingProfile[K]>
  ) => void
  saveProfile: () => Promise<void>
  discardChanges: () => void
  setActiveSection: (section: SectionId) => void
}

export const useTrainingStore = create<TrainingStoreState>((set, get) => ({
  currentProfile: null,
  originalProfile: null,
  isDirty: false,
  activeSection: 'brand-basics',
  isSaving: false,
  lastSaveError: null,

  loadProfile: (siteId) => {
    const profile = trainingService.load(siteId)
    if (profile) {
      set({
        currentProfile: profile,
        originalProfile: structuredClone(profile),
        isDirty: false
      })
    } else {
      // Create empty profile
      const newProfile = createEmptyProfile(siteId)
      set({
        currentProfile: newProfile,
        originalProfile: structuredClone(newProfile),
        isDirty: false
      })
    }
  },

  updateSection: (section, data) => {
    const { currentProfile } = get()
    if (!currentProfile) return

    const updated = {
      ...currentProfile,
      [section]: {
        ...currentProfile[section],
        ...data
      }
    }

    // Recalculate completion
    updated.completionStatus = calculateCompletion(updated)

    set({
      currentProfile: updated,
      isDirty: true
    })
  },

  saveProfile: async () => {
    const { currentProfile } = get()
    if (!currentProfile) return

    set({ isSaving: true, lastSaveError: null })

    try {
      trainingService.save(currentProfile.siteId, currentProfile)
      set({
        originalProfile: structuredClone(currentProfile),
        isDirty: false,
        isSaving: false
      })
    } catch (error) {
      set({
        lastSaveError: error.message,
        isSaving: false
      })
    }
  },

  discardChanges: () => {
    const { originalProfile } = get()
    if (originalProfile) {
      set({
        currentProfile: structuredClone(originalProfile),
        isDirty: false
      })
    }
  },

  setActiveSection: (section) => {
    set({ activeSection: section })
  }
}))

// Helper functions
function createEmptyProfile(siteId: string): TrainingProfile {
  return {
    siteId,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    version: 1,
    completionStatus: {
      overall: '0/6',
      sections: {
        'brand-basics': 'not-started',
        'visual-identity': 'not-started',
        'voice-tone': 'not-started',
        'offerings': 'not-started',
        'contact': 'not-started',
        'ai-behavior': 'not-started'
      }
    },
    section1_brandBasics: { /* empty fields */ },
    section2_visualIdentity: { /* empty fields */ },
    section3_voiceTone: { /* empty fields */ },
    section4_offerings: { services: [], primaryCTA: '' },
    section5_contact: { socialLinks: [] },
    section6_aiBehavior: { sensitiveAreas: [] }
  }
}

function calculateCompletion(profile: TrainingProfile) {
  // Use completion logic utilities
  // TODO: Implement (see completionLogic.ts)
  return profile.completionStatus
}
```

---

### Phase 2: UI Components (6-8 hours)

#### 2.1 Main Panel Component

Create `frontend/src/components/settings/AITrainingPanel.tsx`:

```typescript
import React, { useEffect } from 'react'
import { useTrainingStore } from '../../stores/trainingStore'
import { TrainingStepper } from './TrainingStepper'
import { BrandBasicsSection } from './sections/BrandBasicsSection'
// ... import other sections
import './AITrainingPanel.css'

interface AITrainingPanelProps {
  siteId: string
}

export const AITrainingPanel: React.FC<AITrainingPanelProps> = ({ siteId }) => {
  const {
    currentProfile,
    isDirty,
    activeSection,
    isSaving,
    loadProfile,
    saveProfile,
    discardChanges
  } = useTrainingStore()

  useEffect(() => {
    loadProfile(siteId)
  }, [siteId, loadProfile])

  if (!currentProfile) {
    return <div>Loading...</div>
  }

  return (
    <div className="ai-training-panel">
      {/* Header */}
      <header className="training-header">
        <div className="training-header__info">
          <h1>AI Training</h1>
          <p>Help AI understand your brand and business</p>
          <span className="completion-badge">
            {currentProfile.completionStatus.overall} sections complete
          </span>
        </div>
        <div className="training-header__actions">
          <button
            onClick={discardChanges}
            disabled={!isDirty || isSaving}
            className="btn btn--secondary"
          >
            Discard Changes
          </button>
          <button
            onClick={saveProfile}
            disabled={!isDirty || isSaving}
            className="btn btn--primary"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="training-content">
        <TrainingStepper />

        <div className="training-sections">
          {activeSection === 'brand-basics' && <BrandBasicsSection />}
          {activeSection === 'visual-identity' && <VisualIdentitySection />}
          {/* ... other sections */}
        </div>
      </div>
    </div>
  )
}
```

#### 2.2 Stepper Navigation

Create `frontend/src/components/settings/TrainingStepper.tsx`:

```typescript
import React from 'react'
import { useTrainingStore } from '../../stores/trainingStore'
import type { SectionId } from '../../types/training'
import './TrainingStepper.css'

const SECTIONS: Array<{ id: SectionId; label: string }> = [
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
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="training-stepper">
      {SECTIONS.map((section, index) => {
        const completionState = currentProfile?.completionStatus.sections[section.id]
        const isActive = activeSection === section.id

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`stepper-item ${isActive ? 'stepper-item--active' : ''}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <span className="stepper-item__number">{index + 1}</span>
            <span className="stepper-item__label">{section.label}</span>
            {completionState === 'complete' && (
              <span className="stepper-item__check" aria-label="Complete">✓</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
```

#### 2.3 Example Section Component

Create `frontend/src/components/settings/sections/BrandBasicsSection.tsx`:

```typescript
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTrainingStore } from '../../../stores/trainingStore'
import type { BrandBasics } from '../../../types/training'

export const BrandBasicsSection: React.FC = () => {
  const { currentProfile, updateSection } = useTrainingStore()
  const data = currentProfile?.section1_brandBasics

  const { register, watch, formState: { errors } } = useForm<BrandBasics>({
    defaultValues: data,
    mode: 'onBlur'
  })

  // Watch for changes and update store
  React.useEffect(() => {
    const subscription = watch((value) => {
      updateSection('section1_brandBasics', value)
    })
    return () => subscription.unsubscribe()
  }, [watch, updateSection])

  return (
    <section id="brand-basics" className="training-section">
      <h2>Brand & Business Basics</h2>
      <p className="section-description">
        Essential information about your brand and business
      </p>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="brandName">
            Brand Name <span className="required">*</span>
          </label>
          <input
            id="brandName"
            type="text"
            {...register('brandName', {
              required: 'Brand name is required',
              maxLength: { value: 100, message: 'Max 100 characters' }
            })}
            placeholder="Acme Solutions"
          />
          {errors.brandName && (
            <span className="error">{errors.brandName.message}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="tagline">Tagline</label>
          <input
            id="tagline"
            type="text"
            {...register('tagline', {
              maxLength: { value: 150, message: 'Max 150 characters' }
            })}
            placeholder="Building the future"
          />
        </div>

        {/* ... other fields */}
      </div>
    </section>
  )
}
```

---

### Phase 3: Styling (2-3 hours)

Create `frontend/src/components/settings/AITrainingPanel.css`:

```css
.ai-training-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.training-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #E5E5E5;
}

.training-header__info h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1A1A1A;
  margin: 0 0 0.25rem 0;
}

.training-header__info p {
  font-size: 14px;
  color: #666;
  margin: 0 0 0.5rem 0;
}

.completion-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #F5F5F5;
  border-radius: 0.375rem;
  font-size: 12px;
  font-weight: 500;
  color: #666;
}

.training-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  padding: 2rem;
  overflow: hidden;
}

/* Stepper styles */
.training-stepper {
  position: sticky;
  top: 0;
  height: fit-content;
}

.stepper-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-left: 2px solid transparent;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.stepper-item:hover {
  background: #F5F5F5;
}

.stepper-item--active {
  border-left-color: #EA2724;
  background: #FFF5F5;
}

.stepper-item__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #E5E5E5;
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.stepper-item--active .stepper-item__number {
  background: #EA2724;
  color: #fff;
}

.stepper-item__label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
}

.stepper-item__check {
  color: #10B981;
  font-size: 16px;
}

/* Section styles */
.training-sections {
  overflow-y: auto;
  padding-right: 1rem;
}

.training-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #F5F5F5;
  border-radius: 0.5rem;
}

.training-section h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
  margin: 0 0 0.5rem 0;
}

.section-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 1.5rem 0;
}

/* Form styles */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.form-field label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
  margin-bottom: 0.5rem;
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 14px;
  border: 1px solid #E0E0E0;
  border-radius: 0.375rem;
  background: #fff;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  outline: 2px solid #EA2724;
  outline-offset: 2px;
  border-color: #EA2724;
}

.form-field .error {
  display: block;
  margin-top: 0.25rem;
  font-size: 12px;
  color: #EF4444;
}

.required {
  color: #EA2724;
}

/* Responsive */
@media (max-width: 768px) {
  .training-content {
    grid-template-columns: 1fr;
  }

  .training-stepper {
    position: static;
    display: flex;
    overflow-x: auto;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .stepper-item {
    flex-shrink: 0;
    border-left: none;
    border-bottom: 2px solid transparent;
  }

  .stepper-item--active {
    border-bottom-color: #EA2724;
  }
}
```

---

### Phase 4: Routing & Integration (1-2 hours)

#### 4.1 Add Route

In `frontend/src/components/shell/SettingsRouter.tsx`:

```typescript
import { AITrainingPanel } from '../settings/AITrainingPanel'

// Inside routing logic:
case 'ai-training':
  return <AITrainingPanel siteId={currentSiteId} />
```

#### 4.2 Add Navigation Link

In Settings menu/sidebar, add link to `/settings/ai-training`

---

### Phase 5: AI Integration (2-3 hours)

#### 5.1 Create AI Context Service

Create `frontend/src/services/aiContextService.ts`:

```typescript
import type { TrainingProfile } from '../types/training'
import { trainingService } from './trainingService'

export function buildAIContext(profile: TrainingProfile): string {
  const sections: string[] = []

  // Section 1: Brand Basics
  if (profile.section1_brandBasics.brandName) {
    sections.push(`Brand: ${profile.section1_brandBasics.brandName}`)
    if (profile.section1_brandBasics.tagline) {
      sections.push(`Tagline: ${profile.section1_brandBasics.tagline}`)
    }
    if (profile.section1_brandBasics.description) {
      sections.push(`Description: ${profile.section1_brandBasics.description}`)
    }
  }

  // Section 3: Voice & Tone
  if (profile.section3_voiceTone.formalCasualLevel) {
    const tone = profile.section3_voiceTone.formalCasualLevel < 3 ? 'formal' : 'casual'
    sections.push(`Tone: ${tone}`)
  }

  // Section 6: AI Behavior
  if (profile.section6_aiBehavior.rewriteStrength) {
    sections.push(`Rewrite preference: ${profile.section6_aiBehavior.rewriteStrength}`)
  }

  if (profile.section6_aiBehavior.sensitiveAreas.length) {
    sections.push(
      `Sensitive areas (do not modify): ${profile.section6_aiBehavior.sensitiveAreas.join(', ')}`
    )
  }

  return sections.length ? `\n\n## Site Training Context\n${sections.join('\n')}` : ''
}

export function injectTrainingContext(siteId: string): string {
  const profile = trainingService.load(siteId)
  if (!profile) return ''
  return buildAIContext(profile)
}
```

#### 5.2 Integrate with Chat Panel

In `frontend/src/stores/chatStore.ts` or wherever AI system prompt is built:

```typescript
import { injectTrainingContext } from '../services/aiContextService'

// When building system prompt:
const basePrompt = "You are an AI assistant for PMC Engine..."
const trainingContext = injectTrainingContext(currentSiteId)
const fullPrompt = basePrompt + trainingContext
```

---

### Phase 6: Testing (4-6 hours)

#### 6.1 Unit Tests

Create `frontend/tests/stores/trainingStore.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useTrainingStore } from '../../src/stores/trainingStore'

describe('TrainingStore', () => {
  beforeEach(() => {
    useTrainingStore.setState({
      currentProfile: null,
      originalProfile: null,
      isDirty: false
    })
    localStorage.clear()
  })

  it('loads empty profile for new site', () => {
    const { loadProfile, currentProfile } = useTrainingStore.getState()
    loadProfile('test_site')

    expect(currentProfile).toBeTruthy()
    expect(currentProfile?.siteId).toBe('test_site')
    expect(currentProfile?.completionStatus.overall).toBe('0/6')
  })

  it('marks store as dirty after update', () => {
    const { loadProfile, updateSection, isDirty } = useTrainingStore.getState()
    loadProfile('test_site')

    updateSection('section1_brandBasics', { brandName: 'Test Brand' })

    expect(useTrainingStore.getState().isDirty).toBe(true)
  })

  it('saves and resets dirty flag', async () => {
    const { loadProfile, updateSection, saveProfile } = useTrainingStore.getState()
    loadProfile('test_site')
    updateSection('section1_brandBasics', { brandName: 'Test Brand' })

    await saveProfile()

    expect(useTrainingStore.getState().isDirty).toBe(false)
  })

  it('discards changes', () => {
    const { loadProfile, updateSection, discardChanges, currentProfile } =
      useTrainingStore.getState()
    loadProfile('test_site')
    updateSection('section1_brandBasics', { brandName: 'Changed' })

    discardChanges()

    expect(useTrainingStore.getState().currentProfile?.section1_brandBasics.brandName).toBe('')
    expect(useTrainingStore.getState().isDirty).toBe(false)
  })
})
```

#### 6.2 Component Tests

Create `frontend/tests/components/settings/AITrainingPanel.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AITrainingPanel } from '../../../src/components/settings/AITrainingPanel'

describe('AITrainingPanel', () => {
  it('renders panel with all sections', () => {
    render(<AITrainingPanel siteId="test_site" />)

    expect(screen.getByText('AI Training')).toBeInTheDocument()
    expect(screen.getByText('Brand & Business')).toBeInTheDocument()
    expect(screen.getByText('Visual Identity')).toBeInTheDocument()
  })

  it('enables save button when dirty', async () => {
    render(<AITrainingPanel siteId="test_site" />)

    const input = screen.getByLabelText(/brand name/i)
    fireEvent.change(input, { target: { value: 'New Brand' } })

    const saveButton = screen.getByText('Save Changes')
    expect(saveButton).not.toBeDisabled()
  })

  // ... more tests
})
```

#### 6.3 E2E Tests

Create `frontend/tests/e2e/ai-training-panel.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('complete training workflow', async ({ page }) => {
  await page.goto('/settings/ai-training')

  // Fill brand basics
  await page.fill('[name="brandName"]', 'Test Company')
  await page.fill('[name="elevatorPitch"]', 'We solve problems with technology')
  await page.fill('[name="description"]', 'A test company description that is long enough')
  await page.selectOption('[name="industry"]', 'SaaS')

  // Click save
  await page.click('text=Save Changes')

  // Verify saved
  await expect(page.locator('text=0/6')).not.toBeVisible()
  await expect(page.locator('text=1/6')).toBeVisible()

  // Reload page
  await page.reload()

  // Verify data persisted
  await expect(page.locator('[name="brandName"]')).toHaveValue('Test Company')
})
```

---

## Verification Checklist

- [ ] Training panel accessible from Settings → AI Training
- [ ] Panel loads existing profile or creates empty one
- [ ] All 6 sections render correctly
- [ ] Stepper navigation scrolls to sections
- [ ] Form fields validate properly (required, max length, format)
- [ ] File uploads work (logo, favicon) with preview
- [ ] Color picker allows hex input and visual selection
- [ ] Repeatable fields (services, social links) add/edit/delete
- [ ] Save button enabled when dirty, disabled when clean
- [ ] Discard changes reverts to last saved state
- [ ] Completion status updates correctly (X/6)
- [ ] Data persists in localStorage with correct key pattern
- [ ] AI context service builds prompt from training data
- [ ] AI uses training data in responses (manual test)
- [ ] Responsive design works on mobile (stepper adapts)
- [ ] Keyboard navigation works (tab, arrow keys)
- [ ] Screen reader announces sections and completion state
- [ ] Focus outlines visible and high-contrast
- [ ] All tests passing (unit, integration, E2E)

---

## Deployment Notes

1. **localStorage Migration**: When adding backend API, run migration script to sync existing localStorage data to server
2. **Feature Flag**: Consider feature flag for gradual rollout
3. **Analytics**: Track completion rates, section engagement, AI improvement metrics
4. **Performance**: Monitor panel load time (<2s target), save operation time (<1s)
5. **Support**: Document common issues (quota exceeded, file upload failures)

---

## Next Steps (Post-MVP)

1. Auto-save on field blur (behind setting toggle)
2. Export/import training profiles
3. Version history with rollback
4. Training effectiveness dashboard
5. Multi-language UI support
6. Advanced AI configuration (temperature, model selection)
7. Integration with external CMS/DAM systems

---

## References

- [Feature Spec](spec.md)
- [Implementation Plan](plan.md)
- [Data Model](data-model.md)
- [Research & Technology Choices](research.md)
- [API Contracts](contracts/openapi.yaml)
- PMC Engine Constitution: `.specify/memory/constitution.md`
