# Tasks: AI Coding Mode

**Feature**: `003-ai-coding-mode`
**Input**: Design documents from `/specs/003-ai-coding-mode/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are included for critical functionality (accessibility, validation, integration) per spec.md requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5, US6)
- Include exact file paths in descriptions

## Path Conventions

Web application structure (from plan.md):
- Frontend code: `frontend/src/`
- Frontend tests: `frontend/tests/`
- Component path: `frontend/src/components/code/`
- Services path: `frontend/src/services/`
- Store path: `frontend/src/store/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [X] T001 Install Monaco Editor dependencies (@monaco-editor/react@^4.6.0, @types/monaco-editor@^0.44.0)
- [X] T002 [P] Install diff library (diff@^5.1.0, @types/diff@^5.0.0)
- [X] T003 [P] Verify TypeScript and ESLint versions (TypeScript@^5.3.0, ESLint@^8.55.0)
- [X] T004 Create project structure in frontend/src/components/code/ directory
- [X] T005 Create project structure in frontend/src/services/ directory
- [X] T006 Create project structure in frontend/src/store/ directory
- [X] T007 Create project structure in frontend/src/types/ directory
- [X] T008 Create project structure in frontend/tests/components/code/ directory

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T009 Define TypeScript types in frontend/src/types/code.ts (CodePanelState, DiffPreview, CodeOperation, UndoSnapshot, AICodeRequest per data-model.md)
- [X] T010 [P] Create Zustand code store slice in frontend/src/store/codeStore.ts (per state-schema.json)
- [X] T011 [P] Implement diff generator utility in frontend/src/services/diffGenerator.ts (Myers' diff algorithm using diff library)
- [X] T012 [P] Implement code validator service in frontend/src/services/codeValidator.ts (TypeScript + ESLint validation)
- [X] T013 Implement mock AI code service in frontend/src/services/aiCodeService.ts (SSE simulation per research.md)
- [X] T014 Create diff utility helpers in frontend/src/utils/diffUtils.ts (change counting, line extraction)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Generated Code (Priority: P1) 🎯 MVP

**Goal**: Display current page code in read-only Monaco Editor with syntax highlighting and Canvas selection sync

**Independent Test**:
1. Switch to AI Coding Mode
2. Verify Code Panel appears with read-only Monaco Editor
3. Select element in Canvas
4. Verify corresponding code lines highlighted in Code Panel
5. Attempt to type in Code Panel - verify editing is blocked

### Implementation for User Story 1

- [X] T015 [P] [US1] Create CodeViewer component in frontend/src/components/code/CodeViewer.tsx (Monaco Editor wrapper with read-only mode)
- [X] T016 [P] [US1] Create CodeViewer styles in frontend/src/components/code/CodeViewer.css (highlight decorations per constitution)
- [X] T017 [US1] Create CodePanel component in frontend/src/components/code/CodePanel.tsx (main container with CodeViewer integration)
- [X] T018 [US1] Create CodePanel styles in frontend/src/components/code/CodePanel.css (layout, panel visibility)
- [X] T019 [US1] Integrate CodePanel with Dashboard Shell in frontend/src/components/shell/Shell.tsx (add Code Panel to layout)
- [X] T020 [US1] Implement Canvas selection → Code Panel sync in frontend/src/components/code/CodePanel.tsx (update highlightedRanges on selection change - via setSelectedLines action)
- [X] T021 [US1] Add read-only tooltip in frontend/src/components/code/CodeViewer.css (FR-018: show message when user hovers over code panel)

**Checkpoint**: At this point, User Story 1 should be fully functional - Code Panel displays read-only code with syntax highlighting

---

## Phase 4: User Story 2 - Request Code Changes via Chat (Priority: P1)

**Goal**: Enable natural language code change requests through Chat panel, showing operation logs and diff previews with Accept/Reject controls

**Independent Test**:
1. Type "Change button color to blue" in Chat
2. Verify operation log appears with progressive steps
3. Wait for diff preview to appear (~2-3 seconds)
4. Verify Accept/Reject buttons shown
5. Click Accept
6. Verify code updated in Code Panel

### Implementation for User Story 2

- [ ] T022 [P] [US2] Create DiffPreview component in frontend/src/components/code/DiffPreview.tsx (side-by-side diff display with Monaco DiffEditor)
- [ ] T023 [P] [US2] Create DiffPreview styles in frontend/src/components/code/DiffPreview.css (diff colors: green/red/yellow per FR-008)
- [ ] T024 [P] [US2] Create DiffControls component in frontend/src/components/code/DiffControls.tsx (Accept/Reject buttons)
- [ ] T025 [P] [US2] Create DiffControls styles in frontend/src/components/code/DiffControls.css (button styling per constitution)
- [ ] T026 [US2] Extend OperationLog component in frontend/src/components/chat/OperationLog.tsx (add code operation support with step icons)
- [ ] T027 [US2] Implement AI code request handler in frontend/src/services/aiCodeService.ts (requestCodeChange function with SSE callbacks)
- [ ] T028 [US2] Integrate Chat → AI service in frontend/src/components/chat/PromptComposer.tsx (detect code change requests and route to aiCodeService)
- [ ] T029 [US2] Implement diff acceptance logic in frontend/src/store/codeStore.ts (acceptDiff action updates CodePanelState.currentCode)
- [ ] T030 [US2] Implement diff rejection logic in frontend/src/store/codeStore.ts (rejectDiff action clears activeDiffId)
- [ ] T031 [US2] Add plain-language summary generation in frontend/src/services/diffGenerator.ts (FR-019: explain what changed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can view code AND request changes via Chat

---

## Phase 5: User Story 3 - Track Code Operations (Priority: P2)

**Goal**: Show progressive operation logs with status indicators during AI code generation

**Independent Test**:
1. Submit code change request in Chat
2. Verify operation log shows status "Running"
3. Observe step messages updating: "Analyzing request...", "Generating code...", "Validating changes..."
4. Verify final status shows "Success" or "Error"
5. Check timestamps are displayed

### Implementation for User Story 3

- [ ] T032 [P] [US3] Enhance OperationLog with step history display in frontend/src/components/chat/OperationLog.tsx (show all steps with timestamps)
- [ ] T033 [P] [US3] Add operation status icons in frontend/src/components/chat/OperationLog.tsx (analyze, generate, validate, check, error icons)
- [ ] T034 [US3] Implement operation queue management in frontend/src/store/codeStore.ts (FIFO queue, max 10 concurrent per FR-020)
- [ ] T035 [US3] Add operation progress callbacks in frontend/src/services/aiCodeService.ts (onProgress updates with step messages)
- [ ] T036 [US3] Implement error handling in frontend/src/services/aiCodeService.ts (user-friendly error messages per FR-015)

**Checkpoint**: All user stories 1-3 should now be independently functional - operation transparency complete

---

## Phase 6: User Story 4 - Preview Changes Before Applying (Priority: P2)

**Goal**: Display detailed diff preview with line-by-line comparison, change indicators, and tooltips before code changes are applied

**Independent Test**:
1. Request code change via Chat
2. Wait for diff preview to appear
3. Verify old code shown on left, new code on right
4. Verify changed lines highlighted (green=add, red=delete, yellow=modify)
5. Hover over changed line - verify tooltip shows plain-language explanation
6. Reject change - verify diff preview disappears

### Implementation for User Story 4

- [ ] T037 [P] [US4] Implement Monaco DiffEditor in frontend/src/components/code/DiffPreview.tsx (side-by-side comparison)
- [ ] T038 [P] [US4] Add diff change indicators in frontend/src/components/code/DiffPreview.css (color-coded backgrounds per FR-008)
- [ ] T039 [US4] Implement hover tooltips in frontend/src/components/code/DiffPreview.tsx (plain-language explanations per FR-019)
- [ ] T040 [US4] Add diff validation check in frontend/src/store/codeStore.ts (only show diff if isValid: true per data-model.md)
- [ ] T041 [US4] Integrate DiffPreview with Chat panel in frontend/src/components/chat/ChatPanel.tsx (show diff when operation completes)

**Checkpoint**: Diff preview functionality complete - users can safely review changes before accepting

---

## Phase 7: User Story 5 - Maintain Canvas and Inspector Sync (Priority: P2)

**Goal**: Ensure Canvas visually updates and Inspector shows new property values immediately after code changes are accepted

**Independent Test**:
1. Accept a code change that modifies visual property (e.g., color)
2. Verify Canvas updates within 200ms (no manual refresh)
3. Verify Inspector shows new property values
4. Select different element
5. Verify Canvas and Inspector remain in sync

### Implementation for User Story 5

- [ ] T042 [US5] Implement Code Panel → Canvas sync in frontend/src/components/dashboard/Canvas.tsx (subscribe to CodePanelState.currentCode changes)
- [ ] T043 [US5] Implement Code Panel → Inspector sync in frontend/src/components/dashboard/Inspector.tsx (update property display on code change)
- [ ] T044 [US5] Add debounced Canvas selection handler in frontend/src/components/dashboard/Canvas.tsx (200ms debounce per performance goals)
- [ ] T045 [US5] Implement cross-panel state subscription in frontend/src/store/codeStore.ts (ensure sync within 200ms per SC-004)
- [ ] T046 [US5] Add sync failure detection in frontend/src/components/code/CodePanel.tsx (show error notification per edge case handling)

**Checkpoint**: Cross-panel synchronization complete - Code Panel, Canvas, and Inspector update in real-time

---

## Phase 8: User Story 6 - Undo AI Code Changes (Priority: P3)

**Goal**: Allow users to revert the most recent AI code change with undo/redo functionality

**Independent Test**:
1. Apply a code change (change button color)
2. Verify change reflected in Code Panel, Canvas, and Inspector
3. Click "Undo" button
4. Verify code reverts to previous state
5. Verify Canvas and Inspector also revert
6. Click "Redo" (if applicable)
7. Verify change re-applied

### Implementation for User Story 6

- [ ] T047 [P] [US6] Create undo stack manager in frontend/src/store/undoStack.ts (manage 50 snapshots per data-model.md)
- [ ] T048 [P] [US6] Implement localStorage persistence in frontend/src/store/undoStack.ts (saveUndoSnapshot, getUndoStack per research.md)
- [ ] T049 [US6] Add Undo/Redo actions in frontend/src/store/codeStore.ts (performUndo, performRedo per data-model.md)
- [ ] T050 [US6] Create snapshot on diff acceptance in frontend/src/store/codeStore.ts (capture codeBefore/codeAfter per UndoSnapshot schema)
- [ ] T051 [US6] Add Undo/Redo buttons in frontend/src/components/code/CodePanel.tsx (only enabled when canUndo/canRedo is true)
- [ ] T052 [US6] Implement stack cleanup in frontend/src/store/undoStack.ts (remove oldest snapshots beyond 50 items)

**Checkpoint**: All user stories 1-6 should now be independently functional - full AI Coding Mode feature complete

---

## Phase 9: Testing & Validation

**Purpose**: Comprehensive testing to validate all functional requirements and success criteria

- [ ] T053 [P] Create CodePanel unit tests in frontend/tests/components/code/CodePanel.test.tsx (visibility, read-only enforcement, selection sync)
- [ ] T054 [P] Create CodeViewer unit tests in frontend/tests/components/code/CodeViewer.test.tsx (Monaco Editor initialization, syntax highlighting)
- [ ] T055 [P] Create DiffPreview unit tests in frontend/tests/components/code/DiffPreview.test.tsx (side-by-side display, change indicators)
- [ ] T056 [P] Create DiffControls unit tests in frontend/tests/components/code/DiffControls.test.tsx (Accept/Reject button behavior)
- [ ] T057 [P] Create aiCodeService tests in frontend/tests/services/aiCodeService.test.ts (SSE simulation, progress callbacks, error handling)
- [ ] T058 [P] Create codeValidator tests in frontend/tests/services/codeValidator.test.ts (TypeScript syntax validation, ESLint checks)
- [ ] T059 [P] Create diffGenerator tests in frontend/tests/services/diffGenerator.test.ts (Myers' diff accuracy, change detection)
- [ ] T060 [P] Create accessibility tests in frontend/tests/components/code/accessibility.test.tsx (WCAG AA compliance with jest-axe)
- [ ] T061 Create integration test for code-chat flow in frontend/tests/components/integration/code-chat-integration.test.tsx (end-to-end: Chat request → Operation log → Diff → Accept → Sync)
- [ ] T062 Create integration test for cross-panel sync in frontend/tests/components/integration/code-sync.test.tsx (Code Panel ↔ Canvas ↔ Inspector synchronization)

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and production readiness

- [ ] T063 [P] Performance optimization: Lazy-load Monaco Editor in frontend/src/components/code/CodePanel.tsx (code-splitting with React.lazy)
- [ ] T064 [P] Performance optimization: Implement syntax highlighting cache in frontend/src/components/code/CodeViewer.tsx (reduce re-renders)
- [ ] T065 [P] Security: Add code injection protection in frontend/src/services/codeValidator.ts (sanitize generated code)
- [ ] T066 [P] Security: Validate file paths in frontend/src/store/codeStore.ts (prevent path traversal attacks)
- [ ] T067 [P] Error handling: Add network failure recovery in frontend/src/services/aiCodeService.ts (retry logic with exponential backoff)
- [ ] T068 [P] Error handling: Add graceful degradation in frontend/src/components/code/CodePanel.tsx (fallback to Prism.js if Monaco fails)
- [ ] T069 Documentation: Update quickstart.md with production deployment checklist
- [ ] T070 Documentation: Add inline code comments for complex diff logic in frontend/src/services/diffGenerator.ts
- [ ] T071 Code cleanup: Remove mock AI service placeholders and add production API integration notes in frontend/src/services/aiCodeService.ts
- [ ] T072 [P] Accessibility: Add keyboard shortcuts for Undo/Redo in frontend/src/components/code/CodePanel.tsx (Cmd+Z / Cmd+Shift+Z)
- [ ] T073 [P] Accessibility: Ensure all buttons have ARIA labels in frontend/src/components/code/DiffControls.tsx
- [ ] T074 Run quickstart.md validation: Follow developer setup guide and verify all steps work

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P1 → P2 → P2 → P2 → P3)
- **Testing (Phase 9)**: Can start in parallel with user story implementation (TDD approach)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - **No dependencies on other stories**
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - **No dependencies on other stories** (but builds on US1 for Code Panel display)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Integrates with US2 operation logs
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Extends US2 diff preview display
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Requires US1 CodePanel and US2 acceptance logic
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - Requires US2 diff acceptance to create snapshots

### Within Each User Story

- Components before integration
- Core functionality before enhancements
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup (Phase 1)**: T002 and T003 can run in parallel
- **Foundational (Phase 2)**: T010, T011, T012 can run in parallel (different files)
- **User Story 1**: T015 and T016 can run in parallel (CodeViewer component and CSS)
- **User Story 2**: T022, T023, T024, T025 can run in parallel (DiffPreview, DiffControls components and CSS)
- **User Story 3**: T032 and T033 can run in parallel (OperationLog enhancements)
- **User Story 4**: T037 and T038 can run in parallel (DiffEditor and CSS)
- **User Story 6**: T047 and T048 can run in parallel (undo stack manager and localStorage)
- **Testing (Phase 9)**: All tests marked [P] (T053-T060) can run in parallel
- **Polish (Phase 10)**: Most tasks marked [P] (T063-T068, T072-T073) can run in parallel
- **Different user stories can be worked on in parallel by different team members**

---

## Parallel Example: User Story 1

```bash
# Launch all parallel tasks for User Story 1 together:
Task T015: "Create CodeViewer component in frontend/src/components/code/CodeViewer.tsx"
Task T016: "Create CodeViewer styles in frontend/src/components/code/CodeViewer.css"

# Then sequentially:
Task T017: "Create CodePanel component" (depends on CodeViewer)
Task T018: "Create CodePanel styles"
Task T019: "Integrate CodePanel with Dashboard Shell" (depends on CodePanel)
Task T020: "Implement Canvas selection sync"
Task T021: "Add read-only tooltip"
```

---

## Parallel Example: User Story 2

```bash
# Launch all parallel tasks for User Story 2 together:
Task T022: "Create DiffPreview component in frontend/src/components/code/DiffPreview.tsx"
Task T023: "Create DiffPreview styles in frontend/src/components/code/DiffPreview.css"
Task T024: "Create DiffControls component in frontend/src/components/code/DiffControls.tsx"
Task T025: "Create DiffControls styles in frontend/src/components/code/DiffControls.css"

# Then sequentially:
Task T026: "Extend OperationLog component"
Task T027: "Implement AI code request handler"
Task T028: "Integrate Chat → AI service"
Task T029: "Implement diff acceptance logic"
Task T030: "Implement diff rejection logic"
Task T031: "Add plain-language summary generation"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup → Dependencies installed
2. Complete Phase 2: Foundational → Core services ready (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 → Code Panel displays read-only code
4. Complete Phase 4: User Story 2 → AI code changes work via Chat
5. **STOP and VALIDATE**: Test US1 and US2 independently
6. Deploy/demo MVP (read-only code view + AI code changes)

**Estimated MVP Scope**: 31 tasks (T001-T031)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (T001-T014)
2. Add User Story 1 → Test independently → Deploy/Demo (T015-T021)
3. Add User Story 2 → Test independently → Deploy/Demo (T022-T031) ← **MVP COMPLETE**
4. Add User Story 3 → Test independently → Deploy/Demo (T032-T036)
5. Add User Story 4 → Test independently → Deploy/Demo (T037-T041)
6. Add User Story 5 → Test independently → Deploy/Demo (T042-T046)
7. Add User Story 6 → Test independently → Deploy/Demo (T047-T052)
8. Add Testing → Validate all stories (T053-T062)
9. Add Polish → Production ready (T063-T074)

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers (after Foundational phase complete):

1. **Team completes Setup + Foundational together** (T001-T014)
2. **Once Foundational is done**:
   - Developer A: User Story 1 (T015-T021)
   - Developer B: User Story 2 (T022-T031)
   - Developer C: User Story 3 (T032-T036)
   - Developer D: User Story 4 (T037-T041)
3. **Stories complete and integrate independently**
4. **Final integration testing** (T061-T062)

---

## Success Criteria Validation

Each user story maps to success criteria from spec.md:

- **US1**: SC-001 (non-technical users can view code)
- **US2**: SC-002 (request to acceptance <60s), SC-003 (95% valid code), SC-009 (90% success rate)
- **US3**: SC-005 (real-time progress updates <500ms), SC-007 (understandable error messages)
- **US4**: SC-006 (acceptance rate >80%)
- **US5**: SC-004 (sync <200ms)
- **US6**: SC-010 (undo within 3 clicks)

Overall: SC-008 (handle 5 concurrent requests)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently
- Monaco Editor is lazy-loaded for performance (T063)
- Mock AI service used initially; replace with production API later (T071)
- Undo stack persists to localStorage (max 50 snapshots per data-model.md)
- All code changes validated before preview (TypeScript + ESLint per T012)
- WCAG AA accessibility maintained throughout (T060, T072-T073)
- Constitutional requirements enforced: read-only Code Panel (T015, T021), diff previews before acceptance (T022-T025), operation transparency (T026, T032-T036)

**Total Tasks**: 74
**MVP Tasks (US1 + US2)**: 31 (42% of total)
**Parallel Opportunities**: 31 tasks marked [P] (42% parallelizable)
**Independent Test Criteria**: Defined for all 6 user stories
