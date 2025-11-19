# AI Coding Mode - Manual Testing Guide

This guide explains how to test the AI Coding Mode feature using the mock implementation.

## Prerequisites

1. **Dev server running**: Ensure the dev server is running on `http://localhost:3000/`
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open browser**: Navigate to `http://localhost:3000/` in your browser

## Feature Overview

The AI Coding Mode consists of:
- **Code Panel**: Read-only Monaco Editor view
- **Chat Panel**: AI assistant for generating code
- **Diff Preview**: Side-by-side code comparison
- **Accept/Reject Controls**: Approve or decline code changes

---

## Test Scenario 1: Open Code Panel Manually

### Steps:
1. In the dashboard, look for the Code Panel (it may be hidden initially)
2. The Code Panel should be on the right side of the screen
3. If visible, you should see:
   - Header with "</>" icon and "Code Panel" title
   - "Read-only" badge
   - Undo/Redo buttons (disabled if no history)
   - Close button (X)
   - Empty state message: "No code to display"

### Expected Result:
- Code Panel displays empty state
- All UI elements are properly styled
- Buttons have proper hover states and tooltips

---

## Test Scenario 2: Trigger Code Generation via Chat

### Steps:
1. **Open Chat Panel**: Click the Chat icon in the left rail
2. **Type a code-related command** in the chat input. Try one of these:

   **Example Commands:**
   ```
   Create a function to validate email addresses
   ```
   ```
   Write a React component for a login form
   ```
   ```
   Generate a TypeScript interface for user data
   ```
   ```
   Implement a button component with hover effects
   ```
   ```
   Add a method to format dates
   ```

3. **Send the message**: Press Enter or click Send button

### Expected Result:
1. **User message appears** in chat
2. **Chat shows busy state** (AI is "thinking")
3. **Progress log messages appear** sequentially:
   - 🔍 "Analyzing code request..."
   - ⚙️ "Generating code..." (or similar icon)
   - ⚙️ "Validating changes..."
   - ✅ "Code generated successfully! Review the changes in the Code Panel."
4. **Code Panel automatically opens** (if it was closed)
5. **Diff preview displays** with:
   - Title: "Proposed Changes"
   - Summary description
   - Statistics: "+X added, -Y removed, ~Z modified"
   - Side-by-side Monaco DiffEditor
   - Plain-language explanation: "What's changing?"
   - Accept & Apply button (green)
   - Reject button (red)
6. **AI response message** in chat explaining the changes

### What the Mock Does:
The mock AI service (`aiCodeService.ts`) simulates:
- Progressive operation logs with delays
- Realistic code generation (creates simple function/component)
- Validation (randomly marks some as valid/invalid)
- Diff generation between empty code and generated code

---

## Test Scenario 3: Review Diff Preview

### Steps:
1. After triggering code generation, examine the Diff Preview in Code Panel
2. Check the following elements:

### Expected Elements:
- **Header Section**:
  - "Proposed Changes" title
  - Summary text (e.g., "Generated validateEmail function")
  - Validation status (✓ or ⚠️ warning if invalid)

- **Statistics Bar**:
  - Green indicator: "+N added"
  - Red indicator: "-N removed"
  - Amber indicator: "~N modified"

- **Monaco DiffEditor**:
  - Side-by-side view (Original | Modified)
  - Line numbers
  - Syntax highlighting
  - Green/red/amber highlighting for changes

- **Explanation Section**:
  - "What's changing?" title
  - Plain-language description

- **Controls**:
  - Reject button (left, outlined red)
  - Accept & Apply button (right, solid green)
  - Hint text: "Review the changes carefully..."

### Interactions to Test:
- **Scroll through diff**: Monaco editor should scroll smoothly
- **Hover over buttons**: Tooltips and hover states appear
- **Validation errors**: If code is invalid, Accept button is disabled with explanation

---

## Test Scenario 4: Accept Code Changes

### Steps:
1. After reviewing the diff, click **"Accept & Apply"** button
2. Observe the changes

### Expected Result:
1. **Diff controls disappear**
2. **Status message appears**:
   - ✓ icon (green checkmark)
   - "Changes accepted and applied" text
3. **Code Panel updates** to show the new code (no longer diff view)
4. **Undo button becomes enabled**
5. **Chat shows confirmation** (optional, depending on implementation)

### What Happens Behind the Scenes:
- `acceptDiff(diffId)` is called in `codeStore`
- Diff status changes from 'pending' to 'accepted'
- Code Panel's `currentCode` is updated with new code
- Undo snapshot is created
- Active diff ID is cleared

---

## Test Scenario 5: Reject Code Changes

### Steps:
1. After code generation, click **"Reject"** button instead of Accept
2. Observe the changes

### Expected Result:
1. **Diff controls disappear**
2. **Status message appears**:
   - ✕ icon (red X)
   - "Changes rejected" text
3. **Code Panel remains showing the diff** (or returns to previous state)
4. **No undo snapshot created**

### What Happens Behind the Scenes:
- `rejectDiff(diffId)` is called in `codeStore`
- Diff status changes from 'pending' to 'rejected'
- Code Panel's `currentCode` remains unchanged
- Active diff ID is cleared

---

## Test Scenario 6: Invalid Code Validation

The mock validator randomly marks some code as invalid. To see this:

### Steps:
1. Keep sending code generation requests until you get an invalid result
2. Look for validation error display

### Expected Result When Invalid:
1. **Warning section appears** above diff statistics:
   - ⚠️ icon
   - "Validation Failed" title
   - Error message(s) explaining the issue
   - Example: "Line 5: Missing semicolon"

2. **Accept button is disabled**:
   - Grayed out appearance
   - Tooltip: "Accept disabled - validation errors exist"

3. **Warning message below buttons**:
   - "Cannot accept changes - validation errors must be fixed first"

4. **Reject button still works** (you can reject invalid code)

### Mock Behavior:
The `codeValidator.ts` performs basic checks:
- Unclosed JSX tags
- Missing function bodies
- Invalid TypeScript syntax
- Code quality warnings (long functions, console.log)

---

## Test Scenario 7: Undo/Redo Functionality

### Steps:
1. Accept a code change (to create undo history)
2. Click the **Undo button** (↶) in Code Panel header
3. Click the **Redo button** (↷)

### Expected Result:
1. **Undo** (Cmd+Z / Ctrl+Z):
   - Code reverts to previous state
   - Redo button becomes enabled
   - Undo button may become disabled (if at first snapshot)

2. **Redo** (Cmd+Shift+Z / Ctrl+Shift+Z):
   - Code returns to next state
   - Undo button becomes enabled again

### Keyboard Shortcuts:
- **Undo**: `Cmd+Z` (Mac) or `Ctrl+Z` (Windows/Linux)
- **Redo**: `Cmd+Shift+Z` (Mac) or `Ctrl+Shift+Z` (Windows/Linux)

### What Happens:
- `performUndo()` / `performRedo()` are called
- Current snapshot index changes
- Code Panel updates with snapshot's code
- `canUndo` / `canRedo` flags update button states

---

## Test Scenario 8: Code Command Detection

Test the pattern matching system by trying different phrases:

### Commands That SHOULD Trigger Code Generation:
```
✅ "Create a function to calculate total"
✅ "Write a React component for a button"
✅ "Generate an interface for User type"
✅ "Implement a toggle switch component"
✅ "Add a method to validate phone numbers"
✅ "Fix the bug in the login function"
✅ "Refactor this code to use hooks"
✅ "Show me code for a date picker"
```

### Commands That SHOULD NOT Trigger Code Generation:
```
❌ "What is React?"
❌ "Explain how hooks work"
❌ "Change the color to blue"
❌ "Update the homepage title"
❌ "Tell me about TypeScript"
```

### Expected Behavior:
- Code commands: Chat → Code Panel with diff
- Non-code commands: Regular AI response in chat only
- You can monitor this in browser console: `"Code generation started: <operationId>"` or no log

---

## Test Scenario 9: Multiple Code Generations

### Steps:
1. Trigger first code generation (e.g., "Create a login function")
2. Accept or reject the changes
3. Trigger second code generation (e.g., "Create a logout function")
4. Repeat several times

### Expected Result:
1. **Each operation gets unique ID**
2. **Operation logs appear in chat** for each request
3. **New diff replaces old diff** in Code Panel
4. **Undo stack accumulates** (if accepting changes)
5. **Multiple snapshots available** for undo (up to 50)

### Edge Cases to Check:
- Accepting 5+ changes in a row (undo stack should work)
- Rejecting then accepting (only accepted changes in undo)
- Generating while diff is pending (new request should replace)

---

## Test Scenario 10: Accessibility Features

### Keyboard Navigation:
1. **Tab through Code Panel controls**:
   - Undo button
   - Redo button
   - Close button
   - Accept button
   - Reject button

2. **Focus indicators visible**: Blue outline on focused elements

3. **Screen reader support**:
   - Open browser's screen reader
   - Navigate to Code Panel
   - Should announce: "Code Panel, complementary region"
   - Should announce: "Read-only code view for the current page"

### ARIA Labels to Verify (inspect in DevTools):
- Code Panel: `role="complementary"` `aria-label="Code Panel"`
- Diff Preview: `role="region"` `aria-label="Code change preview"`
- Accept button: `aria-label="Accept and apply changes"` (or disabled variant)
- Reject button: `aria-label="Reject changes"`
- Validation errors: `role="alert"`

---

## Test Scenario 11: Responsive Behavior

### Steps:
1. Resize browser window to different widths:
   - Desktop: 1920px
   - Tablet: 768px
   - Mobile: 375px

### Expected Result:
1. **Code Panel**:
   - Maintains readable width
   - Diff editor adjusts height on mobile

2. **Diff Controls**:
   - Buttons stack vertically on mobile (<768px)
   - Full width buttons on mobile

3. **Monaco Editor**:
   - Minimap disabled (always)
   - Line numbers remain visible
   - Side-by-side diff may switch to inline on very narrow screens

---

## Test Scenario 12: Mock AI Service Behavior

To understand what's happening under the hood:

### Mock Implementation Details:
Located in `/frontend/src/services/aiCodeService.ts`

**Simulated Steps:**
1. **Analyzing** (500ms delay): Parses request
2. **Generating** (1500ms delay): Creates mock code based on prompt keywords
3. **Validating** (800ms delay): Runs basic syntax/quality checks

**Generated Code Examples:**
- "create function" → JavaScript/TypeScript function
- "component" → React component
- "interface" → TypeScript interface
- "button" → Button component with props

**Random Validation:**
- 70% chance: Valid code ✅
- 30% chance: Invalid code with errors ⚠️

### To Modify Mock Behavior:
Edit `/frontend/src/services/aiCodeService.ts`:
- Change delays in `MOCK_OPERATION_STEPS`
- Adjust validation probability
- Customize generated code templates

---

## Test Scenario 13: Console Debugging

### Steps:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Trigger code generation

### Expected Console Logs:
```javascript
"Code generation started: op-1234567890-abc123"
```

### Store Inspection (Redux DevTools equivalent):
Use React DevTools or add console logs:
```javascript
// In ChatPanel.tsx, add:
console.log('Code Result:', codeResult);

// In useCodeStore, access state:
useCodeStore.getState() // View entire state
```

---

## Test Scenario 14: State Persistence

### Steps:
1. Accept 2-3 code changes
2. Refresh the page (F5)

### Expected Result:
**Note**: In MVP, state is NOT persisted across refreshes.
- Code Panel resets to empty
- Undo history is lost
- Chat messages are cleared

**Why**: Per spec, undo stack uses in-memory storage for MVP. LocalStorage persistence is planned for Phase 10.

---

## Common Issues & Troubleshooting

### Issue: Code Panel doesn't open automatically
**Solution**: Check if code command was detected. Look for console log "Code generation started". If missing, try more explicit commands like "Create a function..."

### Issue: Accept button is always disabled
**Solution**: Your generated code failed validation. Check the validation error messages above the diff. The mock validator has strict rules.

### Issue: Diff shows no changes
**Solution**: The mock diff generator compares old code (empty) vs new code. If both are empty, no diff appears. This shouldn't happen with the mock service.

### Issue: Monaco Editor not loading
**Solution**: Check browser console for import errors. Ensure `@monaco-editor/react` is installed: `npm list @monaco-editor/react`

### Issue: Chat not detecting code commands
**Solution**: Check `/frontend/src/utils/codeCommandDetector.ts` patterns. The detector looks for keywords like "create", "function", "component", "implement", etc.

---

## Next Steps: Testing with Real AI

Once you integrate a real AI backend:

1. **Replace mock service**: Update `/frontend/src/services/aiCodeService.ts` to call your API
2. **Update endpoints**: Use contracts in `/specs/003-ai-coding-mode/contracts/ai-code-api.yaml`
3. **SSE implementation**: Replace setTimeout with actual EventSource for streaming
4. **Validation**: Connect to real TypeScript compiler API or linter

---

## Automated Testing (Future)

For automated tests, see Phase 9 tasks (T061-T070):
- Unit tests for code detector
- Integration tests for code generation flow
- E2E tests for accept/reject workflow
- Accessibility tests (axe-core)

Run tests with:
```bash
npm test -- --run
```

---

## Success Criteria Checklist

Use this to verify MVP completion:

- [ ] FR-001: Code Panel is read-only (no edit cursors, context menu disabled)
- [ ] FR-002: Code Panel opens via chat command
- [ ] FR-003: Monaco Editor displays with syntax highlighting
- [ ] FR-004: Line numbers visible
- [ ] FR-006: Chat detects code-related commands
- [ ] FR-007: Side-by-side diff preview appears
- [ ] FR-008: Diff uses green/red/amber colors per constitution
- [ ] FR-009: Accept & Reject buttons work
- [ ] FR-010: Undo/Redo via buttons and keyboard shortcuts
- [ ] FR-019: Plain-language explanations appear
- [ ] WCAG AA: All interactive elements have focus indicators
- [ ] WCAG AA: Proper ARIA labels on all regions
- [ ] Performance: Diff appears in <500ms (mock)

---

## Feedback & Reporting Issues

If you encounter issues:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Ensure dev server is running on Node 20+
4. Check network tab for failed imports

For bugs, note:
- Browser & version
- Console errors
- Steps to reproduce
- Expected vs actual behavior
