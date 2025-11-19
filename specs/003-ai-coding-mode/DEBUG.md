# AI Coding Mode - Debugging Guide

## Error: "An error occurred while processing your request"

This error means something went wrong during code generation. Here's how to debug it:

### Step 1: Open Browser Console

1. Open your browser at `http://localhost:3000/`
2. Press `F12` to open DevTools
3. Go to the **Console** tab
4. Keep it open while testing

### Step 2: Clear Console and Try Again

1. Click "Clear console" button (🚫 icon)
2. Type your test command in Chat:
   ```
   Create a function to validate email addresses
   ```
3. Press Enter
4. Watch the console for errors

### Step 3: Look for These Error Patterns

#### Error Pattern 1: Missing Method
```javascript
TypeError: useCodeStore.getState().addOperation is not a function
```
**Cause**: Store method doesn't exist
**Fix**: I've just added the missing methods (`addOperation`, `updateOperation`, `addDiffPreview`, `setActiveDiffId`)

#### Error Pattern 2: Type Mismatch
```javascript
TypeError: Cannot read property 'X' of undefined
```
**Cause**: Data structure mismatch
**Check**: Operations store structure

#### Error Pattern 3: Async Error
```javascript
Unhandled Promise Rejection: ...
```
**Cause**: Error in async code generation flow
**Check**: aiCodeService.ts mock implementation

###Step 4: Check Network Tab

1. Go to **Network** tab in DevTools
2. Refresh page (`Cmd+R` / `Ctrl+R`)
3. Look for:
   - ❌ Red/failed requests
   - ⚠️ 404 errors for JavaScript modules

If you see 404 errors, the build might be broken.

### Step 5: Check React DevTools (Optional)

1. Install React DevTools extension
2. Go to **Components** tab
3. Find `ChatPanel` component
4. Check the hooks section for `useCodeGeneration`

### Step 6: Add Console Logs

If the error persists, add debug logs to `/frontend/src/hooks/useCodeGeneration.ts`:

```typescript
const processMessage = useCallback(
  (message: string, scope: Scope, currentContext: string): CodeGenerationResult => {
    console.log('=== CODE GENERATION DEBUG ===');
    console.log('Message:', message);
    console.log('Scope:', scope);
    console.log('Context:', currentContext);

    const detection = detectCodeCommand(message, scope, currentContext);
    console.log('Detection result:', detection);

    if (!detection.isCodeCommand) {
      console.log('Not a code command, skipping');
      return { wasCodeCommand: false, operationId: null };
    }

    console.log('Creating code generation request...');
    const request = createCodeGenerationRequest(message, detection, scope, currentContext);
    console.log('Request:', request);

    // ... rest of code
  },
  // ...
);
```

### Step 7: Verify Store Methods Exist

Open browser console and run:

```javascript
// Check if store methods exist
const store = window.__ZUSTAND_STORES__?.codeStore || {};
console.log('Store methods:', Object.keys(store.getState()));

// Or if using React DevTools, select ChatPanel and run:
$r.props // Should show the store methods
```

### Step 8: Test Code Command Detection

Open browser console and test the detector directly:

```javascript
import { detectCodeCommand } from '/src/utils/codeCommandDetector.ts';

const result = detectCodeCommand(
  'Create a function to validate email addresses',
  'page',
  'Home'
);

console.log(result);
// Should output: { isCodeCommand: true, confidence: 0.5+, ... }
```

## Common Fixes

### Fix 1: Refresh the Page

Sometimes HMR (Hot Module Replacement) doesn't catch all changes.

1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
2. Or clear cache and refresh: `Cmd+Option+R` / `Ctrl+F5`

### Fix 2: Restart Dev Server

If hard refresh doesn't work:

1. Stop the dev server (Ctrl+C in terminal)
2. Restart: `npm run dev`
3. Wait for "ready" message
4. Refresh browser

### Fix 3: Clear Browser Storage

Sometimes old state causes issues:

1. Open DevTools → Application tab
2. Clear Storage → Clear site data
3. Refresh page

### Fix 4: Check for TypeScript Errors

Run TypeScript check:

```bash
cd frontend
npx tsc --noEmit
```

Look for errors in:
- `/src/hooks/useCodeGeneration.ts`
- `/src/store/codeStore.ts`
- `/src/utils/codeCommandDetector.ts`

## Detailed Error Troubleshooting

### Issue: "useCodeStore is not defined"

**Symptoms**: Console shows `ReferenceError: useCodeStore is not defined`

**Cause**: Import path issue

**Fix**: Check `/frontend/src/hooks/useCodeGeneration.ts` line 8:
```typescript
import { useCodeStore } from '../store/codeStore'; // Should be this
```

### Issue: "addMessage is not a function"

**Symptoms**: Console shows `TypeError: addMessage is not a function`

**Cause**: Dashboard store method missing

**Fix**: Check `/frontend/src/hooks/useCodeGeneration.ts` line 25:
```typescript
const { addMessage } = useDashboardStore();
```

Make sure `useDashboardStore` has an `addMessage` method.

### Issue: "requestCodeChange is not a function"

**Symptoms**: Console shows `TypeError: requestCodeChange is not a function`

**Cause**: AI service import issue

**Fix**: Check `/frontend/src/hooks/useCodeGeneration.ts` line 11:
```typescript
import { requestCodeChange } from '../services/aiCodeService';
```

Verify `/frontend/src/services/aiCodeService.ts` exports `requestCodeChange`.

## Testing the Fix

After applying fixes, test with this sequence:

1. **Restart everything**:
   ```bash
   # Kill dev server
   # Restart
   cd frontend && npm run dev
   ```

2. **Hard refresh browser**: `Cmd+Shift+R` / `Ctrl+Shift+R`

3. **Clear console**: Click 🚫 icon

4. **Send test command**:
   ```
   Create a function to validate email addresses
   ```

5. **Expected console output**:
   ```
   Code generation started: op-1234567890-abc123
   ```

6. **Expected UI**:
   - Progress logs in chat
   - Code Panel opens
   - Diff preview appears

## Still Not Working?

If you're still seeing the error after all fixes:

1. **Check the exact error message** in console
2. **Take a screenshot** of:
   - The console errors
   - The chat panel
   - The network tab

3. **Check file versions**:
   ```bash
   # Make sure all my changes were saved
   cat frontend/src/store/codeStore.ts | grep "setActiveDiffId"
   # Should output the method definition
   ```

4. **Verify package installation**:
   ```bash
   cd frontend
   npm list @monaco-editor/react diff
   ```
   Both should be installed.

## What Just Changed

I fixed the following issues:

1. **Added `setActiveDiffId` method** to `codeStore.ts`
   - Type definition in `CodeStore` interface (line 51)
   - Implementation (lines 249-252)

2. **Added `addOperation` method** to `codeStore.ts`
   - Type definition (line 45)
   - Implementation (lines 139-146)

3. **Added `updateOperation` method** to `codeStore.ts`
   - Type definition (line 46)
   - Implementation (lines 148-164)
   - Supports both object and function updates

4. **Added `addDiffPreview` method** to `codeStore.ts`
   - Type definition (line 51)
   - Implementation (lines 229-235)

These were missing from the initial implementation, causing the error when the `useCodeGeneration` hook tried to call them.

## HMR Status

The changes have been saved and should trigger Hot Module Replacement. The dev server should automatically reload the affected modules.

**If HMR didn't pick up the changes**, do a hard refresh or restart the dev server.

---

## Quick Test After Fix

```
1. Open http://localhost:3000/
2. Open DevTools Console (F12)
3. Click Chat icon
4. Type: "Create a function to validate email addresses"
5. Press Enter
6. Watch console for: "Code generation started: op-..."
7. Watch UI for progress logs and Code Panel opening
```

If you see the progress logs and Code Panel, the fix worked! 🎉
