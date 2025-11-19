# Implementation Tasks: Basic Site AI Training Panel

**Feature**: 005-basic-ai-training
**Branch**: `005-basic-ai-training`
**Generated**: 2025-01-18

---

## Overview

This document contains all implementation tasks for the Basic Site AI Training Panel, organized by user story to enable independent implementation and testing. Each phase represents a complete, testable increment.

**Total Tasks**: 67
**User Stories**: 7 (2 P1, 4 P2, 1 P3)
**Estimated Time**: 30-38 hours total

---

## Implementation Strategy

**MVP Scope** (Recommended first milestone):
- Phase 1: Setup (infrastructure)
- Phase 2: Foundational (core components)
- Phase 3: User Story 1 (Basic training setup with AI integration)
- Phase 4: User Story 2 (Visual assets)

This MVP delivers core value: AI can understand brand basics and visual identity.

**Incremental Delivery**:
1. **Week 1**: Setup + Foundational + US1 → AI uses brand info ✅
2. **Week 2**: US2 + US7 → Complete visual identity + edit capability ✅
3. **Week 3**: US3 + US4 + US5 → Full training panel functional ✅
4. **Week 4**: US6 + Polish → Production-ready ✅

---

## Dependencies

### User Story Dependency Graph

```
Setup (Phase 1)
  ↓
Foundational (Phase 2)
  ↓
├─→ US1 (P1) - Initial Training Setup [BLOCKS: All other stories]
│     ↓
├─→ US2 (P1) - Upload Visual Assets [independent after US1]
├─→ US3 (P2) - Communication Tone [independent after US1]
├─→ US4 (P2) - Services & CTA [independent after US1]
├─→ US5 (P2) - Contact Info [independent after US1]
├─→ US7 (P2) - Edit Existing Training [independent after US1]
│     ↓
└─→ US6 (P3) - AI Boundaries [depends on US1 for AI integration]
      ↓
    Polish (Final Phase)
```

**Critical Path**: Setup → Foundational → US1 → US6 → Polish

**Parallel Opportunities**:
- After US1: US2, US3, US4, US5, US7 can be developed in parallel
- All section components are independent and parallelizable

---

## Phase 1: Setup (4 tasks, ~2 hours)

**Goal**: Initialize project dependencies and directory structure

- [ ] T001 Install required npm dependencies in frontend/package.json: react-hook-form@7, @radix-ui/react-popover, @radix-ui/react-label
- [ ] T002 [P] Create TypeScript types file frontend/src/types/training.ts with all interfaces from data-model.md
- [ ] T003 [P] Create utility file frontend/src/utils/validation.ts with validation functions (email, phone, url, hexColor, required, maxLength, minLength)
- [ ] T004 [P] Create utility file frontend/src/utils/completionLogic.ts with section completion calculation functions

---

## Phase 2: Foundational (10 tasks, ~4 hours)

**Goal**: Build core infrastructure that all user stories depend on

**Independent Test**: Panel loads with empty profile, stepper navigates between sections, save/discard buttons respond to dirty state

### Core Services & Store

- [ ] T005 Create training service file frontend/src/services/trainingService.ts with localStorage implementation (load, save, delete methods)
- [ ] T006 Create AI context service file frontend/src/services/aiContextService.ts with buildAIContext and injectTrainingContext functions
- [ ] T007 Create Zustand store frontend/src/stores/trainingStore.ts with state management (currentProfile, isDirty, loadProfile, updateSection, saveProfile, discardChanges, setActiveSection)

### Core UI Components

- [ ] T008 Create main panel component frontend/src/components/settings/AITrainingPanel.tsx with header, save/discard buttons, and content grid layout
- [ ] T009 Create main panel styles frontend/src/components/settings/AITrainingPanel.css following PMC Engine visual language
- [ ] T010 [P] Create stepper component frontend/src/components/settings/TrainingStepper.tsx with vertical navigation, completion indicators, and scroll-to-section behavior
- [ ] T011 [P] Create stepper styles frontend/src/components/settings/TrainingStepper.css with sticky positioning and responsive breakpoints
- [ ] T012 [P] Create reusable form field wrapper component frontend/src/components/settings/TrainingFormField.tsx with label, error display, and helper text support
- [ ] T013 Add AI Training route to frontend/src/components/shell/SettingsRouter.tsx mapping /settings/ai-training to AITrainingPanel
- [ ] T014 Add "AI Training" navigation link to Settings menu/sidebar

---

## Phase 3: User Story 1 - Initial Training Setup (Priority: P1) (9 tasks, ~4 hours)

**Story Goal**: Site owner provides basic brand information so AI generates appropriate content without repeated questions

**Independent Test**: Fill brand basics (name, elevator pitch, description, industry), save, generate AI content, verify AI uses brand name and tone without asking clarifying questions

**Acceptance Criteria**:
1. Empty panel shows 0/6 sections filled for new site
2. Brand name and description save and mark section partially complete
3. AI incorporates brand info in responses without asking "What does your business do?"

### Section 1: Brand Basics Implementation

- [ ] T015 [US1] Create BrandBasics section component frontend/src/components/settings/sections/BrandBasicsSection.tsx with form fields: brandName (required), tagline, elevatorPitch (required), description (required), industry dropdown (required), location
- [ ] T016 [US1] Add react-hook-form integration to BrandBasicsSection with validation rules: brandName (1-100 chars), elevatorPitch (10-250 chars), description (50-500 chars), industry (required)
- [ ] T017 [US1] Implement auto-update of Zustand store on form field changes using watch() in BrandBasicsSection
- [ ] T018 [US1] Add completion logic for section1_brandBasics in frontend/src/utils/completionLogic.ts (complete when all required fields filled)
- [ ] T019 [US1] Wire BrandBasicsSection into AITrainingPanel based on activeSection state

### AI Integration

- [ ] T020 [US1] Implement brand basics context building in frontend/src/services/aiContextService.ts (export brand name, tagline, elevator pitch, description to AI prompt)
- [ ] T021 [US1] Integrate trainingContext injection into chat store frontend/src/stores/chatStore.ts when AI Change Timeline opens
- [ ] T022 [US1] Update AI system prompt builder to append training context from injectTrainingContext()
- [ ] T023 [US1] Test AI integration: Create training profile with brand info, open chat, verify AI uses brand context in responses without asking basic questions

---

## Phase 4: User Story 2 - Upload Visual Assets (Priority: P1) (12 tasks, ~5 hours)

**Story Goal**: Site owner uploads logo and sets brand colors so AI references correct visual identity

**Independent Test**: Upload logo (PNG/SVG), set primary/secondary colors, select dark mode option, verify preview displays and AI references colors in content

**Acceptance Criteria**:
1. Logo upload accepts PNG/SVG, shows preview, validates size (5MB max)
2. Dark mode "Both" option reveals dark logo upload and default mode selector
3. AI correctly references brand colors in generated content

### File Upload Component

- [ ] T024 [P] [US2] Create file upload component frontend/src/components/settings/FileUpload.tsx with drag-and-drop support, file type validation (image/png, image/svg+xml for logos), size validation (5MB max for logos, 1MB for favicon), and preview display using URL.createObjectURL()
- [ ] T025 [P] [US2] Create file upload styles frontend/src/components/settings/FileUpload.css with upload area, preview container, and error states
- [ ] T026 [P] [US2] Add file-to-base64 conversion utility in frontend/src/utils/fileHelpers.ts for localStorage storage

### Color Picker Component

- [ ] T027 [P] [US2] Create color picker component frontend/src/components/settings/ColorPicker.tsx using Radix UI Popover + native input type="color" with hex text input fallback
- [ ] T028 [P] [US2] Create color picker styles frontend/src/components/settings/ColorPicker.css with swatch preview and popover positioning
- [ ] T029 [P] [US2] Add hex color validation and normalization in frontend/src/utils/validation.ts

### Section 2: Visual Identity Implementation

- [ ] T030 [US2] Create VisualIdentitySection component frontend/src/components/settings/sections/VisualIdentitySection.tsx with fields: primaryLogo (FileUpload), darkModeLogo (FileUpload, conditional), favicon (FileUpload), darkModeSupport (radio: light-only/dark-only/both), defaultMode (radio, conditional), primaryColor (ColorPicker), secondaryColor (ColorPicker)
- [ ] T031 [US2] Implement conditional field display: Show darkModeLogo and defaultMode inputs only when darkModeSupport === "both"
- [ ] T032 [US2] Add file upload handlers to convert files to FileData objects with base64 dataUrl for localStorage storage
- [ ] T033 [US2] Add completion logic for section2_visualIdentity in completionLogic.ts (complete when darkModeSupport set AND (logo OR color exists))
- [ ] T034 [US2] Wire VisualIdentitySection into AITrainingPanel
- [ ] T035 [US2] Update AI context service to include visual identity data (logo status, colors) in prompt context

---

## Phase 5: User Story 3 - Define Communication Tone (Priority: P2) (7 tasks, ~3 hours)

**Story Goal**: Site owner specifies how AI should write (formal vs casual, playful vs serious) for consistent brand voice

**Independent Test**: Set tone sliders (formal/casual, playful/serious), add words to USE/AVOID lists, set emoji preference, generate multiple content pieces, verify consistent tone and vocabulary

**Acceptance Criteria**:
1. Tone sliders (1-5 scale) save properly
2. AI avoids words in "Words to AVOID" list
3. AI respects emoji usage preference (never/sometimes/often)

### Slider Component

- [ ] T036 [P] [US3] Create range slider component frontend/src/components/settings/RangeSlider.tsx with 1-5 scale, labels at ends (e.g., "Formal" ↔ "Casual"), and current value display
- [ ] T037 [P] [US3] Create range slider styles frontend/src/components/settings/RangeSlider.css with accessible focus states and touch-friendly targets (44px min)

### Section 3: Voice & Tone Implementation

- [ ] T038 [US3] Create VoiceToneSection component frontend/src/components/settings/sections/VoiceToneSection.tsx with fields: formalCasualLevel (RangeSlider 1-5), playfulSeriousLevel (RangeSlider 1-5), toneDescription (textarea, 200 chars max), emojiUsage (radio: never/sometimes/often), wordsToUse (textarea, parse by newlines, max 20 items), wordsToAvoid (textarea, parse by newlines, max 20 items)
- [ ] T039 [US3] Add validation for word lists: max 20 items per list, max 50 chars per item, trim whitespace, deduplicate case-insensitive
- [ ] T040 [US3] Add completion logic for section3_voiceTone in completionLogic.ts (complete when both sliders set OR toneDescription + wordsToUse has items)
- [ ] T041 [US3] Wire VoiceToneSection into AITrainingPanel
- [ ] T042 [US3] Update AI context service to include tone settings (formal/casual level, emoji preference, word lists) with sanitization to prevent prompt injection

---

## Phase 6: User Story 4 - Specify Services and CTA (Priority: P2) (7 tasks, ~3 hours)

**Story Goal**: Site owner lists offerings and preferred CTA for relevant, specific content generation

**Independent Test**: Add 3+ services with descriptions, set primary CTA, generate Services section or hero, verify services and CTA appear in content

**Acceptance Criteria**:
1. Services list supports add/edit/delete with descriptions (max 20 services)
2. Primary CTA field saves (max 50 chars)
3. AI prioritizes listed services in generated content

### Repeatable Field Component

- [ ] T043 [P] [US4] Create repeatable list component frontend/src/components/settings/RepeatableList.tsx with add/edit/delete/reorder functionality, using UUID for item IDs
- [ ] T044 [P] [US4] Create repeatable list styles frontend/src/components/settings/RepeatableList.css with drag handles, action buttons, and empty state

### Section 4: Offerings Implementation

- [ ] T045 [US4] Create OfferingsSection component frontend/src/components/settings/sections/OfferingsSection.tsx with fields: services (RepeatableList with name + description per item, max 20 items), primaryCTA (text input, 50 chars max)
- [ ] T046 [US4] Add service validation: name required (1-100 chars), description optional (max 200 chars), max 20 services total
- [ ] T047 [US4] Add completion logic for section4_offerings in completionLogic.ts (complete when 3+ services with descriptions AND CTA provided)
- [ ] T048 [US4] Wire OfferingsSection into AITrainingPanel
- [ ] T049 [US4] Update AI context service to include services/products list and primary CTA in prompt

---

## Phase 7: User Story 5 - Set Contact Info (Priority: P2) (7 tasks, ~3 hours)

**Story Goal**: Site owner ensures AI-generated contact sections use correct email, phone, and social links

**Independent Test**: Enter email, phone, address, add social links (Facebook, Instagram), set preferred contact method, generate footer, verify all contact details appear correctly

**Acceptance Criteria**:
1. Email field validates email format
2. Social links support multiple platforms (Facebook, Instagram, Twitter, LinkedIn, etc.) with URL validation
3. AI emphasizes preferred contact method in generated content

### Section 5: Contact Implementation

- [ ] T050 [US5] Create ContactSection component frontend/src/components/settings/sections/ContactSection.tsx with fields: email (email validation), phone (lenient phone validation), address (textarea, 250 chars), preferredMethod (dropdown: call/whatsapp/email/form), socialLinks (RepeatableList with platform dropdown + URL per item, max 10 links)
- [ ] T051 [US5] Add email validation using regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/ in validation.ts
- [ ] T052 [US5] Add phone validation (lenient: allow +, -, spaces, parentheses, 7-20 chars) in validation.ts
- [ ] T053 [US5] Add URL validation for social links (must start with http:// or https://) in validation.ts
- [ ] T054 [US5] Add completion logic for section5_contact in completionLogic.ts (complete when email AND (phone OR socialLinks exist))
- [ ] T055 [US5] Wire ContactSection into AITrainingPanel
- [ ] T056 [US5] Update AI context service to include contact info (email, phone, preferred method, social platforms) in prompt

---

## Phase 8: User Story 7 - Edit Existing Training (Priority: P2) (5 tasks, ~2 hours)

**Story Goal**: Site owner updates training data as business evolves

**Independent Test**: Load existing profile, change brand name, save, reload page, verify changes persist; test discard changes functionality

**Acceptance Criteria**:
1. Modified training data saves and persists across sessions
2. lastUpdated timestamp updates on save
3. Discard changes reverts to last saved state

### Save/Discard Logic

- [ ] T057 [US7] Implement saveProfile action in trainingStore.ts: update lastUpdated timestamp, persist to localStorage via trainingService, update originalProfile snapshot, reset isDirty flag
- [ ] T058 [US7] Implement discardChanges action in trainingStore.ts: revert currentProfile to originalProfile clone, reset isDirty flag
- [ ] T059 [US7] Add dirty state tracking: set isDirty=true on any updateSection call, display unsaved changes indicator in panel header
- [ ] T060 [US7] Implement "Last updated" timestamp display in panel header showing profile.lastUpdated in human-readable format (e.g., "Saved 5 minutes ago")
- [ ] T061 [US7] Add browser beforeunload warning when isDirty=true to prevent accidental data loss on page navigation

---

## Phase 9: User Story 6 - Control AI Boundaries (Priority: P3) (6 tasks, ~2.5 hours)

**Story Goal**: Site owner controls rewrite aggressiveness and marks sensitive areas AI shouldn't modify

**Independent Test**: Set rewrite strength to "Light edits only", mark "Pricing" as sensitive, ask AI to modify pricing, verify AI warns or declines

**Acceptance Criteria**:
1. Rewrite strength setting (light/balanced/heavy) saves
2. Sensitive areas checkboxes (pricing, legal, testimonials, other) save with custom text for "other"
3. AI respects boundaries and warns when asked to modify sensitive content

### Section 6: AI Behavior Implementation

- [ ] T062 [US6] Create AIBehaviorSection component frontend/src/components/settings/sections/AIBehaviorSection.tsx with fields: rewriteStrength (radio: light/balanced/heavy), sensitiveAreas (checkboxes: pricing/legal/testimonials/other), customSensitiveText (text input, shows when "other" checked, 100 chars max), alwaysKeepInstructions (textarea, 300 chars max)
- [ ] T063 [US6] Implement conditional display: Show customSensitiveText field only when "other" is checked in sensitiveAreas
- [ ] T064 [US6] Add validation: customSensitiveText required if "other" checked, alwaysKeepInstructions max 300 chars
- [ ] T065 [US6] Add completion logic for section6_aiBehavior in completionLogic.ts (complete when rewriteStrength set AND (sensitiveAreas OR alwaysKeepInstructions provided))
- [ ] T066 [US6] Wire AIBehaviorSection into AITrainingPanel
- [ ] T067 [US6] Update AI context service to include rewrite strength preference and sensitive areas with clear "DO NOT MODIFY" instructions in prompt

---

## Phase 10: Polish & Cross-Cutting Concerns (Final Phase) (0 tasks, ~0 hours)

**Goal**: Production readiness, performance, accessibility, and quality assurance

**Note**: Testing is not explicitly requested in the feature specification. Test tasks have been omitted per task generation rules. If testing is required, add unit tests (Vitest + React Testing Library) and E2E tests (Playwright) as separate tasks.

### Recommended Polish Tasks (if time permits):
- Responsive design testing (mobile stepper adaptation)
- Accessibility audit (keyboard navigation, screen reader testing, color contrast)
- Performance optimization (lazy loading, bundle size analysis)
- Error handling improvements (localStorage quota exceeded, network failures)
- Loading states and skeleton screens
- Empty state messaging and onboarding hints
- Analytics integration (track completion rates, section engagement)

---

## Parallel Execution Examples

### After Foundational Phase Complete:

**Parallel Batch 1** (Phase 3: US1):
- T015-T019: BrandBasicsSection implementation
- T020-T023: AI integration (can work concurrently with section UI)

**Parallel Batch 2** (After US1 complete, can run all in parallel):
- Phase 4 (US2): T024-T035 - Visual assets
- Phase 5 (US3): T036-T042 - Communication tone
- Phase 6 (US4): T043-T049 - Services & CTA
- Phase 7 (US5): T050-T056 - Contact info
- Phase 8 (US7): T057-T061 - Edit functionality

**Parallel Batch 3** (Final story):
- Phase 9 (US6): T062-T067 - AI boundaries (depends on US1 AI integration)

### Component-Level Parallelization:

Within each user story phase, [P] marked tasks can be built in parallel by different developers:

**Example from Phase 4 (US2)**:
- Developer A: T024-T026 (FileUpload component)
- Developer B: T027-T029 (ColorPicker component)
- Developer C: T030-T035 (VisualIdentitySection integration) - starts after A & B complete

**Example from Phase 6 (US4)**:
- Developer A: T043-T044 (RepeatableList component)
- Developer B: T045-T049 (OfferingsSection) - starts after A completes

---

## Task Validation

✅ **Format Check**: All 67 tasks follow required format:
- All start with `- [ ]`
- All have sequential Task ID (T001-T067)
- User story tasks have [US#] label
- Parallelizable tasks have [P] marker
- All include specific file paths

✅ **Completeness Check**:
- All 7 user stories covered
- Each story has independent test criteria
- Dependencies clearly marked
- Parallel opportunities identified

✅ **Traceability**:
- Setup → 4 tasks
- Foundational → 10 tasks
- US1 (P1) → 9 tasks
- US2 (P1) → 12 tasks
- US3 (P2) → 7 tasks
- US4 (P2) → 7 tasks
- US5 (P2) → 7 tasks
- US7 (P2) → 5 tasks
- US6 (P3) → 6 tasks
- Polish → 0 tasks (testing not requested)
- **Total**: 67 tasks

---

## Success Criteria

MVP (Phases 1-4) delivers:
- ✅ Panel accessible from Settings → AI Training
- ✅ Brand basics section (Section 1) fully functional
- ✅ Visual identity section (Section 2) with file upload
- ✅ AI uses training context in responses
- ✅ Data persists in localStorage
- ✅ Save/discard functionality
- ✅ Completion tracking (X/6)

Full Feature (All Phases) delivers:
- ✅ All 6 sections implemented and functional
- ✅ Form validation on all fields
- ✅ File uploads with preview (logo, favicon)
- ✅ Color pickers for brand colors
- ✅ Repeatable fields (services, social links)
- ✅ AI integration with full training context
- ✅ Edit existing profiles with persistence
- ✅ Dirty state tracking and unsaved changes warning
- ✅ Completion status per section
- ✅ Responsive design (stepper adapts on mobile)
- ✅ Accessible (keyboard navigation, screen reader support)

---

## References

- **Feature Spec**: [spec.md](spec.md)
- **Implementation Plan**: [plan.md](plan.md)
- **Data Model**: [data-model.md](data-model.md)
- **Research**: [research.md](research.md)
- **API Contracts**: [contracts/openapi.yaml](contracts/openapi.yaml)
- **Quickstart Guide**: [quickstart.md](quickstart.md)
- **PMC Engine Constitution**: `../../.specify/memory/constitution.md`
