# Implementation Plan: Mobile-Responsive PMC Engine UI

**Branch**: `007-mobile-responsive` | **Date**: 2025-11-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-mobile-responsive/spec.md`

**Note**: This plan was generated based on the comprehensive mobile responsiveness feature specification. Implementation will proceed through phased rollout as outlined below.

## Summary

Make the existing PMC Engine frontend UI fully mobile-responsive and usable across common breakpoints (small mobile ≤480px, mobile/tablet 481-1024px, desktop ≥1025px). Focus on adapting the dashboard shell, core panels (inspector, chat, AI training), and all UI components for touch-optimized mobile/tablet usage while maintaining full feature parity. No separate mobile app - same codebase with responsive layout patterns. Technical approach includes: defining responsive breakpoints in design tokens, converting fixed layouts to flexbox/grid, implementing drawer/overlay patterns for panels on mobile, ensuring 44x44px touch targets, and comprehensive device testing.

## Technical Context

**Language/Version**: TypeScript 5+ (strict mode), React 19.2.0
**Primary Dependencies**: Existing stack (React, Zustand, TypeScript) + responsive utilities (no new major dependencies required)
**Storage**: N/A (UI-only changes, no new data storage)
**Testing**: Vitest + @testing-library/react + @axe-core/react (existing test infrastructure from refactoring phases 1-7)
**Target Platform**: Modern web browsers on mobile (iOS Safari 14+, Chrome for Android), tablet (iPad OS, Android tablets), and desktop
**Project Type**: Web application (frontend only - NO backend changes)
**Performance Goals**: <3s initial load on 3G, 60fps animations, <0.1 CLS during layout shifts, lighthouse mobile score >90
**Constraints**: Zero breaking changes to existing features, full feature parity across all device sizes, WCAG AA accessibility maintained
**Scale/Scope**: Affects entire frontend UI (~20 existing components, 3 major panels, dashboard shell, all forms)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Alignment with PMC Engine Constitution

#### ✅ Consistency (Section 2.I)
- **Requirement**: "One single dashboard shell across all states"
- **Compliance**: Mobile responsiveness maintains same shell structure (top bar, left rail, canvas, inspector) - only layout patterns change (sidebar → drawer, panel → overlay), NOT shell structure
- **No violations**: Same components used across all breakpoints

#### ✅ Clarity & Cognitive Load Reduction (Section 2.II)
- **Requirement**: "Show only what users need in current context"
- **Compliance**: Mobile layouts hide/collapse less-used elements (hamburger menu, collapsible sections), showing primary actions prominently
- **Enhancement**: Responsive design REDUCES cognitive load on small screens by removing clutter

#### ✅ User Safety (Section 2.IV)
- **Requirement**: "Auto-save, undo/redo, destructive action confirmation"
- **Compliance**: Mobile implementation maintains all existing safety features, no changes to data flow or save logic
- **Enhancement**: Sticky save buttons on mobile improve safety by keeping actions visible

#### ✅ Accessibility (Section 2.V)
- **Requirement**: "Keyboard navigable, WCAG AA minimum, 44x44px touch targets"
- **Compliance**: Mobile responsiveness ENHANCES accessibility with larger touch targets (44x44px enforced), maintains keyboard navigation, adds mobile screen reader support
- **Exceeds requirements**: Targets WCAG 2.1 AAA for touch targets (44x44px vs 24x24px AA minimum)

#### ✅ The Canvas is Sacred (Section 3.I)
- **Requirement**: "Canvas must always show high-fidelity live preview"
- **Compliance**: Mobile canvas maintains live preview, only adds zoom controls for detailed content viewing on small screens
- **No violations**: No wireframes, placeholders, or schematic UI introduced

#### ✅ Visual Language (Section 4)
- **Requirement**: "Mandatory palette, no gradients, subtle motion"
- **Compliance**: Responsive design uses existing design tokens, maintains aesthetic rules, animation timings (250ms panels) within allowed range (<400ms)
- **No violations**: No new visual language introduced

#### ✅ Prohibited Patterns (Section 7)
- **Not introducing**: No drag-and-drop builder, no dark mode, no multiple dashboards, no full-screen modals hiding chrome
- **Compliance**: Drawer/overlay patterns maintain top bar visibility (not full-screen modals that hide chrome)

### Complexity Justification

**No complexity violations** - this feature simplifies existing UI for small screens using industry-standard responsive patterns.

## Project Structure

### Documentation (this feature)

```text
specs/007-mobile-responsive/
├── spec.md                    # Feature specification (completed)
├── plan.md                    # This file
├── checklists/
│   └── requirements.md        # Spec quality checklist (completed - all pass)
├── research.md                # Phase 0: Responsive patterns research (to be created)
├── data-model.md              # N/A (no new data entities)
├── quickstart.md              # Phase 1: Mobile testing quickstart (to be created)
├── contracts/                 # N/A (no API changes)
└── tasks.md                   # Phase 2: Implementation tasks (to be created via /speckit.tasks)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── shell/                    # MODIFY: Dashboard shell responsiveness
│   │   │   ├── TopBar.tsx           # Add responsive hamburger menu, icon-only mobile
│   │   │   ├── LeftRail.tsx         # Add drawer overlay for mobile
│   │   │   └── Shell.tsx            # Add breakpoint-aware layout switching
│   │   ├── ui/                       # MODIFY: 20 existing UI components
│   │   │   ├── Button/              # Enforce 44x44px touch targets
│   │   │   ├── Modal/               # Add mobile full-screen variant
│   │   │   ├── Panel/               # Add drawer/overlay mobile variant
│   │   │   ├── Stepper/             # Add mobile horizontally scrollable variant
│   │   │   └── ...                  # All components get responsive variants
│   │   ├── chat/
│   │   │   └── ChatPanel.tsx        # MODIFY: Drawer on tablet, full-screen on mobile
│   │   ├── deployment/
│   │   │   └── DeployPanel.tsx      # MODIFY: Full-screen mobile overlay
│   │   ├── settings/
│   │   │   └── AITrainingPanel.tsx  # MODIFY: Mobile form layouts, collapsible sections
│   │   ├── code/
│   │   │   └── Canvas.tsx           # MODIFY: Add zoom controls for mobile
│   │   └── forms/                    # MODIFY: All form components for mobile
│   ├── hooks/
│   │   ├── responsive/               # NEW: Responsive utility hooks
│   │   │   ├── useBreakpoint.ts     # Detect current breakpoint
│   │   │   ├── useMediaQuery.ts     # Match media query hook
│   │   │   ├── useTouchDevice.ts    # Detect touch capability
│   │   │   └── useOrientation.ts    # Detect portrait/landscape
│   │   └── index.ts                  # MODIFY: Export new responsive hooks
│   ├── styles/
│   │   ├── tokens.ts                 # MODIFY: Add responsive breakpoints, spacing scales
│   │   ├── responsive.css            # NEW: Responsive utility classes
│   │   └── mobile.css                # NEW: Mobile-specific overrides
│   └── utils/
│       └── responsive.ts             # NEW: Breakpoint utilities, touch detection
└── tests/
    ├── responsive/                    # NEW: Responsive-specific tests
    │   ├── breakpoints.test.ts       # Test breakpoint detection
    │   ├── touch-targets.test.ts     # Test 44x44px enforcement
    │   └── mobile-layouts.test.tsx   # Test mobile layout patterns
    └── integration/
        └── mobile-flows.test.tsx      # NEW: End-to-end mobile user flows
```

**Structure Decision**: Web application frontend-only changes. Existing `frontend/` structure used. New responsive hooks added to `/hooks/responsive/`, new CSS files for responsive utilities, and comprehensive test coverage for mobile patterns. NO backend changes required.

## Complexity Tracking

> **No violations** - all changes align with constitution principles

*(Table intentionally empty - no constitutional violations to justify)*

---

## Phase 0: Responsive Patterns Research

### Research Topics

#### 1. Responsive Breakpoint Strategy

**Research Question**: What are industry-standard breakpoints for modern responsive web applications?

**Focus Areas**:
- Common mobile device viewport sizes (iPhone SE 375px, iPhone 12 390px, Pixel 5 393px)
- Tablet breakpoints (iPad 768px portrait, 1024px landscape, iPad Pro 1366px)
- Best practices for number of breakpoints (avoid too many: maintenance burden)
- Mobile-first vs desktop-first approach

**Expected Findings**:
- 4 breakpoints: xs (≤480px), sm (481-768px), md (769-1024px), lg (≥1025px)
- Mobile-first approach preferred (start with mobile, add complexity for larger screens)
- Use CSS custom properties (CSS variables) for breakpoint values shared between CSS and JS

#### 2. Mobile Navigation Patterns

**Research Question**: How do modern web apps handle navigation on mobile vs desktop?

**Focus Areas**:
- Hamburger menu patterns (overlay drawer, push menu, slide-in)
- Bottom navigation vs top hamburger (mobile UX research)
- Drawer components best practices (animation, backdrop, swipe-to-close)
- Pages sidebar alternatives on mobile (bottom sheet, accordion, separate screen)

**Expected Findings**:
- Hamburger menu with slide-in drawer overlay (most common for complex apps)
- Bottom sheet pattern for secondary navigation (e.g., pages list)
- Swipe gestures for drawer close (native mobile feel)
- Backdrop overlay with tap-to-close for focus

#### 3. Touch Interaction Patterns

**Research Question**: How to make mouse-based interactions work with touch?

**Focus Areas**:
- Touch vs hover states (tooltips, dropdowns, context menus)
- Minimum touch target sizes (WCAG 2.1 vs Apple HIG vs Material Design)
- Drag-and-drop on touch devices (libraries: react-beautiful-dnd, dnd-kit)
- Gestures: swipe, long-press, pinch-to-zoom
- Double-tap zoom prevention

**Expected Findings**:
- 44x44px minimum touch target (WCAG 2.1 AAA, Apple HIG)
- 8px minimum spacing between targets
- Tooltips: tap-to-show, tap-outside-to-dismiss
- Drag: use touch-action CSS, visual drag handles
- Disable double-tap zoom on buttons: `touch-action: manipulation`

#### 4. Form UX on Mobile

**Research Question**: What are best practices for forms on mobile devices?

**Focus Areas**:
- Input type attributes (email, tel, number) for mobile keyboards
- Label placement (above vs inline) on narrow screens
- Error message display (inline vs modal)
- Sticky submit buttons when keyboard open
- Field auto-scroll when keyboard appears

**Expected Findings**:
- Labels above inputs (not inline) for mobile
- Full-width inputs on mobile (100% container width)
- Inline error messages below field (no tooltips)
- Sticky footer for submit buttons
- Use `inputmode` attribute for keyboard optimization

#### 5. Responsive Typography

**Research Question**: How should typography scale across breakpoints?

**Focus Areas**:
- Fluid typography (clamp, vw units) vs fixed breakpoint scales
- Minimum readable font sizes on mobile (body, labels, helper text)
- Line length optimization (45-75 characters per line)
- Line height adjustments for small screens

**Expected Findings**:
- Breakpoint-based typography scales (not fluid - easier maintenance)
- 14px minimum body text, 12px minimum helper text
- Scale headings down on mobile (24px → 20px, 18px → 16px)
- Maintain 1.5 line height for body text across breakpoints

#### 6. Performance Optimization for Mobile

**Research Question**: How to maintain performance on mobile devices?

**Focus Areas**:
- Lazy loading strategies for images/components
- CSS animations performance (GPU acceleration, will-change)
- Bundle size optimization (code splitting by route)
- 3G performance testing tools

**Expected Findings**:
- Use `loading="lazy"` for images
- Animate transform and opacity only (GPU-accelerated)
- Code split by feature (React.lazy)
- Chrome DevTools 3G throttling for testing
- Target Lighthouse mobile score >90

#### 7. Testing Strategies for Responsive UI

**Research Question**: How to comprehensively test responsive layouts?

**Focus Areas**:
- Viewport testing tools (Chrome DevTools, BrowserStack, real devices)
- Automated visual regression testing (Percy, Chromatic)
- Touch interaction testing (@testing-library/user-event)
- Accessibility testing on mobile (axe-core, screen readers)

**Expected Findings**:
- Use Chrome DevTools device presets for initial testing
- Test on real devices: 1 iOS + 1 Android minimum
- Automated tests: useMediaQuery hooks, touch target sizes
- Manual QA checklist: horizontal scroll, keyboard coverage, gesture support

### Research Deliverable

**Output**: `research.md` document with findings from all 7 topics, including:
- Chosen breakpoint values with rationale
- Selected mobile navigation patterns (drawer overlay for left rail, bottom sheet for pages)
- Touch target enforcement strategy (utility classes + linting rules)
- Form UX guidelines (mobile keyboard types, error display patterns)
- Typography scale table (desktop → tablet → mobile)
- Performance budget definition (3s load, 60fps, <0.1 CLS)
- Testing device matrix (DevTools presets + real devices)

---

## Phase 1: Design & Implementation Setup

### 1. Design Token Updates

**Task**: Extend existing `src/styles/tokens.ts` with responsive values

**New Tokens to Add**:

```typescript
// Breakpoints
export const breakpoints = {
  xs: '480px',      // Small mobile
  sm: '768px',      // Large mobile / portrait tablet
  md: '1024px',     // Tablet landscape
  lg: '1280px',     // Desktop
  xl: '1536px',     // Large desktop
} as const;

// Responsive spacing (tighter on mobile)
export const spacing = {
  // ... existing spacing ...
  mobile: {
    section: '12px',  // vs 16px desktop
    card: '12px',     // vs 16px desktop
    form: '16px',     // vs 24px desktop
  },
} as const;

// Touch targets
export const touchTargets = {
  minimum: '44px',
  comfortable: '48px',
  spacing: '8px',
} as const;

// Responsive typography
export const typography = {
  // ... existing typography ...
  responsive: {
    pageTitle: {
      desktop: '24px',
      tablet: '22px',
      mobile: '20px',
    },
    sectionHeading: {
      desktop: '18px',
      tablet: '17px',
      mobile: '16px',
    },
    body: {
      all: '14px', // No scaling - minimum readability
    },
    helperText: {
      all: '12px', // No scaling - minimum readability
    },
  },
} as const;
```

### 2. Responsive Utility Hooks

**Task**: Create hooks for breakpoint detection and responsive behavior

**Hooks to Create**:

1. **`useBreakpoint.ts`** - Detect current breakpoint
   ```typescript
   export function useBreakpoint(): 'xs' | 'sm' | 'md' | 'lg' | 'xl' {
     // Uses window.matchMedia + state
   }
   ```

2. **`useMediaQuery.ts`** - Match custom media queries
   ```typescript
   export function useMediaQuery(query: string): boolean {
     // Returns true/false based on media query match
   }
   ```

3. **`useTouchDevice.ts`** - Detect touch capability
   ```typescript
   export function useTouchDevice(): boolean {
     // Returns true if device supports touch
   }
   ```

4. **`useOrientation.ts`** - Detect orientation
   ```typescript
   export function useOrientation(): 'portrait' | 'landscape' {
     // Returns current orientation
   }
   ```

### 3. Responsive Utility CSS

**Task**: Create utility classes for common responsive patterns

**File**: `src/styles/responsive.css`

```css
/* Hide/show at breakpoints */
@media (max-width: 480px) {
  .hide-on-mobile { display: none !important; }
}

@media (min-width: 481px) {
  .show-on-mobile { display: none !important; }
}

/* Touch target enforcement */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 8px;
}

/* Responsive spacing */
.section-spacing {
  padding: var(--spacing-section-mobile);
}

@media (min-width: 769px) {
  .section-spacing {
    padding: var(--spacing-section-desktop);
  }
}
```

### 4. Mobile Layout Patterns Document

**Task**: Define standard mobile layout patterns to use across app

**Patterns to Document**:

1. **Drawer Overlay Pattern** - For left rail on mobile
   - Slides in from left
   - Backdrop overlay with opacity
   - Close on backdrop tap or swipe-left
   - Focus trap inside drawer

2. **Bottom Sheet Pattern** - For pages sidebar on mobile
   - Slides up from bottom
   - Drag handle at top
   - Swipe-down to close
   - Partial height (60-80% of screen)

3. **Full-Screen Overlay Pattern** - For inspector/panels on mobile
   - Slides in from right
   - Close button in top-right
   - No backdrop (takes full screen)
   - Maintains top bar visibility

4. **Collapsible Section Pattern** - For forms on mobile
   - Accordion-style sections
   - Expand/collapse icons
   - Default state: primary fields visible, advanced collapsed

### Deliverables

- Updated `src/styles/tokens.ts` with responsive values
- 4 new responsive hooks in `src/hooks/responsive/`
- New `src/styles/responsive.css` utility file
- `quickstart.md` with mobile testing instructions (how to test on DevTools, real devices)
- `contracts/` N/A (no API contracts needed)

---

## Phase 2: Component-by-Component Implementation

*(This will be generated by `/speckit.tasks` command - below is outline only)*

### Task Groups

#### Group 1: Foundation (Week 1-2)

1. **Shell Responsiveness** (Priority: P1)
   - TopBar responsive variants (hamburger menu on mobile)
   - LeftRail drawer overlay implementation
   - Shell layout switching based on breakpoint
   - Pages sidebar bottom sheet on mobile

2. **Responsive Hooks Integration** (Priority: P1)
   - Add useBreakpoint to shell components
   - Add useTouchDevice for conditional rendering
   - Add useOrientation for layout adjustments

#### Group 2: Core Panels (Week 3-4)

3. **Inspector Responsiveness** (Priority: P1)
   - Desktop: right panel (existing)
   - Tablet: drawer from right (60-80% width)
   - Mobile: full-screen overlay with close button

4. **Chat Panel Responsiveness** (Priority: P1)
   - Same pattern as inspector
   - Maintain message readability on narrow screens

5. **AI Training Panel Responsiveness** (Priority: P2)
   - Mobile form layouts (full-width inputs, labels above)
   - Stepper mobile variant (horizontal scroll or dropdown)
   - Collapsible sections for advanced fields

#### Group 3: UI Components (Week 5-6)

6. **Form Components** (Priority: P2)
   - Button: enforce 44x44px touch targets
   - TextField, TextareaField: full-width on mobile, appropriate inputmode
   - SelectField: native mobile select where appropriate
   - All inputs: validation errors inline below field

7. **Layout Components** (Priority: P2)
   - Modal: full-screen variant on mobile
   - Card: responsive grid patterns (1/2/3/4 columns)
   - Panel: collapsible on mobile

8. **Feedback Components** (Priority: P3)
   - LoadingState, EmptyState, ErrorState: responsive text sizing
   - Toast: position appropriately on mobile (top or bottom)

#### Group 4: Tables, Lists, Typography (Week 7)

9. **Tables & Lists** (Priority: P2)
   - Table → card layout on mobile
   - List spacing enforcement (prevent mis-taps)

10. **Typography Scaling** (Priority: P3)
    - Apply responsive typography scale
    - Verify readability at all breakpoints

#### Group 5: Testing & QA (Week 8)

11. **Automated Tests** (Priority: P1)
    - Breakpoint detection tests
    - Touch target size tests (all buttons ≥44x44px)
    - Mobile layout rendering tests

12. **Manual QA** (Priority: P1)
    - DevTools device preset testing (iPhone SE, iPad, etc.)
    - Real device testing (1 iOS, 1 Android)
    - Horizontal scroll check (automated + manual)
    - Accessibility audit (axe-core on mobile viewports)

13. **Performance Testing** (Priority: P1)
    - Lighthouse mobile audit (target >90 score)
    - 3G throttling tests (ensure <3s load)
    - Animation performance (60fps check)

### Rollout Strategy

**Phase 1: Shell + Core Panels** (Weeks 1-4)
- Deploy shell responsiveness to staging
- QA test on devices
- Fix critical issues
- Deploy to production behind feature flag

**Phase 2: Forms + Components** (Weeks 5-6)
- Deploy form responsiveness
- QA test AI Training Panel on mobile
- Deploy to production (feature flag still active)

**Phase 3: Polish + Final QA** (Week 7-8)
- Typography, tables, final touches
- Comprehensive device testing
- Remove feature flag (full rollout)

---

## Success Criteria Checklist

- [ ] All 65 functional requirements (FR-007-001 through FR-007-065) implemented and tested
- [ ] 12 success criteria (SC-007-001 through SC-007-012) verified:
  - [ ] SC-007-001: 100% of core pages have no horizontal scroll on mobile
  - [ ] SC-007-002: Basic editing task completable in <2 minutes on mobile
  - [ ] SC-007-003: 100% of interactive elements meet 44x44px touch target size
  - [ ] SC-007-004: AI Training Panel workflow success rate ≥90% on tablet
  - [ ] SC-007-005: Page load <3s on 3G connection
  - [ ] SC-007-006: Zero critical WCAG AA violations on mobile
  - [ ] SC-007-007: User satisfaction >4/5 for mobile experience
  - [ ] SC-007-008: 95% can use hamburger, drawers, bottom sheets on first attempt
  - [ ] SC-007-009: CLS <0.1 during orientation/panel changes
  - [ ] SC-007-010: <10% custom mobile code per feature (reusability)
  - [ ] SC-007-011: Full feature parity confirmed via QA
  - [ ] SC-007-012: 60fps animation performance on iPhone 11, Pixel 5
- [ ] All edge cases handled (8 scenarios from spec)
- [ ] Zero breaking changes to existing desktop functionality
- [ ] Constitution compliance verified (all 6 applicable sections)

---

## Next Steps

1. **Immediate**: Run `.specify/scripts/bash/update-agent-context.sh claude` to add responsive patterns to agent context
2. **Phase 0**: Generate `research.md` by researching all 7 topics outlined above
3. **Phase 1**: Create responsive hooks, update design tokens, write `quickstart.md`
4. **Phase 2**: Run `/speckit.tasks` to generate detailed implementation tasks from this plan
5. **Implementation**: Execute tasks group-by-group over 8-week timeline
6. **Deployment**: Phased rollout with feature flags, comprehensive QA between phases

**Estimated Total Effort**: 8 weeks (1 developer full-time)

**Ready for**: Phase 0 research phase
