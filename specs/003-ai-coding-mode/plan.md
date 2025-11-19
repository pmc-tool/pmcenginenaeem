# Implementation Plan: AI Coding Mode

**Branch**: `003-ai-coding-mode` | **Date**: 2025-01-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-ai-coding-mode/spec.md`

## Summary

AI Coding Mode provides a read-only Code Panel that displays page code with syntax highlighting, allows users to request code changes through natural language chat commands, shows progressive operation logs, presents diff previews with Accept/Reject controls, and maintains real-time synchronization between Code Panel, Canvas, and Inspector. The feature empowers non-technical users to understand and modify code without writing it themselves, while maintaining transparency, safety, and control through scoped AI operations and diff validation.

**Technical Approach**: Extend existing Dashboard Shell with a new Code Panel component, integrate with Chat panel for AI code requests, implement a diff visualization system using Monaco Editor, and leverage existing Zustand state management for cross-panel synchronization.

## Technical Context

**Language/Version**: TypeScript 5+ (strict mode) with React 18+
**Primary Dependencies**: React 18+, Zustand 4 (state management), Monaco Editor (code display/diff), Prism.js or Shiki (syntax highlighting), date-fns (timestamps)
**Storage**: In-memory state (Zustand), with persistence via browser localStorage for undo/redo history
**Testing**: Vitest 4+ with React Testing Library, jest-axe for accessibility validation
**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Project Type**: Web application (frontend-only feature, extends existing Dashboard Shell)
**Performance Goals**:
- Code Panel renders within 200ms for typical page code (<1000 lines)
- Diff generation completes within 500ms
- Cross-panel sync updates within 200ms (Canvas, Inspector, Code Panel)
- Syntax highlighting for files up to 5000 lines without lag

**Constraints**:
- Code Panel must be read-only (no direct editing allowed per constitution)
- All AI operations must show progressive operation logs
- Diff previews must be presented before any code is applied
- Must maintain WCAG AA accessibility standards
- Must work within existing Dashboard Shell without mode-switching shock

**Scale/Scope**:
- Support page code files ranging from 100-5000 lines
- Handle up to 10 concurrent AI code operations in queue
- Undo stack maintains minimum 50 code change snapshots
- Diff previews support up to 500 changed lines per operation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Consistency (Section 2.I)
- **Compliant**: Code Panel integrates within existing Dashboard Shell, does not create secondary UI or mode-switching
- **Evidence**: Code Panel slides into main layout alongside Canvas and Inspector, maintains top bar and left rail

### ✅ Clarity & Cognitive Load Reduction (Section 2.II)
- **Compliant**: Code Panel is contextual (only shows when AI Coding Mode active), uses progressive disclosure for operation logs
- **Evidence**: Code Panel hidden by default, operation logs are collapsible, diff previews show only relevant changed lines

### ✅ AI Scope Control (Section 2.III)
- **Compliant**: All AI code changes require explicit Accept/Reject, changes are scoped to page/section, preview shown before application
- **Evidence**: FR-009 (Accept/Reject controls), FR-007 (diff preview), operation logs show scope

### ✅ User Safety (Section 2.IV)
- **Compliant**: All code changes are undoable (FR-022), diff previews prevent surprises, validation happens before presentation
- **Evidence**: Undo feature specified, diff preview with plain-language explanations, validation in FR-014

### ✅ Accessibility (Section 2.V)
- **Compliant**: Code Panel keyboard navigable, screen reader labels for all controls, WCAG AA contrast maintained
- **Evidence**: Code Panel uses Monaco Editor (keyboard accessible), Accept/Reject buttons have ARIA labels, operation logs have live regions

### ✅ Canvas is Sacred (Section 3.I)
- **Compliant**: Canvas updates in real-time after code changes accepted, no interference with Canvas rendering
- **Evidence**: FR-011 (Canvas updates without refresh), SC-004 (sync within 200ms)

### ✅ Inspector is Source of Truth (Section 3.II)
- **Compliant**: Inspector updates to reflect code changes, maintains sync with Code Panel
- **Evidence**: FR-012 (Inspector shows new properties), FR-016 (maintain sync across all panels)

### ✅ Chat is Command Center (Section 3.III)
- **Compliant**: All code change requests route through Chat, operation logs show transparency, Accept/Reject workflow
- **Evidence**: FR-004 (requests via Chat), FR-005/FR-006 (operation logs), FR-009 (Accept/Reject)

### ✅ Code Panel is Read-Only (Section 3.IV)
- **Compliant**: Code Panel explicitly read-only, diffs shown with calm visual indicators, syntax highlighting included
- **Evidence**: FR-003 (prevent direct editing), FR-008 (diff highlighting), user stories emphasize read-only nature

### ✅ Visual Language (Section 4)
- **Compliant**: Uses constitutional palette (#EA2724 accent, grayscale hierarchy), no gradients/shadows/patterns
- **Evidence**: Diff colors use soft backgrounds (red/green/yellow per FR-008), follows existing Dashboard design system

### ✅ State Management (Section 5.IV)
- **Compliant**: Uses Zustand for central state, all changes logged for undo, serializable state
- **Evidence**: Existing Dashboard uses Zustand, undo stack specified in FR-022, state includes code snapshots

**Constitution Compliance**: ✅ **PASS** - All constitutional gates satisfied. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/003-ai-coding-mode/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (completed)
├── research.md          # Phase 0 output (to be created)
├── data-model.md        # Phase 1 output (to be created)
├── quickstart.md        # Phase 1 output (to be created)
├── contracts/           # Phase 1 output (to be created)
│   ├── ai-code-api.yaml # AI code generation service contract
│   └── state-schema.json # Zustand state schema for code panel
├── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
└── checklists/
    └── requirements.md  # Specification quality checklist (completed)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── chat/              # Existing Chat panel (002-chat-panel)
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── OperationLog.tsx  # Will be extended for code operations
│   │   │   └── PromptComposer.tsx
│   │   ├── code/              # NEW: Code Panel components
│   │   │   ├── CodePanel.tsx         # Main read-only code panel
│   │   │   ├── CodeViewer.tsx        # Monaco Editor wrapper
│   │   │   ├── DiffPreview.tsx       # Side-by-side diff display
│   │   │   ├── DiffControls.tsx      # Accept/Reject buttons
│   │   │   ├── SyntaxHighlighter.tsx # Fallback syntax highlighting
│   │   │   ├── CodePanel.css
│   │   │   ├── DiffPreview.css
│   │   │   └── DiffControls.css
│   │   └── dashboard/         # Existing Dashboard Shell
│   │       ├── DashboardShell.tsx
│   │       ├── TopBar.tsx
│   │       ├── LeftRail.tsx
│   │       └── Canvas.tsx
│   ├── services/
│   │   ├── aiCodeService.ts   # NEW: AI code generation API client
│   │   ├── codeValidator.ts   # NEW: Code validation logic
│   │   ├── diffGenerator.ts   # NEW: Diff generation utilities
│   │   └── mockAI.ts          # Existing mock AI (002-chat-panel)
│   ├── store/
│   │   ├── dashboardStore.ts  # Existing Zustand store (will be extended)
│   │   ├── codeStore.ts       # NEW: Code Panel specific state slice
│   │   └── undoStack.ts       # NEW: Undo/redo history management
│   ├── types/
│   │   ├── chat.ts            # Existing chat types
│   │   ├── code.ts            # NEW: Code Panel, Diff, Operation types
│   │   └── dashboard.ts       # Existing dashboard types
│   └── utils/
│       ├── formatTimestamp.ts # Existing (002-chat-panel)
│       ├── debounce.ts        # Existing (002-chat-panel)
│       └── diffUtils.ts       # NEW: Diff comparison utilities
└── tests/
    ├── components/
    │   ├── code/
    │   │   ├── CodePanel.test.tsx
    │   │   ├── CodeViewer.test.tsx
    │   │   ├── DiffPreview.test.tsx
    │   │   ├── DiffControls.test.tsx
    │   │   └── accessibility.test.tsx  # WCAG validation
    │   └── integration/
    │       ├── code-chat-integration.test.tsx
    │       └── code-sync.test.tsx
    └── services/
        ├── aiCodeService.test.ts
        ├── codeValidator.test.ts
        └── diffGenerator.test.ts
```

**Structure Decision**: Web application structure (Option 2) selected. Feature extends existing `frontend/` codebase with new Code Panel components and services. Integration with existing Chat panel (002-chat-panel) for AI request routing. Uses existing Zustand store architecture for state management and cross-panel synchronization.

## Complexity Tracking

> **No violations - this section not applicable**

All constitutional requirements are satisfied without introducing complexity violations. The feature:
- Uses existing Dashboard Shell architecture (no new UI paradigms)
- Extends existing Chat panel (no new command centers)
- Integrates with existing Zustand state management (no new state patterns)
- Maintains read-only Code Panel per constitutional requirement
- Follows existing accessibility and visual language standards

## Phase 0: Research & Technology Selection

### Research Goals

1. **Monaco Editor Integration**: Determine best approach for embedding Monaco Editor in React with read-only mode, syntax highlighting, and diff visualization
2. **Diff Generation Algorithm**: Research efficient diff algorithms for comparing code versions (Myers diff, patience diff, or library solutions)
3. **AI Code Service Integration**: Define contract for AI code generation service (request format, response structure, error handling)
4. **Syntax Highlighting Fallback**: Evaluate Prism.js vs. Shiki for fallback syntax highlighting when Monaco is too heavy
5. **Undo/Redo Architecture**: Research patterns for maintaining code change history with efficient memory usage
6. **Code Validation**: Define validation rules for generated code (syntax checking, schema compliance, safety checks)

### Technology Decisions to Research

| Decision Area | Options to Evaluate | Success Criteria |
|---------------|---------------------|------------------|
| Code Editor | Monaco Editor, CodeMirror 6, Prism.js (read-only) | Read-only mode, diff support, <200ms render, TypeScript/JSX syntax |
| Diff Algorithm | diff library, jsdiff, fast-diff, monaco-diff | <500ms for 1000 line files, accurate line-by-line comparison |
| State Persistence | localStorage, IndexedDB, sessionStorage | Store 50+ undo snapshots, <50ms read/write |
| Code Validation | ESLint API, TypeScript Compiler API, custom parser | Validate JSX/TSX syntax, detect breaking changes, <300ms |
| AI Service Protocol | REST API, WebSocket, Server-Sent Events | Real-time progress updates, <5s response for simple changes |

### Integration Points Research

1. **Chat Panel Integration**: How to extend existing OperationLog component for code-specific operations
2. **Canvas Sync**: How Canvas re-renders when code changes are applied (existing API exploration)
3. **Inspector Sync**: How Inspector updates property values post-code-change (existing API exploration)
4. **Zustand Store Extension**: Best practice for adding code panel slice to existing store without breaking changes

## Phase 1: Design Artifacts

### Data Model (data-model.md)

**Entities to Define**:
- CodePanelState (current code, file path, syntax language, visibility)
- DiffPreview (old code, new code, changed lines, summary, status)
- CodeOperation (operation ID, status, logs, request text, target scope, diff preview)
- UndoSnapshot (timestamp, code before, code after, operation metadata)
- AICodeRequest (request text, scope, context, timestamp)

**State Relationships**:
- CodePanelState linked to selected page/section
- CodeOperation contains one DiffPreview
- UndoSnapshot array managed by UndoStack
- AICodeRequest creates CodeOperation

### Contracts (contracts/)

**AI Code Service API** (`ai-code-api.yaml`):
- POST `/api/code/generate` - Generate code from natural language
- GET `/api/code/validate` - Validate generated code
- POST `/api/code/diff` - Generate diff between code versions

**Zustand State Schema** (`state-schema.json`):
- codePanel state slice schema
- codeOperations queue schema
- undoStack schema

### Quickstart (quickstart.md)

**Developer Setup**:
1. Install Monaco Editor dependencies
2. Configure Code Panel in Dashboard Shell
3. Set up AI code service mock
4. Run development server with Code Panel enabled

**Testing Guide**:
1. Switch to AI Coding Mode
2. Verify Code Panel renders read-only
3. Send chat request for code change
4. Verify operation log appears
5. Verify diff preview shown with Accept/Reject
6. Accept change and verify Canvas/Inspector sync

## Phase 2: Task Breakdown

*This phase is handled by the `/speckit.tasks` command and is NOT part of this plan output.*

The tasks will be generated based on:
- User Stories 1-6 from spec.md (prioritized P1, P2, P3)
- Functional Requirements FR-001 to FR-023
- Phase 1 design artifacts (data model, contracts, quickstart)
- Testing requirements (unit, integration, accessibility)

## Next Steps

1. ✅ **Completed**: Feature specification (spec.md)
2. ✅ **Completed**: Specification quality validation (checklists/requirements.md)
3. ✅ **Completed**: Implementation plan with technical context (this file)
4. ✅ **Completed**: Phase 0 research (research.md)
5. ✅ **Completed**: Phase 1 design artifacts (data-model.md, contracts/, quickstart.md)
6. ✅ **Completed**: Agent context update (CLAUDE.md)
7. ✅ **Completed**: Task breakdown (tasks.md) - 74 tasks organized by 6 user stories

**Ready for**: Implementation via `/speckit.implement` command or manual task execution.
