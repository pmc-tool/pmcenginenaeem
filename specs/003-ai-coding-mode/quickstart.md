# Developer Quickstart: AI Coding Mode

**Feature**: `003-ai-coding-mode`
**Created**: 2025-01-17
**Purpose**: Step-by-step guide for developers to set up, develop, and test the AI Coding Mode feature

---

## Prerequisites

Before starting, ensure you have completed:
- ✅ Feature `002-chat-panel` (Chat interface for AI requests)
- ✅ Feature `001-dashboard-shell` (Dashboard layout with Canvas and Inspector)
- ✅ Node.js 20.19.5+ installed (via nvm)
- ✅ Git repository initialized
- ✅ Development server functional (`npm run dev`)

**Branch**: `003-ai-coding-mode`

---

## 1. Install Dependencies

### Monaco Editor

The Code Panel uses Monaco Editor for syntax highlighting and diff visualization:

```bash
cd frontend
npm install --save @monaco-editor/react@^4.6.0
npm install --save-dev @types/monaco-editor@^0.44.0
```

### Diff Library

For generating line-by-line diffs using Myers' algorithm:

```bash
npm install --save diff@^5.1.0
npm install --save-dev @types/diff@^5.0.0
```

### Code Validation

TypeScript and ESLint for validating generated code:

```bash
npm install --save typescript@^5.3.0
npm install --save eslint@^8.55.0
```

**Note**: TypeScript and ESLint are likely already installed. Verify versions match requirements.

### Verify Installation

```bash
npm list @monaco-editor/react diff typescript eslint
```

Expected output:
```
frontend@1.0.0
├── @monaco-editor/react@4.6.0
├── diff@5.1.0
├── typescript@5.3.0
└── eslint@8.55.0
```

---

## 2. Project Structure Setup

Create the following directories and files:

```bash
cd frontend/src

# Code Panel components
mkdir -p components/code
touch components/code/CodePanel.tsx
touch components/code/CodePanel.css
touch components/code/CodeViewer.tsx
touch components/code/DiffPreview.tsx
touch components/code/DiffPreview.css
touch components/code/DiffControls.tsx
touch components/code/DiffControls.css

# Services
touch services/aiCodeService.ts
touch services/codeValidator.ts
touch services/diffGenerator.ts

# Store
touch store/codeStore.ts
touch store/undoStack.ts

# Types
touch types/code.ts

# Utils
touch utils/diffUtils.ts

# Tests
mkdir -p ../tests/components/code
touch ../tests/components/code/CodePanel.test.tsx
touch ../tests/components/code/CodeViewer.test.tsx
touch ../tests/components/code/DiffPreview.test.tsx
touch ../tests/components/code/DiffControls.test.tsx
touch ../tests/components/code/accessibility.test.tsx

mkdir -p ../tests/services
touch ../tests/services/aiCodeService.test.ts
touch ../tests/services/codeValidator.test.ts
touch ../tests/services/diffGenerator.test.ts
```

---

## 3. Configure Monaco Editor

### 3.1 Create Monaco Wrapper Component

**File**: `src/components/code/CodeViewer.tsx`

```typescript
import Editor from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';
import { useRef, useEffect } from 'react';

interface CodeViewerProps {
  code: string;
  language: 'typescript' | 'javascript' | 'tsx' | 'jsx' | 'css' | 'html';
  highlightedRanges?: Array<{ startLine: number; endLine: number }>;
  onMount?: () => void;
}

export function CodeViewer({ code, language, highlightedRanges = [], onMount }: CodeViewerProps) {
  const editorRef = useRef<any>(null);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;
    onMount?.();
  }

  useEffect(() => {
    if (editorRef.current && highlightedRanges.length > 0) {
      // Add decorations for highlighted ranges
      const decorations = highlightedRanges.map(range => ({
        range: new monaco.Range(range.startLine, 1, range.endLine, 1),
        options: {
          isWholeLine: true,
          className: 'code-viewer__highlight',
          glyphMarginClassName: 'code-viewer__glyph-margin'
        }
      }));
      editorRef.current.deltaDecorations([], decorations);
    }
  }, [highlightedRanges]);

  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      theme="vs-light"
      options={{
        readOnly: true,              // Per constitution Section 3.IV
        minimap: { enabled: false },
        lineNumbers: 'on',
        fontSize: 14,
        wordWrap: 'off',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        contextmenu: false          // Disable right-click menu
      }}
      onMount={handleEditorDidMount}
    />
  );
}
```

### 3.2 Add Monaco CSS

**File**: `src/components/code/CodeViewer.css` (create this file)

```css
.code-viewer__highlight {
  background-color: rgba(234, 39, 36, 0.1); /* Soft red per constitution */
}

.code-viewer__glyph-margin {
  background-color: #EA2724; /* Constitution accent color */
  width: 4px !important;
}
```

---

## 4. Set Up AI Code Service (Mock)

### 4.1 Create Mock AI Service

**File**: `src/services/aiCodeService.ts`

```typescript
import type { DiffPreview, OperationStep } from '../types/code';

export interface CodeGenerationRequest {
  requestText: string;
  scope: {
    type: 'page' | 'section' | 'element';
    targetName: string;
    filePath: string;
  };
  context: {
    currentCode: string;
    selectedElement: string | null;
  };
}

export function requestCodeChange(
  request: CodeGenerationRequest,
  onProgress: (step: OperationStep) => void,
  onComplete: (diffPreview: DiffPreview) => void,
  onError: (error: { message: string; type: string }) => void
): () => void {
  // Mock SSE simulation with setTimeout
  const steps: Array<{ message: string; icon: any; delay: number }> = [
    { message: 'Analyzing request...', icon: 'analyze', delay: 500 },
    { message: 'Generating code...', icon: 'generate', delay: 1500 },
    { message: 'Validating changes...', icon: 'validate', delay: 800 }
  ];

  let currentStepIndex = 0;
  let timeouts: NodeJS.Timeout[] = [];
  let cancelled = false;

  function runNextStep() {
    if (cancelled || currentStepIndex >= steps.length) {
      if (!cancelled) {
        // Simulate completion with mock diff
        onComplete(generateMockDiff(request));
      }
      return;
    }

    const step = steps[currentStepIndex];
    onProgress({
      message: step.message,
      status: 'running',
      timestamp: Date.now(),
      icon: step.icon
    });

    const timeout = setTimeout(() => {
      onProgress({
        message: step.message,
        status: 'complete',
        timestamp: Date.now(),
        icon: step.icon
      });
      currentStepIndex++;
      runNextStep();
    }, step.delay);

    timeouts.push(timeout);
  }

  runNextStep();

  // Return cancel function
  return () => {
    cancelled = true;
    timeouts.forEach(clearTimeout);
  };
}

function generateMockDiff(request: CodeGenerationRequest): DiffPreview {
  // TODO: Replace with actual API call to AI service
  const operationId = crypto.randomUUID();

  return {
    id: crypto.randomUUID(),
    operationId,
    oldCode: request.context.currentCode,
    newCode: request.context.currentCode.replace('red', 'blue'), // Mock change
    changes: [
      {
        lineNumber: 1,
        type: 'modification',
        oldContent: request.context.currentCode,
        newContent: request.context.currentCode.replace('red', 'blue')
      }
    ],
    summary: `Changed ${request.scope.targetName} as requested`,
    scope: {
      type: request.scope.type,
      targetName: request.scope.targetName,
      filePath: request.scope.filePath
    },
    status: 'pending',
    createdAt: Date.now(),
    respondedAt: null,
    isValid: true,
    validationErrors: []
  };
}
```

### 4.2 Create Diff Generator

**File**: `src/services/diffGenerator.ts`

```typescript
import * as Diff from 'diff';
import type { DiffChange } from '../types/code';

export function generateDiff(oldCode: string, newCode: string): DiffChange[] {
  const diffResult = Diff.diffLines(oldCode, newCode);
  const changes: DiffChange[] = [];
  let lineNumber = 1;

  diffResult.forEach(part => {
    const lines = part.value.split('\n').filter(line => line.length > 0);

    if (part.added) {
      lines.forEach(line => {
        changes.push({
          lineNumber: lineNumber++,
          type: 'addition',
          oldContent: null,
          newContent: line
        });
      });
    } else if (part.removed) {
      lines.forEach(line => {
        changes.push({
          lineNumber: lineNumber,
          type: 'deletion',
          oldContent: line,
          newContent: null
        });
      });
    } else {
      // Context lines (unchanged)
      lines.forEach(line => {
        changes.push({
          lineNumber: lineNumber++,
          type: 'context',
          oldContent: line,
          newContent: line
        });
      });
    }
  });

  return changes;
}
```

---

## 5. Development Workflow

### 5.1 Start Development Server

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v4.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 5.2 Enable AI Coding Mode

1. Navigate to `http://localhost:5173`
2. Open the Chat panel (002-chat-panel should be functional)
3. Click the "Code" icon in the left rail to toggle AI Coding Mode
4. Verify Code Panel appears on the right side

**Expected State**:
- Code Panel visible with read-only Monaco Editor
- Current page code displayed
- Syntax highlighting active
- No manual editing allowed (cursor appears but typing has no effect)

### 5.3 Test Code Change Request

1. In Chat panel, type: `"Change the button color to blue"`
2. Click Send (or press Enter)
3. Observe operation log with progressive steps:
   - "Analyzing request..." (with spinning icon)
   - "Generating code..." (with generate icon)
   - "Validating changes..." (with validate icon)
4. After ~2-3 seconds, diff preview appears
5. Verify diff shows old code (red) vs. new code (green) side-by-side
6. Click "Accept" button
7. Verify Canvas updates immediately
8. Verify Inspector shows new property values
9. Verify Code Panel shows updated code

---

## 6. Testing Guide

### 6.1 Unit Tests

Run unit tests for individual components:

```bash
npm test -- CodePanel.test.tsx
npm test -- DiffPreview.test.tsx
npm test -- aiCodeService.test.ts
```

### 6.2 Integration Tests

Test cross-panel sync:

```bash
npm test -- code-chat-integration.test.tsx
npm test -- code-sync.test.tsx
```

### 6.3 Accessibility Tests

Validate WCAG AA compliance:

```bash
npm test -- accessibility.test.tsx
```

**Expected**: All tests pass with no accessibility violations (jest-axe)

### 6.4 Manual Testing Checklist

**Code Panel Display (User Story 1)**:
- [ ] Code Panel appears when AI Coding Mode activated
- [ ] Code is read-only (cannot type or edit)
- [ ] Syntax highlighting works for TypeScript/JSX
- [ ] Line numbers displayed
- [ ] Canvas selection highlights corresponding code lines

**Code Change Request (User Story 2)**:
- [ ] Chat request triggers operation log
- [ ] Operation log shows progressive steps
- [ ] Diff preview displays after operation completes
- [ ] Accept button applies changes
- [ ] Reject button discards changes
- [ ] Canvas updates after acceptance
- [ ] Inspector updates after acceptance

**Operation Logs (User Story 3)**:
- [ ] Operation logs show status (pending/running/success/error)
- [ ] Step messages update in real-time
- [ ] Error messages are user-friendly
- [ ] Logs remain in Chat history

**Diff Preview (User Story 4)**:
- [ ] Side-by-side comparison shows old vs. new code
- [ ] Additions highlighted in green
- [ ] Deletions highlighted in red
- [ ] Modifications highlighted in yellow
- [ ] Plain-language summary displayed

**Cross-Panel Sync (User Story 5)**:
- [ ] Code Panel → Canvas sync (<200ms)
- [ ] Code Panel → Inspector sync (<200ms)
- [ ] Canvas selection → Code Panel highlight sync

**Undo (User Story 6)**:
- [ ] Undo button reverts most recent change
- [ ] Code Panel, Canvas, and Inspector all revert
- [ ] Multiple undo operations work in sequence

**Edge Cases**:
- [ ] Ambiguous request shows error message
- [ ] Invalid generated code blocked before preview
- [ ] Network failure shows appropriate error
- [ ] Multiple requests queued and processed sequentially

---

## 7. Debugging

### 7.1 Monaco Editor Not Rendering

**Symptom**: Code Panel shows blank area instead of code

**Fix**:
1. Check browser console for errors
2. Verify `@monaco-editor/react` installed correctly
3. Ensure `Editor` component has `height="100%"` and parent has defined height
4. Check that language prop matches valid Monaco language ID

### 7.2 Diff Not Updating

**Symptom**: Diff preview shows old code even after changes

**Fix**:
1. Verify `diffGenerator.ts` is returning correct `DiffChange[]` array
2. Check Zustand store `diffPreviews` state is updating
3. Ensure `activeDiffId` is set correctly
4. Inspect `DiffPreview` component props with React DevTools

### 7.3 Canvas Not Syncing

**Symptom**: Canvas doesn't update after accepting code changes

**Fix**:
1. Verify `CodePanelState.currentCode` is updating in Zustand store
2. Check that Canvas component is subscribed to `currentCode` changes
3. Ensure Canvas re-render is triggered (use `useEffect` with `currentCode` dependency)
4. Validate code change is syntactically correct (invalid code may block Canvas update)

### 7.4 Operation Logs Not Appearing

**Symptom**: Chat panel doesn't show operation logs during code generation

**Fix**:
1. Check `aiCodeService.ts` is calling `onProgress` callback
2. Verify `OperationLog` component is rendering in Chat panel
3. Ensure `operations` state in Zustand store is updating
4. Check that `OperationLog` CSS is loading (look for styled operation bubbles)

---

## 8. Performance Optimization

### 8.1 Monaco Editor Lazy Loading

Prevent Monaco from blocking initial page load:

**File**: `src/components/code/CodePanel.tsx`

```typescript
import { lazy, Suspense } from 'react';

const CodeViewer = lazy(() => import('./CodeViewer').then(m => ({ default: m.CodeViewer })));

export function CodePanel() {
  return (
    <Suspense fallback={<div>Loading Code Panel...</div>}>
      <CodeViewer code={code} language="tsx" />
    </Suspense>
  );
}
```

### 8.2 Debounce Canvas Selection Updates

Prevent excessive Code Panel updates during Canvas interactions:

**File**: `src/utils/debounce.ts` (should already exist from 002-chat-panel)

```typescript
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
```

Usage in Canvas component:

```typescript
import { debounce } from '../utils/debounce';

const debouncedUpdateCodePanel = debounce((lineStart, lineEnd) => {
  codePanelStore.setSelectedLines(lineStart, lineEnd);
}, 200);
```

---

## 9. Production Checklist

Before merging `003-ai-coding-mode` branch:

- [ ] All unit tests passing (`npm test`)
- [ ] All integration tests passing
- [ ] Accessibility tests passing (jest-axe, no violations)
- [ ] Manual testing checklist completed
- [ ] Performance metrics met:
  - [ ] Code Panel renders <200ms for 1000-line files
  - [ ] Diff generation <500ms
  - [ ] Cross-panel sync <200ms
- [ ] Constitution compliance verified:
  - [ ] Code Panel is read-only (cannot edit directly)
  - [ ] All AI operations show operation logs
  - [ ] Diff previews shown before acceptance
  - [ ] WCAG AA accessibility maintained
- [ ] Mock AI service replaced with production API
- [ ] Error handling for all edge cases
- [ ] Undo stack persisted to localStorage
- [ ] Documentation updated (README, CLAUDE.md)

---

## 10. Next Steps

After completing this quickstart:

1. **Run `/speckit.tasks`** to generate detailed task breakdown
2. **Implement Code Panel** (User Story 1 - P1 priority)
3. **Integrate with Chat** (User Story 2 - P1 priority)
4. **Add Operation Logs** (User Story 3 - P2 priority)
5. **Implement Diff Preview** (User Story 4 - P2 priority)
6. **Enable Cross-Panel Sync** (User Story 5 - P2 priority)
7. **Add Undo Feature** (User Story 6 - P3 priority)

Refer to `plan.md` for detailed architecture and `data-model.md` for state structure.

---

**Questions?** Check `spec.md` for functional requirements, `research.md` for technology decisions, and `contracts/` for API schemas.
