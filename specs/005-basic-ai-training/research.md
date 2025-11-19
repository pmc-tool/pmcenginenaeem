# Research: Basic Site AI Training Panel

**Feature**: 005-basic-ai-training
**Date**: 2025-01-18
**Purpose**: Document technology choices, patterns, and best practices for implementation

---

## Overview

This document captures research findings and architectural decisions for the Basic Site AI Training Panel. The panel is a settings interface with wizard-style stepper UI, form validation, file uploads, and AI context integration.

---

## Key Technology Decisions

### 1. Form State Management

**Decision**: Use `react-hook-form` v7+ for form handling

**Rationale**:
- Minimal re-renders (uncontrolled form pattern by default)
- Built-in validation with yup/zod schema integration
- Excellent TypeScript support
- Handles complex forms with nested fields (services/social links arrays)
- Already used in other PMC Engine features (consistency)
- Much lighter than Formik (~8KB vs 20KB gzipped)

**Alternatives Considered**:
- **Formik**: More boilerplate, heavier bundle, slower performance with large forms
- **Manual Zustand state**: Would require custom validation logic, error handling, and field-level updates
- **Controlled inputs with React state**: Poor performance with 35+ fields (too many re-renders)

**Best Practices**:
- Use `useForm()` hook at panel level, pass down field registration
- Validate on blur for better UX (don't block typing)
- Use `watch()` sparingly to avoid re-renders
- Integrate with Zustand for persistence layer (form → Zustand → localStorage)

---

### 2. File Upload Handling

**Decision**: Use native File API with custom React component wrapper

**Rationale**:
- No heavy upload library needed for simple logo/favicon uploads
- Full control over validation (file size, type, dimensions)
- Can preview images immediately with `URL.createObjectURL()`
- Easy to add drag-and-drop later if needed
- Aligns with "keep it simple" constitution principle

**Alternatives Considered**:
- **react-dropzone**: Overkill for simple file input (adds 15KB)
- **Uppy**: Too feature-rich for this use case (multi-file, resumable uploads not needed)

**Implementation Pattern**:
```typescript
// FileUpload.tsx component
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?[0]
  if (!file) return

  // Validate type
  if (!['image/png', 'image/svg+xml'].includes(file.type)) {
    setError('Please upload PNG or SVG files only')
    return
  }

  // Validate size (5MB for logos, 1MB for favicon)
  const maxSize = type === 'favicon' ? 1_000_000 : 5_000_000
  if (file.size > maxSize) {
    setError(`File too large (max ${maxSize / 1_000_000}MB)`)
    return
  }

  // Create preview and store file
  const previewUrl = URL.createObjectURL(file)
  setPreview(previewUrl)
  onUpload(file)
}
```

**Best Practices**:
- Always validate file type and size client-side before upload
- Show preview immediately for better UX
- Clean up blob URLs with `URL.revokeObjectURL()` in cleanup
- Store file metadata (name, size, type) in training profile
- For MVP, convert to base64 and store in localStorage (future: upload to backend)

---

### 3. Color Picker Component

**Decision**: Use Radix UI's primitives to build custom color picker

**Rationale**:
- Radix UI already used in PMC Engine (consistency)
- Accessible out of the box (keyboard navigation, ARIA labels)
- Unstyled, so matches PMC Engine visual language
- Can combine with native `<input type="color">` for browser picker
- Lightweight and composable

**Alternatives Considered**:
- **react-colorful**: Good option but adds 2KB, less accessible
- **react-color**: Heavy (10KB+), over-styled, hard to customize

**Implementation Pattern**:
```typescript
// Use Radix Popover + native color input
<Popover.Root>
  <Popover.Trigger>
    <div style={{ background: color }} /> {color}
  </Popover.Trigger>
  <Popover.Content>
    <input
      type="color"
      value={color}
      onChange={(e) => setColor(e.target.value)}
    />
    <input
      type="text"
      value={color}
      pattern="^#[0-9A-Fa-f]{6}$"
      onChange={(e) => setColor(e.target.value)}
    />
  </Popover.Content>
</Popover.Root>
```

**Best Practices**:
- Always provide text input fallback for precise hex entry
- Validate hex format with regex: `/^#[0-9A-Fa-f]{6}$/`
- Show visual swatch preview next to hex value
- Support both formats: `#EA2724` and `EA2724` (normalize to #-prefixed)

---

### 4. Stepper Navigation Pattern

**Decision**: Custom stepper component with scroll-to-section behavior

**Rationale**:
- No robust React stepper library fits PMC Engine's minimal aesthetic
- Simple to build: array of sections, active state, click handlers
- Full control over sticky positioning and responsive behavior
- Matches PMC Engine constitution (predictable, minimal UI)

**Implementation Pattern**:
```typescript
// TrainingStepper.tsx
const sections = [
  { id: 'brand-basics', label: 'Brand & Business', completed: false },
  { id: 'visual-identity', label: 'Visual Identity', completed: true },
  // ... 4 more
]

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  setActiveSection(sectionId)
}

return (
  <nav className="training-stepper">
    {sections.map((section, index) => (
      <button
        key={section.id}
        onClick={() => scrollToSection(section.id)}
        className={activeSection === section.id ? 'active' : ''}
      >
        <span className="step-number">{index + 1}</span>
        <span className="step-label">{section.label}</span>
        {section.completed && <CheckIcon />}
      </button>
    ))}
  </nav>
)
```

**Best Practices**:
- Use `position: sticky` for left stepper (stays visible while scrolling)
- Highlight active section based on scroll position (Intersection Observer)
- Show completion icon (checkmark) when section complete
- On mobile: Convert to horizontal tabs or top dropdown
- Keyboard navigation: arrow keys move between steps, Enter activates

---

### 5. Completion Logic

**Decision**: Per-section completion rules stored in separate utility module

**Rationale**:
- Keeps logic centralized and testable
- Each section has different completion criteria (see spec FR-246+)
- Can be easily updated without touching UI components
- Supports partial completion state (not started / partial / complete)

**Implementation Pattern**:
```typescript
// completionLogic.ts
export function getSectionCompletion(
  section: TrainingSection,
  data: SectionData
): 'not-started' | 'partial' | 'complete' {
  switch (section) {
    case 'brand-basics':
      // Complete if: brandName + elevatorPitch + description + industry
      const required = [data.brandName, data.elevatorPitch, data.description, data.industry]
      const filled = required.filter(Boolean).length
      if (filled === 0) return 'not-started'
      if (filled < 4) return 'partial'
      return 'complete'

    case 'visual-identity':
      // Complete if: darkMode + (logo OR colors)
      if (!data.darkMode) return 'not-started'
      const hasVisual = data.logo || data.primaryColor
      return hasVisual ? 'complete' : 'partial'

    // ... other sections
  }
}

export function getOverallCompletion(profile: TrainingProfile): string {
  const completed = SECTIONS.filter(
    section => getSectionCompletion(section, profile[section]) === 'complete'
  )
  return `${completed.length}/6`
}
```

**Best Practices**:
- Test completion logic independently with unit tests
- Document criteria clearly (see appendices/completion-logic.md)
- Update UI reactively when fields change
- Show helpful hints: "Add 2 more services to mark complete"

---

### 6. Persistent Storage Strategy

**Decision**: MVP uses localStorage with site-scoped keys, backend-ready service abstraction

**Rationale**:
- Fast development (no backend changes needed initially)
- Synchronous API (easier than async backend calls)
- Per-site scoping via key pattern: `pmc_training_${siteId}`
- Service abstraction allows backend migration without UI changes
- Aligns with "ship fast, iterate" approach

**Implementation Pattern**:
```typescript
// trainingService.ts
export interface TrainingService {
  load(siteId: string): TrainingProfile | null
  save(siteId: string, profile: TrainingProfile): void
  delete(siteId: string): void
}

// localStorage implementation
export const localStorageService: TrainingService = {
  load(siteId) {
    const raw = localStorage.getItem(`pmc_training_${siteId}`)
    return raw ? JSON.parse(raw) : null
  },
  save(siteId, profile) {
    localStorage.setItem(`pmc_training_${siteId}`, JSON.stringify(profile))
  },
  delete(siteId) {
    localStorage.removeItem(`pmc_training_${siteId}`)
  }
}

// Future: API implementation (same interface)
export const apiService: TrainingService = {
  async load(siteId) {
    const res = await fetch(`/api/sites/${siteId}/training`)
    return res.ok ? res.json() : null
  },
  async save(siteId, profile) {
    await fetch(`/api/sites/${siteId}/training`, {
      method: 'PUT',
      body: JSON.stringify(profile)
    })
  },
  async delete(siteId) {
    await fetch(`/api/sites/${siteId}/training`, { method: 'DELETE' })
  }
}
```

**Best Practices**:
- Serialize with `JSON.stringify/parse` (handles nested objects)
- Validate data shape on load (handle corrupted localStorage)
- Handle quota exceeded errors (localStorage ~5-10MB limit)
- For files: Convert to base64 for MVP, upload to CDN for backend version
- Add migration utility when switching to backend

**Migration Path**:
1. MVP: localStorage only
2. Phase 2: Dual-write (localStorage + backend) for reliability
3. Phase 3: Backend-only with localStorage cache

---

### 7. AI Context Integration

**Decision**: Export training profile as structured prompt context via `aiContextService`

**Rationale**:
- AI Change Timeline (002-chat-panel) already has context injection mechanism
- Training data should enhance, not replace, existing context (theme, user prompts)
- Structured format allows AI to selectively use relevant data
- Missing/incomplete sections gracefully ignored (no errors)

**Implementation Pattern**:
```typescript
// aiContextService.ts
export function buildAIContext(profile: TrainingProfile): string {
  const sections: string[] = []

  if (profile.section1_brandBasics.brandName) {
    sections.push(`Brand: ${profile.section1_brandBasics.brandName}`)
    if (profile.section1_brandBasics.description) {
      sections.push(`Description: ${profile.section1_brandBasics.description}`)
    }
  }

  if (profile.section3_voiceTone.formalCasual) {
    const tone = profile.section3_voiceTone.formalCasual < 3 ? 'formal' : 'casual'
    sections.push(`Tone: ${tone}`)
  }

  if (profile.section6_aiBehavior.rewriteStrength) {
    sections.push(`Rewrite strength: ${profile.section6_aiBehavior.rewriteStrength}`)
  }

  if (profile.section6_aiBehavior.sensitiveAreas.length) {
    sections.push(`Sensitive areas (do not modify): ${profile.section6_aiBehavior.sensitiveAreas.join(', ')}`)
  }

  return sections.length ? `\n\n## Site Training Context\n${sections.join('\n')}` : ''
}

// Integration with chat panel
export function injectTrainingContext(siteId: string): void {
  const profile = trainingService.load(siteId)
  if (!profile) return // No training = no context injection

  const context = buildAIContext(profile)
  // Append to existing AI system prompt via chat store
  chatStore.setState(state => ({
    systemPrompt: state.systemPrompt + context
  }))
}
```

**Best Practices**:
- Only inject non-empty sections (don't clutter prompt with nulls)
- Mark sensitive areas clearly for AI to respect
- Prioritize recent updates (timestamp-based context freshness)
- Keep context concise (AI prompts have token limits)
- Re-inject on training save (update live AI session)

---

### 8. Responsive Design Approach

**Decision**: Desktop-first with mobile breakpoints at 768px and 480px

**Rationale**:
- PMC Engine users primarily desktop (site building is desktop activity)
- Stepper navigation needs adaptation for mobile (horizontal tabs or dropdown)
- Form fields stack naturally on mobile (no complex grid layouts)
- Constitution prioritizes desktop UX, mobile is secondary

**Implementation Pattern**:
```css
/* Desktop default (stepper left, content right) */
.training-panel {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

/* Tablet: narrower stepper */
@media (max-width: 768px) {
  .training-panel {
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
  }
}

/* Mobile: stacked layout, stepper becomes top tabs */
@media (max-width: 480px) {
  .training-panel {
    grid-template-columns: 1fr;
  }

  .training-stepper {
    position: sticky;
    top: 0;
    overflow-x: auto;
    display: flex;
    gap: 0.5rem;
  }

  .training-stepper button {
    flex-shrink: 0;
    padding: 0.5rem 1rem;
  }
}
```

**Best Practices**:
- Test touch targets (44×44px minimum per constitution)
- File uploads work on mobile (native camera access)
- Color picker uses native input for mobile
- Form fields have sufficient spacing for touch
- Save/Discard buttons always visible (sticky footer on mobile)

---

## Security Considerations

### File Upload Validation

**Decision**: Multi-layered validation (client + server)

**Client-side checks**:
- File extension: `.png`, `.svg`, `.ico` only
- MIME type: `image/png`, `image/svg+xml`, `image/x-icon`
- File size: 5MB max for logos, 1MB for favicon
- Dimensions: Warn if >2000px (performance concern)

**Server-side checks** (when backend implemented):
- Re-validate MIME type (can't trust client)
- Scan for embedded scripts in SVG (sanitize with DOMPurify or similar)
- Check file headers (magic bytes) to prevent MIME spoofing
- Store files with random names (no user-provided filenames)

### Prompt Injection Prevention

**Decision**: Sanitize user input before passing to AI context

**Implementation**:
```typescript
function sanitizeForAI(input: string): string {
  // Remove potential prompt injection patterns
  return input
    .replace(/```/g, '') // Remove code blocks
    .replace(/<\|.*?\|>/g, '') // Remove special tokens
    .replace(/###/g, '') // Remove markdown headers
    .slice(0, 500) // Truncate to reasonable length
}
```

**Best Practices**:
- Never trust user input in AI prompts
- Clearly mark user-provided content in context
- Monitor AI responses for unexpected behavior
- Log suspicious patterns for review

---

## Performance Optimization

### Bundle Size Management

**Decisions**:
- Lazy load training panel component (not needed on every page load)
- Use tree-shaking for Radix UI (import only used primitives)
- Defer image preview rendering until file selected

**Target**:
- Training panel chunk: <50KB gzipped
- First paint: <100ms after route transition
- Form interaction: <16ms (60fps)

### Render Optimization

**Patterns**:
- Memoize section components with `React.memo()`
- Use `useCallback` for event handlers passed to children
- Debounce auto-save (if implemented) to 2 seconds
- Avoid watching all form fields (watch only what's needed)

---

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)

**Coverage targets**:
- Form validation logic: 100%
- Completion logic: 100%
- Training service: 100%
- Components: 80%+ (focus on behavior, not implementation)

**Key test scenarios**:
- Form submission with valid/invalid data
- File upload validation (size, type, preview)
- Section completion state changes
- localStorage persistence (mock localStorage)
- AI context generation

### Integration Tests

**Scenarios**:
- Full panel workflow: load → edit → save → reload
- Multi-section editing with navigation
- File upload → preview → save → load preview
- Discard changes behavior

### E2E Tests (Playwright)

**Critical paths**:
1. New site: Open panel → Fill brand basics → Save → Verify AI uses data
2. Existing site: Load panel → Edit visual identity → Save → Verify updates
3. File upload: Upload logo → Preview appears → Save → Reload shows logo
4. Responsive: Mobile stepper navigation works

---

## Open Questions & Future Considerations

### Resolved
- ✅ Storage strategy: localStorage MVP, backend later
- ✅ Form library: react-hook-form
- ✅ File handling: Native File API with preview
- ✅ Color picker: Radix + native input

### Deferred to Future Iterations
- Auto-save behavior (enabled by default or opt-in?)
- Version history for training profiles
- Export/import training profiles
- Multi-language support for panel UI
- Analytics: which sections completed most often?
- A/B testing: does training improve AI acceptance rate?

---

## References

- PMC Engine Constitution: `.specify/memory/constitution.md`
- Feature Spec: `specs/005-basic-ai-training/spec.md`
- react-hook-form docs: https://react-hook-form.com/
- Radix UI docs: https://www.radix-ui.com/
- Web File API: https://developer.mozilla.org/en-US/docs/Web/API/File_API
