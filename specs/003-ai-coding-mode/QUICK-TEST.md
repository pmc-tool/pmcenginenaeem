# AI Coding Mode - Quick Test Reference

## 🚀 Quick Start

1. **Start dev server**: `cd frontend && npm run dev`
2. **Open browser**: `http://localhost:3000`
3. **Open Chat**: Click chat icon in left rail
4. **Send code command**: Type one of the test commands below

---

## ✅ Essential Test Commands

### Trigger Code Generation (SHOULD work):
```
Create a function to validate email addresses
Write a React component for a login form
Generate a TypeScript interface for user data
Implement a button component with hover effects
```

### Regular Chat (should NOT trigger code):
```
What is React?
Change the color to blue
Explain how hooks work
```

---

## 🎯 What to Expect

### When You Send a Code Command:

1. **Chat shows progress logs:**
   - 🔍 Analyzing code request...
   - ⚙️ Generating code...
   - ⚙️ Validating changes...
   - ✅ Code generated successfully!

2. **Code Panel opens automatically** with:
   - Side-by-side diff view
   - Green (+) additions, Red (-) deletions
   - "Accept & Apply" button (green)
   - "Reject" button (red)

3. **Diff Preview shows:**
   - Title: "Proposed Changes"
   - Statistics: "+5 added, -0 removed, ~0 modified"
   - Monaco DiffEditor with syntax highlighting
   - Plain-language explanation
   - Accept/Reject controls

---

## 🔄 Basic Workflow Test

1. **Type**: `Create a function to calculate total`
2. **Press**: Enter
3. **Wait**: ~3 seconds for mock AI to complete
4. **Review**: Diff in Code Panel
5. **Click**: "Accept & Apply" button
6. **Verify**: ✓ "Changes accepted and applied" appears
7. **Test Undo**: Click ↶ button (or Cmd+Z)
8. **Test Redo**: Click ↷ button (or Cmd+Shift+Z)

---

## ⚠️ Validation Test

The mock randomly marks ~30% of code as invalid.

**If you see validation errors:**
- ⚠️ warning banner appears
- Accept button is DISABLED
- Error messages explain issues
- Reject button still works

**Keep trying commands until you get an invalid result.**

---

## 🔍 Quick Inspection Checklist

### Code Panel UI:
- [ ] "</>" icon visible
- [ ] "Read-only" badge displayed
- [ ] Undo/Redo buttons present
- [ ] Close (X) button works
- [ ] File path shown (when code exists)

### Diff Preview:
- [ ] Side-by-side Monaco Editor
- [ ] Green/Red/Amber color indicators
- [ ] Line numbers visible
- [ ] Accept button (green, right)
- [ ] Reject button (red, left)

### Accessibility:
- [ ] Tab navigation works
- [ ] Focus indicators visible (blue outline)
- [ ] Buttons have hover states
- [ ] ARIA labels present (check DevTools)

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Code Panel doesn't open | Try more explicit command: "Create a function..." |
| Accept always disabled | Code failed validation - check warning message |
| No diff appears | Refresh page and try again |
| Monaco not loading | Run `npm install` again |

---

## 📊 Mock Behavior

**Timing:**
- Analyzing: 500ms
- Generating: 1500ms
- Validating: 800ms
- **Total**: ~2.8 seconds per request

**Validation:**
- 70% valid ✅
- 30% invalid ⚠️

**Generated Code Types:**
- "function" → JavaScript/TypeScript function
- "component" → React component
- "interface" → TypeScript interface
- "button" → Button component

---

## 🎹 Keyboard Shortcuts

| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| Undo | Cmd+Z | Ctrl+Z |
| Redo | Cmd+Shift+Z | Ctrl+Shift+Z |
| Close Chat | Esc | Esc |
| Toggle Preview | Cmd+P | Ctrl+P |

---

## 📝 Browser Console Check

Open DevTools (F12) → Console tab

**Look for:**
```
"Code generation started: op-1234567890-abc123"
```

**If missing:** Code command wasn't detected. Try different phrasing.

---

## ✨ Success Indicators

You've successfully tested the feature when:

1. ✅ Code commands trigger diff preview
2. ✅ Non-code commands go to normal chat
3. ✅ Accept/Reject buttons work correctly
4. ✅ Undo/Redo changes code state
5. ✅ Validation errors block acceptance
6. ✅ Code Panel auto-opens on code requests
7. ✅ Monaco DiffEditor displays properly
8. ✅ All UI elements have proper styling

---

## 🔗 Full Testing Guide

For comprehensive testing scenarios, see:
`/specs/003-ai-coding-mode/TESTING.md`

---

## 🆘 Need Help?

1. Check full TESTING.md guide
2. Inspect browser console for errors
3. Verify Node 20+ is active: `node --version`
4. Ensure all packages installed: `npm install`
5. Restart dev server if needed
