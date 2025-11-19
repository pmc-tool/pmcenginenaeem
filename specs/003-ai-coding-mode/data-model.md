# Data Model: AI Coding Mode

**Feature**: `003-ai-coding-mode`
**Created**: 2025-01-17
**Purpose**: Define entities, state structure, and validation rules for AI Coding Mode

## Entity Definitions

### 1. CodePanelState

**Purpose**: Manages the state of the read-only Code Panel display

```typescript
interface CodePanelState {
  // Core Display
  isVisible: boolean;              // Whether Code Panel is currently shown
  currentCode: string;             // Current page/section code being displayed
  filePath: string;                // Path to the file being displayed (e.g., "pages/home.tsx")
  language: SyntaxLanguage;        // Syntax highlighting language

  // Selection & Highlighting
  selectedLineStart: number | null; // Start line of current selection (Canvas sync)
  selectedLineEnd: number | null;   // End line of current selection (Canvas sync)
  highlightedRanges: CodeRange[];   // Highlighted code ranges from diff preview

  // Monaco Editor Config
  editorOptions: MonacoEditorOptions; // Read-only, minimap, theme, etc.

  // Metadata
  lastUpdated: number;             // Timestamp of last code update (epoch ms)
  isDirty: boolean;                // Whether code has pending changes
}

type SyntaxLanguage = 'typescript' | 'javascript' | 'tsx' | 'jsx' | 'css' | 'html';

interface CodeRange {
  startLine: number;
  endLine: number;
  type: 'addition' | 'deletion' | 'modification';
}

interface MonacoEditorOptions {
  readOnly: true;                  // Always true per constitution
  minimap: { enabled: boolean };
  lineNumbers: 'on' | 'off';
  theme: 'vs-light' | 'vs-dark';
  fontSize: number;
  wordWrap: 'on' | 'off';
}
```

**Validation Rules**:
- `currentCode` must be valid UTF-8 string (max 50,000 lines per SC-024)
- `filePath` must match pattern `^[a-zA-Z0-9/_-]+\.(tsx?|jsx?|css|html)$`
- `selectedLineStart` and `selectedLineEnd` must be within bounds of `currentCode` line count
- `editorOptions.readOnly` must always be `true`
- `lastUpdated` must be valid Unix timestamp (milliseconds)

**State Transitions**:
- `isVisible`: `false` → `true` when user activates AI Coding Mode
- `currentCode`: Updates when page selection changes or code change accepted
- `isDirty`: `false` → `true` when diff preview shown, `true` → `false` when accepted/rejected

---

### 2. DiffPreview

**Purpose**: Represents a proposed code change with before/after comparison

```typescript
interface DiffPreview {
  // Identity
  id: string;                      // Unique diff preview ID (UUID)
  operationId: string;             // Parent operation that generated this diff

  // Code Comparison
  oldCode: string;                 // Original code before change
  newCode: string;                 // Proposed code after change
  changes: DiffChange[];           // Line-by-line change details

  // User-Facing Summary
  summary: string;                 // Plain-language explanation (e.g., "Button color changed to blue")
  scope: DiffScope;                // What was changed (page, section, element)

  // Status
  status: DiffStatus;              // pending | accepted | rejected
  createdAt: number;               // Timestamp when diff was generated
  respondedAt: number | null;      // Timestamp when user accepted/rejected

  // Validation
  isValid: boolean;                // Whether code passed validation
  validationErrors: ValidationError[]; // Any errors found during validation
}

interface DiffChange {
  lineNumber: number;              // Line number in final code
  type: 'addition' | 'deletion' | 'modification' | 'context';
  oldContent: string | null;       // Content before (null for additions)
  newContent: string | null;       // Content after (null for deletions)
}

interface DiffScope {
  type: 'page' | 'section' | 'element';
  targetName: string;              // Name of page/section/element
  filePath: string;                // File being modified
}

type DiffStatus = 'pending' | 'accepted' | 'rejected';

interface ValidationError {
  severity: 'error' | 'warning';
  message: string;                 // User-friendly error message
  line: number | null;             // Line number where error occurred
  code: string;                    // Error code (e.g., 'TS2304', 'syntax-error')
}
```

**Validation Rules**:
- `id` must be valid UUIDv4
- `operationId` must reference an existing `CodeOperation.id`
- `changes` array must contain at least 1 change
- `changes` must be sorted by `lineNumber` ascending
- `summary` must be non-empty string (max 200 chars)
- `status` can only transition: `pending` → `accepted` OR `pending` → `rejected`
- `isValid` must be `true` before `status` can become `accepted`
- `validationErrors` with `severity: 'error'` must set `isValid: false`

**Derived Data**:
- Total lines added: `changes.filter(c => c.type === 'addition').length`
- Total lines removed: `changes.filter(c => c.type === 'deletion').length`
- Total lines modified: `changes.filter(c => c.type === 'modification').length`

---

### 3. CodeOperation

**Purpose**: Tracks AI code generation request lifecycle and progress

```typescript
interface CodeOperation {
  // Identity
  id: string;                      // Unique operation ID (UUID)
  requestId: string;               // Associated AICodeRequest.id

  // Progress Tracking
  status: OperationStatus;         // pending | running | success | error
  currentStep: string;             // Current step message (e.g., "Analyzing request...")
  stepHistory: OperationStep[];    // All steps with timestamps

  // Result
  diffPreview: DiffPreview | null; // Generated diff (null until success)
  error: OperationError | null;    // Error details (null unless status === 'error')

  // Timing
  createdAt: number;               // When operation started
  completedAt: number | null;      // When operation finished (success or error)

  // Metadata
  estimatedDuration: number;       // Estimated duration in ms (for progress bar)
}

type OperationStatus = 'pending' | 'running' | 'success' | 'error';

interface OperationStep {
  message: string;                 // Step description (e.g., "Generating code...")
  status: 'pending' | 'running' | 'complete' | 'failed';
  timestamp: number;               // When step occurred
  icon: OperationIcon;             // Icon to display
}

type OperationIcon = 'analyze' | 'generate' | 'validate' | 'check' | 'error';

interface OperationError {
  message: string;                 // User-friendly error message
  type: ErrorType;                 // Error category
  recoverable: boolean;            // Whether user can retry
  details: string | null;          // Technical details (for debugging, not shown to user)
}

type ErrorType =
  | 'ambiguous-request'            // User request unclear
  | 'validation-failed'            // Generated code invalid
  | 'network-error'                // Connection issue
  | 'ai-service-error'             // AI service unavailable
  | 'timeout'                      // Operation took too long
  | 'unknown';                     // Unexpected error
```

**Validation Rules**:
- `id` must be valid UUIDv4
- `requestId` must reference an existing `AICodeRequest.id`
- `status` transitions: `pending` → `running` → (`success` | `error`)
- Cannot transition back to `pending` or `running` after `success` or `error`
- `diffPreview` must be non-null when `status === 'success'`
- `error` must be non-null when `status === 'error'`
- `completedAt` must be `>= createdAt` when non-null
- `stepHistory` must have at least 1 step when `status !== 'pending'`

**State Transitions**:
1. Created: `status: 'pending'`, `currentStep: 'Queued'`
2. Start: `status: 'running'`, `currentStep: 'Analyzing request...'`
3. Progress: Add steps to `stepHistory`, update `currentStep`
4. Success: `status: 'success'`, set `diffPreview`, set `completedAt`
5. Failure: `status: 'error'`, set `error`, set `completedAt`

---

### 4. UndoSnapshot

**Purpose**: Stores code state for undo/redo functionality

```typescript
interface UndoSnapshot {
  // Identity
  id: string;                      // Unique snapshot ID (UUID)
  operationId: string;             // Operation that triggered this snapshot

  // Code State
  codeBefore: string;              // Code state before change
  codeAfter: string;               // Code state after change
  filePath: string;                // File that was modified

  // Metadata
  timestamp: number;               // When snapshot was created
  description: string;             // Human-readable description (e.g., "Changed button color")

  // Snapshot Position
  index: number;                   // Position in undo stack (0 = oldest)
  isCurrent: boolean;              // Whether this is the current state
}
```

**Validation Rules**:
- `id` must be valid UUIDv4
- `operationId` must reference an existing `CodeOperation.id`
- `codeBefore` and `codeAfter` must be non-empty strings
- `codeBefore` must differ from `codeAfter` (no no-op snapshots)
- `filePath` must match pattern `^[a-zA-Z0-9/_-]+\.(tsx?|jsx?|css|html)$`
- `index` must be unique within the undo stack
- Only one snapshot can have `isCurrent: true` at a time

**Stack Management**:
- Max stack size: 50 snapshots (per `FR-022` and `plan.md`)
- When stack exceeds 50, remove oldest snapshot (lowest `index`)
- All snapshots must be re-indexed when one is removed
- Stack stored in localStorage under key `pmc-code-undo-stack`

**Undo Operation**:
1. Find current snapshot (`isCurrent: true`)
2. Set `isCurrent: false` on current
3. Set `isCurrent: true` on snapshot at `index - 1`
4. Update `CodePanelState.currentCode` to `snapshot[index - 1].codeBefore`

**Redo Operation**:
1. Find current snapshot (`isCurrent: true`)
2. Set `isCurrent: false` on current
3. Set `isCurrent: true` on snapshot at `index + 1`
4. Update `CodePanelState.currentCode` to `snapshot[index + 1].codeAfter`

---

### 5. AICodeRequest

**Purpose**: Represents user's natural language request for code changes

```typescript
interface AICodeRequest {
  // Identity
  id: string;                      // Unique request ID (UUID)
  chatMessageId: string;           // Associated chat message ID

  // Request Details
  requestText: string;             // User's natural language request
  scope: RequestScope;             // What to modify
  context: RequestContext;         // Additional context for AI

  // Status
  status: RequestStatus;           // queued | processing | completed | failed
  operationId: string | null;      // Associated CodeOperation.id (null until queued)

  // Timing
  createdAt: number;               // When request was submitted
  processedAt: number | null;      // When processing started
  completedAt: number | null;      // When request finished
}

interface RequestScope {
  type: 'page' | 'section' | 'element' | 'global';
  targetId: string | null;         // ID of target page/section/element
  targetName: string;              // Display name of target
  filePath: string;                // File to modify
}

interface RequestContext {
  currentCode: string;             // Code state when request made
  selectedElement: string | null;  // Canvas-selected element (if any)
  pageMetadata: PageMetadata;      // Page structure, components used, etc.
}

interface PageMetadata {
  pageId: string;
  pageName: string;
  componentLibrary: string[];      // Available components
  styleVariables: Record<string, string>; // CSS variables
}

type RequestStatus = 'queued' | 'processing' | 'completed' | 'failed';
```

**Validation Rules**:
- `id` must be valid UUIDv4
- `chatMessageId` must reference an existing chat message
- `requestText` must be non-empty string (max 500 chars)
- `scope.filePath` must match pattern `^[a-zA-Z0-9/_-]+\.(tsx?|jsx?|css|html)$`
- `status` transitions: `queued` → `processing` → (`completed` | `failed`)
- `operationId` must be set when `status !== 'queued'`
- `processedAt` must be set when `status !== 'queued'`
- `completedAt` must be set when `status === 'completed' || status === 'failed'`

**Request Queue**:
- Max concurrent processing: 1 request at a time (per `FR-020`)
- Additional requests queued with `status: 'queued'`
- Requests processed in FIFO order based on `createdAt` timestamp

---

## State Relationships

### Zustand Store Structure

```typescript
interface CodeStore {
  // Code Panel State
  codePanel: CodePanelState;

  // Operations Queue
  operations: Record<string, CodeOperation>; // Indexed by operation ID
  operationQueue: string[];                  // Array of operation IDs in queue order

  // Diff Previews
  diffPreviews: Record<string, DiffPreview>; // Indexed by diff ID
  activeDiffId: string | null;               // Currently displayed diff

  // Undo Stack
  undoStack: UndoSnapshot[];                 // Sorted by index ascending
  currentSnapshotIndex: number;              // Index of current state
  canUndo: boolean;                          // Derived: currentSnapshotIndex > 0
  canRedo: boolean;                          // Derived: currentSnapshotIndex < stack.length - 1

  // Actions
  setCodePanelVisibility: (visible: boolean) => void;
  updateCurrentCode: (code: string) => void;
  queueCodeRequest: (request: AICodeRequest) => string; // Returns operation ID
  updateOperationProgress: (operationId: string, step: OperationStep) => void;
  completeOperation: (operationId: string, diff: DiffPreview) => void;
  failOperation: (operationId: string, error: OperationError) => void;
  acceptDiff: (diffId: string) => void;
  rejectDiff: (diffId: string) => void;
  performUndo: () => void;
  performRedo: () => void;
}
```

### Entity Relationships

```
AICodeRequest (1) ──── (1) CodeOperation
                            │
                            │
                            ▼
                        DiffPreview (1)
                            │
                            │
                            ▼
                        UndoSnapshot (1)
                            │
                            │
                            ▼
                        CodePanelState (updated)
```

**Lifecycle Flow**:
1. User submits chat message → `AICodeRequest` created
2. Request queued → `CodeOperation` created with `status: 'pending'`
3. Operation starts → `status: 'running'`, `OperationStep` updates
4. AI generates code → `DiffPreview` created with `status: 'pending'`
5. User accepts diff → `UndoSnapshot` created, `CodePanelState.currentCode` updated
6. Canvas/Inspector sync triggered by `currentCode` change

**Cross-Panel Sync**:
- `CodePanelState.currentCode` change → triggers Canvas update
- Canvas selection change → updates `CodePanelState.selectedLineStart/End`
- Inspector property change (manual edit) → updates `CodePanelState.currentCode` via diffGenerator
- Operation completion → updates operation log in Chat panel

---

## Validation & Constraints

### Performance Constraints

From `plan.md` success criteria:

- Code Panel render: `< 200ms` for files up to 1000 lines (SC-001)
- Diff generation: `< 500ms` for 1000-line files (SC-004)
- Cross-panel sync: `< 200ms` after code change (SC-004)
- Code validation: `< 300ms` per diff preview (from research.md)

**Implementation Requirements**:
- Debounce Canvas selection updates to `CodePanelState` (200ms debounce)
- Lazy-load Monaco Editor (code-split with React.lazy)
- Cache syntax highlighting results
- Limit diff preview to 500 changed lines (per plan.md scale/scope)

### Storage Constraints

- Undo stack: Max 50 snapshots in localStorage
- LocalStorage budget: ~5MB for undo stack (each snapshot ≈ 100KB max)
- In-memory operations queue: Max 10 concurrent operations (per plan.md scale/scope)

**Cleanup Strategy**:
- Remove undo snapshots older than 50 entries
- Clear completed/failed operations after 24 hours
- Purge rejected diff previews immediately

### Validation Rules Summary

| Entity | Validation |
|--------|------------|
| CodePanelState | `currentCode` max 50,000 lines, `editorOptions.readOnly` always true |
| DiffPreview | `isValid: true` required before acceptance, max 500 changed lines |
| CodeOperation | Status state machine enforced, `diffPreview` XOR `error` based on status |
| UndoSnapshot | `codeBefore ≠ codeAfter`, unique `index`, only one `isCurrent: true` |
| AICodeRequest | `requestText` max 500 chars, FIFO queue order, max 1 processing |

---

## Migration & Versioning

**Initial Version**: `1.0.0`

Future schema changes will be versioned and migrated via:
1. Add `schemaVersion: string` to localStorage persisted data
2. On load, check version and run migration functions
3. Migration functions transform old schema → new schema

**Example Migration** (if adding new field to UndoSnapshot):
```typescript
function migrateUndoStack_1_0_to_1_1(stack: UndoSnapshot[]): UndoSnapshot[] {
  return stack.map(snapshot => ({
    ...snapshot,
    newField: 'default-value' // Add new field with default
  }));
}
```

---

## Testing Considerations

**Unit Test Coverage**:
- [ ] Validate all state transitions (CodeOperation status, DiffPreview status)
- [ ] Test undo/redo stack operations (push, pop, reindex)
- [ ] Verify validation rules for all entities
- [ ] Test queue management (FIFO ordering, max concurrent)

**Integration Test Coverage**:
- [ ] Cross-panel sync (Code Panel ↔ Canvas ↔ Inspector)
- [ ] End-to-end flow: Request → Operation → Diff → Accept → Undo
- [ ] LocalStorage persistence and retrieval
- [ ] Monaco Editor initialization and update

**Edge Cases**:
- [ ] Undo stack full (50 snapshots) - oldest removed
- [ ] Multiple requests queued - processed sequentially
- [ ] Network failure during operation - error state handled
- [ ] Invalid code generated - validation catches before preview

---

**Next Phase**: API Contracts (contracts/)
