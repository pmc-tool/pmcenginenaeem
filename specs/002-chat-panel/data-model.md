# Data Model: AI Chat Panel & Command Center

**Feature**: 002-chat-panel
**Date**: 2025-11-17
**Status**: Complete

## Overview

This document defines the data entities, relationships, and state management for the AI Chat Panel feature. All entities are ephemeral (in-memory only, no persistence) per FR-049. State is managed through Zustand store slice integrated into existing dashboardStore.

## Core Entities

### ChatMessage

Represents a single message in the chat history (user-sent, AI response, or system log).

**Source**: FR-013, FR-046 (Key Entities section of spec)

```typescript
interface ChatMessage {
  // Identity
  id: string                    // UUID v4, generated client-side
  type: MessageType             // 'user' | 'ai' | 'log'

  // Content
  text: string                  // Message content (markdown supported for AI messages)

  // Context
  scope: Scope                  // 'field' | 'section' | 'page' | 'feature'
  action?: string               // Optional action type (e.g., "rewrite", "improve", "generate")

  // Metadata
  createdAt: number             // Unix timestamp (milliseconds)
  relatedEntityId?: string      // Optional link to page/section ID for "View change" functionality

  // UI State
  isCollapsed: boolean          // For messages >8 lines (FR-019)
}

// Supporting Types
type MessageType = 'user' | 'ai' | 'log'
type Scope = 'field' | 'section' | 'page' | 'feature'
```

**Validation Rules** (from FRs):
- `id`: Must be unique within session, non-empty
- `type`: Must be one of three enum values
- `text`: Non-empty string, max 10,000 characters (prevents memory overflow)
- `scope`: Must be one of four enum values
- `action`: Optional, max 50 characters if present
- `createdAt`: Must be valid timestamp, not future date
- `relatedEntityId`: If present, must reference valid page/section in dashboard state
- `isCollapsed`: Derived on render based on line count (true if >8 lines per FR-019)

**Relationships**:
- No direct parent-child relationships (flat message list structure)
- `relatedEntityId` weak reference to Page/Section entities in dashboard store (not enforced FK)

**Lifecycle**:
1. Created: When user sends message (type: 'user'), AI responds (type: 'ai'), or operation logs (type: 'log')
2. Updated: Never (immutable once created)
3. Deleted: When user clears conversation (FR-011) or session ends (no persistence)

**State Transitions**: None (messages are immutable)

---

### ChatOperationLog

Represents the execution log of an AI operation showing progression over time.

**Source**: FR-063 (Mock operation log structure)

```typescript
interface ChatOperationLog {
  // Identity
  operationId: string           // UUID v4, unique per AI operation

  // Context
  scope: Scope                  // Scope at time of operation start
  targetEntityId: string        // Page/section ID being modified

  // Status
  status: OperationStatus       // 'pending' | 'running' | 'success' | 'error'

  // Progression
  messages: string[]            // Array of log lines ["Analyzing...", "Processing...", "Complete"]

  // Timestamps
  createdAt: number             // When operation started
  completedAt?: number          // When operation finished (success or error)
}

// Supporting Types
type OperationStatus = 'pending' | 'running' | 'success' | 'error'
```

**Validation Rules**:
- `operationId`: Must be unique within session, non-empty
- `scope`: Must be one of four enum values
- `targetEntityId`: Must reference valid page/section in dashboard state
- `status`: Must progress logically (pending → running → success/error)
- `messages`: Array length 1-20 (prevents memory overflow), each message max 200 chars
- `createdAt`: Valid timestamp, not future date
- `completedAt`: If present, must be >= createdAt

**Relationships**:
- Associated with one or more ChatMessage entries of type 'log'
- One operation can generate multiple log messages as it progresses (FR-023)
- Weak reference to targetEntityId (Page/Section in dashboard store)

**Lifecycle**:
1. Created: When AI operation begins (status: 'pending')
2. Updated: As operation progresses (status: 'running', messages appended)
3. Completed: When operation finishes (status: 'success'/'error', completedAt set)
4. Deleted: When user clears conversation or session ends

**State Transitions**:
```
pending → running → success
                 → error

(No backward transitions allowed)
```

**Constitutional Compliance**:
- FR-028: All log messages must be human-readable (no stack traces, no error codes)
- Example valid messages: "Analyzing section structure...", "Updating 2 of 4 fields...", "Complete"
- Example invalid messages: "Error: TypeError at line 42", "ECONNREFUSED", "Stack: at Function.Module..."

---

### ChatState

Frontend state slice managing the chat panel's UI and data.

**Source**: FR-045 (State Management requirements)

```typescript
interface ChatState {
  // Messages
  messages: ChatMessage[]       // Full message history (user, ai, log)

  // UI State
  isOpen: boolean               // Whether chat panel is visible
  scope: Scope                  // Currently selected scope in composer
  isBusy: boolean               // Whether AI operation is in progress

  // Context
  currentContext: string        // Formatted context label (e.g., "Home / Hero")

  // Panel Layout
  panelWidth: number            // Current width in pixels (360-600px, FR-004)
}
```

**Validation Rules**:
- `messages`: Array, max 1000 messages (prevents memory overflow, 100+ required per SC-003)
- `isOpen`: Boolean
- `scope`: Must be one of four enum values
- `isBusy`: Boolean, true when AI processing, false otherwise
- `currentContext`: String, max 200 characters, format: "[Page Name] / [Section Name]"
- `panelWidth`: Number, min 360, max 600 (per FR-004 resize constraints)

**Default Values**:
```typescript
const defaultChatState: ChatState = {
  messages: [],
  isOpen: false,
  scope: 'section',           // FR-031: Default scope is Section
  isBusy: false,
  currentContext: '',
  panelWidth: 420,            // Mid-range between 360-600
}
```

**Relationships**:
- Reads from dashboard store: `shell.selectedPageId`, `shell.selectedSectionId`, `shell.aiCreditsCount`
- Updates flow one-way: Dashboard state → ChatState (never reverse)

**Lifecycle**:
1. Initialized: On app load with default values
2. Updated: Throughout session (messages added, scope changed, etc.)
3. Reset: When user clears conversation (messages cleared, scope reset to 'section')
4. Destroyed: On session end (no persistence per FR-049)

---

## State Management Architecture

### Zustand Store Integration

ChatState integrates into existing `dashboardStore` as a new slice:

```typescript
// store/dashboardStore.ts (MODIFIED)

export interface DashboardState {
  // ... existing slices (shell, topBar, pageSidebar, inspector, canvas)
  chat: ChatState                    // NEW SLICE
}

export interface DashboardActions {
  // ... existing actions

  // Chat actions (NEW)
  toggleChat: () => void
  addMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => void
  removeMessage: (messageId: string) => void
  setScope: (scope: Scope) => void
  setBusy: (busy: boolean) => void
  clearMessages: () => void
  setChatPanelWidth: (width: number) => void
}
```

**Actions Implementation** (pseudocode):

```typescript
toggleChat: () => set((state) => ({
  chat: { ...state.chat, isOpen: !state.chat.isOpen }
}))

addMessage: (message) => set((state) => ({
  chat: {
    ...state.chat,
    messages: [
      ...state.chat.messages,
      {
        ...message,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        isCollapsed: false  // Computed on first render
      }
    ]
  }
}))

clearMessages: () => set((state) => ({
  chat: {
    ...state.chat,
    messages: [],
    isBusy: false,
    scope: 'section'  // Reset to default
  }
}))

setScope: (scope) => set((state) => ({
  chat: { ...state.chat, scope }
}))

setBusy: (busy) => set((state) => ({
  chat: { ...state.chat, isBusy: busy }
}))

setChatPanelWidth: (width) => set((state) => ({
  chat: { ...state.chat, panelWidth: Math.min(600, Math.max(360, width)) }
}))
```

### Context Synchronization Logic

**Source**: FR-041, FR-042 (Context synchronization requirements)

```typescript
// In ChatPanel component
const selectedPageId = useDashboardStore((state) => state.shell.selectedPageId)
const selectedSectionId = useDashboardStore((state) => state.shell.selectedSectionId)
const aiCreditsCount = useDashboardStore((state) => state.shell.aiCreditsCount)

// Debounced context update (100ms per FR-042)
useEffect(() => {
  const updateContext = debounce(() => {
    const pageName = getPageName(selectedPageId)  // Lookup from pages data
    const sectionName = getSectionName(selectedSectionId)

    const context = sectionName
      ? `${pageName} / ${sectionName}`
      : pageName || 'Site'

    // Update internal component state (not stored in Zustand)
    setCurrentContext(context)
  }, 100)

  updateContext()
}, [selectedPageId, selectedSectionId])
```

### Persistence Strategy

**NO PERSISTENCE** (per FR-049)

- Rationale: Constitutional requirement for transparency - ephemeral chat prevents hidden logs
- Implication: All chat history lost on page refresh or tab close
- User expectation: Set by "in-memory only" messaging in UI (future enhancement)

---

## Data Flow Diagrams

### Message Creation Flow

```
User types message → Press Enter
  ↓
addMessage(type: 'user', text, scope)
  ↓
Zustand state update (messages array appended)
  ↓
MessageList re-renders (auto-scrolls to bottom per FR-021)
  ↓
mockAI.generateMockResponse() called
  ↓
2-3 second delay (FR-060)
  ↓
addMessage(type: 'ai', text, scope)
  ↓
AI credits decremented (-10 per FR-064)
  ↓
MessageList renders AI response
```

### Operation Logging Flow

```
AI operation starts → setBusy(true)
  ↓
Create OperationLog (status: 'pending')
  ↓
addMessage(type: 'log', text: 'Analyzing...', relatedEntityId)
  ↓
Operation progresses → Update OperationLog (status: 'running')
  ↓
addMessage(type: 'log', text: 'Processing field 1 of 3...')
  ↓
Operation completes → Update OperationLog (status: 'success', completedAt)
  ↓
addMessage(type: 'log', text: 'Updated 3 fields in Hero section')
  ↓
setBusy(false)
```

### Context Sync Flow

```
User clicks section in canvas
  ↓
setSelectedSection(sectionId) in dashboard store
  ↓
Zustand subscription triggers in ChatPanel
  ↓
100ms debounce timer starts
  ↓
(If no more changes within 100ms)
  ↓
Lookup page/section names from dashboard data
  ↓
Format context string: "Home / Hero"
  ↓
Component state updated (currentContext)
  ↓
PromptComposer re-renders with new context chip
```

---

## Memory Management

### Constraints

- FR constraint: <10MB memory for message history
- Target: Support 100+ messages per SC-003

### Size Calculations

**Per Message**:
- ChatMessage object: ~500 bytes (id: 36 bytes, text: avg 200 bytes, metadata: ~100 bytes)
- React component overhead: ~300 bytes
- Total per message: ~800 bytes

**100 messages**: 100 × 800 bytes = ~80KB
**1000 messages** (limit): 1000 × 800 bytes = ~800KB

**Conclusion**: Well within <10MB constraint even at max capacity

### Garbage Collection Strategy

- No manual cleanup needed for normal operation (array splice is efficient)
- clearMessages() releases all message references immediately
- Zustand store doesn't persist to storage → no IndexedDB/localStorage overhead

---

## Validation and Error Handling

### Input Validation

**User Message Text** (PromptComposer):
```typescript
function validateUserMessage(text: string): string | null {
  if (text.trim().length === 0) return 'Message cannot be empty'
  if (text.length > 10000) return 'Message too long (max 10,000 characters)'
  return null  // Valid
}
```

**Scope Selection**:
```typescript
const VALID_SCOPES: Scope[] = ['field', 'section', 'page', 'feature']
function isValidScope(scope: string): scope is Scope {
  return VALID_SCOPES.includes(scope as Scope)
}
```

### Error States

**AI Credits Exhausted** (FR-035):
```typescript
if (aiCreditsCount === 0) {
  // Disable composer
  // Show message: "Out of credits - purchase more to continue"
  return
}

if (aiCreditsCount < 50) {
  // Show amber warning (FR-034)
  showWarningIndicator()
}
```

**Operation Failure** (FR-027):
```typescript
// Mock AI error simulation
if (operationFails) {
  addMessage({
    type: 'log',
    text: 'Operation failed: Unable to connect to AI service. Please try again.',
    scope: currentScope,
    relatedEntityId: targetId
  })
  setBusy(false)
}
```

---

## Type Definitions Export

All types defined in this document will be exported from:

**File**: `frontend/src/types/chat.ts`

```typescript
// Re-exported from this file for use across chat components
export type {
  ChatMessage,
  ChatOperationLog,
  ChatState,
  MessageType,
  Scope,
  OperationStatus
}

// Action types for store
export type {
  AddMessagePayload,
  SetScopePayload,
  // etc.
}
```

---

## Design Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Flat message array (no threading) | Simplifies UI, matches constitutional "Command Center" linear log pattern |
| Immutable messages | Prevents accidental state corruption, simpler React rendering |
| No message IDs in URL | No deep linking needed (ephemeral session) |
| Separate OperationLog entity | Allows progress tracking without mutating ChatMessage |
| 100ms context debounce | Balances responsiveness (FR-042) with performance (prevents render thrashing) |
| No pagination for messages | 100 messages render efficiently, virtualization premature optimization |
| Scope default to 'section' | Safest starting point per FR-031 (narrower than page, broader than field) |

---

## Data Model Validation Checklist

- [x] All entities from spec "Key Entities" section defined
- [x] All FR requirements for data structure addressed
- [x] Validation rules documented for each field
- [x] Relationships clearly defined
- [x] State transitions documented where applicable
- [x] Memory constraints validated
- [x] Constitutional requirements enforced (FR-028: human-readable logs, FR-049: no persistence)
- [x] Type safety maintained (TypeScript interfaces)
- [x] Error states handled
- [x] Integration with dashboard store specified

**Status**: ✅ Data model complete and validated
