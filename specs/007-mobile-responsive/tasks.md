# Tasks: Mobile-Responsive PMC Engine UI

**Input**: Design documents from `/specs/007-mobile-responsive/`
**Prerequisites**: plan.md (completed), spec.md (completed), research.md (completed), quickstart.md (completed)

**Tests**: No automated tests requested in specification - focus on implementation with manual QA validation per quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Web application**: `frontend/src/` for all React/TypeScript code
- **Tests**: `frontend/tests/` for test files
- Paths use absolute references from repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and responsive infrastructure setup

**Status**: ✅ COMPLETED (Phase 1 setup already done in previous work session)

- [x] T001 Update design tokens with responsive breakpoints in frontend/src/styles/tokens.ts
- [x] T002 [P] Create useMediaQuery hook in frontend/src/hooks/responsive/useMediaQuery.ts
- [x] T003 [P] Create useBreakpoint hook in frontend/src/hooks/responsive/useBreakpoint.ts
- [x] T004 [P] Create useTouchDevice hook in frontend/src/hooks/responsive/useTouchDevice.ts
- [x] T005 [P] Create useOrientation hook in frontend/src/hooks/responsive/useOrientation.ts
- [x] T006 Create responsive hooks index file in frontend/src/hooks/responsive/index.ts
- [x] T007 [P] Add responsive utility classes to frontend/src/styles/responsive.css
- [x] T008 [P] Create mobile-specific CSS overrides in frontend/src/styles/mobile.css
- [x] T009 Create mobile testing quickstart guide in specs/007-mobile-responsive/quickstart.md

**Checkpoint**: ✅ Foundation ready - user story implementation can now begin

---

## Phase 2: User Story 1 - View and Edit Site on Mobile Phone (Priority: P1) 🎯 MVP

**Goal**: Enable site owners to access PMC Engine from smartphones, view their site, and make quick content updates with no horizontal scroll and touch-optimized controls.

**Independent Test**: Load PMC Engine on mobile device (375px-414px viewport), navigate to a site, view canvas, open inspector, make text change, verify change saves. Per quickstart.md Section "Testing on Mobile" > Method 1 (Chrome DevTools) and Method 2 (Real Devices).

**Addresses**: FR-007-001 through FR-007-023 (breakpoints, top bar, sidebars, inspector, canvas)

### Dashboard Shell Mobile Layout

- [ ] T010 [P] [US1] Add mobile breakpoint detection to Shell component in frontend/src/components/shell/Shell.tsx using useBreakpoint hook
- [ ] T011 [US1] Implement mobile grid layout (topbar → canvas → inspector stacked) in frontend/src/components/shell/Shell.tsx for xs/sm breakpoints
- [ ] T012 [P] [US1] Update TopBar component for mobile: add hamburger menu icon, hide non-critical actions, ensure 44px touch targets in frontend/src/components/shell/TopBar.tsx
- [ ] T013 [P] [US1] Create mobile drawer overlay component for left rail in frontend/src/components/shell/MobileDrawer.tsx with slide-in animation, backdrop, close button

### Left Sidebar Mobile Implementation

- [ ] T014 [US1] Update LeftRail component to conditionally render as drawer on mobile (≤768px) in frontend/src/components/shell/LeftRail.tsx
- [ ] T015 [US1] Add hamburger menu open/close state management to shell store in frontend/src/store/shellStore.ts
- [ ] T016 [US1] Implement drawer slide-in animation (250ms ease-out, translateX) in frontend/src/components/shell/MobileDrawer.tsx
- [ ] T017 [US1] Add backdrop overlay with tap-to-close handler in frontend/src/components/shell/MobileDrawer.tsx
- [ ] T018 [US1] Add swipe-to-close gesture detection using touch events in frontend/src/components/shell/MobileDrawer.tsx

### Pages Sidebar Mobile Implementation

- [ ] T019 [P] [US1] Create bottom sheet component for pages list in frontend/src/components/shell/PagesBottomSheet.tsx with swipe-up/down gestures
- [ ] T020 [US1] Update Pages sidebar to render as bottom sheet on mobile in frontend/src/components/shell/PagesSidebar.tsx
- [ ] T021 [US1] Add drag handle indicator at top of bottom sheet in frontend/src/components/shell/PagesBottomSheet.tsx
- [ ] T022 [US1] Implement bottom sheet height (70% screen) and swipe dismiss in frontend/src/components/shell/PagesBottomSheet.tsx

### Inspector Mobile Implementation

- [ ] T023 [P] [US1] Create full-screen overlay variant for inspector on mobile in frontend/src/components/inspector/InspectorMobileOverlay.tsx
- [ ] T024 [US1] Update Inspector component to conditionally render full-screen on mobile (≤768px) in frontend/src/components/inspector/Inspector.tsx
- [ ] T025 [US1] Add close button (X) in top-right of mobile inspector in frontend/src/components/inspector/InspectorMobileOverlay.tsx with 44px touch target
- [ ] T026 [US1] Ensure inspector content scrolls properly on mobile with keyboard open in frontend/src/components/inspector/InspectorMobileOverlay.tsx
- [ ] T027 [US1] Add field auto-scroll when mobile keyboard appears in frontend/src/components/inspector/InspectorMobileOverlay.tsx

### Canvas Mobile Optimization

- [ ] T028 [P] [US1] Add canvas zoom controls for mobile in frontend/src/components/code/Canvas.tsx
- [ ] T029 [US1] Ensure canvas has no horizontal scroll on mobile viewports in frontend/src/components/code/Canvas.tsx
- [ ] T030 [US1] Implement canvas vertical-only scrolling on mobile in frontend/src/components/code/Canvas.tsx

### Mobile QA for User Story 1

- [ ] T031 [US1] Validate no horizontal scroll on mobile (375px, 390px, 414px) per quickstart.md checklist
- [ ] T032 [US1] Test hamburger menu, drawer, bottom sheet interactions on real iOS device
- [ ] T033 [US1] Test inspector full-screen overlay with keyboard on real Android device
- [ ] T034 [US1] Verify all touch targets ≥44px in shell components using Chrome DevTools
- [ ] T035 [US1] Test orientation change (portrait ↔ landscape) maintains layout and state

**Checkpoint**: User Story 1 complete - mobile phone editing functional. Run quickstart.md "Manual Testing" checklist for iPhone SE and iPhone 12 Pro.

---

## Phase 3: User Story 2 - Manage Sites on Tablet (Priority: P1)

**Goal**: Enable site owners to use tablets (iPad, Android tablets) for more complex editing including multi-page navigation and AI-assisted content with adapted layouts.

**Independent Test**: Load PMC Engine on tablet (769-1024px viewport), open Site Manager, create/edit pages, use Chat panel, verify multi-column layouts adapt. Per quickstart.md Section "Testing on Mobile" > tablet devices.

**Addresses**: FR-007-024 through FR-007-028 (component responsiveness, card grids, touch targets)

### Tablet Layout Adjustments

- [ ] T036 [P] [US2] Add tablet breakpoint (md: 769-1024px) layout variant to Shell in frontend/src/components/shell/Shell.tsx with condensed sidebar widths
- [ ] T037 [US2] Implement tablet portrait layout: left rail icon-only, inspector as drawer in frontend/src/components/shell/Shell.tsx
- [ ] T038 [US2] Implement tablet landscape layout: full shell with narrower panels in frontend/src/components/shell/Shell.tsx

### Chat Panel Tablet Implementation

- [ ] T039 [P] [US2] Create tablet drawer variant for Chat panel in frontend/src/components/chat/ChatPanel.tsx (300px width, slides from right)
- [ ] T040 [US2] Update Chat panel to use drawer on tablet portrait, right panel on landscape in frontend/src/components/chat/ChatPanel.tsx
- [ ] T041 [US2] Ensure chat messages remain readable in narrow drawer width in frontend/src/components/chat/ChatPanel.tsx

### Site Manager Grid Responsiveness

- [ ] T042 [P] [US2] Update Site Manager card grid to responsive columns in frontend/src/components/sites/SiteManager.tsx (1 col mobile, 2 col tablet portrait, 3 col tablet landscape, 4 col desktop)
- [ ] T043 [US2] Add responsive spacing between cards based on breakpoint in frontend/src/components/sites/SiteManager.tsx
- [ ] T044 [US2] Ensure site cards have adequate touch spacing (8px minimum) in frontend/src/components/sites/SiteCard.tsx

### Component Touch Target Enforcement

- [ ] T045 [P] [US2] Audit all Button components for 44x44px minimum size in frontend/src/components/ui/Button/
- [ ] T046 [P] [US2] Add touch-target class to icon-only buttons in frontend/src/components/ui/
- [ ] T047 [US2] Verify dropdown menus work on tap without hover in frontend/src/components/ui/Dropdown/
- [ ] T048 [US2] Update select fields to use native mobile select on touch devices in frontend/src/components/ui/SelectField/

### Tablet QA for User Story 2

- [ ] T049 [US2] Test tablet portrait layout (768px) on iPad Air per quickstart.md
- [ ] T050 [US2] Test tablet landscape layout (1024px) on iPad Pro per quickstart.md
- [ ] T051 [US2] Verify Site Manager grid responsive columns on tablet viewports
- [ ] T052 [US2] Test Chat panel drawer on tablet with touch interactions
- [ ] T053 [US2] Validate multi-column content stacks correctly in portrait orientation

**Checkpoint**: User Story 2 complete - tablet management functional. Run quickstart.md "Manual Testing" checklist for iPad devices.

---

## Phase 4: User Story 3 - Touch-Optimized Interactions (Priority: P2)

**Goal**: Provide native mobile-quality touch interactions with proper touch targets, tap alternatives to hover, and smooth drag-and-drop on touch devices.

**Independent Test**: Use PMC Engine exclusively with touch on mobile device, verify all elements tappable without zoom, drag handles work, tooltips show on tap. Per quickstart.md Section "Interaction Testing".

**Addresses**: FR-007-040 through FR-007-044 (touch events, drag-and-drop, hover alternatives, gestures)

### Touch Event Handling

- [ ] T054 [P] [US3] Add touch event listeners to all interactive elements in frontend/src/components/ui/
- [ ] T055 [P] [US3] Implement tap-to-show tooltip behavior in frontend/src/components/ui/Tooltip/Tooltip.tsx (first tap shows, second tap or tap outside dismisses)
- [ ] T056 [P] [US3] Remove hover-dependent dropdown behavior, use tap-to-open in frontend/src/components/ui/Dropdown/Dropdown.tsx
- [ ] T057 [US3] Add touch-action: manipulation to buttons to prevent double-tap zoom in frontend/src/styles/mobile.css

### Drag-and-Drop Touch Support

- [ ] T058 [P] [US3] Implement touch drag for page reordering in Pages sidebar in frontend/src/components/shell/PagesSidebar.tsx using dnd-kit library
- [ ] T059 [US3] Add visual drag handles (44x44px) to draggable page items in frontend/src/components/shell/PageItem.tsx
- [ ] T060 [US3] Implement touch-friendly drop zones with visual feedback in frontend/src/components/shell/PagesSidebar.tsx
- [ ] T061 [US3] Test drag-and-drop works smoothly on touch devices without jank

### Resize Handle Touch Optimization

- [ ] T062 [P] [US3] Increase resize handle touch target size to 44x44px in frontend/src/components/inspector/InspectorResizeHandle.tsx
- [ ] T063 [US3] Add visual feedback (color change) on touch drag of resize handle in frontend/src/components/inspector/InspectorResizeHandle.tsx
- [ ] T064 [US3] Implement smooth panel resize on touch drag in frontend/src/components/inspector/Inspector.tsx

### Scroll Performance Optimization

- [ ] T065 [P] [US3] Add -webkit-overflow-scrolling: touch to all scrollable panels in frontend/src/styles/mobile.css
- [ ] T066 [P] [US3] Enable momentum scrolling on canvas and inspector in frontend/src/styles/mobile.css
- [ ] T067 [US3] Test scroll performance at 60fps on mid-range mobile device per quickstart.md Performance Testing section

### Touch QA for User Story 3

- [ ] T068 [US3] Validate all interactive elements have 44x44px touch targets per quickstart.md touch target checklist
- [ ] T069 [US3] Test tooltips appear on tap and dismiss correctly on mobile
- [ ] T070 [US3] Test page drag-and-drop reordering on touch device
- [ ] T071 [US3] Verify resize handles work smoothly on tablet touch
- [ ] T072 [US3] Test scroll performance with Chrome DevTools Performance profiler (target 60fps)

**Checkpoint**: User Story 3 complete - touch interactions optimized. Run quickstart.md "Interaction Testing" checklist.

---

## Phase 5: User Story 4 - Responsive Forms and Data Entry (Priority: P2)

**Goal**: Optimize forms (Business Profile, AI Training Panel, Settings) for mobile with full-width inputs, appropriate keyboards, inline validation, and sticky submit buttons.

**Independent Test**: Complete AI Training Panel workflow on mobile, fill all fields, upload images, submit successfully. Per quickstart.md form testing examples.

**Addresses**: FR-007-029 through FR-007-034 (form layouts, labels, validation, keyboard handling)

### AI Training Panel Mobile Forms

- [ ] T073 [P] [US4] Update AI Training Panel form layout for mobile: full-width inputs in frontend/src/components/settings/AITrainingPanel.tsx
- [ ] T074 [US4] Move form labels above inputs (not inline) on mobile in frontend/src/components/settings/AITrainingPanel.tsx
- [ ] T075 [US4] Add collapsible sections for advanced fields on mobile in frontend/src/components/settings/AITrainingPanel.tsx
- [ ] T076 [US4] Implement sticky submit button footer on mobile in frontend/src/components/settings/AITrainingPanel.tsx
- [ ] T077 [US4] Add appropriate inputmode attributes (email, tel, numeric) to inputs in frontend/src/components/settings/AITrainingPanel.tsx

### Form Component Mobile Optimization

- [ ] T078 [P] [US4] Update TextField component for mobile: full-width, 44px height, 16px font-size in frontend/src/components/ui/TextField/TextField.tsx
- [ ] T079 [P] [US4] Update TextareaField component for mobile: full-width, minimum 120px height in frontend/src/components/ui/TextareaField/TextareaField.tsx
- [ ] T080 [P] [US4] Update SelectField component to use native select on mobile in frontend/src/components/ui/SelectField/SelectField.tsx
- [ ] T081 [US4] Add input-no-zoom class (16px font-size) to prevent iOS auto-zoom in frontend/src/components/ui/TextField/TextField.tsx

### Form Validation Mobile UX

- [ ] T082 [P] [US4] Move validation errors inline below fields (not tooltips) in frontend/src/components/ui/TextField/TextField.tsx
- [ ] T083 [US4] Add clear error state styling (red border, red text) visible on mobile in frontend/src/styles/mobile.css
- [ ] T084 [US4] Ensure error messages have adequate contrast (WCAG AA 4.5:1) in frontend/src/styles/tokens.ts

### Mobile Keyboard Handling

- [ ] T085 [P] [US4] Implement field auto-scroll when keyboard opens on mobile in frontend/src/hooks/ui/useKeyboardScroll.ts
- [ ] T086 [US4] Ensure submit button remains accessible with keyboard open (sticky footer) in frontend/src/components/settings/AITrainingPanel.tsx
- [ ] T087 [US4] Test keyboard appearance and field visibility on iOS Safari and Android Chrome

### Image Upload Mobile UX

- [ ] T088 [P] [US4] Update image upload button for mobile: clear label, 44px height in frontend/src/components/ui/ImageUpload/ImageUpload.tsx
- [ ] T089 [US4] Add mobile-optimized image preview (scaled to fit) in frontend/src/components/ui/ImageUpload/ImageUpload.tsx
- [ ] T090 [US4] Show upload progress indicator on mobile in frontend/src/components/ui/ImageUpload/ImageUpload.tsx

### Forms QA for User Story 4

- [ ] T091 [US4] Test AI Training Panel workflow completion on mobile (375px viewport) per quickstart.md
- [ ] T092 [US4] Verify all form inputs full-width with labels above on mobile
- [ ] T093 [US4] Test email/tel/numeric keyboards appear correctly on iOS and Android
- [ ] T094 [US4] Verify validation errors display inline below fields
- [ ] T095 [US4] Test field auto-scroll and submit button accessibility with keyboard open
- [ ] T096 [US4] Test image upload from mobile device camera and gallery

**Checkpoint**: User Story 4 complete - forms optimized for mobile. Run quickstart.md form testing checklist.

---

## Phase 6: User Story 5 - Responsive Typography and Content Readability (Priority: P3)

**Goal**: Scale typography appropriately across breakpoints, ensure text is readable without zoom, maintain proper line lengths and hierarchy.

**Independent Test**: View all major screens on mobile, verify text readable without zoom, line lengths appropriate, hierarchy maintained. Per quickstart.md typography testing.

**Addresses**: FR-007-035 through FR-007-039 (typography scaling, minimum sizes, line heights)

### Typography Scale Implementation

- [ ] T097 [P] [US5] Apply responsive page title sizing (24px desktop → 20px mobile) in frontend/src/styles/responsive.css
- [ ] T098 [P] [US5] Apply responsive section heading sizing (18px desktop → 16px mobile) in frontend/src/styles/responsive.css
- [ ] T099 [P] [US5] Ensure body text minimum 14px across all breakpoints in frontend/src/styles/mobile.css
- [ ] T100 [P] [US5] Ensure helper text minimum 12px with WCAG AA contrast in frontend/src/styles/mobile.css

### Component Typography Updates

- [ ] T101 [P] [US5] Update TopBar title to use responsive typography in frontend/src/components/shell/TopBar.tsx
- [ ] T102 [P] [US5] Update Inspector section headings to use responsive typography in frontend/src/components/inspector/Inspector.tsx
- [ ] T103 [P] [US5] Update Panel titles to use responsive typography in frontend/src/components/ui/Panel/Panel.tsx
- [ ] T104 [P] [US5] Update Modal titles to use responsive typography in frontend/src/components/ui/Modal/Modal.tsx

### Line Height and Spacing

- [ ] T105 [P] [US5] Set heading line-height to 1.2 across all breakpoints in frontend/src/styles/tokens.ts
- [ ] T106 [P] [US5] Set body text line-height to 1.5 across all breakpoints in frontend/src/styles/tokens.ts
- [ ] T107 [US5] Verify paragraph spacing (12px mobile, 16px desktop) in frontend/src/styles/mobile.css

### Code and Monospace Text

- [ ] T108 [P] [US5] Update code block font-size for mobile (12px minimum) in frontend/src/styles/mobile.css
- [ ] T109 [US5] Ensure code blocks horizontally scrollable on mobile in frontend/src/styles/mobile.css
- [ ] T110 [US5] Test syntax highlighting readability on mobile in Chat panel and Code panel

### Typography QA for User Story 5

- [ ] T111 [US5] Verify all headings scale appropriately on mobile (375px), tablet (768px), desktop (1280px)
- [ ] T112 [US5] Verify body text readable at 14px without zoom on mobile
- [ ] T113 [US5] Test line lengths don't exceed 75 characters on narrow screens
- [ ] T114 [US5] Verify text hierarchy maintained across all breakpoints
- [ ] T115 [US5] Test code blocks readable and scrollable on mobile

**Checkpoint**: User Story 5 complete - typography optimized. Run quickstart.md typography testing checklist.

---

## Phase 7: Tables, Lists, and Stepper Components (Cross-Cutting)

**Purpose**: Responsive patterns for tables, lists, and navigation components that affect multiple user stories

**Addresses**: FR-007-045 through FR-007-050 (steppers, tables, lists)

### Stepper Mobile Optimization

- [ ] T116 [P] Update Stepper component for mobile: horizontally scrollable steps in frontend/src/components/ui/Stepper/Stepper.tsx
- [ ] T117 Update Stepper to show scroll indicators (fade on edges) on mobile in frontend/src/components/ui/Stepper/Stepper.tsx
- [ ] T118 Add current step dropdown variant for very small mobile in frontend/src/components/ui/Stepper/Stepper.tsx

### Table Responsiveness

- [ ] T119 [P] Create card-based table layout variant for mobile in frontend/src/components/ui/Table/TableMobile.tsx
- [ ] T120 Implement horizontal scroll fallback for complex tables on mobile in frontend/src/components/ui/Table/Table.tsx
- [ ] T121 Add sticky first column for scrollable tables in frontend/src/components/ui/Table/Table.tsx

### List and Grid Spacing

- [ ] T122 [P] Enforce minimum 8px spacing between list items on touch devices in frontend/src/styles/mobile.css
- [ ] T123 Update card grids with touch-friendly spacing in frontend/src/styles/responsive.css
- [ ] T124 Test list item touch targets prevent mis-taps on mobile

**Checkpoint**: Tables, lists, and steppers responsive across all user stories.

---

## Phase 8: Performance Optimization (Cross-Cutting)

**Purpose**: Ensure mobile performance meets targets: <3s load on 3G, 60fps animations, <0.1 CLS

**Addresses**: FR-007-058 through FR-007-061 (performance budget, CLS, animations, lazy loading)

### Bundle Optimization

- [ ] T125 [P] Implement code splitting by route using React.lazy() in frontend/src/App.tsx
- [ ] T126 [P] Add lazy loading for heavy components (Chat, Code panel) in frontend/src/components/
- [ ] T127 Verify bundle size reduction for mobile initial load

### Image Optimization

- [ ] T128 [P] Add loading="lazy" to all image components in frontend/src/components/
- [ ] T129 Implement responsive image sizes (srcset) for canvas previews in frontend/src/components/code/Canvas.tsx
- [ ] T130 Test image lazy loading on 3G throttled connection

### Animation Performance

- [ ] T131 [P] Audit all animations use transform/opacity only (GPU-accelerated) in frontend/src/styles/
- [ ] T132 Add will-change to drawer/panel animations in frontend/src/styles/responsive.css
- [ ] T133 Test animation performance at 60fps on iPhone 11 and Pixel 5 per quickstart.md

### CLS Optimization

- [ ] T134 [P] Add explicit width/height to images to prevent layout shift in frontend/src/components/
- [ ] T135 Reserve space for inspector panel to prevent CLS on open in frontend/src/components/shell/Shell.tsx
- [ ] T136 Test CLS score <0.1 during orientation changes with Lighthouse

### Performance Testing

- [ ] T137 Run Lighthouse mobile audit, target score >90 per quickstart.md Performance Testing section
- [ ] T138 Test 3G load time <3s with Chrome DevTools throttling
- [ ] T139 Verify LCP <2.5s, FID <100ms, CLS <0.1 on mobile
- [ ] T140 Profile animation performance with Chrome DevTools Performance tab

**Checkpoint**: Performance targets met. Run quickstart.md "Performance Testing" checklist.

---

## Phase 9: Accessibility and Final QA (Cross-Cutting)

**Purpose**: Ensure WCAG AA compliance on mobile, screen reader support, keyboard navigation

**Addresses**: FR-007-054 through FR-007-057 (accessibility), FR-007-062 through FR-007-065 (testing)

### Mobile Accessibility

- [ ] T141 [P] Verify all touch targets meet WCAG 2.1 AAA (44x44px) with automated test
- [ ] T142 [P] Add proper ARIA labels to drawer overlays and mobile navigation in frontend/src/components/shell/
- [ ] T143 [P] Ensure focus indicators visible and high-contrast on mobile in frontend/src/styles/mobile.css
- [ ] T144 Test screen reader (VoiceOver on iOS, TalkBack on Android) per quickstart.md Accessibility Testing

### Keyboard Navigation

- [ ] T145 [P] Test keyboard navigation in mobile browser (external keyboard on iPad)
- [ ] T146 Verify focus trap works in mobile drawer and modal overlays in frontend/src/components/
- [ ] T147 Test tab order logical on mobile layouts

### Zoom Support

- [ ] T148 [P] Verify layout works with 200% browser zoom without breaking
- [ ] T149 Test that no viewport zoom is disabled (allow user pinch-zoom)
- [ ] T150 Ensure content remains accessible at all zoom levels

### Comprehensive Device Testing

- [ ] T151 Test on iPhone SE (375px) - smallest mobile per quickstart.md device matrix
- [ ] T152 Test on iPhone 12 Pro (390px) - modern mobile per quickstart.md device matrix
- [ ] T153 Test on iPad Air (820px portrait) - tablet per quickstart.md device matrix
- [ ] T154 Test on iPad Pro (1024px landscape) - large tablet per quickstart.md device matrix
- [ ] T155 Test on real iOS device (1 device minimum) per FR-007-063
- [ ] T156 Test on real Android device (1 device minimum) per FR-007-063

### Automated Validation

- [ ] T157 [P] Run automated horizontal scroll detection on all core pages
- [ ] T158 [P] Run axe-core accessibility audit on mobile viewports (target 0 critical violations)
- [ ] T159 Verify all 12 success criteria (SC-007-001 through SC-007-012) from spec.md met
- [ ] T160 Complete manual QA checklist from quickstart.md for all user stories

### Edge Case Testing

- [ ] T161 Test orientation change (portrait ↔ landscape) maintains state and layout
- [ ] T162 Test keyboard covers content - verify auto-scroll and sticky buttons work
- [ ] T163 Test very long page names truncate with ellipsis
- [ ] T164 Test touch target spacing prevents overlaps
- [ ] T165 Test offline editing and connection loss handling
- [ ] T166 Test split-screen mode on tablet (narrow viewport handling)
- [ ] T167 Test browser zoom (pinch-zoom) doesn't break layout
- [ ] T168 Test very small phone (<375px) shows appropriate warning or degrades gracefully

**Checkpoint**: All accessibility and QA testing complete. All 5 user stories validated on real devices.

---

## Phase 10: Documentation and Polish

**Purpose**: Final documentation updates, code cleanup, preparation for deployment

- [ ] T169 [P] Update component documentation with responsive usage examples in frontend/src/components/
- [ ] T170 [P] Add responsive examples to Storybook stories (if using Storybook)
- [ ] T171 [P] Document responsive patterns in frontend architecture docs
- [ ] T172 Code cleanup: remove console.logs, unused imports, commented code
- [ ] T173 Run ESLint and fix any warnings in responsive components
- [ ] T174 Verify all TypeScript types are properly defined for responsive hooks
- [ ] T175 [P] Update CHANGELOG.md with mobile responsiveness feature
- [ ] T176 [P] Add mobile testing instructions to developer onboarding docs
- [ ] T177 Validate quickstart.md instructions are complete and accurate
- [ ] T178 Take screenshots of mobile layouts for documentation

**Checkpoint**: Feature ready for deployment. All documentation complete.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: ✅ COMPLETED - responsive infrastructure ready
- **User Stories (Phase 2-6)**: All depend on Phase 1 completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3 → US4 → US5)
- **Cross-Cutting (Phase 7-9)**: Depends on relevant user stories being complete
- **Polish (Phase 10)**: Depends on all user stories and QA being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start immediately after Phase 1 - No dependencies on other stories
- **User Story 2 (P1)**: Can start immediately after Phase 1 - May integrate with US1 but independently testable
- **User Story 3 (P2)**: Can start after Phase 1 - Enhances US1/US2, independently testable
- **User Story 4 (P2)**: Can start after Phase 1 - Enhances forms, independently testable
- **User Story 5 (P3)**: Can start after Phase 1 - Polish typography, independently testable

### Within Each User Story

- Tasks within a user story generally follow this order:
  1. Layout structure and breakpoint detection
  2. Component updates for mobile patterns
  3. Touch interactions and gestures
  4. QA validation per quickstart.md

### Parallel Opportunities

- Phase 1 tasks T002-T008 can run in parallel (different files)
- Within each user story, tasks marked [P] can run in parallel
- User Stories 1-5 can be worked on in parallel by different team members after Phase 1 completes
- Phase 7-9 cross-cutting tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch shell component updates in parallel:
Task: T010 "Add mobile breakpoint detection to Shell component"
Task: T012 "Update TopBar component for mobile"
Task: T013 "Create mobile drawer overlay component"

# Launch inspector and canvas updates in parallel:
Task: T023 "Create full-screen overlay variant for inspector"
Task: T028 "Add canvas zoom controls for mobile"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. ✅ Complete Phase 1: Setup (DONE)
2. Complete Phase 2: User Story 1 (Mobile Phone Editing)
3. **STOP and VALIDATE**: Test User Story 1 independently per quickstart.md
4. Deploy/demo MVP (mobile phone access functional)

**Estimated effort**: 1 week for User Story 1 implementation + QA

### Incremental Delivery

1. ✅ Phase 1: Setup → Foundation ready
2. Phase 2: User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Phase 3: User Story 2 → Test independently → Deploy/Demo (tablet support added)
4. Phase 4: User Story 3 → Test independently → Deploy/Demo (touch optimized)
5. Phase 5: User Story 4 → Test independently → Deploy/Demo (forms optimized)
6. Phase 6: User Story 5 → Test independently → Deploy/Demo (typography polished)
7. Phase 7-9: Cross-cutting concerns → Final QA → Production ready

**Total estimated effort**: 8 weeks (1 developer full-time) per plan.md

### Parallel Team Strategy

With multiple developers after Phase 1:

1. Developer A: User Story 1 (Mobile Phone - P1)
2. Developer B: User Story 2 (Tablet - P1)
3. Developer C: User Story 3 (Touch Interactions - P2)
4. Stories complete and integrate independently

**Accelerated timeline**: 3-4 weeks with 3 developers in parallel

---

## Success Validation

Before marking feature complete, verify:

- [ ] All 65 functional requirements (FR-007-001 through FR-007-065) implemented
- [ ] All 12 success criteria (SC-007-001 through SC-007-012) validated
- [ ] All 8 edge cases tested and handled
- [ ] Zero breaking changes to existing desktop functionality
- [ ] Constitution compliance maintained (verified in plan.md)
- [ ] Quickstart.md manual testing checklist 100% complete
- [ ] Lighthouse mobile score >90 achieved
- [ ] Real device testing (1 iOS + 1 Android) completed
- [ ] User Story 1-5 independently functional and tested

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable per quickstart.md
- Phase 1 (Setup) already complete - ready to start User Story 1 implementation
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No automated tests requested - validation via quickstart.md manual QA checklist
- Focus on implementation quality and mobile UX over test coverage

---

## Task Count Summary

- **Phase 1 (Setup)**: 9 tasks ✅ COMPLETED
- **Phase 2 (US1 - Mobile Phone)**: 26 tasks (T010-T035)
- **Phase 3 (US2 - Tablet)**: 18 tasks (T036-T053)
- **Phase 4 (US3 - Touch)**: 19 tasks (T054-T072)
- **Phase 5 (US4 - Forms)**: 24 tasks (T073-T096)
- **Phase 6 (US5 - Typography)**: 19 tasks (T097-T115)
- **Phase 7 (Tables/Lists)**: 9 tasks (T116-T124)
- **Phase 8 (Performance)**: 16 tasks (T125-T140)
- **Phase 9 (Accessibility/QA)**: 28 tasks (T141-T168)
- **Phase 10 (Documentation)**: 10 tasks (T169-T178)

**Total**: 178 tasks (169 implementation + QA tasks remaining)

**Parallel opportunities**: 45 tasks marked [P] can run in parallel within their phases

**MVP scope**: Phase 2 (User Story 1) = 26 tasks for basic mobile phone editing

**Ready to start**: Task T010 (Begin User Story 1 implementation)
