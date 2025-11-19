# Implementation Plan: Basic Site AI Training Panel

**Branch**: `005-basic-ai-training` | **Date**: 2025-01-18 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-basic-ai-training/spec.md`

## Summary

The Basic Site AI Training Panel is a non-blocking, optional configuration interface that allows PMC Engine site owners to provide foundational brand and business information to help AI generate consistent, on-brand content. The panel captures minimum training data across 6 sections: Brand & Business, Visual Identity, Voice & Tone, Offerings & CTA, Contact & Social, and AI Behaviour. All sections are optional and skippable; incomplete training never blocks PMC Engine features.

**Technical Approach**: Build as a settings sub-panel within the PMC Engine dashboard shell, using React components with Zustand state management. Implement a wizard-style stepper UI with left navigation and scrollable right content area. Store training profiles per-site in persistent storage (localStorage for MVP, with backend API ready). Integrate with AI system by loading profile data into AI context/prompts when Change Timeline opens.

## Technical Context

**Language/Version**: TypeScript 5+ (strict mode), inherited from dashboard shell
**Primary Dependencies**: React 18+, Zustand 4 (state management), Radix UI (form primitives, color picker), react-hook-form (form validation)
**Storage**: Browser localStorage for MVP (per-site scoped), with API endpoints prepared for future backend migration
**Testing**: Vitest + React Testing Library (unit/integration), Playwright (E2E), axe-core (accessibility)
**Target Platform**: Web (desktop-first, responsive breakpoints for mobile)
**Project Type**: Web (frontend in existing React app)
**Performance Goals**: Panel load <2s, file upload <5s (<2MB files), save operation <1s, AI context integration <10s
**Constraints**: Must never block PMC Engine features, all sections optional, must respect constitution's clarity and consistency principles
**Scale/Scope**: 6 sections, ~35 form fields total, 3-5 repeatable items (services/social links), supports 100s of sites

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Evaluation

**✅ PASS: Consistency Principle**
- Feature uses existing PMC Engine dashboard shell (top bar, left rail, main content area)
- No new UI paradigms introduced
- Settings sub-panel pattern consistent with shell architecture

**✅ PASS: Clarity & Cognitive Load Reduction**
- Wizard stepper provides progressive disclosure (one section at a time)
- Advanced fields are optional/skippable
- Clear section completion indicators reduce mental overhead
- Only 6 top-level sections (well within 7±2 item limit)

**✅ PASS: AI Scope Control**
- Training panel provides context TO AI, doesn't perform AI actions
- All training sections are optional and don't execute AI operations
- AI integration respects scoped operations defined in 002-chat-panel

**✅ PASS: User Safety**
- Non-blocking by design (explicit requirement)
- Save/Discard pattern provides undo capability
- Auto-save optional (manual save default for user control)
- No destructive actions (editing training doesn't delete site content)

**✅ PASS: Accessibility**
- Will use Radix UI primitives (keyboard navigable)
- Form fields will have proper labels and ARIA attributes
- Focus management for stepper navigation
- Color picker will include text input fallback

**✅ PASS: Visual Language**
- Uses existing PMC Engine palette (#EA2724 accent, consistent grays)
- Stepper UI follows minimal, professional aesthetic
- No prohibited patterns (gradients, glass effects, etc.)

**✅ PASS: Prohibited Patterns**
- Not a drag-and-drop builder
- Not a modal that hides chrome (lives in main content area)
- Technical details hidden from non-technical users
- No auto-publishing (training is just context, not site changes)

**No violations detected. Proceeding to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/005-basic-ai-training/
├── plan.md              # This file
├── research.md          # Phase 0 output (technology choices, patterns)
├── data-model.md        # Phase 1 output (TrainingProfile entity structure)
├── quickstart.md        # Phase 1 output (implementation guide)
├── contracts/           # Phase 1 output (API contracts for future backend)
├── appendices/          # Detailed specs from feature spec
│   ├── layout-specs.md
│   ├── field-specs.md
│   ├── completion-logic.md
│   ├── data-model.md
│   └── ai-integration.md
└── tasks.md             # Phase 2 output (/speckit.tasks - NOT created by this command)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── settings/
│   │   │   ├── AITrainingPanel.tsx          # Main panel component
│   │   │   ├── AITrainingPanel.css          # Panel styles
│   │   │   ├── TrainingStepper.tsx          # Left navigation stepper
│   │   │   ├── TrainingStepper.css
│   │   │   ├── sections/
│   │   │   │   ├── BrandBasicsSection.tsx   # Section 1
│   │   │   │   ├── VisualIdentitySection.tsx # Section 2
│   │   │   │   ├── VoiceToneSection.tsx     # Section 3
│   │   │   │   ├── OfferingsSection.tsx     # Section 4
│   │   │   │   ├── ContactSection.tsx       # Section 5
│   │   │   │   └── AIBehaviorSection.tsx    # Section 6
│   │   │   ├── TrainingSummaryCard.tsx      # Completion summary display
│   │   │   └── TrainingFormField.tsx        # Reusable field wrapper
│   │   └── shell/
│   │       └── SettingsRouter.tsx           # Add AI Training route
│   ├── stores/
│   │   └── trainingStore.ts                 # Zustand store for training data
│   ├── services/
│   │   ├── trainingService.ts               # localStorage persistence
│   │   └── aiContextService.ts              # Integration with AI system
│   ├── types/
│   │   └── training.ts                      # TypeScript interfaces
│   └── hooks/
│       └── useTrainingForm.ts               # Form validation & submission
└── tests/
    ├── components/
    │   └── settings/
    │       ├── AITrainingPanel.test.tsx
    │       └── sections/
    │           └── *.test.tsx               # Per-section tests
    ├── stores/
    │   └── trainingStore.test.ts
    └── e2e/
        └── ai-training-panel.spec.ts        # Playwright E2E tests
```

**Structure Decision**: Web application structure (Option 2). Feature lives entirely in `frontend/` since MVP uses localStorage (no backend changes required). Future backend API will add `backend/src/api/training/` endpoints for persistence, but architecture supports both approaches via abstracted `trainingService`.

## Complexity Tracking

> No constitution violations detected. Table left empty per template instructions.

---

## Post-Design Constitution Check

*Re-evaluation after Phase 1 design artifacts completed*

### Design Artifact Review

**✅ PASS: Consistency Principle**
- All components use existing PMC Engine visual system
- Settings panel pattern matches shell architecture
- No new navigation paradigms introduced
- Stepper UI is familiar wizard pattern (common in web apps)

**✅ PASS: Clarity & Cognitive Load Reduction**
- Data model uses clear, flat section structure (no deep nesting)
- Form fields have descriptive labels and helper text
- Progressive disclosure via stepper (one section at a time)
- Advanced fields clearly marked as optional
- Completion logic transparent (X/6 visible at all times)

**✅ PASS: AI Scope Control**
- Training panel only provides context, doesn't execute AI actions
- AI integration service properly scoped to load profile data
- No cross-site data leakage (per-site scoped keys)
- AI respects sensitive area boundaries (explicit checks in context builder)

**✅ PASS: User Safety**
- Save/Discard pattern prevents accidental data loss
- localStorage quota errors caught and surfaced clearly
- No destructive operations (delete only removes training, not site content)
- Form validation prevents invalid data from being saved
- Dirty state tracking ensures users know when changes are unsaved

**✅ PASS: Accessibility**
- Radix UI components provide keyboard navigation and ARIA attributes
- Form fields have proper labels (required for screen readers)
- Focus management in stepper navigation
- Color contrast verified (see quickstart CSS)
- Touch targets meet 44×44px minimum on mobile
- Completion state announced to screen readers

**✅ PASS: Visual Language**
- Uses PMC Engine palette (#EA2724, grays, whites)
- No prohibited patterns (gradients, glass, neumorphism)
- Consistent spacing and typography
- Minimal, professional aesthetic maintained

**✅ PASS: Prohibited Patterns**
- Not a drag-and-drop builder ✓
- Not a full-screen modal that hides chrome ✓
- No technical jargon exposed to users ✓
- No auto-publishing ✓
- No nested sections beyond 2 levels ✓
- No conflicting keyboard shortcuts ✓

**✅ PASS: State Management**
- Zustand store provides single source of truth
- Immutable updates (structuredClone for snapshots)
- Undo capability via discard changes
- State is serializable (JSON-compatible)
- Dirty tracking prevents data loss

**✅ PASS: Performance Goals**
- Target panel load <2s (no heavy computations)
- localStorage reads/writes are synchronous and fast
- Form validation on blur (doesn't block typing)
- Lazy loading pattern ready (panel not loaded until needed)
- File size validation prevents storage bloat

### Final Verdict

**All constitution principles satisfied.** No violations detected in pre-design or post-design evaluation. Feature is ready for implementation with confidence that it aligns with PMC Engine's quality standards and user experience goals.

### Compliance Notes

- Feature successfully maintains consistency with existing dashboard shell
- Progressive disclosure and optional design reduce cognitive load
- Non-blocking behavior ensures user safety and flexibility
- Accessibility requirements met through Radix UI and proper semantic HTML
- Visual language adheres to constitution's minimal, professional aesthetic
- No complexity added unnecessarily (localStorage for MVP, backend later)

**Approval**: Ready to proceed to `/speckit.tasks` for task generation.
