# Refactored Components Testing Checklist

**Purpose**: Testing checklist for components refactored in Phase 4
**Last Updated**: 2025-11-19
**Status**: Ready for testing

---

## Overview

This checklist ensures thorough testing of refactored components before swapping them with originals.

**Components to Test**:
1. DeployPanel.refactored.tsx
2. ChatPanel.refactored.tsx
3. AITrainingPanel.refactored.tsx

**Testing Approach**:
- Manual testing first
- Automated tests second
- User acceptance third
- Swap only after all checks pass

---

## DeployPanel.refactored.tsx

### Functional Testing

#### Confirmation Dialog
- [ ] Opens on mount
- [ ] Shows correct title ("Deploy this theme?")
- [ ] Shows explanation text
- [ ] "Yes, deploy" button works
- [ ] "Cancel" button works
- [ ] Closes on cancel
- [ ] Starts deployment on confirm

#### Deployment Progress
- [ ] Shows "Setting up your site" title during deployment
- [ ] DeploymentSteps component displays correctly
- [ ] Steps update in real-time
- [ ] Current step highlighted
- [ ] Terminal logs display
- [ ] Logs are initially collapsed
- [ ] Logs can be expanded/collapsed
- [ ] Progress updates smoothly

#### Success State
- [ ] Shows "Your site is live!" title
- [ ] Success message displays
- [ ] "Go to Preview" button works
- [ ] "Edit with AI" button works
- [ ] Redirects to preview correctly
- [ ] Opens chat with AI correctly

#### Error State
- [ ] Shows "Deployment failed" title
- [ ] Error message displays
- [ ] "Retry" button works
- [ ] "View Logs" expands logs
- [ ] "Open AI Help" button works
- [ ] Logs expand automatically on error

#### UI/UX
- [ ] Close button (×) works
- [ ] Close button shows correct tooltip
- [ ] Panel has correct overlay/backdrop
- [ ] Animations smooth (fade in/out)
- [ ] No visual glitches

### Integration Testing

- [ ] Integrates with useDeploymentFlow hook
- [ ] Integrates with DeploymentStore
- [ ] Integrates with ThemesStore
- [ ] Updates theme status correctly
- [ ] Calls deployment service correctly

### Accessibility Testing

- [ ] role="dialog" present
- [ ] aria-modal="true" present
- [ ] aria-labelledby points to title
- [ ] Live region announces status
- [ ] Keyboard navigation works
- [ ] Focus management correct
- [ ] ESC key closes (if appropriate)
- [ ] Screen reader announces changes

### Performance Testing

- [ ] No memory leaks
- [ ] Render time acceptable
- [ ] Updates don't cause lag
- [ ] Cleanup on unmount works

### Regression Testing

- [ ] All original functionality preserved
- [ ] No new bugs introduced
- [ ] User flow unchanged
- [ ] Data flow identical

### Comparison with Original

- [ ] Visual appearance matches
- [ ] Behavior identical
- [ ] Error handling same
- [ ] Loading states match
- [ ] No missing features

---

## ChatPanel.refactored.tsx

### Functional Testing

#### Basic Display
- [ ] Panel renders correctly
- [ ] Correct width (panelWidth px)
- [ ] Resize handle appears
- [ ] Header displays
- [ ] Message list displays
- [ ] Bottom AI panel displays
- [ ] Input bar displays

#### Message Functionality
- [ ] Can send messages
- [ ] User messages display
- [ ] AI responses display
- [ ] Log messages display
- [ ] Messages can be collapsed/expanded
- [ ] "View change" links work
- [ ] Message timestamps display

#### Chat Features
- [ ] Scope selector works
- [ ] Model selector works
- [ ] Context updates correctly (debounced)
- [ ] Clear conversation works
- [ ] AI credits count displays
- [ ] Input disabled when busy
- [ ] Input disabled when no credits

#### Special Commands
- [ ] "demo code" triggers code generation
- [ ] Code generation demo works
- [ ] Chat processes normal messages
- [ ] Operation logs display

#### Panel Controls
- [ ] Resize handle works
- [ ] Panel resizes smoothly
- [ ] Min width enforced (280px)
- [ ] Max width enforced (600px)
- [ ] Close button works

### Integration Testing

- [ ] Integrates with useChatFlow hook
- [ ] Integrates with DashboardStore
- [ ] Integrates with CodeStore
- [ ] Integrates with useCodeGeneration
- [ ] Context syncs with page/section selection
- [ ] Debounce works (100ms delay)

### Accessibility Testing

- [ ] role="complementary" present
- [ ] aria-label="AI Chat Assistant"
- [ ] aria-describedby points to description
- [ ] Screen reader description present (sr-only)
- [ ] Focus moves to input on open
- [ ] Focus returns on close
- [ ] Resize handle has separator role
- [ ] Keyboard accessible

### Performance Testing

- [ ] useDebounce reduces context updates
- [ ] Message list renders efficiently
- [ ] No lag when typing
- [ ] Resize smooth

### Regression Testing

- [ ] All chat features work
- [ ] Code generation works
- [ ] Message history preserved
- [ ] Scope changes work

### Comparison with Original

- [ ] UI identical
- [ ] Behavior same
- [ ] All features present
- [ ] No regressions

---

## AITrainingPanel.refactored.tsx

### Functional Testing

#### Loading State
- [ ] Shows LoadingState component on mount
- [ ] Shows "Loading training panel..." message
- [ ] Loading spinner animates
- [ ] Transitions to content when loaded

#### Header
- [ ] Title "AI Training" displays
- [ ] Description displays
- [ ] Completion badge shows correct count
- [ ] Save button displays
- [ ] Discard button displays
- [ ] Buttons disabled when not dirty
- [ ] Buttons enabled when dirty
- [ ] Save button shows "Saving..." during save

#### Error Handling
- [ ] Error displays when save fails
- [ ] Error dismissable (× button)
- [ ] Error shows correct message

#### Content
- [ ] TrainingStepper displays
- [ ] Active section renders
- [ ] Section switches correctly
- [ ] Form data persists between sections

#### Unsaved Changes
- [ ] isDirty tracked correctly
- [ ] Browser warning shows on leave
- [ ] Discard reverts changes
- [ ] Save persists changes

### Integration Testing

- [ ] Integrates with useTrainingStore
- [ ] Integrates with LoadingState component
- [ ] Integrates with AITrainingHeader
- [ ] Profile loads correctly
- [ ] Profile saves correctly

### Accessibility Testing

- [ ] Loading state has role="status"
- [ ] Proper heading structure
- [ ] Buttons keyboard accessible
- [ ] Form sections accessible

### Performance Testing

- [ ] Loads quickly
- [ ] Section switches smooth
- [ ] No lag when typing

### Regression Testing

- [ ] All training features work
- [ ] Data persistence works
- [ ] Validation works

### Comparison with Original

- [ ] Loading state cleaner (uses LoadingState component)
- [ ] Header extracted (cleaner code)
- [ ] Functionality identical
- [ ] No missing features

---

## Cross-Component Testing

### All Refactored Components

- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] No console errors
- [ ] Imports resolve correctly
- [ ] CSS classes apply correctly
- [ ] Design tokens used correctly

---

## Test Execution Plan

### Phase 1: Manual Testing (Developer)

**Estimated Time**: 4 hours

1. Test each component individually
2. Check all items in checklists above
3. Document any issues found
4. Fix issues
5. Retest

### Phase 2: Automated Testing

**Estimated Time**: 8 hours

1. Write unit tests for hooks:
   - useDeploymentFlow
   - useChatFlow

2. Write component tests:
   - DeployConfirmation
   - DeploySuccess
   - AITrainingHeader

3. Write integration tests:
   - Full deployment flow
   - Chat message flow
   - Training data flow

4. Run tests, achieve > 80% coverage

### Phase 3: User Acceptance Testing

**Estimated Time**: 2 hours

1. Have product owner test each component
2. Verify matches requirements
3. Verify UX acceptable
4. Get sign-off

### Phase 4: Swap Components

**Estimated Time**: 1 hour

1. Rename original files:
   ```bash
   git mv DeployPanel.tsx DeployPanel.original.tsx
   git mv ChatPanel.tsx ChatPanel.original.tsx
   git mv AITrainingPanel.tsx AITrainingPanel.original.tsx
   ```

2. Rename refactored files:
   ```bash
   git mv DeployPanel.refactored.tsx DeployPanel.tsx
   git mv ChatPanel.refactored.tsx ChatPanel.tsx
   git mv AITrainingPanel.refactored.tsx AITrainingPanel.tsx
   ```

3. Test in development environment

4. If issues found, revert:
   ```bash
   git checkout DeployPanel.tsx ChatPanel.tsx AITrainingPanel.tsx
   ```

5. If all good, commit:
   ```bash
   git add .
   git commit -m "refactor: swap refactored components with originals"
   ```

6. Archive originals:
   ```bash
   mkdir -p src/components/__archive
   git mv *.original.tsx src/components/__archive/
   ```

---

## Sign-Off Checklist

### DeployPanel

- [ ] Developer tested (all checks pass)
- [ ] Automated tests written and passing
- [ ] User acceptance complete
- [ ] Code reviewed
- [ ] Ready to swap

**Signed**: _____________ Date: _____________

### ChatPanel

- [ ] Developer tested (all checks pass)
- [ ] Automated tests written and passing
- [ ] User acceptance complete
- [ ] Code reviewed
- [ ] Ready to swap

**Signed**: _____________ Date: _____________

### AITrainingPanel

- [ ] Developer tested (all checks pass)
- [ ] Automated tests written and passing
- [ ] User acceptance complete
- [ ] Code reviewed
- [ ] Ready to swap

**Signed**: _____________ Date: _____________

---

## Rollback Plan

If issues discovered after swap:

1. **Immediately revert**:
   ```bash
   git revert HEAD
   ```

2. **Restore originals**:
   ```bash
   git checkout src/components/__archive/DeployPanel.original.tsx
   git mv DeployPanel.original.tsx DeployPanel.tsx
   ```

3. **Document issue**:
   - What broke
   - Steps to reproduce
   - Expected vs actual behavior

4. **Fix in refactored version**:
   - Address root cause
   - Add test to prevent regression
   - Retest fully

5. **Attempt swap again**

---

## Success Criteria

A refactored component is ready to swap when:

- ✅ All functional tests pass
- ✅ All integration tests pass
- ✅ All accessibility tests pass
- ✅ Automated test coverage > 80%
- ✅ Performance equal or better than original
- ✅ No regressions identified
- ✅ User acceptance obtained
- ✅ Code review approved

---

**Total Estimated Testing Effort**: 15 hours
**Expected Timeline**: 2-3 days

**Last Updated**: 2025-11-19
**Status**: Ready to begin testing
