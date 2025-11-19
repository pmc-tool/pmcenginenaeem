# Data Model: Basic Site AI Training Panel

**Feature**: 005-basic-ai-training
**Date**: 2025-01-18
**Purpose**: Define complete data structures, validation rules, and state management

---

## Overview

The training panel's data model centers on a **TrainingProfile** entity that contains 6 section sub-objects, each capturing specific brand/business information. The model supports partial completion, per-site scoping, and seamless serialization for localStorage and future API persistence.

---

## Core Entities

### TrainingProfile

Root entity representing all training data for a single site.

```typescript
interface TrainingProfile {
  // Meta
  siteId: string                          // PMC Engine site identifier
  createdAt: string                       // ISO 8601 timestamp
  lastUpdated: string                     // ISO 8601 timestamp
  version: number                         // Schema version (currently 1)

  // Completion tracking
  completionStatus: {
    overall: string                       // "X/6" format (e.g., "3/6")
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

type SectionId =
  | 'brand-basics'
  | 'visual-identity'
  | 'voice-tone'
  | 'offerings'
  | 'contact'
  | 'ai-behavior'

type CompletionState = 'not-started' | 'partial' | 'complete'
```

**Validation Rules**:
- `siteId`: Required, non-empty string
- `createdAt`, `lastUpdated`: Valid ISO 8601 timestamps
- `version`: Currently must be `1`
- All section objects: Must be present (can be empty)

**State Transitions**:
- Profile created → all sections `not-started`
- User edits section → section moves to `partial` or `complete`
- User saves → `lastUpdated` timestamp refreshed
- User discards → revert to last saved state

---

### Section 1: BrandBasics

```typescript
interface BrandBasics {
  brandName: string                       // REQUIRED, max 100 chars
  tagline: string                         // Optional, max 150 chars
  elevatorPitch: string                   // REQUIRED, max 250 chars
  description: string                     // REQUIRED, max 500 chars, 2-3 sentences
  industry: string                        // REQUIRED, dropdown or free text
  location: string                        // Optional, max 100 chars
}
```

**Validation Rules**:
- `brandName`: Required, 1-100 chars, trim whitespace
- `tagline`: Optional, max 150 chars
- `elevatorPitch`: Required, 10-250 chars (must be substantive)
- `description`: Required, 50-500 chars, plain text only
- `industry`: Required, one of predefined list OR custom text (max 50 chars)
  - Predefined: `SaaS`, `Agency`, `Clinic`, `E-commerce`, `Restaurant`, `Real Estate`, `Consulting`, `Other`
- `location`: Optional, max 100 chars (city, country, or "Global")

**Completion Logic**:
- `not-started`: All required fields empty
- `partial`: Some required fields filled
- `complete`: All required fields filled (brandName + elevatorPitch + description + industry)

**Error Messages**:
- Brand name required: "Please enter your brand or site name"
- Elevator pitch too short: "Elevator pitch should be at least 10 characters"
- Description too short: "Please provide a brief description (at least 50 characters)"
- Industry not selected: "Please select your industry or type your own"

---

### Section 2: VisualIdentity

```typescript
interface VisualIdentity {
  primaryLogo: FileData | null           // Optional, PNG/SVG
  darkModeLogo: FileData | null          // Optional, PNG/SVG
  favicon: FileData | null               // Optional, ICO/PNG
  darkModeSupport: DarkModeOption        // REQUIRED
  defaultMode: 'light' | 'dark' | null   // Required if darkModeSupport = 'both'
  primaryColor: string | null            // Optional, hex format #RRGGBB
  secondaryColor: string | null          // Optional, hex format #RRGGBB
}

interface FileData {
  name: string                           // Original filename
  type: string                           // MIME type
  size: number                           // Bytes
  dataUrl: string                        // Base64 data URL for MVP
  uploadedAt: string                     // ISO 8601 timestamp
}

type DarkModeOption = 'light-only' | 'dark-only' | 'both'
```

**Validation Rules**:
- `primaryLogo`, `darkModeLogo`:
  - Type: `image/png` or `image/svg+xml` only
  - Size: Max 5MB (5,242,880 bytes)
  - Dimensions: Warn if >2000px (not enforced)
- `favicon`:
  - Type: `image/x-icon`, `image/png`, or `image/svg+xml`
  - Size: Max 1MB (1,048,576 bytes)
- `darkModeSupport`: Required, one of 3 options
- `defaultMode`: Required only if `darkModeSupport === 'both'`
- `primaryColor`, `secondaryColor`:
  - Format: `/^#[0-9A-Fa-f]{6}$/` (uppercase hex preferred)
  - Invalid colors fall back to null

**Completion Logic**:
- `not-started`: `darkModeSupport` not set
- `partial`: `darkModeSupport` set but no logo/colors provided
- `complete`: `darkModeSupport` set AND (logo exists OR color exists)

**Error Messages**:
- Invalid file type: "Please upload PNG or SVG files only"
- File too large: "File size exceeds 5MB limit for logos (1MB for favicon)"
- Dark mode support missing: "Please select your dark mode preference"
- Default mode missing: "Please choose light or dark as the default mode"
- Invalid color hex: "Please enter a valid hex color (e.g., #EA2724)"

---

### Section 3: VoiceTone

```typescript
interface VoiceTone {
  formalCasualLevel: number | null       // Optional, 1-5 scale (1=formal, 5=casual)
  playfulSeriousLevel: number | null     // Optional, 1-5 scale (1=playful, 5=serious)
  toneDescription: string                // Optional, max 200 chars
  emojiUsage: EmojiPreference           // Optional
  wordsToUse: string[]                   // Optional, array of words/phrases
  wordsToAvoid: string[]                 // Optional, array of words/phrases
}

type EmojiPreference = 'never' | 'sometimes' | 'often' | null
```

**Validation Rules**:
- `formalCasualLevel`, `playfulSeriousLevel`:
  - Range: 1-5 inclusive
  - Stored as integer
  - Null if not set
- `toneDescription`: Optional, max 200 chars, plain text
- `emojiUsage`: Optional, one of 3 predefined options
- `wordsToUse`, `wordsToAvoid`:
  - Max 20 items per list
  - Each item max 50 chars
  - Trim whitespace, deduplicate
  - Case-insensitive matching

**Completion Logic**:
- `not-started`: All fields empty/null
- `partial`: At least one field filled
- `complete`: Both sliders set OR (toneDescription + wordsToUse has items)

**Error Messages**:
- Too many words: "Maximum 20 words/phrases per list"
- Word too long: "Each word/phrase should be under 50 characters"

---

### Section 4: Offerings

```typescript
interface Offerings {
  services: Service[]                    // Optional, 0-20 items
  primaryCTA: string                     // Optional, max 50 chars
}

interface Service {
  id: string                             // UUID for list management
  name: string                           // Required, max 100 chars
  description: string                    // Optional, max 200 chars
  order: number                          // Display order (0-based)
}
```

**Validation Rules**:
- `services`:
  - Max 20 items (practical limit)
  - Each service must have `name` (required)
  - `description` optional but recommended
- Service `name`: 1-100 chars, trim whitespace
- Service `description`: Max 200 chars, plain text
- `primaryCTA`: Optional, max 50 chars (e.g., "Get Started", "Book Now")

**Completion Logic**:
- `not-started`: No services, no CTA
- `partial`: At least 1 service OR CTA provided
- `complete`: At least 3 services with descriptions AND CTA provided

**Error Messages**:
- Service name missing: "Please enter a service name"
- Too many services: "Maximum 20 services allowed"
- CTA too long: "CTA should be under 50 characters"

---

### Section 5: Contact

```typescript
interface Contact {
  email: string | null                   // Optional, email format
  phone: string | null                   // Optional, phone format (lenient)
  address: string | null                 // Optional, max 250 chars
  preferredMethod: ContactMethod | null  // Optional
  socialLinks: SocialLink[]              // Optional, 0-10 items
}

type ContactMethod = 'call' | 'whatsapp' | 'email' | 'form'

interface SocialLink {
  id: string                             // UUID for list management
  platform: SocialPlatform               // Required
  url: string                            // Required, valid URL
  order: number                          // Display order (0-based)
}

type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'pinterest'
  | 'other'
```

**Validation Rules**:
- `email`:
  - Format: RFC 5322 (use standard email regex or library)
  - Example: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- `phone`:
  - Lenient format (allow +, -, spaces, parentheses)
  - Min 7 chars, max 20 chars
  - Optional country code
- `address`: Max 250 chars, multiline OK
- `preferredMethod`: Optional, one of 4 options
- `socialLinks`:
  - Max 10 items
  - `url` must be valid URL (starts with http:// or https://)
  - Platform required (dropdown)

**Completion Logic**:
- `not-started`: All fields empty
- `partial`: At least one contact method provided
- `complete`: Email provided AND (phone OR social links exist)

**Error Messages**:
- Invalid email: "Please enter a valid email address"
- Invalid phone: "Please enter a valid phone number"
- Invalid URL: "Please enter a complete URL starting with https://"
- Too many links: "Maximum 10 social links allowed"

---

### Section 6: AIBehavior

```typescript
interface AIBehavior {
  rewriteStrength: RewriteStrength | null  // Optional
  sensitiveAreas: SensitiveArea[]          // Optional, 0-4 predefined + custom
  customSensitiveText: string              // Optional, if "other" checked
  alwaysKeepInstructions: string           // Optional, max 300 chars
}

type RewriteStrength = 'light' | 'balanced' | 'heavy'

type SensitiveArea = 'pricing' | 'legal' | 'testimonials' | 'other'
```

**Validation Rules**:
- `rewriteStrength`: Optional, one of 3 options (default: 'balanced' if not set)
- `sensitiveAreas`: Array of checked options
  - Max 4 items (3 predefined + 1 other)
- `customSensitiveText`:
  - Required if `sensitiveAreas` includes 'other'
  - Max 100 chars
- `alwaysKeepInstructions`: Max 300 chars, multiline OK

**Completion Logic**:
- `not-started`: All fields empty
- `partial`: Rewrite strength set OR sensitive areas checked
- `complete`: Rewrite strength set AND (sensitive areas OR always-keep instructions provided)

**Error Messages**:
- Custom area missing: 'Please specify "Other" sensitive area'
- Always-keep too long: "Instructions should be under 300 characters"

---

## Zustand Store Schema

```typescript
interface TrainingStoreState {
  // Current profile being edited
  currentProfile: TrainingProfile | null

  // Dirty state tracking
  isDirty: boolean
  originalProfile: TrainingProfile | null  // For discard changes

  // UI state
  activeSection: SectionId
  isSaving: boolean
  lastSaveError: string | null

  // Actions
  loadProfile: (siteId: string) => void
  updateSection: <T extends keyof TrainingProfile>(
    section: T,
    data: Partial<TrainingProfile[T]>
  ) => void
  saveProfile: () => Promise<void>
  discardChanges: () => void
  setActiveSection: (section: SectionId) => void
}
```

**State Management Rules**:
- Load profile on panel mount (by siteId from route/context)
- Mark `isDirty = true` on any field change
- `originalProfile` snapshot taken on load/save (for discard)
- `saveProfile` persists via `trainingService`, resets `isDirty`
- `discardChanges` reverts to `originalProfile`, resets `isDirty`

---

## Serialization & Persistence

### localStorage Format (MVP)

**Key Pattern**: `pmc_training_${siteId}`

**Value**: JSON-stringified `TrainingProfile`

**Example**:
```json
{
  "siteId": "site_abc123",
  "createdAt": "2025-01-18T10:30:00Z",
  "lastUpdated": "2025-01-18T14:22:13Z",
  "version": 1,
  "completionStatus": {
    "overall": "3/6",
    "sections": {
      "brand-basics": "complete",
      "visual-identity": "complete",
      "voice-tone": "partial",
      "offerings": "not-started",
      "contact": "not-started",
      "ai-behavior": "not-started"
    }
  },
  "section1_brandBasics": {
    "brandName": "Acme Solutions",
    "tagline": "Building the future",
    "elevatorPitch": "We help businesses automate workflows with AI",
    "description": "Acme Solutions is a SaaS company specializing in AI-powered automation tools for small and medium businesses.",
    "industry": "SaaS",
    "location": "San Francisco, CA"
  },
  "section2_visualIdentity": {
    "primaryLogo": {
      "name": "logo.png",
      "type": "image/png",
      "size": 45678,
      "dataUrl": "data:image/png;base64,iVBORw0KG...",
      "uploadedAt": "2025-01-18T10:35:12Z"
    },
    "darkModeLogo": null,
    "favicon": null,
    "darkModeSupport": "light-only",
    "defaultMode": null,
    "primaryColor": "#EA2724",
    "secondaryColor": "#1A1A1A"
  },
  "section3_voiceTone": {
    "formalCasualLevel": 3,
    "playfulSeriousLevel": 4,
    "toneDescription": "Professional but approachable",
    "emojiUsage": "sometimes",
    "wordsToUse": ["innovative", "streamline", "empower"],
    "wordsToAvoid": ["cheap", "free trial", "limited time"]
  },
  "section4_offerings": {
    "services": [],
    "primaryCTA": ""
  },
  "section5_contact": {
    "email": null,
    "phone": null,
    "address": null,
    "preferredMethod": null,
    "socialLinks": []
  },
  "section6_aiBehavior": {
    "rewriteStrength": null,
    "sensitiveAreas": [],
    "customSensitiveText": "",
    "alwaysKeepInstructions": ""
  }
}
```

**Storage Considerations**:
- localStorage limit: ~5-10MB (browser-dependent)
- Base64 images inflate size (~33% larger than binary)
- Monitor size: warn if approaching 2MB (leave headroom)
- Graceful degradation: if quota exceeded, prompt to remove images

---

### Future API Format

**Endpoint**: `PUT /api/sites/:siteId/training`

**Request Body**: Same as localStorage format (JSON)

**Response**:
```json
{
  "success": true,
  "profile": { /* full profile */ },
  "lastUpdated": "2025-01-18T14:22:13Z"
}
```

**File Upload Strategy** (when backend exists):
1. Upload files separately: `POST /api/sites/:siteId/training/upload`
2. Receive URL: `{ "url": "https://cdn.example.com/logos/abc123.png" }`
3. Store URL in profile instead of base64
4. Update profile: `PUT /api/sites/:siteId/training` with file URLs

---

## Validation Utilities

```typescript
// validation.ts
export const validators = {
  email: (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  },

  phone: (value: string): boolean => {
    const cleaned = value.replace(/[\s\-().+]/g, '')
    return cleaned.length >= 7 && cleaned.length <= 20 && /^\d+$/.test(cleaned)
  },

  url: (value: string): boolean => {
    try {
      new URL(value)
      return value.startsWith('http://') || value.startsWith('https://')
    } catch {
      return false
    }
  },

  hexColor: (value: string): boolean => {
    return /^#[0-9A-Fa-f]{6}$/.test(value)
  },

  required: (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0
    return value != null && value !== ''
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min
  }
}
```

---

## Migration Strategy

### Version 1 → Version 2 (Example)

If schema changes in future (e.g., add new field):

```typescript
function migrateProfile(profile: any): TrainingProfile {
  if (profile.version === 1) {
    // Add new fields with defaults
    return {
      ...profile,
      version: 2,
      section7_newSection: {
        // default values
      }
    }
  }
  return profile
}
```

**Migration runs**:
- On profile load from localStorage
- Before saving (ensure latest version)
- Log migration events for debugging

---

## Testing Data Model

### Unit Test Coverage

**Required tests**:
1. Profile creation with defaults
2. Section update immutability (Zustand patterns)
3. Completion logic for each section
4. Validation rules for all fields
5. Serialization/deserialization (JSON round-trip)
6. File size/type validation
7. URL/email/phone format validation
8. Dirty state tracking
9. Discard changes behavior

### Test Fixtures

```typescript
export const mockProfile: TrainingProfile = {
  siteId: 'test_site',
  createdAt: '2025-01-18T10:00:00Z',
  lastUpdated: '2025-01-18T10:00:00Z',
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
  section1_brandBasics: {
    brandName: '',
    tagline: '',
    elevatorPitch: '',
    description: '',
    industry: '',
    location: ''
  },
  // ... empty sections
}
```

---

## References

- Feature Spec: `specs/005-basic-ai-training/spec.md`
- Research: `specs/005-basic-ai-training/research.md`
- Appendix: `specs/005-basic-ai-training/appendices/data-model.md` (if exists)
