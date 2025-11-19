# TODO Backlog

**Purpose**: Centralized tracking of future enhancements and implementation tasks
**Status**: Active
**Last Updated**: 2025-11-19

---

## Overview

This document tracks all TODOs extracted from code comments. Instead of cluttering the codebase with TODO comments, we track them here with priority and status.

---

## High Priority

### HP-001: Real Data Integration

**Current State**: Using mock data and hardcoded values
**Target**: Integrate with real backend APIs

**Tasks**:
1. Replace mock data in ChatPanel with real API calls
   - File: `src/components/chat/ChatPanel.tsx`
   - Line: 84
   - Comment: `// TODO: In real implementation, fetch page/section names from data store`
   - Effort: 4 hours

2. Implement canvas scrolling to sections
   - File: `src/components/chat/ChatPanel.tsx`
   - Line: 218
   - Comment: `// TODO: Scroll canvas to the section`
   - Effort: 2 hours

3. Replace FileExplorerSidebar mock data
   - File: `src/components/code/FileExplorerSidebar.tsx`
   - Comment: `// TODO: Replace with actual file content loading`
   - Comment: `// TODO: Replace with actual project file structure`
   - Effort: 6 hours

**Total Effort**: 12 hours
**Priority**: High (needed for production)
**Dependencies**: Backend API implementation

---

### HP-002: AI Service Integration

**Current State**: Mock AI responses and simulated operations
**Target**: Connect to real AI APIs

**Tasks**:
1. Replace mock AI service with production API
   - File: `src/services/aiCodeService.ts`
   - Comments:
     - `// TODO: Replace with production API integration`
     - `// TODO: Replace with actual AI API call`
     - `// TODO: Implement function logic`
     - `// TODO: Implement actual logic`
   - Effort: 16 hours

**Total Effort**: 16 hours
**Priority**: High (core feature)
**Dependencies**: AI API credentials, API documentation

---

## Medium Priority

### MP-001: Navigation & Commands

**Current State**: Placeholder UI with no actions
**Target**: Implement actual navigation and command execution

**Tasks**:
1. Implement navigation to target paths
   - File: `src/components/deployment/ThemeSummary.tsx`
   - Line: Unknown
   - Comment: `// TODO: Implement navigation to target path`
   - Effort: 2 hours

2. Implement command execution
   - File: `src/components/deployment/ThemeSummary.tsx`
   - Comment: `// TODO: Execute command`
   - Effort: 3 hours

**Total Effort**: 5 hours
**Priority**: Medium
**Dependencies**: Routing setup, command parser

---

### MP-002: Data Migration

**Current State**: No version migration logic
**Target**: Handle schema changes gracefully

**Tasks**:
1. Add training data version migration
   - File: `src/services/trainingService.ts`
   - Comment: `// TODO: Add version migration logic here when schema changes`
   - Effort: 4 hours

**Total Effort**: 4 hours
**Priority**: Medium
**Dependencies**: Schema versioning strategy

---

### MP-003: Chat Prompt Sending

**Current State**: Placeholder function
**Target**: Implement actual message sending

**Tasks**:
1. Implement chat message sending
   - File: `src/components/chat/ChatPromptBox.tsx`
   - Comment: `// TODO: Send message to chat`
   - Effort: 1 hour

**Total Effort**: 1 hour
**Priority**: Medium (may already be implemented elsewhere)
**Dependencies**: None

---

## Low Priority

### LP-001: Component Refactoring

**Current State**: Some components not yet migrated to Phase 3/4 patterns
**Target**: Apply refactoring patterns to all components

**Tasks**:
- Refactor FileExplorerSidebar (335 LOC)
- Refactor Canvas (258 LOC)
- Refactor RichTextEditor (245 LOC)
- Apply form hooks to all forms

**Total Effort**: 20 hours
**Priority**: Low (code quality improvement)
**Dependencies**: Phase 3 & 4 patterns established ✅

---

### LP-002: CSS Consolidation

**Current State**: Some CSS uses hardcoded values instead of design tokens
**Target**: 100% design token usage

**Tasks**:
- Audit all CSS files for hardcoded colors
- Replace with design tokens from `src/styles/tokens.ts`
- Remove duplicate button/spacing styles

**Total Effort**: 8 hours
**Priority**: Low (visual consistency)
**Dependencies**: Design tokens established ✅

---

## Completed ✅

### ~~C-001: Debounce/Throttle Utilities~~

**Status**: ✅ Completed in Phase 3
**Solution**: Created useDebounce, useThrottle, useDebouncedCallback, useThrottledCallback hooks
**Files**: `src/hooks/async/useDebounce.ts`, `src/hooks/async/useThrottle.ts`

---

### ~~C-002: Form State Management~~

**Status**: ✅ Completed in Phase 3
**Solution**: Created useFormState, useFormValidation, useFormDirty hooks
**Files**: `src/hooks/forms/`

---

### ~~C-003: UI Component Library~~

**Status**: ✅ Completed in Phase 2
**Solution**: Created 20 reusable UI components
**Files**: `src/components/ui/`, `src/components/feedback/`

---

## Deferred / Not Doing

### D-001: Code Quality TODO Detection

**File**: `src/services/codeValidator.ts`
**Comment**: Checks for TODO/FIXME comments in code
**Reason**: This is intentional functionality, not a TODO item
**Status**: Keep as-is

---

## Summary by Priority

| Priority | Count | Total Effort |
|----------|-------|--------------|
| High | 2 items | 28 hours |
| Medium | 3 items | 10 hours |
| Low | 2 items | 28 hours |
| **Total** | **7 items** | **66 hours** |

---

## Tracking Guidelines

### Adding New TODOs

Instead of adding `// TODO` comments in code:

1. Add entry to this document
2. Assign priority (High/Medium/Low)
3. Estimate effort
4. Note dependencies
5. Reference file/line if applicable

### Updating Status

When starting work:
- Move from backlog to "In Progress"
- Update status in this document

When completing:
- Move to "Completed" section
- Add completion date
- Document solution

### Code Comment Policy

**Allowed in Code**:
- `// FIXME` for bugs that need immediate attention
- `// HACK` for temporary workarounds (with backlog reference)
- `// NOTE` for important implementation details

**Not Allowed in Code**:
- `// TODO` for future work (use this backlog instead)
- `// XXX` for warnings (use FIXME or NOTE)

---

## Integration with Phases

### Phase 5 (Current)
- ✅ TODOs extracted to this document
- ✅ Code comments cleaned up
- ⏭️ Implementation of backlog items

### Phase 6 (Documentation & Code Quality)
- Add testing strategy for backlog items
- Document implementation approach for each item

### Phase 7 (Testing & QA)
- Test completed backlog items
- Verify no regressions

### Phase 8 (Migration & Rollout)
- Prioritize high-priority items for production
- Plan sprints for medium/low priority items

---

## Notes

**Production Readiness**: High-priority items (28 hours) should be completed before production deployment.

**Code Quality**: Low-priority items can be done incrementally without blocking features.

**Tracking**: This document should be updated weekly during active development.

---

**Last Review**: 2025-11-19
**Next Review**: TBD
