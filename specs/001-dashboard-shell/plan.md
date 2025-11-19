# Implementation Plan: Dashboard Shell

**Branch**: `001-dashboard-shell` | **Date**: 2025-11-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-dashboard-shell/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create the foundational dashboard shell for PMC Engine Editor - a unified, persistent layout that maintains consistency across all application states (wizard, edit, preview, settings). The shell provides five core regions: persistent top bar with site controls, left rail navigation, collapsible page sidebar, central live preview canvas, and right inspector panel with tabbed interface. This foundation enables all future editing, AI assistance, and preview functionality while strictly adhering to constitutional principles of consistency, clarity, accessibility, and user safety.

Technical approach: Browser-based single-page application with component-based architecture, reactive state management for real-time synchronization across shell regions, CSS Grid/Flexbox for responsive layout with defined breakpoints, and WCAG AA accessibility compliance through semantic HTML and ARIA attributes.

## Technical Context

**Language/Version**: TypeScript 5+ (strict mode)
**Primary Dependencies**: React 18+, Zustand 4 (state management), Vanilla Extract + CSS Modules (styling), Radix UI (accessible primitives)
**Storage**: IndexedDB (primary, <5MB state) with localStorage fallback (Safari private mode compatibility)
**Testing**: Vitest + React Testing Library (component), Playwright (E2E), @axe-core/playwright + vitest-axe (accessibility)
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Project Type**: Web (frontend single-page application)
**Performance Goals**: <100ms synchronization latency, 60fps resize/animation, <50ms input feedback, <3s auto-save completion
**Constraints**: Must work offline (for local editing), <100MB memory footprint, responsive 320px-3840px viewport, no external API dependencies for shell functionality
**Scale/Scope**: Single-user browser session, supports 1-100 pages per site, 1-50 sections per page, <5MB state size

*All NEEDS CLARIFICATION items resolved via Phase 0 research. See [research.md](./research.md) for detailed technology selection rationale.*

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitutional Alignment Gates

**✅ PASS - Section 2.I: Consistency**
- Requirement: One single dashboard shell across all states
- Evidence: FR-006 mandates consistent layout across wizard/edit/preview/settings modes
- Compliance: Shell structure never changes, only content within regions updates

**✅ PASS - Section 2.II: Clarity & Cognitive Load Reduction**
- Requirement: Progressive disclosure, show only what users need
- Evidence: Inspector tabs (P3) enable progressive disclosure; Advanced tab visually de-emphasized (FR-015, User Story 3)
- Compliance: Default view shows essential controls, advanced features opt-in

**✅ PASS - Section 2.III: AI Scope Control**
- Requirement: AI actions scoped (field, section, page)
- Evidence: AI Assistant tab includes scope selector (User Story 3, Acceptance Scenario 1)
- Compliance: Shell provides UI for scoped AI operations

**✅ PASS - Section 2.IV: User Safety**
- Requirement: Auto-save, undo/redo, clear error states
- Evidence: FR-020 (auto-save within 30s), FR-023 (undo/redo support), Edge Cases cover save failure with recovery
- Compliance: Auto-save prevents data loss, undo available, errors recoverable

**✅ PASS - Section 2.V: Accessibility**
- Requirement: WCAG AA, keyboard navigation, ARIA labels
- Evidence: FR-016 (focus outlines), FR-017 (ARIA labels), FR-018 (keyboard navigation), SC-009 (WCAG AA contrast)
- Compliance: Full keyboard support, screen reader compatible, contrast verified

**✅ PASS - Section 3.I: Canvas is Sacred**
- Requirement: Canvas shows high-fidelity live preview, no wireframes
- Evidence: FR-004 specifies "live site preview," User Story 1 requires "high fidelity rendering"
- Compliance: Canvas displays actual site, not placeholder UI

**✅ PASS - Section 3.II: Inspector is Source of Truth**
- Requirement: All structured editing happens in Inspector
- Evidence: FR-005 defines inspector with Content/Settings/Advanced tabs, FR-012 shows inspector updates with section-specific fields
- Compliance: Inspector is central editing interface

**✅ PASS - Section 3.V: Pages Sidebar Defines Structure**
- Requirement: Clear page/section hierarchy, syncs with canvas
- Evidence: FR-003 (hierarchical page/section list), FR-014 (synchronized selection states)
- Compliance: Pages sidebar provides navigation, maintains sync

**✅ PASS - Section 4: Visual Language**
- Requirement: Specific spacing, typography, color palette from constitution
- Evidence: FR-015 explicitly references constitution-defined spacing (8px base), typography (Inter), colors (#FFFFFF, #F5F5F5, #EA2724)
- Compliance: All visual specifications derive from constitutional standards

**✅ PASS - Section 7: Prohibited Patterns**
- Requirement: No drag-and-drop builder, no multiple dashboards, no dark mode UI
- Evidence: Spec describes schema-driven editing, not drag-and-drop; single shell structure mandated
- Compliance: Design avoids all prohibited patterns

### Gate Summary

**Status**: ✅ ALL GATES PASSED

No constitutional violations detected. Feature design fully aligns with PMC Engine Editor constitutional principles. No complexity justification required.

## Project Structure

### Documentation (this feature)

```text
specs/001-dashboard-shell/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (already created)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── shell-api.md     # Internal component API contracts
├── checklists/
│   └── requirements.md  # Quality validation checklist (completed)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── shell/
│   │   │   ├── TopBar.{ext}           # Persistent top bar component
│   │   │   ├── LeftRail.{ext}         # Left navigation rail
│   │   │   ├── PageSidebar.{ext}      # Collapsible page/section navigator
│   │   │   ├── Canvas.{ext}           # Live site preview area
│   │   │   ├── Inspector.{ext}        # Right panel with tabs
│   │   │   └── Shell.{ext}            # Root shell container
│   │   ├── ui/
│   │   │   ├── Button.{ext}           # Reusable button component
│   │   │   ├── Icon.{ext}             # Icon component with ARIA
│   │   │   ├── Tab.{ext}              # Tab component for inspector
│   │   │   └── ResizeHandle.{ext}     # Draggable resize control
│   │   └── overlays/
│   │       ├── HelpPanel.{ext}        # Contextual help overlay
│   │       └── WizardOverlay.{ext}    # Wizard mode overlay
│   ├── store/
│   │   ├── shellState.{ext}           # Global shell state management
│   │   ├── topBarState.{ext}          # Top bar state slice
│   │   ├── navigationState.{ext}      # Left rail & pages sidebar state
│   │   ├── inspectorState.{ext}       # Inspector panel state
│   │   └── canvasState.{ext}          # Canvas viewport state
│   ├── hooks/
│   │   ├── useKeyboardNav.{ext}       # Keyboard navigation hook
│   │   ├── useAutoSave.{ext}          # Auto-save logic hook
│   │   ├── useResize.{ext}            # Panel resize handler
│   │   └── useSync.{ext}              # Cross-region sync hook
│   ├── utils/
│   │   ├── debounce.{ext}             # Debouncing utility
│   │   ├── localStorage.{ext}         # Browser storage abstraction
│   │   └── a11y.{ext}                 # Accessibility helpers
│   ├── styles/
│   │   ├── tokens.css                 # Design tokens from constitution
│   │   ├── layout.css                 # Grid/flexbox layout styles
│   │   └── responsive.css             # Breakpoint-specific styles
│   └── App.{ext}                      # Root application component
├── tests/
│   ├── integration/
│   │   ├── shell-navigation.test.{ext}    # User navigation flows
│   │   ├── shell-resize.test.{ext}        # Responsive behavior
│   │   ├── shell-sync.test.{ext}          # State synchronization
│   │   └── shell-keyboard.test.{ext}      # Keyboard accessibility
│   ├── component/
│   │   ├── TopBar.test.{ext}
│   │   ├── LeftRail.test.{ext}
│   │   ├── PageSidebar.test.{ext}
│   │   ├── Canvas.test.{ext}
│   │   └── Inspector.test.{ext}
│   └── a11y/
│       └── shell-wcag.test.{ext}          # WCAG compliance tests
└── public/
    └── index.html                         # Entry HTML

{ext} = .jsx/.tsx/.vue/.svelte depending on framework choice from research
```

**Structure Decision**: Web application structure selected based on browser-based target platform and SPA requirements. Frontend-only architecture appropriate for dashboard shell (no backend needed for layout/state management). Component-based organization enables independent development of shell regions per user stories. State management layer ensures synchronized updates across components. Testing structure supports acceptance scenarios from spec.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - No constitutional violations detected. All gates passed.

## Phase 0: Research & Technology Selection

**Status**: ✅ COMPLETED

**Research Tasks**:

1. **UI Framework Selection** (addresses: Language/Version, Primary Dependencies)
   - Evaluate: React 18+, Vue 3+, Svelte 4+
   - Criteria: Component model maturity, state management ecosystem, accessibility support, TypeScript integration, bundle size
   - Output: Recommended framework with rationale

2. **State Management Pattern** (addresses: Primary Dependencies)
   - Evaluate: Context API + useReducer, Zustand, Recoil, Signals (framework-specific)
   - Criteria: Synchronization performance (<100ms requirement), dev tools, time-travel debugging support, learning curve
   - Output: Selected state library with integration pattern

3. **Testing Strategy** (addresses: Testing)
   - Evaluate: Jest + React Testing Library / Vue Test Utils / Svelte Testing Library, Playwright / Cypress for E2E, axe-core for a11y
   - Criteria: Component testing ergonomics, E2E reliability, accessibility automation, CI integration
   - Output: Testing stack with example patterns

4. **CSS Architecture** (addresses: Primary Dependencies)
   - Evaluate: CSS Modules, Styled Components, Emotion, Tailwind CSS, Vanilla Extract
   - Criteria: Constitution token integration, responsive patterns, bundle size, dev experience
   - Output: Styling approach with constitutional token mapping

5. **Type Safety Approach** (addresses: Language/Version)
   - Evaluate: JavaScript + JSDoc vs TypeScript strict mode
   - Criteria: IDE support, refactoring safety, team familiarity, build complexity
   - Output: Language choice with configuration

6. **Browser Storage Strategy** (addresses: Storage)
   - Evaluate: LocalStorage vs IndexedDB for auto-save, SessionStorage for transient state
   - Criteria: 5MB quota, synchronous vs async API, safari private mode compatibility
   - Output: Storage architecture with fallback handling

7. **Responsive Layout Best Practices** (addresses: Constraints)
   - Research: CSS Grid vs Flexbox for shell layout, container queries, viewport units
   - Criteria: 320px-3840px support, browser compatibility, resize performance
   - Output: Layout implementation guide

8. **Keyboard Navigation Patterns** (addresses: Accessibility Testing)
   - Research: Roving tabindex, focus trap, skip links, keyboard shortcuts registry
   - Criteria: WCAG 2.1 Level AA compliance, screen reader compatibility, framework integration
   - Output: Accessibility implementation checklist

**Output**: ✅ `research.md` created - All NEEDS CLARIFICATION items resolved

## Phase 1: Design & Contracts

**Status**: ✅ COMPLETED

**Prerequisites**: `research.md` complete with all technology selections finalized ✅

### 1.1 Data Model

**Extract from spec entities** → `data-model.md`:

- Shell State (mode, active tabs, visibility flags, selected IDs, save status, AI credits)
- Top Bar State (site name, logo URL, save text, preview boolean, credits count, help visibility)
- Left Rail State (active icon, hover states)
- Page Sidebar State (open boolean, expanded page IDs, selected page/section IDs, drag state)
- Inspector State (active tab, panel width, loading state)
- Canvas State (current page ID, scroll position, hovered/selected section IDs, zoom, preview mode)

**Validation rules**:
- Inspector width: 280-600px (FR-010)
- AI credits: non-negative integer, amber warning <50 (FR-022)
- Mode: enum [wizard, edit, preview, settings] (FR-006)
- Selected IDs: must reference valid page/section from theme data

**State transitions**:
- Mode changes preserve shell layout (FR-006)
- Tab selection persists across navigation (FR-013)
- Preview mode toggles shell visibility (FR-008)
- Save status: idle → saving → saved | failed (FR-019)

### 1.2 Component Contracts

**Generate internal API contracts** → `/contracts/shell-api.md`:

Component interfaces for:
- Shell container (orchestrates layout, manages global state)
- TopBar (receives: site data, save status, credits; emits: preview toggle, help request, publish action)
- LeftRail (receives: active tab; emits: tab change)
- PageSidebar (receives: pages array, selected IDs; emits: page/section selection, reorder)
- Canvas (receives: page ID, section ID, preview mode; emits: section hover, section click)
- Inspector (receives: active tab, selected entity, schema; emits: tab change, content update, resize)

Event contracts for synchronization:
- Page selected → Canvas updates + Inspector updates
- Section selected → Canvas scrolls + Inspector loads fields
- Content changed → Auto-save triggers + Save status updates
- Resize drag → Inspector width updates (debounced 60fps)

### 1.3 Quickstart Guide

**Generate developer onboarding** → `quickstart.md`:

1. Setup instructions (install dependencies from research.md)
2. Run dev server
3. Navigate to localhost URL
4. Expected initial state (see User Story 1 acceptance scenarios)
5. How to test each shell region independently
6. How to trigger each user story scenario
7. Accessibility testing with keyboard-only navigation
8. Performance profiling for <100ms sync requirement

### 1.4 Update Agent Context

**Run**: `.specify/scripts/bash/update-agent-context.sh claude`

Adds selected technologies from research.md to agent-specific context file for improved code generation alignment.

**Output**: ✅ `data-model.md` created with 6 entities, state synchronization flows, TypeScript interfaces
✅ `/contracts/shell-api.md` created with component prop interfaces and event contracts
✅ `quickstart.md` created with setup instructions and testing guide

## Next Steps

After Phase 1 completion:

1. **Re-evaluate Constitution Check**: Verify design artifacts maintain constitutional compliance
2. **Proceed to `/speckit.tasks`**: Generate dependency-ordered task list for implementation
3. **Begin implementation**: Follow task sequence, test incrementally per user story priorities

**Command to continue**: `/speckit.tasks`
