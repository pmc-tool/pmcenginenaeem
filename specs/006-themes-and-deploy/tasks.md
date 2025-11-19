# Tasks: Themes Page, Theme Upload & AI Deploy Panel

**Input**: Design documents from `/specs/006-themes-and-deploy/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in specification - focusing on implementation tasks only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:
- Frontend: `frontend/src/`
- Components: `frontend/src/components/themes/`, `frontend/src/components/deployment/`
- Stores: `frontend/src/store/`
- Services: `frontend/src/services/`
- Types: `frontend/src/types/`
- Utils: `frontend/src/utils/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [ ] T001 Install new dependencies: ajv, jszip, date-fns in frontend/package.json
- [ ] T002 Install dev dependencies: @types/jszip in frontend/package.json
- [ ] T003 [P] Create types directory structure: frontend/src/types/themes.ts
- [ ] T004 [P] Create components directory structure: frontend/src/components/themes/ and frontend/src/components/deployment/
- [ ] T005 [P] Create store directory files: frontend/src/store/themesStore.ts and frontend/src/store/deploymentStore.ts
- [ ] T006 [P] Create services directory files: frontend/src/services/themeService.ts and frontend/src/services/deploymentService.ts
- [ ] T007 [P] Create utils directory files: frontend/src/utils/themeValidator.ts and frontend/src/utils/sandboxManager.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, validators, and stores that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Define Theme interface in frontend/src/types/themes.ts (id, name, version, framework, source, deploymentStatus, etc.)
- [ ] T009 [P] Define UploadSession interface in frontend/src/types/themes.ts (id, fileName, progressPercent, validationState, etc.)
- [ ] T010 [P] Define DeploymentSession interface in frontend/src/types/themes.ts (id, themeId, currentStep, steps, buildLogs, etc.)
- [ ] T011 [P] Define StepStatus, ErrorDetails, PurchasedMetadata, UploadedMetadata types in frontend/src/types/themes.ts
- [ ] T012 Implement themeValidator using ajv for JSON Schema validation in frontend/src/utils/themeValidator.ts
- [ ] T013 Implement validateThemeFile function with jszip extraction in frontend/src/utils/themeValidator.ts
- [ ] T014 Create themesStore with Zustand (themes array, uploadSessions, actions) in frontend/src/store/themesStore.ts
- [ ] T015 Create deploymentStore with Zustand (activeSessions Map, actions) in frontend/src/store/deploymentStore.ts
- [ ] T016 Implement mock PackMyCode API sync service in frontend/src/services/themeService.ts
- [ ] T017 Implement theme CRUD operations in themeService (addTheme, deleteTheme, etc.) in frontend/src/services/themeService.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View and Browse Available Themes (Priority: P1) 🎯 MVP

**Goal**: Display Themes page with unified list of purchased and uploaded themes, with filtering and search

**Independent Test**: Navigate to Themes page and verify purchased/uploaded themes display with thumbnails, status pills, search, and tag filters

### Implementation for User Story 1

- [ ] T018 [P] [US1] Add Themes icon (Palette) to LeftRail tabs in frontend/src/components/shell/LeftRail.tsx
- [ ] T019 [P] [US1] Create ThemesPage component skeleton in frontend/src/components/themes/ThemesPage.tsx
- [ ] T020 [P] [US1] Create ThemesPage styles in frontend/src/components/themes/ThemesPage.css
- [ ] T021 [P] [US1] Create ThemeCard component for individual theme display in frontend/src/components/themes/ThemeCard.tsx
- [ ] T022 [P] [US1] Create ThemeCard styles in frontend/src/components/themes/ThemeCard.css
- [ ] T023 [P] [US1] Create MyThemesList component for unified theme list in frontend/src/components/themes/MyThemesList.tsx
- [ ] T024 [P] [US1] Create MyThemesList styles in frontend/src/components/themes/MyThemesList.css
- [ ] T025 [P] [US1] Create ThemeFilters component with search and tag filters in frontend/src/components/themes/ThemeFilters.tsx
- [ ] T026 [US1] Integrate ThemesPage with themesStore to display themes in frontend/src/components/themes/ThemesPage.tsx
- [ ] T027 [US1] Implement theme filtering logic (by source, tags, search query) in frontend/src/components/themes/MyThemesList.tsx
- [ ] T028 [US1] Add "Refresh themes" button to sync purchased themes from PackMyCode in frontend/src/components/themes/ThemesPage.tsx
- [ ] T029 [US1] Implement active theme status pill display ("Active on this site") in frontend/src/components/themes/ThemeCard.tsx
- [ ] T030 [US1] Implement source badge display ("Uploaded theme" vs purchased) in frontend/src/components/themes/ThemeCard.tsx
- [ ] T031 [US1] Add real-time search filtering in ThemeFilters component in frontend/src/components/themes/ThemeFilters.tsx
- [ ] T032 [US1] Add tag-based filtering UI (SaaS, Portfolio, Blog tags) in frontend/src/components/themes/ThemeFilters.tsx
- [ ] T033 [US1] Update Shell routing to render ThemesPage when Themes tab active in frontend/src/components/shell/Shell.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - users can view, search, and filter all available themes

---

## Phase 4: User Story 2 - Upload Custom Theme (Priority: P2)

**Goal**: Enable drag-and-drop and file picker upload with validation (50 MB limit, manifest validation)

**Independent Test**: Upload a valid theme .zip file, verify it appears in My Themes with proper badge; test error cases with invalid files

### Implementation for User Story 2

- [ ] T034 [P] [US2] Create ThemeUploadCard component skeleton in frontend/src/components/themes/ThemeUploadCard.tsx
- [ ] T035 [P] [US2] Create ThemeUploadCard styles in frontend/src/components/themes/ThemeUploadCard.css
- [ ] T036 [US2] Implement drag-and-drop dropzone in ThemeUploadCard using HTML5 drag events in frontend/src/components/themes/ThemeUploadCard.tsx
- [ ] T037 [US2] Implement file picker dialog ("Browse files" button) in frontend/src/components/themes/ThemeUploadCard.tsx
- [ ] T038 [US2] Implement upload progress tracking (0-100%) in frontend/src/components/themes/ThemeUploadCard.tsx
- [ ] T039 [US2] Create upload session on file selection in frontend/src/services/themeService.ts
- [ ] T040 [US2] Implement file size validation (<= 50 MB) before upload in frontend/src/services/themeService.ts
- [ ] T041 [US2] Implement file type validation (.zip only) in frontend/src/services/themeService.ts
- [ ] T042 [US2] Integrate validateThemeFile function to extract and validate manifest.json in frontend/src/services/themeService.ts
- [ ] T043 [US2] Handle validation success: create Theme entity with "uploaded" source in frontend/src/services/themeService.ts
- [ ] T044 [US2] Handle validation failure: display friendly error messages in frontend/src/components/themes/ThemeUploadCard.tsx
- [ ] T045 [US2] Implement error message for file size > 50 MB in frontend/src/components/themes/ThemeUploadCard.tsx
- [ ] T046 [US2] Implement error message for non-zip files in frontend/src/components/themes/ThemeUploadCard.tsx
- [ ] T047 [US2] Implement error message for missing/invalid manifest in frontend/src/components/themes/ThemeUploadCard.tsx
- [ ] T048 [US2] Add uploaded theme to top of My Themes list with placeholder thumbnail in frontend/src/store/themesStore.ts
- [ ] T049 [US2] Implement upload session cleanup (remove after 5 minutes) in frontend/src/services/themeService.ts
- [ ] T050 [US2] Display upload progress indicator during file upload and validation in frontend/src/components/themes/ThemeUploadCard.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can view themes AND upload new custom themes

---

## Phase 5: User Story 3 - Deploy Theme with AI Guidance (Priority: P1) 🎯 MVP

**Goal**: Deploy selected theme with step-by-step progress, tech stack detection, and terminal logs

**Independent Test**: Select any theme, click "Use this theme", observe Deploy Panel with live step updates, terminal logs, and successful preview mode transition

### Implementation for User Story 3

- [ ] T051 [P] [US3] Create DeployPanel component skeleton in frontend/src/components/deployment/DeployPanel.tsx
- [ ] T052 [P] [US3] Create DeployPanel styles in frontend/src/components/deployment/DeployPanel.css
- [ ] T053 [P] [US3] Create DeploymentSteps component for step progress UI in frontend/src/components/deployment/DeploymentSteps.tsx
- [ ] T054 [P] [US3] Create DeploymentSteps styles in frontend/src/components/deployment/DeploymentSteps.css
- [ ] T055 [P] [US3] Create TerminalLog component for collapsible build logs in frontend/src/components/deployment/TerminalLog.tsx
- [ ] T056 [P] [US3] Create TerminalLog styles in frontend/src/components/deployment/TerminalLog.css
- [ ] T057 [P] [US3] Create ThemeSummary component for inspector post-deploy view in frontend/src/components/deployment/ThemeSummary.tsx
- [ ] T058 [US3] Implement DeploymentService.mockDeployment method in frontend/src/services/deploymentService.ts
- [ ] T059 [US3] Implement deployment step progression (detecting_stack → preparing_env → building → deploying → done) in frontend/src/services/deploymentService.ts
- [ ] T060 [US3] Implement tech stack detection and display ("Detected Next.js 13.4") in frontend/src/services/deploymentService.ts
- [ ] T061 [US3] Implement buildLogs array population with simulated terminal output in frontend/src/services/deploymentService.ts
- [ ] T062 [US3] Add "Use this theme" button to ThemeCard in frontend/src/components/themes/ThemeCard.tsx
- [ ] T063 [US3] Implement confirmation note display before deployment ("We'll deploy this theme...") in frontend/src/components/deployment/DeployPanel.tsx
- [ ] T064 [US3] Open Deploy Panel on theme selection in frontend/src/components/themes/ThemeCard.tsx
- [ ] T065 [US3] Display vertical timeline with step statuses (idle, in_progress, success, error) in frontend/src/components/deployment/DeploymentSteps.tsx
- [ ] T066 [US3] Implement live status text updates during deployment in frontend/src/components/deployment/DeploymentSteps.tsx
- [ ] T067 [US3] Implement spinner icon for in_progress steps in frontend/src/components/deployment/DeploymentSteps.tsx
- [ ] T068 [US3] Implement checkmark icon for success steps in frontend/src/components/deployment/DeploymentSteps.tsx
- [ ] T069 [US3] Implement collapsible terminal log ("View build details" / "Hide details") in frontend/src/components/deployment/TerminalLog.tsx
- [ ] T070 [US3] Implement terminal log scrolling for content exceeding panel height in frontend/src/components/deployment/TerminalLog.css
- [ ] T071 [US3] Display success message on deployment completion ("Your site is live in Preview mode") in frontend/src/components/deployment/DeployPanel.tsx
- [ ] T072 [US3] Add "Go to Preview" button on deployment success in frontend/src/components/deployment/DeployPanel.tsx
- [ ] T073 [US3] Close Deploy Panel and switch canvas to Preview mode on success in frontend/src/components/deployment/DeployPanel.tsx
- [ ] T074 [US3] Update top bar Preview toggle to reflect Preview state in frontend/src/components/shell/TopBar.tsx
- [ ] T075 [US3] Display Theme Summary in inspector with theme name, thumbnail, quick actions in frontend/src/components/deployment/ThemeSummary.tsx
- [ ] T076 [US3] Implement quick action links ("Open Pages & Sections", "Open AI Coding mode", "Edit Business Profile") in frontend/src/components/deployment/ThemeSummary.tsx
- [ ] T077 [US3] Update theme deploymentStatus to "deploying" on start, "active" on success in frontend/src/store/themesStore.ts
- [ ] T078 [US3] Ensure only one deployment runs at a time per site (freeze UI during deploy) in frontend/src/services/deploymentService.ts
- [ ] T079 [US3] Implement Deploy Panel as modal/sidebar within shell (not pop-out window) in frontend/src/components/deployment/DeployPanel.tsx

**Checkpoint**: At this point, User Stories 1 AND 3 should both work independently - users can view themes AND deploy them with full AI guidance

---

## Phase 6: User Story 4 - Recover from Deployment Errors with AI Help (Priority: P2)

**Goal**: Handle deployment failures with Chat integration, error explanations, and re-deployment

**Independent Test**: Trigger deployment failure (mock error), verify error display, Chat panel opening with context, AI explanation, and re-deploy capability

### Implementation for User Story 4

- [ ] T080 [P] [US4] Implement error icon and red text for failing steps in frontend/src/components/deployment/DeploymentSteps.tsx
- [ ] T081 [P] [US4] Auto-expand terminal log and scroll to error lines on failure in frontend/src/components/deployment/TerminalLog.tsx
- [ ] T082 [P] [US4] Subtly highlight error lines in terminal log in frontend/src/components/deployment/TerminalLog.css
- [ ] T083 [US4] Display error summary text ("We couldn't finish the deployment...") in frontend/src/components/deployment/DeployPanel.tsx
- [ ] T084 [US4] Add "Open AI help to fix this" button to error panel in frontend/src/components/deployment/DeployPanel.tsx
- [ ] T085 [US4] Implement Chat panel opening within shell on error button click in frontend/src/components/deployment/DeployPanel.tsx
- [ ] T086 [US4] Pass deployment error context to Chat panel (themeId, failingStep, errorSnippet) in frontend/src/components/deployment/DeployPanel.tsx
- [ ] T087 [US4] Populate Chat with AI message explaining error in plain English in frontend/src/components/chat/ChatPanel.tsx (MODIFIED)
- [ ] T088 [US4] Add "Deploy again" button/command to Chat panel in frontend/src/components/chat/ChatPanel.tsx (MODIFIED)
- [ ] T089 [US4] Implement re-deployment trigger from Chat (resets Deploy Panel, clears logs, starts new session) in frontend/src/services/deploymentService.ts
- [ ] T090 [US4] Update theme deploymentStatus to "failed" on error in frontend/src/store/themesStore.ts
- [ ] T091 [US4] Store errorDetails in DeploymentSession (failingStep, errorMessage, errorSnippet) in frontend/src/store/deploymentStore.ts
- [ ] T092 [US4] Implement error snippet extraction (5-10 lines around error) in frontend/src/services/deploymentService.ts
- [ ] T093 [US4] Display persistent warning if Deploy Panel closed without opening Chat ("Last deployment failed...") in frontend/src/components/themes/ThemesPage.tsx or frontend/src/components/shell/TopBar.tsx
- [ ] T094 [US4] Implement mock deployment failure scenarios for testing in frontend/src/services/deploymentService.ts

**Checkpoint**: All user stories should now be independently functional - complete theme lifecycle from viewing → uploading → deploying → error recovery

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, accessibility, and edge cases

- [ ] T095 [P] Implement connection loss detection during deployment in frontend/src/services/deploymentService.ts
- [ ] T096 [P] Add "Connection lost" message and retry button for network failures in frontend/src/components/deployment/DeployPanel.tsx
- [ ] T097 [P] Implement re-deployment confirmation for active theme ("This theme is already active. Re-deploying will restart...") in frontend/src/components/themes/ThemeCard.tsx
- [ ] T098 [P] Prevent duplicate deployments (show "Deployment already in progress" message) in frontend/src/services/deploymentService.ts
- [ ] T099 [P] Keep Deploy Panel visible as modal when user navigates away from Themes page in frontend/src/components/deployment/DeployPanel.tsx
- [ ] T100 [P] Implement sandboxManager for sandboxed iframe deployment in frontend/src/utils/sandboxManager.ts
- [ ] T101 [P] Configure iframe sandbox attributes (allow-scripts, allow-same-origin) and CSP headers in frontend/src/utils/sandboxManager.ts
- [ ] T102 [P] Add ARIA labels for all interactive elements (buttons, dropzone, theme cards) in all component files
- [ ] T103 [P] Implement keyboard navigation for Themes page (Tab, Enter, Escape) in frontend/src/components/themes/ThemesPage.tsx
- [ ] T104 [P] Implement keyboard navigation for Deploy Panel (Tab, Escape to close) in frontend/src/components/deployment/DeployPanel.tsx
- [ ] T105 [P] Add focus management (trap focus in Deploy Panel, restore on close) in frontend/src/components/deployment/DeployPanel.tsx
- [ ] T106 [P] Ensure WCAG AA color contrast for all text and status indicators in all .css files
- [ ] T107 [P] Add screen reader announcements for deployment progress updates in frontend/src/components/deployment/DeploymentSteps.tsx
- [ ] T108 [P] Implement localStorage caching for purchased themes metadata in frontend/src/services/themeService.ts
- [ ] T109 [P] Implement IndexedDB storage for deployment sessions (24-hour retention) in frontend/src/services/deploymentService.ts
- [ ] T110 [P] Implement IndexedDB storage for theme thumbnails in frontend/src/services/themeService.ts
- [ ] T111 [P] Add deployment session cleanup (remove sessions older than 24 hours) in frontend/src/services/deploymentService.ts
- [ ] T112 [P] Limit buildLogs to max 1000 entries to prevent memory bloat in frontend/src/services/deploymentService.ts
- [ ] T113 Code cleanup and refactoring across all theme and deployment components
- [ ] T114 Run quickstart.md validation (verify all implementation steps match quickstart guide)
- [ ] T115 Performance optimization: lazy-load ThemesPage and DeployPanel components
- [ ] T116 Add comprehensive inline comments for complex validation and deployment logic

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (View Themes - P1): Can start after Foundational - No dependencies on other stories
  - US2 (Upload - P2): Can start after Foundational - No dependencies on other stories
  - US3 (Deploy - P1): Can start after Foundational - No dependencies on other stories
  - US4 (Error Recovery - P2): Depends on US3 (Deploy Panel must exist) - Should implement after US3
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - INDEPENDENT
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - INDEPENDENT
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - INDEPENDENT
- **User Story 4 (P2)**: Depends on User Story 3 completion (needs Deploy Panel components) - NOT INDEPENDENT

### Within Each User Story

- Component skeletons and styles marked [P] can run in parallel
- Services and stores must complete before UI integration
- Core implementation before edge cases and error handling

### Parallel Opportunities

- Phase 1 Setup: T003, T004, T005, T006, T007 can run in parallel
- Phase 2 Foundational: T009, T010, T011 can run in parallel after T008
- US1: T018, T019, T020, T021, T022, T023, T024, T025 can run in parallel
- US2: T034, T035 can run in parallel
- US3: T051-T057 (all component skeletons and styles) can run in parallel
- US4: T080, T081, T082 can run in parallel
- Polish: Most tasks (T095-T112) marked [P] can run in parallel

---

## Parallel Example: User Story 3 (Deploy)

```bash
# Launch all component skeletons for User Story 3 together:
Task: "Create DeployPanel component skeleton in frontend/src/components/deployment/DeployPanel.tsx"
Task: "Create DeployPanel styles in frontend/src/components/deployment/DeployPanel.css"
Task: "Create DeploymentSteps component in frontend/src/components/deployment/DeploymentSteps.tsx"
Task: "Create DeploymentSteps styles in frontend/src/components/deployment/DeploymentSteps.css"
Task: "Create TerminalLog component in frontend/src/components/deployment/TerminalLog.tsx"
Task: "Create TerminalLog styles in frontend/src/components/deployment/TerminalLog.css"
Task: "Create ThemeSummary component in frontend/src/components/deployment/ThemeSummary.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 3 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T017) - CRITICAL
3. Complete Phase 3: User Story 1 - View Themes (T018-T033)
4. Complete Phase 5: User Story 3 - Deploy Theme (T051-T079)
5. **STOP and VALIDATE**: Test viewing and deploying themes independently
6. Deploy/demo if ready - **This is the minimum viable product**

**Rationale**: US1 + US3 together provide core value (view + deploy purchased themes). Upload (US2) and error recovery (US4) are enhancements.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (View) → Test independently → Deploy/Demo
3. Add User Story 3 (Deploy) → Test independently → Deploy/Demo (MVP!)
4. Add User Story 2 (Upload) → Test independently → Deploy/Demo
5. Add User Story 4 (Error Recovery) → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (critical path)
2. Once Foundational is done:
   - Developer A: User Story 1 (View Themes)
   - Developer B: User Story 3 (Deploy) - start in parallel with US1
   - Developer C: User Story 2 (Upload) - start in parallel with US1
3. After US3 completes:
   - Any developer: User Story 4 (Error Recovery) - depends on US3
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies, safe to parallelize
- [Story] label maps task to specific user story for traceability
- User Story 4 is NOT independent - it requires User Story 3 Deploy Panel components
- Each user story (except US4) should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- MVP = US1 (View) + US3 (Deploy) = 62 tasks (T001-T033 + T051-T079)
- Full feature = 116 tasks total

---

## Task Count Summary

- **Phase 1 (Setup)**: 7 tasks
- **Phase 2 (Foundational)**: 10 tasks (blocking all stories)
- **Phase 3 (US1 - View Themes)**: 16 tasks
- **Phase 4 (US2 - Upload)**: 17 tasks
- **Phase 5 (US3 - Deploy)**: 29 tasks
- **Phase 6 (US4 - Error Recovery)**: 15 tasks
- **Phase 7 (Polish)**: 22 tasks
- **Total**: 116 tasks

**MVP Scope** (US1 + US3): 62 tasks (Phases 1, 2, 3, 5)
**Full Feature**: 116 tasks (All phases)

**Parallel Opportunities**: 42 tasks marked [P] across all phases
