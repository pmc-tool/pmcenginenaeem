---

description: "Task list for Dashboard Shell feature implementation"
---

# Tasks: Dashboard Shell

**Input**: Design documents from `/specs/001-dashboard-shell/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification. This feature specification does not explicitly request tests, so test tasks are excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend project**: `frontend/src/`, `frontend/tests/` at repository root
- Paths shown below use `.tsx` extension (React + TypeScript from research.md)
- Adjust based on plan.md structure decision

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize React 18 + TypeScript project with Vite
- [ ] T003 [P] Install core dependencies (React 18, Zustand 4, Vanilla Extract, Radix UI)
- [ ] T004 [P] Install development dependencies (Vitest, Playwright, ESLint, Prettier)
- [ ] T005 [P] Configure TypeScript with strict mode in tsconfig.json
- [ ] T006 [P] Configure Vite with Vanilla Extract plugin in vite.config.ts
- [ ] T007 [P] Configure Vitest in vite.config.ts test section
- [ ] T008 [P] Install Playwright browsers with npx playwright install --with-deps
- [ ] T009 [P] Create frontend/src directory structure (components/shell, components/ui, components/overlays, store, hooks, utils, styles)
- [ ] T010 [P] Create frontend/tests directory structure (integration, component, a11y)
- [ ] T011 [P] Create frontend/public directory with index.html entry point

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T012 Create constitutional design tokens in frontend/src/styles/tokens.css.ts
- [ ] T013 Create base layout styles with CSS Grid in frontend/src/styles/layout.css.ts
- [ ] T014 Create responsive breakpoint styles in frontend/src/styles/responsive.css.ts
- [ ] T015 [P] Create debounce utility in frontend/src/utils/debounce.ts
- [ ] T016 [P] Create localStorage abstraction utility in frontend/src/utils/localStorage.ts
- [ ] T017 [P] Create accessibility helper utilities in frontend/src/utils/a11y.ts
- [ ] T018 Create global Zustand store with 6 state slices in frontend/src/store/dashboardStore.ts
- [ ] T019 Configure Zustand devtools middleware in frontend/src/store/dashboardStore.ts
- [ ] T020 Configure Zustand persist middleware with IndexedDB/localStorage hybrid in frontend/src/store/dashboardStore.ts
- [ ] T021 [P] Create shell state slice with mode, selected IDs, save status in frontend/src/store/shellState.ts
- [ ] T022 [P] Create top bar state slice with site name, logo, credits in frontend/src/store/topBarState.ts
- [ ] T023 [P] Create navigation state slice for left rail and page sidebar in frontend/src/store/navigationState.ts
- [ ] T024 [P] Create inspector state slice with active tab, panel width in frontend/src/store/inspectorState.ts
- [ ] T025 [P] Create canvas state slice with page ID, scroll position in frontend/src/store/canvasState.ts
- [ ] T026 Create selector hooks for fine-grained subscriptions in frontend/src/store/dashboardStore.ts
- [ ] T027 [P] Create keyboard navigation hook with roving tabindex in frontend/src/hooks/useKeyboardNav.ts
- [ ] T028 [P] Create auto-save hook with 30s debounce in frontend/src/hooks/useAutoSave.ts
- [ ] T029 [P] Create resize hook with 60fps debouncing in frontend/src/hooks/useResize.ts
- [ ] T030 [P] Create sync hook for cross-region state updates in frontend/src/hooks/useSync.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Access Core Editing Interface (Priority: P1) 🎯 MVP

**Goal**: Render functional dashboard shell with all 5 regions (top bar, left rail, canvas, inspector, page sidebar) maintaining consistent layout across all modes

**Independent Test**: Load editor, verify all shell regions render correctly, switch between edit/preview/settings modes and verify layout consistency, resize browser window and verify responsive behavior

### Implementation for User Story 1

- [ ] T031 [P] [US1] Create Button UI primitive component in frontend/src/components/ui/Button.tsx
- [ ] T032 [P] [US1] Create Icon UI primitive component with ARIA labels in frontend/src/components/ui/Icon.tsx
- [ ] T033 [P] [US1] Create Tab UI primitive component in frontend/src/components/ui/Tab.tsx
- [ ] T034 [P] [US1] Create ResizeHandle UI primitive component in frontend/src/components/ui/ResizeHandle.tsx
- [ ] T035 [US1] Create Shell root container component with CSS Grid layout in frontend/src/components/shell/Shell.tsx
- [ ] T036 [US1] Implement responsive breakpoints (<768px, <1024px) in Shell component
- [ ] T037 [US1] Add keyboard shortcut registry (Escape, Tab navigation) to Shell component
- [ ] T038 [P] [US1] Create TopBar component with logo, site name, save status, preview toggle in frontend/src/components/shell/TopBar.tsx
- [ ] T039 [US1] Implement site name inline editing in TopBar component
- [ ] T040 [US1] Implement preview mode toggle in TopBar component
- [ ] T041 [US1] Implement AI credits display with amber warning (<50 credits) in TopBar component
- [ ] T042 [US1] Add help icon with click handler to TopBar component
- [ ] T043 [P] [US1] Create LeftRail component with Chat, Pages, Settings icons in frontend/src/components/shell/LeftRail.tsx
- [ ] T044 [US1] Implement icon hover tooltips in LeftRail component
- [ ] T045 [US1] Implement icon click handlers with active state in LeftRail component
- [ ] T046 [P] [US1] Create Canvas component with iframe for live site preview in frontend/src/components/shell/Canvas.tsx
- [ ] T047 [US1] Implement welcome screen for empty state in Canvas component
- [ ] T048 [US1] Implement preview mode (full-screen, hide shell UI) in Canvas component
- [ ] T049 [P] [US1] Create Inspector component with 5 tabs (Content, AI Assistant, Settings, Logic & Data, Advanced) in frontend/src/components/shell/Inspector.tsx
- [ ] T050 [US1] Implement tab switching logic in Inspector component
- [ ] T051 [US1] Implement horizontal resize with draggable handle (280-600px) in Inspector component
- [ ] T052 [US1] Add visual de-emphasis for Advanced tab content in Inspector component
- [ ] T053 [US1] Implement empty state ("Select a page to edit") in Inspector component
- [ ] T054 [P] [US1] Create PageSidebar component with collapsible behavior in frontend/src/components/shell/PageSidebar.tsx
- [ ] T055 [US1] Implement 250ms slide animation in PageSidebar component
- [ ] T056 [US1] Implement empty state ("No pages yet") with "Create First Page" button in PageSidebar component
- [ ] T057 [US1] Wire Shell component to Zustand store with state subscriptions
- [ ] T058 [US1] Connect TopBar to topBar state slice
- [ ] T059 [US1] Connect LeftRail to navigation state slice
- [ ] T060 [US1] Connect Canvas to canvas state slice
- [ ] T061 [US1] Connect Inspector to inspector state slice
- [ ] T062 [US1] Connect PageSidebar to navigation state slice
- [ ] T063 [US1] Create App.tsx root component rendering Shell
- [ ] T064 [US1] Implement mode switching logic (wizard, edit, preview, settings) maintaining consistent shell layout
- [ ] T065 [US1] Add ARIA labels to all interactive elements (icons, buttons, tabs)
- [ ] T066 [US1] Implement focus-visible outlines (2px solid accent, 2px offset) across all components
- [ ] T067 [US1] Verify all regions use constitutional design tokens (8px spacing, Inter font, #EA2724 accent)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. All 5 shell regions render, layout persists across modes, responsive breakpoints work.

---

## Phase 4: User Story 2 - Navigate Pages and Sections (Priority: P2)

**Goal**: Enable page/section navigation with synchronized updates across page sidebar, canvas, and inspector within 100ms

**Independent Test**: Create site with 3 pages and multiple sections, click Pages icon to open sidebar, expand pages to see sections, select sections and verify canvas scrolls + inspector updates, test drag-to-reorder pages

### Implementation for User Story 2

- [ ] T068 [P] [US2] Create PageNode and SectionNode type interfaces in frontend/src/types/page.ts
- [ ] T069 [P] [US2] Create mock page data (3 pages with sections) in frontend/src/data/mockPages.ts
- [ ] T070 [US2] Implement hierarchical page/section tree rendering in PageSidebar component
- [ ] T071 [US2] Implement page expand/collapse with expandedPageIds state in PageSidebar component
- [ ] T072 [US2] Implement page selection highlighting in PageSidebar component
- [ ] T073 [US2] Implement section selection highlighting in PageSidebar component
- [ ] T074 [US2] Add onPageSelect handler in PageSidebar component
- [ ] T075 [US2] Add onSectionSelect handler in PageSidebar component
- [ ] T076 [US2] Implement page selection synchronization flow (PageSidebar → Shell → Canvas → Inspector) in under 100ms
- [ ] T077 [US2] Implement section selection synchronization flow (PageSidebar → Canvas scroll → Inspector update) in under 100ms
- [ ] T078 [US2] Implement canvas scroll-to-section logic with smooth scroll in Canvas component
- [ ] T079 [US2] Implement section outline on hover (1px low opacity) in Canvas component
- [ ] T080 [US2] Implement section highlight on selection (2px accent color outline) in Canvas component
- [ ] T081 [US2] Update Inspector content on page selection (show page-level fields)
- [ ] T082 [US2] Update Inspector content on section selection (show section-specific fields)
- [ ] T083 [US2] Implement Inspector loading state during content fetch
- [ ] T084 [US2] Implement debounced updates (max 1 update per 100ms) for rapid page/section switching
- [ ] T085 [US2] Add drag-to-reorder functionality for pages in PageSidebar component
- [ ] T086 [US2] Implement visual feedback for valid drop zones during page drag
- [ ] T087 [US2] Update page order state on successful drag-and-drop
- [ ] T088 [US2] Add keyboard accessibility for page/section navigation (Arrow keys, Enter to select)
- [ ] T089 [US2] Implement roving tabindex for page list using useKeyboardNav hook
- [ ] T090 [US2] Add ARIA tree/treeitem roles to page/section hierarchy

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can navigate pages/sections with synchronized canvas/inspector updates.

---

## Phase 5: User Story 3 - Customize Inspector View (Priority: P3)

**Goal**: Enable inspector tab switching with content updates and tab persistence across navigation

**Independent Test**: Click each inspector tab (Content, AI Assistant, Settings, Logic & Data, Advanced), verify content area updates, navigate to different page/section and verify active tab persists, confirm Advanced tab uses visual de-emphasis

### Implementation for User Story 3

- [ ] T091 [P] [US3] Create ContentTab component for schema-driven field editing in frontend/src/components/inspector/ContentTab.tsx
- [ ] T092 [P] [US3] Create AIAssistantTab component with chat interface and scope selector in frontend/src/components/inspector/AIAssistantTab.tsx
- [ ] T093 [P] [US3] Create SettingsTab component for page/section settings in frontend/src/components/inspector/SettingsTab.tsx
- [ ] T094 [P] [US3] Create LogicDataTab component (placeholder for future feature) in frontend/src/components/inspector/LogicDataTab.tsx
- [ ] T095 [P] [US3] Create AdvancedTab component with visual de-emphasis styling in frontend/src/components/inspector/AdvancedTab.tsx
- [ ] T096 [US3] Implement tab content switching logic in Inspector component
- [ ] T097 [US3] Implement tab state persistence across page/section navigation
- [ ] T098 [US3] Add AI scope selector (field, section, page, feature) to AIAssistantTab
- [ ] T099 [US3] Implement visual de-emphasis for AdvancedTab (12px font, #666666 color)
- [ ] T100 [US3] Add tab transition animation (150ms ease-out)
- [ ] T101 [US3] Update Inspector to unmount/mount tab panels on tab change
- [ ] T102 [US3] Ensure ContentTab fetches schema-driven fields based on selected page/section
- [ ] T103 [US3] Add ARIA tab/tabpanel/tablist roles to Inspector tabs
- [ ] T104 [US3] Implement keyboard navigation for tabs (Arrow Left/Right, Enter to activate)
- [ ] T105 [US3] Add aria-selected state to active tab

**Checkpoint**: All inspector tabs functional, content updates appropriately, tab persistence works, visual styling correct.

---

## Phase 6: User Story 4 - Access Help and Status Information (Priority: P4)

**Goal**: Display help panel, save status updates, AI credits, and preview mode toggle

**Independent Test**: Click help icon and verify contextual help appears, make edit and watch save status update ("Saving..." → "All changes saved" in <3s), verify AI credits display, toggle preview mode and confirm UI hides/restores

### Implementation for User Story 4

- [ ] T106 [P] [US4] Create HelpPanel overlay component in frontend/src/components/overlays/HelpPanel.tsx
- [ ] T107 [US4] Implement HelpPanel slide-in animation (250ms from right)
- [ ] T108 [US4] Add contextual help content based on current mode (wizard, edit, preview, settings)
- [ ] T109 [US4] Implement help icon click handler in TopBar to toggle HelpPanel
- [ ] T110 [US4] Add Escape key handler to close HelpPanel
- [ ] T111 [US4] Implement auto-save status updates in TopBar (idle → saving → saved/failed)
- [ ] T112 [US4] Display save status text ("All changes saved", "Saving...", "Failed to save")
- [ ] T113 [US4] Add retry button for "Failed to save" state
- [ ] T114 [US4] Implement auto-save trigger on content change (30s debounce or blur) using useAutoSave hook
- [ ] T115 [US4] Implement AI credits display with icon in TopBar
- [ ] T116 [US4] Change AI credits color to amber when <50 credits
- [ ] T117 [US4] Implement preview mode toggle button in TopBar
- [ ] T118 [US4] Hide shell UI (top bar, sidebars, inspector) when preview mode active
- [ ] T119 [US4] Show only Canvas in full-screen during preview mode
- [ ] T120 [US4] Implement Escape key handler to exit preview mode
- [ ] T121 [US4] Add preview mode toggle keyboard shortcut (Cmd+P / Ctrl+P)
- [ ] T122 [US4] Update Shell component to handle preview mode state
- [ ] T123 [US4] Add focus trap to HelpPanel when open
- [ ] T124 [US4] Ensure HelpPanel has aria-label and role="dialog"

**Checkpoint**: All user stories should now be independently functional. Help, status, and preview features working.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T125 [P] Add skip links for keyboard navigation (skip to main content, inspector, page navigation)
- [ ] T126 [P] Implement focus management for modals/panels (focus trap, restore focus on close)
- [ ] T127 [P] Add ARIA live regions for save status and dynamic content updates
- [ ] T128 [P] Verify all color contrasts meet WCAG AA (4.5:1 minimum) using design tokens
- [ ] T129 [P] Add loading states for all async operations (page fetch, section fetch, save)
- [ ] T130 [P] Implement error boundaries for React component error handling
- [ ] T131 [P] Add toast notifications for save success/failure
- [ ] T132 [P] Implement keyboard shortcuts documentation (accessible via help panel)
- [ ] T133 [P] Add performance monitoring for <100ms sync requirement
- [ ] T134 [P] Optimize bundle size (code splitting, lazy loading for tab content)
- [ ] T135 [P] Add visual feedback for all interactive elements (hover, active, focus states)
- [ ] T136 [P] Implement smooth transitions for all animations (150-300ms per constitution)
- [ ] T137 [P] Add console error logging for state sync failures
- [ ] T138 [P] Implement graceful fallbacks for failed operations
- [ ] T139 [P] Create production build and verify <100KB CSS, <200KB JS bundle sizes
- [ ] T140 Run quickstart.md validation (verify all setup steps and expected states)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 shell structure but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on US1 inspector structure but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Builds on US1 top bar but independently testable

### Within Each User Story

- UI primitives (Button, Icon, Tab, ResizeHandle) before shell components
- Shell components before state connections
- State connections before synchronization logic
- Core implementation before keyboard accessibility
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003-T011)
- All Foundational utility tasks can run in parallel (T015-T017, T027-T030)
- All Foundational state slices can run in parallel (T021-T025)
- All UI primitive components can run in parallel (T031-T034)
- Shell region components (TopBar, LeftRail, Canvas, Inspector, PageSidebar) can start in parallel after primitives complete
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All Polish tasks can run in parallel (T125-T139)

---

## Parallel Example: User Story 1

```bash
# Launch all UI primitives together:
Task: "Create Button UI primitive component in frontend/src/components/ui/Button.tsx"
Task: "Create Icon UI primitive component with ARIA labels in frontend/src/components/ui/Icon.tsx"
Task: "Create Tab UI primitive component in frontend/src/components/ui/Tab.tsx"
Task: "Create ResizeHandle UI primitive component in frontend/src/components/ui/ResizeHandle.tsx"

# After primitives done, launch all shell components together:
Task: "Create TopBar component with logo, site name, save status, preview toggle in frontend/src/components/shell/TopBar.tsx"
Task: "Create LeftRail component with Chat, Pages, Settings icons in frontend/src/components/shell/LeftRail.tsx"
Task: "Create Canvas component with iframe for live site preview in frontend/src/components/shell/Canvas.tsx"
Task: "Create Inspector component with 5 tabs in frontend/src/components/shell/Inspector.tsx"
Task: "Create PageSidebar component with collapsible behavior in frontend/src/components/shell/PageSidebar.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T011)
2. Complete Phase 2: Foundational (T012-T030) → CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T031-T067)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Load editor, verify all 5 shell regions render, test responsive behavior, verify mode switching
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (T031-T067) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (T068-T090) → Test independently → Deploy/Demo (navigation enabled)
4. Add User Story 3 (T091-T105) → Test independently → Deploy/Demo (inspector customization)
5. Add User Story 4 (T106-T124) → Test independently → Deploy/Demo (help & status)
6. Add Polish (T125-T140) → Final quality pass → Production release
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T031-T067)
   - Developer B: User Story 2 (T068-T090)
   - Developer C: User Story 3 (T091-T105)
   - Developer D: User Story 4 (T106-T124)
3. Stories complete and integrate independently
4. Team collaborates on Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- All tasks include exact file paths
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Totals

- **Total tasks**: 140
- **Setup tasks**: 11
- **Foundational tasks**: 19
- **User Story 1 tasks**: 37 (MVP scope)
- **User Story 2 tasks**: 23
- **User Story 3 tasks**: 15
- **User Story 4 tasks**: 19
- **Polish tasks**: 16
- **Parallel opportunities**: 67 tasks marked [P]

---

## Independent Test Summary

**User Story 1 (P1 - MVP)**: Load editor, verify all 5 shell regions render with correct content, switch modes (edit/preview/settings) and confirm layout consistency, resize browser window and verify responsive breakpoints

**User Story 2 (P2)**: Create mock 3-page site with sections, open Pages sidebar, expand/collapse pages, select pages/sections, verify canvas scrolls to section and inspector updates within 100ms, test drag-to-reorder

**User Story 3 (P3)**: Click each inspector tab, verify content area changes appropriately (Content shows fields, AI Assistant shows chat + scope selector, Advanced shows de-emphasized content), navigate to different page and confirm active tab persists

**User Story 4 (P4)**: Click help icon and verify panel slides in with contextual content, edit site name and watch save status transition ("Saving..." → "All changes saved"), check AI credits display turns amber at <50, toggle preview mode and confirm shell UI hides/restores on Escape

---

## Next Commands

After completing MVP (User Story 1):
- Run `npm run dev` and navigate to localhost:3000
- Verify all acceptance scenarios from spec.md User Story 1
- Run accessibility audit: `npm run test:a11y`
- Profile performance: Chrome DevTools → Performance tab → verify <100ms sync

After all user stories complete:
- Run full integration test suite
- Run E2E tests with Playwright
- Generate production build
- Deploy MVP to staging environment
