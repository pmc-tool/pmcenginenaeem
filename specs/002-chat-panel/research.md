# Technology Research: AI Chat Panel & Command Center

**Feature**: 002-chat-panel
**Date**: 2025-11-17
**Status**: Complete - all technology decisions inherited or specified

## Overview

This feature extends the existing 001-dashboard-shell with no new technology dependencies. All core architectural decisions (React 18+, TypeScript 5+, Zustand 4, testing stack) are inherited. This research document focuses on chat-specific implementation patterns and validates that no additional dependencies are required.

## Inherited Technology Stack

### From 001-dashboard-shell (Complete Stack)

All technology decisions below are inherited with no modifications:

**Language/Framework**
- Decision: TypeScript 5+ (strict mode) with React 18+
- Rationale: Already established in dashboard shell, provides type safety and modern React features (concurrent rendering, automatic batching)
- Alternatives considered: None - consistency with existing codebase is mandatory

**State Management**
- Decision: Zustand 4 for global state
- Rationale: Already used for dashboard store, lightweight (~1KB), excellent TypeScript support, simple API
- Alternatives considered: None - adding Redux/MobX would violate simplicity principle

**Styling**
- Decision: CSS Modules (inherited from shell)
- Rationale: Component-scoped CSS, no runtime overhead, already configured in build system
- Alternatives considered: None - consistency with shell styling approach

**Accessibility**
- Decision: Radix UI primitives for dropdown/dialog, vitest-axe for testing
- Rationale: Already used in shell for accessible components, WCAG AA compliant out of box
- Alternatives considered: None - consistency with existing accessible UI patterns

**Testing**
- Decision: Vitest + React Testing Library (unit/component), Playwright (E2E), vitest-axe (accessibility)
- Rationale: Established testing stack in shell, fast execution, excellent TypeScript support
- Alternatives considered: None - maintaining consistent testing patterns

## Chat-Specific Technology Decisions

### Timestamp Formatting

**Decision**: date-fns library
**Rationale**:
- Lightweight (tree-shakeable, only import functions used)
- Excellent relative time formatting (formatDistanceToNow, format)
- Already used in many React projects, well-maintained
- TypeScript-first library with strong type definitions
- Constitutional requirement: human-readable timestamps ("2 min ago", "Yesterday at 3:15 PM")

**Alternatives Considered**:
- Moment.js - REJECTED: Large bundle size (67KB minified), deprecated in favor of alternatives
- Luxon - REJECTED: Heavier than date-fns (23KB vs ~5KB for needed functions), more than needed
- Native Intl.RelativeTimeFormat - REJECTED: Poor browser support for "auto" formatting, requires manual time unit calculation
- Manual implementation - REJECTED: Date math is error-prone (timezones, DST, leap seconds), date-fns battle-tested

**Bundle Impact**: ~5KB minified (only formatDistanceToNow and format functions imported)

### Mock AI Response Handling

**Decision**: Simple in-memory mock with keyword parsing (no external library)
**Rationale**:
- Feature requires frontend-only testing (FR-060 through FR-065)
- Keyword-based responses sufficient for UI validation
- No network calls, no API mocking library overhead
- Simulated delays via setTimeout (2-3 second range per FR-060)
- Easy to replace with real API integration in future feature

**Alternatives Considered**:
- MSW (Mock Service Workers) - REJECTED: Overkill for simple mock, no network layer to intercept
- Faker.js - REJECTED: Don't need realistic fake data, just canned responses
- AI SDK mocks - REJECTED: No real AI integration yet, premature

**Implementation Pattern**:
```typescript
// services/mockAI.ts
export function generateMockResponse(userMessage: string, scope: Scope): Promise<ChatMessage>
export function simulateOperation(action: string, scope: Scope): AsyncGenerator<ChatOperationLog>
```

### Message Collapse/Expand UI

**Decision**: CSS-based truncation with React state for expand/collapse
**Rationale**:
- FR-019 requires messages >8 lines show first 5 lines with "Show more" button
- Pure CSS solution: line-clamp (but no way to show "Show more" button conditionally)
- React state approach: ref to measure actual line count, conditionally render button
- Performance: One-time measurement per message on mount, no re-renders during scroll

**Alternatives Considered**:
- CSS line-clamp only - REJECTED: Can't show "Show more" button conditionally
- react-truncate library - REJECTED: Unmaintained, 4KB for simple feature
- Full content always visible - REJECTED: Violates FR-019 requirement

**Implementation Pattern**:
```typescript
const [isCollapsed, setIsCollapsed] = useState(true)
const contentRef = useRef<HTMLDivElement>(null)
const shouldCollapse = contentRef.current?.scrollHeight > LINES_THRESHOLD * LINE_HEIGHT
```

### Context Synchronization

**Decision**: Direct Zustand store subscription with 100ms debounce
**Rationale**:
- FR-042 requires context chip update within 100ms when selection changes
- Zustand provides fine-grained subscriptions (useDashboardStore((state) => state.shell.selectedSectionId))
- Debounce prevents rapid updates during drag operations or quick navigation
- debounce utility already exists in shell (utils/debounce.ts)

**Alternatives Considered**:
- Event bus - REJECTED: Adds complexity, Zustand subscriptions already reactive
- Polling - REJECTED: Wasteful, doesn't meet 100ms requirement reliably
- No debounce - REJECTED: Causes excessive re-renders during rapid selection changes

**Implementation Pattern**:
```typescript
const selectedSectionId = useDashboardStore((state) => state.shell.selectedSectionId)
const debouncedUpdate = useMemo(() => debounce(updateContextChip, 100), [])
useEffect(() => { debouncedUpdate(selectedSectionId) }, [selectedSectionId])
```

## No Additional Dependencies Required

### Z-Index Management
- Decision: Use CSS variable from shell (--z-index-chat: 40)
- Rationale: Shell defines z-index layers, chat fits between inspector (30) and modals (50)
- No z-index management library needed

### Animation
- Decision: CSS transitions (transform: translateX, 250ms ease-in-out)
- Rationale: Constitutional timing requirement (250ms), simple slide-in animation, no complex sequences
- No animation library (Framer Motion, React Spring) needed

### Resize Handle
- Decision: Reuse existing ResizeHandle component from shell
- Rationale: Shell already implements ResizeHandle for inspector panel, same behavior needed for chat width adjustment

### Icon Library
- Decision: Use existing icon system from shell (likely Lucide or Heroicons based on common React patterns)
- Rationale: Consistency with shell icons (chat bubble, close X, overflow menu dots, send arrow)
- Research Note: Icon library not specified in shell plan - assumed based on Radix UI ecosystem

## Performance Validation

### Bundle Size Impact
- New dependencies: date-fns (~5KB for needed functions)
- Chat components: Estimated ~15KB minified (8 components × ~2KB average)
- Total impact: ~20KB minified + gzipped → ~7KB actual
- Within constraints: No hard limit specified, but <100KB total app from shell constraint maintained

### Memory Constraints
- FR requirement: <10MB memory for message history
- Calculation: 100 messages × ~2KB per message (text + metadata) = ~200KB
- Well within constraint even with 500 messages (1MB)

### Runtime Performance
- Message list rendering: Virtualization NOT needed for 100 messages (React handles <1000 DOM nodes efficiently)
- Context sync: 100ms debounce prevents excessive re-renders
- Animation: CSS transform (GPU-accelerated) meets 250ms target

## Integration Points

### Dashboard Store Extension
- Pattern: Add chatState slice to existing dashboardStore
- No architectural changes needed
- Zustand supports slice composition natively

### Shell Component Modification
- Modify: Shell.tsx to render ChatPanel conditionally
- Modify: LeftRail.tsx to add Chat icon and toggle handler
- Pattern: Conditional rendering based on state.shell.isChatOpen

### Type System Integration
- New types file: frontend/src/types/chat.ts
- Export: ChatMessage, ChatOperationLog, Scope, MessageType
- Pattern: Consistent with shell's type organization

## Research Conclusion

**Status**: ✅ All technology decisions finalized

**New Dependencies**: 1 (date-fns)
**Inherited Dependencies**: All from 001-dashboard-shell
**No NEEDS CLARIFICATION items remaining**

All chat-specific decisions documented above. Feature ready for Phase 1 (data model and contracts).

---

**Research Artifacts**:
- No prototype code needed (simple feature, patterns established)
- No performance benchmarks needed (well within constraints)
- No browser compatibility research needed (inherited from shell)
