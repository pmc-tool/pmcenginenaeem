---
description: "Task list for AI Chat Panel & Command Center implementation"
---

# Tasks: AI Chat Panel & Command Center

**Feature**: 002-chat-panel
**Branch**: `002-chat-panel`
**Input**: Design documents from `/specs/002-chat-panel/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not explicitly requested in spec - component tests only (no TDD)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Web application structure (from plan.md):
- **Frontend**: `frontend/src/` (components, store, services, types, utils)
- **Tests**: `frontend/tests/` (components, integration)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and chat panel foundation

- [X] T001 Install date-fns dependency in frontend/package.json
- [X] T002 [P] Create type definitions in frontend/src/types/chat.ts
- [X] T003 [P] Create utility function in frontend/src/utils/formatTimestamp.ts

**Checkpoint**: Type system and utilities ready for component development

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core state management and mock service that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Extend dashboardStore with chatState slice in frontend/src/store/dashboardStore.ts
- [X] T005 Add toggleChat action to dashboardStore in frontend/src/store/dashboardStore.ts
- [X] T006 Add addMessage action to dashboardStore in frontend/src/store/dashboardStore.ts
- [X] T007 Add setScope action to dashboardStore in frontend/src/store/dashboardStore.ts
- [X] T008 Add setBusy action to dashboardStore in frontend/src/store/dashboardStore.ts
- [X] T009 Add clearMessages action to dashboardStore in frontend/src/store/dashboardStore.ts
- [X] T010 Add setChatPanelWidth action to dashboardStore in frontend/src/store/dashboardStore.ts
- [X] T011 [P] Implement mock AI response handler in frontend/src/services/mockAI.ts (generateMockResponse function)
- [X] T012 [P] Implement mock operation simulator in frontend/src/services/mockAI.ts (simulateOperation function)
- [X] T013 [P] Implement action keyword detector in frontend/src/services/mockAI.ts (detectAction function)
- [X] T014 [P] Implement log message formatter in frontend/src/services/mockAI.ts (formatLogMessage function)

**Checkpoint**: Foundation ready - state management working, mock AI responding, user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Open Chat and Send Basic Message (Priority: P1) 🎯 MVP

**Goal**: Enable users to open chat panel, see context, send messages, and receive AI responses

**Independent Test**:
1. Click Chat icon in left rail → panel slides in from right
2. Type message in composer → press Enter → user message appears
3. Wait 2-3 seconds → AI response appears with timestamp
4. Click close button → panel slides out

**Why this is MVP**: This establishes the core communication loop between user and AI. Without this foundation, no other chat features (scoping, quick actions, history) can exist.

### Implementation for User Story 1

**Core Components (build in order):**

- [X] T015 [P] [US1] Create MessageBubble component in frontend/src/components/chat/MessageBubble.tsx
- [X] T016 [P] [US1] Add MessageBubble styles in frontend/src/components/chat/MessageBubble.css
- [X] T017 [US1] Create MessageList component in frontend/src/components/chat/MessageList.tsx (depends on T015)
- [X] T018 [US1] Add MessageList styles with auto-scroll behavior in frontend/src/components/chat/MessageList.css
- [X] T019 [P] [US1] Create PromptComposer component in frontend/src/components/chat/PromptComposer.tsx
- [X] T020 [P] [US1] Add PromptComposer styles in frontend/src/components/chat/PromptComposer.css
- [X] T021 [P] [US1] Create ChatHeader component in frontend/src/components/chat/ChatHeader.tsx
- [X] T022 [P] [US1] Add ChatHeader styles in frontend/src/components/chat/ChatHeader.css
- [X] T023 [US1] Create ChatPanel container component in frontend/src/components/chat/ChatPanel.tsx (assembles T015-T022)
- [X] T024 [US1] Add ChatPanel styles with 250ms slide-in animation in frontend/src/components/chat/ChatPanel.css

**Shell Integration:**

- [X] T025 [US1] Add Chat icon to LeftRail in frontend/src/components/shell/LeftRail.tsx
- [X] T026 [US1] Integrate ChatPanel into Shell component in frontend/src/components/shell/Shell.tsx
- [X] T027 [US1] Add conditional rendering logic for chat panel in preview mode in frontend/src/components/shell/Shell.tsx

**Component Tests:**

- [ ] T028 [P] [US1] Write component tests for MessageBubble in frontend/tests/components/chat/MessageBubble.test.tsx
- [ ] T029 [P] [US1] Write component tests for MessageList in frontend/tests/components/chat/MessageList.test.tsx
- [ ] T030 [P] [US1] Write component tests for PromptComposer in frontend/tests/components/chat/PromptComposer.test.tsx
- [ ] T031 [P] [US1] Write component tests for ChatPanel in frontend/tests/components/chat/ChatPanel.test.tsx

**E2E Test:**

- [ ] T032 [US1] Write E2E test for complete chat workflow in frontend/tests/integration/chat-workflow.test.tsx

**Checkpoint**: At this point, users can open chat, send messages, receive AI responses, and close chat. This is a fully functional MVP.

---

## Phase 4: User Story 2 - Use Scoped Commands with Operation Logging (Priority: P2)

**Goal**: Enable users to select AI operation scope (Field/Section/Page/Feature) and see transparent operation logs

**Independent Test**:
1. Open chat → click scope dropdown → select "Page" → send command
2. AI response shows "SCOPE: Page" badge
3. Log messages appear: "Analyzing About page...", "Finding content sections...", "Updated 3 sections"
4. Click "View change" link → canvas scrolls to section, inspector highlights fields

**Why after MVP**: Builds on US1's communication by adding scope control and transparency. Requires US1's message infrastructure to exist first.

### Implementation for User Story 2

**Scope Control:**

- [X] T033 [P] [US2] Create ScopeSelector dropdown component in frontend/src/components/chat/ScopeSelector.tsx
- [X] T034 [P] [US2] Add ScopeSelector styles with tooltip in frontend/src/components/chat/ScopeSelector.css
- [X] T035 [US2] Integrate ScopeSelector into PromptComposer in frontend/src/components/chat/PromptComposer.tsx

**Operation Logging:**

- [X] T036 [P] [US2] Create OperationLog component in frontend/src/components/chat/OperationLog.tsx
- [X] T037 [P] [US2] Add OperationLog styles with "View change" links in frontend/src/components/chat/OperationLog.css
- [X] T038 [US2] Integrate OperationLog rendering into MessageList in frontend/src/components/chat/MessageList.tsx

**Context Synchronization:**

- [X] T039 [US2] Add context chip display to PromptComposer in frontend/src/components/chat/PromptComposer.tsx
- [X] T040 [US2] Implement 100ms debounced context sync in ChatPanel in frontend/src/components/chat/ChatPanel.tsx
- [X] T041 [US2] Add "View change" click handler with canvas/inspector focus in frontend/src/components/chat/OperationLog.tsx

**Scope Badges:**

- [X] T042 [US2] Add scope badge rendering to MessageBubble for AI messages in frontend/src/components/chat/MessageBubble.tsx
- [X] T043 [US2] Add scope badge styles in frontend/src/components/chat/MessageBubble.css

**Mock AI Enhancement:**

- [X] T044 [US2] Enhance mock AI to generate progressive operation logs in frontend/src/services/mockAI.ts

**Component Tests:**

- [X] T045 [P] [US2] Write component tests for ScopeSelector in frontend/tests/components/chat/ScopeSelector.test.tsx
- [X] T046 [P] [US2] Write component tests for OperationLog in frontend/tests/components/chat/OperationLog.test.tsx
- [X] T047 [US2] Write integration test for scope selection workflow in frontend/tests/integration/chat-workflow.test.tsx

**Checkpoint**: Users can now select scope levels and see transparent operation logs showing exactly what AI changed. This builds trust through transparency.

---

## Phase 5: User Story 3 - Use Quick Action Chips for Common Tasks (Priority: P3)

**Goal**: Enable users to quickly execute common AI tasks with one click using contextual action chips

**Independent Test**:
1. Open chat with section selected → see chips: "Rewrite section", "Improve headline", "Generate FAQs"
2. Click "Improve headline" chip → composer fills with prompt, chip highlights
3. Press Enter → AI executes action on headline field only
4. Type custom message → chip deselects, custom message sent instead

**Why after US1+US2**: Requires chat infrastructure (US1) and scope control (US2) to work. Quick actions are shortcuts for scoped commands.

### Implementation for User Story 3

**Quick Action Chips:**

- [X] T048 [P] [US3] Create QuickActionChips component in frontend/src/components/chat/QuickActionChips.tsx
- [X] T049 [P] [US3] Add QuickActionChips styles with hover states in frontend/src/components/chat/QuickActionChips.css
- [X] T050 [US3] Integrate QuickActionChips into PromptComposer in frontend/src/components/chat/PromptComposer.tsx

**Chip Logic:**

- [X] T051 [US3] Implement contextual chip filtering based on selected element type in frontend/src/components/chat/QuickActionChips.tsx
- [X] T052 [US3] Add chip click handler to fill composer textarea in frontend/src/components/chat/PromptComposer.tsx
- [X] T053 [US3] Add chip deselection on manual text edit in frontend/src/components/chat/PromptComposer.tsx

**Mock AI Enhancement:**

- [X] T054 [US3] Add keyword detection for quick action prompts in frontend/src/services/mockAI.ts

**Component Tests:**

- [X] T055 [P] [US3] Write component tests for QuickActionChips in frontend/tests/components/chat/QuickActionChips.test.tsx
- [X] T056 [US3] Write integration test for quick action workflow in frontend/tests/integration/chat-workflow.test.tsx

**Checkpoint**: Users can now use one-click shortcuts for common tasks, reducing friction and discovering AI capabilities.

---

## Phase 6: User Story 4 - Expand/Collapse Long Responses and Review History (Priority: P4)

**Goal**: Enable users to manage long AI responses and clear conversation history

**Independent Test**:
1. Trigger long AI response (15+ lines) → see first 5 lines with "Show more" button
2. Click "Show more" → full message expands, button changes to "Show less"
3. Scroll message history → see timestamps ("2 hours ago", "Yesterday at 3:15 PM")
4. Click header overflow menu (three dots) → select "Clear" → confirmation dialog appears
5. Confirm clear → all messages removed, composer resets

**Why after US1-US3**: Polish feature that improves usability during extended sessions. Not critical for core functionality.

### Implementation for User Story 4

**Message Collapse/Expand:**

- [X] T057 [US4] Add message length detection to MessageBubble in frontend/src/components/chat/MessageBubble.tsx
- [X] T058 [US4] Add collapse/expand toggle logic to MessageBubble in frontend/src/components/chat/MessageBubble.tsx
- [X] T059 [US4] Add "Show more"/"Show less" button styles in frontend/src/components/chat/MessageBubble.css

**Clear Conversation:**

- [X] T060 [US4] Add overflow menu (three dots) to ChatHeader in frontend/src/components/chat/ChatHeader.tsx
- [X] T061 [US4] Add "Clear conversation" menu item in frontend/src/components/chat/ChatHeader.tsx
- [X] T062 [US4] Implement confirmation dialog using Radix UI Dialog primitive in frontend/src/components/chat/ChatHeader.tsx
- [X] T063 [US4] Wire up clearMessages action on confirmation in frontend/src/components/chat/ChatHeader.tsx

**Relative Timestamps:**

- [X] T064 [US4] Update formatTimestamp utility to handle 7+ day old messages in frontend/src/utils/formatTimestamp.ts
- [X] T065 [US4] Update MessageBubble to show relative timestamps in frontend/src/components/chat/MessageBubble.tsx

**Component Tests:**

- [X] T066 [P] [US4] Write tests for message collapse/expand in frontend/tests/components/chat/MessageBubble.test.tsx
- [X] T067 [P] [US4] Write tests for clear conversation flow in frontend/tests/components/chat/ChatHeader.test.tsx
- [X] T068 [US4] Write integration test for long message handling in frontend/tests/integration/chat-workflow.test.tsx

**Checkpoint**: Chat panel now scales gracefully for extended sessions with 100+ messages, providing full conversation management.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, accessibility validation, and production readiness

**Accessibility:**

- [ ] T069 [P] Write accessibility tests for keyboard navigation in frontend/tests/components/chat/accessibility.test.tsx
- [ ] T070 [P] Add ARIA labels and roles per FR-051 through FR-059 in frontend/src/components/chat/ChatPanel.tsx
- [ ] T071 [P] Add aria-live region for screen reader announcements in frontend/src/components/chat/MessageList.tsx
- [ ] T072 [P] Implement focus management on panel open/close in frontend/src/components/chat/ChatPanel.tsx
- [ ] T073 Run vitest-axe validation on all chat components

**Resize Handle:**

- [ ] T074 Add ResizeHandle to chat panel left edge in frontend/src/components/chat/ChatPanel.tsx
- [ ] T075 Implement width constraints (360-600px) in ChatPanel resize logic in frontend/src/components/chat/ChatPanel.tsx
- [ ] T076 Persist panel width to chatState.panelWidth in frontend/src/components/chat/ChatPanel.tsx

**Performance:**

- [ ] T077 Test message list performance with 150+ messages
- [ ] T078 Verify 250ms slide-in animation timing
- [ ] T079 Verify 100ms context chip sync timing
- [ ] T080 Test smooth scrolling with 100+ messages

**Edge Cases:**

- [ ] T081 Handle zero AI credits state (disable composer per FR-035) in frontend/src/components/chat/PromptComposer.tsx
- [ ] T082 Handle low AI credits warning (<50) with amber color per FR-034 in frontend/src/components/chat/PromptComposer.tsx
- [ ] T083 Handle network failure with reassuring error message per FR-027 in frontend/src/services/mockAI.ts
- [ ] T084 Handle chat close while operation in progress (continue in background) in frontend/src/components/chat/ChatPanel.tsx
- [ ] T085 Handle preview mode auto-close per Edge Cases in frontend/src/components/shell/Shell.tsx

**Code Quality:**

- [ ] T086 [P] Add JSDoc comments to all public component props
- [ ] T087 [P] Ensure all components follow constitutional color palette (#EA2724, grays)
- [ ] T088 [P] Verify all focus rings use 2px solid #EA2724 per FR-058
- [ ] T089 Run ESLint and fix any warnings
- [ ] T090 Run TypeScript strict mode check with zero errors

**Documentation:**

- [ ] T091 [P] Update quickstart.md with any implementation learnings
- [ ] T092 [P] Add inline code comments for complex logic (debouncing, context sync)
- [ ] T093 Create demo screenshots for PR (open, send, scope, chips, logs, close)

**Final Validation:**

- [ ] T094 Run full test suite: npm run test && npm run test:e2e
- [ ] T095 Test on Chrome, Firefox, Safari per constitutional browser requirements
- [ ] T096 Validate all 12 success criteria from spec.md
- [ ] T097 Verify all 65 functional requirements from spec.md
- [ ] T098 Run quickstart.md validation workflow

**Checkpoint**: Feature is production-ready, accessible, performant, and fully validated against spec.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately (3 tasks, all parallelizable)
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories (14 tasks, 7 parallel opportunities)
- **User Story 1 (Phase 3)**: Depends on Foundational completion (18 tasks, 10 parallel opportunities) - **MVP DELIVERY**
- **User Story 2 (Phase 4)**: Depends on Foundational + US1 completion (15 tasks, 7 parallel opportunities)
- **User Story 3 (Phase 5)**: Depends on Foundational + US1 + US2 completion (9 tasks, 4 parallel opportunities)
- **User Story 4 (Phase 6)**: Depends on Foundational + US1 completion (US2/US3 not required) (12 tasks, 4 parallel opportunities)
- **Polish (Phase 7)**: Depends on all desired user stories being complete (30 tasks, 12 parallel opportunities)

### User Story Dependencies

- **User Story 1 (P1) - FOUNDATIONAL**: Must complete first - all other stories build on this
  - Provides: ChatPanel, MessageList, MessageBubble, PromptComposer, ChatHeader components
  - Provides: Basic send/receive message flow
  - Provides: Shell integration (Chat icon, panel rendering)

- **User Story 2 (P2)**: Depends on US1
  - Adds: ScopeSelector, OperationLog components
  - Extends: PromptComposer (scope control), MessageBubble (badges), MessageList (logs)
  - Independent test: Can verify scoping works without US3/US4

- **User Story 3 (P3)**: Depends on US1 + US2
  - Adds: QuickActionChips component
  - Extends: PromptComposer (chip integration)
  - Independent test: Can verify chips work without US4

- **User Story 4 (P4)**: Depends on US1 only (US2/US3 not required)
  - Extends: MessageBubble (collapse/expand), ChatHeader (overflow menu), formatTimestamp utility
  - Independent test: Can verify history management without scoping or chips

### Within Each User Story

1. **Setup & Foundational (Phases 1-2)**: Complete in order, no user story work until done
2. **User Story 1 (Phase 3)**: Core components → Shell integration → Tests
   - Build components first (T015-T024)
   - Integrate into shell (T025-T027)
   - Write tests (T028-T032)
3. **User Story 2 (Phase 4)**: New components → Integration → Enhancement → Tests
   - ScopeSelector + OperationLog components (T033-T038)
   - Context sync and badges (T039-T043)
   - Mock AI enhancement (T044)
   - Tests (T045-T047)
4. **User Story 3 (Phase 5)**: New component → Integration → Logic → Tests
   - QuickActionChips component (T048-T050)
   - Chip interaction logic (T051-T053)
   - Mock AI enhancement (T054)
   - Tests (T055-T056)
5. **User Story 4 (Phase 6)**: Extend existing → Clear flow → Tests
   - Collapse/expand (T057-T059)
   - Clear conversation (T060-T063)
   - Timestamps (T064-T065)
   - Tests (T066-T068)
6. **Polish (Phase 7)**: Accessibility → Resize → Performance → Edge cases → Quality → Docs

### Parallel Opportunities

**Within Foundational (Phase 2):**
- T011-T014 (all mock AI functions) can run in parallel

**Within User Story 1 (Phase 3):**
- T015-T016 (MessageBubble), T019-T020 (PromptComposer), T021-T022 (ChatHeader) can run in parallel
- T028-T031 (all component tests) can run in parallel

**Within User Story 2 (Phase 4):**
- T033-T034 (ScopeSelector), T036-T037 (OperationLog) can run in parallel
- T045-T046 (component tests) can run in parallel

**Within User Story 3 (Phase 5):**
- T048-T049 (QuickActionChips component + styles) can run in parallel

**Within User Story 4 (Phase 6):**
- T066-T067 (component tests) can run in parallel

**Within Polish (Phase 7):**
- T069-T072 (all accessibility tasks) can run in parallel
- T086-T088 (code quality tasks) can run in parallel
- T091-T093 (documentation tasks) can run in parallel

**Cross-Story Parallelization:**
- Once US1 is complete, US2 and US4 can proceed in parallel (US4 doesn't need US2)
- US3 must wait for US2 to complete

---

## Parallel Example: User Story 1 (MVP)

After completing Foundational phase, launch these tasks together:

```bash
# Core components (different files, no dependencies):
Task T015: "Create MessageBubble component in frontend/src/components/chat/MessageBubble.tsx"
Task T016: "Add MessageBubble styles in frontend/src/components/chat/MessageBubble.css"
Task T019: "Create PromptComposer component in frontend/src/components/chat/PromptComposer.tsx"
Task T020: "Add PromptComposer styles in frontend/src/components/chat/PromptComposer.css"
Task T021: "Create ChatHeader component in frontend/src/components/chat/ChatHeader.tsx"
Task T022: "Add ChatHeader styles in frontend/src/components/chat/ChatHeader.css"

# After core components complete, launch tests together:
Task T028: "Write component tests for MessageBubble"
Task T029: "Write component tests for MessageList"
Task T030: "Write component tests for PromptComposer"
Task T031: "Write component tests for ChatPanel"
```

---

## Parallel Example: User Story 2 (Scoped Commands)

After completing User Story 1, launch these tasks together:

```bash
# New components (different files):
Task T033: "Create ScopeSelector dropdown component"
Task T034: "Add ScopeSelector styles"
Task T036: "Create OperationLog component"
Task T037: "Add OperationLog styles"

# After components complete, launch tests together:
Task T045: "Write component tests for ScopeSelector"
Task T046: "Write component tests for OperationLog"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) ✅ RECOMMENDED

**Goal**: Ship working chat in ~18 tasks

1. **Phase 1: Setup** (3 tasks, ~1 hour)
   - Install date-fns
   - Create types
   - Create utility function

2. **Phase 2: Foundational** (14 tasks, ~4 hours)
   - Extend dashboardStore (7 actions)
   - Implement mock AI service (4 functions)
   - **Validate**: Mock AI responds to test input

3. **Phase 3: User Story 1** (18 tasks, ~8 hours)
   - Build 5 core components
   - Integrate into shell
   - Write component + E2E tests
   - **Validate**: Can open chat, send message, receive AI response

4. **STOP and DEPLOY MVP**: Users can interact with AI through chat panel

**Total MVP**: 35 tasks, ~13 hours of focused development

### Incremental Delivery (Add Stories Sequentially)

After MVP is deployed and validated:

1. **Add User Story 2** (15 tasks, ~4 hours)
   - Adds: Scope control and operation logging
   - **Validate**: Users can select scope and see transparent logs
   - **Deploy**: Enhanced trust through transparency

2. **Add User Story 3** (9 tasks, ~2 hours)
   - Adds: Quick action chips for common tasks
   - **Validate**: Users can execute one-click shortcuts
   - **Deploy**: Reduced friction for repeat workflows

3. **Add User Story 4** (12 tasks, ~3 hours)
   - Adds: Message management (collapse, clear)
   - **Validate**: Chat scales for extended sessions
   - **Deploy**: Production-ready conversation management

4. **Polish & Ship** (30 tasks, ~6 hours)
   - Full accessibility validation
   - Performance testing
   - Edge case handling
   - **Deploy**: Feature-complete, production-hardened

**Total with all stories**: 98 tasks, ~28 hours

### Parallel Team Strategy

With 3 developers after Foundational phase completes:

1. **Week 1**: Team completes Setup + Foundational together (Phases 1-2)
2. **Week 2**: Parallel story development
   - **Developer A**: User Story 1 (MVP) - 18 tasks
   - **Developer B**: User Story 2 (after A completes US1) - 15 tasks
   - **Developer C**: User Story 4 (after A completes US1) - 12 tasks
3. **Week 3**:
   - **Developer B**: User Story 3 (depends on US1+US2) - 9 tasks
   - **All**: Polish phase together - 30 tasks
4. **Week 4**: Final validation and deployment

**Total team time**: ~4 weeks with 3 developers

---

## Notes

- **[P] tasks**: Different files, no dependencies - safe to parallelize
- **[Story] label**: Maps task to specific user story for traceability
- **MVP = User Story 1**: Delivers core value (chat communication loop)
- **Each user story independently testable**: Validate before proceeding
- **Commit strategy**: Commit after each task or logical component group
- **Test early**: Run component tests as you build, E2E tests after integration
- **Constitutional compliance**: All tasks follow plan.md constitutional requirements
- **Avoid**: Working on same file simultaneously, blocking other developers, cross-story dependencies that break independence

---

## Task Summary

**Total Tasks**: 98
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 14 tasks
- Phase 3 (US1 - MVP): 18 tasks ✅ **STOP HERE FOR MVP**
- Phase 4 (US2): 15 tasks
- Phase 5 (US3): 9 tasks
- Phase 6 (US4): 12 tasks
- Phase 7 (Polish): 30 tasks (includes 3 tasks marked optional/nice-to-have)

**Parallel Opportunities**: 40 tasks marked [P] can run concurrently

**MVP Scope**: Phases 1-3 only (35 tasks) delivers working chat panel

**Independent Test Criteria**:
- US1: Open → Send → Receive → Close workflow works
- US2: Scope selection → Scoped command → Operation logs visible → "View change" works
- US3: Select element → See contextual chips → Click chip → AI executes action
- US4: Long message → Collapses → Expand works → Clear conversation → Confirmation → Messages cleared

**Suggested Implementation Order**:
1. MVP first (US1 only) - validate and deploy
2. Add US2 (scoping) - validate and deploy
3. Add US3 (quick actions) - validate and deploy
4. Add US4 (history management) - validate and deploy
5. Polish phase - final production hardening

**Next Steps**: Begin with Phase 1 (Setup) - follow quickstart.md for development environment setup
