# Phase 8: Migration & Rollout Strategy

**Status**: 📋 Planning
**Date**: 2025-11-19
**Timeline**: 4-6 weeks estimated

---

## Executive Summary

This document outlines the complete migration and rollout strategy for transitioning from the old codebase to the refactored architecture established in Phases 1-7.

**Key Principles**:
- **Zero downtime**: All migrations happen incrementally
- **Zero breaking changes**: Maintain full feature parity throughout
- **Test-first**: Complete testing before any swap
- **Rollback ready**: Every change can be reverted instantly
- **Gradual adoption**: Migrate component by component

---

## Current State Analysis

### Refactored Components Ready for Swap

| Component | Original LOC | Refactored LOC | Reduction | Status |
|-----------|-------------|----------------|-----------|--------|
| DeployPanel | 369 | 100 | 73% | ✅ Ready |
| ChatPanel | 318 | 80 | 75% | ✅ Ready |
| AITrainingPanel | 130 | 85 | 35% | ✅ Ready |

### New Infrastructure Created

**UI Components** (20 components):
- Form: Button, TextField, TextareaField, SelectField, ImageField, RichTextEditor
- Layout: Card, Panel, Modal, Tab, ResizeHandle
- Feedback: LoadingState, EmptyState, ErrorState
- Navigation: Stepper
- Utility: Badge, Icon, Toast, ToastContainer, SkipLinks

**Custom Hooks** (16 hooks):
- UI: useToggle, useDisclosure, useModal
- Forms: useFormState, useFormValidation, useFormDirty
- Async: useAsync, useDebounce, useDebouncedCallback, useThrottle, useThrottledCallback
- State: usePersistedState, useLocalStorage
- Domain: useStepper, useAutoSave

**Flow Hooks** (2 hooks):
- useDeploymentFlow
- useChatFlow

### Duplicate Code Identified

**Old Utils** (pending removal):
- `src/utils/debounce.ts` → Replaced by `useDebounce`, `useDebouncedCallback`
- `src/utils/validation.ts` (partial) → Replaced by `useFormValidation`

**Estimated Removable Code**: 665 LOC (72% reduction after migration)

---

## Migration Phases

### Phase 8.1: Test Implementation (Week 1-2)

**Objective**: Implement automated tests before any code changes

**Tasks**:

1. **Setup Test Infrastructure** (Day 1)
   - Install test dependencies (Vitest, Testing Library, axe-core)
   - Configure Vitest
   - Setup test utilities
   - **Effort**: 4 hours

2. **Hook Tests** (Day 2-7)
   - Implement tests for all 16 custom hooks
   - Achieve 100% coverage
   - **Effort**: 30 hours (from Phase 7 plan)

3. **Component Tests** (Day 8-12)
   - Implement tests for 20 UI components
   - Achieve 90% coverage
   - **Effort**: 40 hours (from Phase 7 plan)

4. **Integration Tests** (Day 13-14)
   - Login flow
   - Deployment flow
   - Chat flow
   - Training flow
   - **Effort**: 10 hours

**Deliverable**: 85% overall test coverage

**Success Criteria**:
- [ ] All tests passing
- [ ] Coverage > 85%
- [ ] No test failures in CI/CD
- [ ] Accessibility tests passing

---

### Phase 8.2: Refactored Component Swap (Week 3)

**Objective**: Replace original components with refactored versions

**Prerequisites**:
- ✅ Tests implemented (Phase 8.1)
- ✅ All tests passing
- ✅ Manual QA complete (from Phase 7 checklist)

#### Step 1: DeployPanel Swap (Day 1)

**Procedure**:

```bash
# 1. Create backup branch
git checkout -b backup/deploy-panel-swap
git push origin backup/deploy-panel-swap

# 2. Verify tests pass
npm test -- DeployPanel

# 3. Rename original to .original.tsx
git mv src/components/deployment/DeployPanel.tsx \
       src/components/deployment/DeployPanel.original.tsx

# 4. Rename refactored to main name
git mv src/components/deployment/DeployPanel.refactored.tsx \
       src/components/deployment/DeployPanel.tsx

# 5. Run all tests
npm test
npm run lint

# 6. Manual QA testing (from Phase 7 checklist)
npm run dev
# Test all DeployPanel functionality

# 7. If all passes, commit
git add .
git commit -m "refactor: swap DeployPanel with refactored version

- Reduces LOC from 369 to 100 (73% reduction)
- Extracts logic to useDeploymentFlow hook
- Splits UI into DeployConfirmation and DeploySuccess components
- Maintains full feature parity
- All tests passing

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 8. If issues found, rollback immediately
# git checkout main
# git reset --hard HEAD~1
```

**Rollback Plan**:
```bash
# Instant rollback if issues detected
git mv src/components/deployment/DeployPanel.tsx \
       src/components/deployment/DeployPanel.refactored.tsx
git mv src/components/deployment/DeployPanel.original.tsx \
       src/components/deployment/DeployPanel.tsx
git add .
git commit -m "revert: rollback DeployPanel swap due to [ISSUE]"
```

**Testing Checklist**:
- [ ] Confirmation dialog works
- [ ] Deployment starts correctly
- [ ] Progress updates in real-time
- [ ] Success state shows correctly
- [ ] Error state shows correctly
- [ ] Logs expand/collapse
- [ ] All buttons work
- [ ] Accessibility preserved
- [ ] No console errors
- [ ] No visual regressions

**Effort**: 4 hours (including testing)

---

#### Step 2: ChatPanel Swap (Day 2)

**Procedure**: Same as DeployPanel, using ChatPanel.refactored.tsx

**Testing Checklist**:
- [ ] Messages send correctly
- [ ] AI responses display
- [ ] Scope selector works
- [ ] Model selector works
- [ ] Context updates (debounced)
- [ ] Panel resize works
- [ ] Code generation demo works
- [ ] Clear conversation works
- [ ] Accessibility preserved
- [ ] No console errors

**Effort**: 4 hours

---

#### Step 3: AITrainingPanel Swap (Day 3)

**Procedure**: Same as above, using AITrainingPanel.refactored.tsx

**Testing Checklist**:
- [ ] Loading state displays
- [ ] Form sections load
- [ ] Save/discard work
- [ ] isDirty tracking works
- [ ] Validation works
- [ ] Stepper navigation works
- [ ] Browser warning on leave
- [ ] Accessibility preserved
- [ ] No console errors

**Effort**: 3 hours

---

#### Step 4: Archive Original Files (Day 4)

After all swaps successful and verified in production:

```bash
# Create archive directory
mkdir -p src/components/__archive

# Move all .original.tsx files
git mv src/components/deployment/DeployPanel.original.tsx \
       src/components/__archive/

git mv src/components/chat/ChatPanel.original.tsx \
       src/components/__archive/

git mv src/components/settings/AITrainingPanel.original.tsx \
       src/components/__archive/

# Commit
git add .
git commit -m "chore: archive original component files

All refactored components verified in production.
Archiving originals for reference.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Effort**: 1 hour

**Total Phase 8.2 Effort**: 12 hours (3 days)

---

### Phase 8.3: Utils to Hooks Migration (Week 4)

**Objective**: Migrate old utility functions to new custom hooks

#### Migration 1: Debounce (Day 1)

**Files to Update**:
- Any components using `import { debounce } from '@/utils/debounce'`
- Replace with `useDebounce` or `useDebouncedCallback`

**Example**:

Before:
```typescript
import { debounce } from '@/utils/debounce';

const TopBar = () => {
  const debouncedSearch = debounce((value: string) => {
    fetchResults(value);
  }, 500);

  return <input onChange={(e) => debouncedSearch(e.target.value)} />;
};
```

After:
```typescript
import { useDebounce } from '@/hooks';

const TopBar = () => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);

  useEffect(() => {
    if (debouncedValue) {
      fetchResults(debouncedValue);
    }
  }, [debouncedValue]);

  return <input onChange={(e) => setSearchValue(e.target.value)} />;
};
```

**Steps**:
1. Identify all usages: `git grep "from '@/utils/debounce'"`
2. Update each component
3. Test each component
4. Remove `src/utils/debounce.ts` after all migrations

**Effort**: 4 hours

---

#### Migration 2: Validation (Day 2-3)

**Files to Update**:
- Components using manual validation logic
- Replace with `useFormValidation` or `useFormState`

**Example**:

Before:
```typescript
const MyForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!email) {
      setError('Required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      // submit
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && <span>{error}</span>}
    </form>
  );
};
```

After:
```typescript
import { useFormState } from '@/hooks';

const MyForm = () => {
  const form = useFormState({
    initialValues: { email: '' },
    onSubmit: async (values) => {
      // submit
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.email) errors.email = 'Required';
      else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Invalid email';
      return errors;
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.getFieldProps('email')} />
      {form.errors.email && <span>{form.errors.email}</span>}
    </form>
  );
};
```

**Steps**:
1. Identify all forms with manual validation
2. Migrate to useFormState
3. Test each form
4. Update validation utils documentation

**Effort**: 8 hours

---

#### Migration 3: Cleanup Old Utils (Day 4)

After all migrations complete:

```bash
# Remove old utility files (after verifying no usages)
git rm src/utils/debounce.ts

# Update barrel exports if needed
# Edit src/utils/index.ts to remove deprecated exports

git add .
git commit -m "chore: remove deprecated utility files

All functionality migrated to custom hooks:
- debounce → useDebounce, useDebouncedCallback
- throttle → useThrottle, useThrottledCallback
- validation (partial) → useFormValidation, useFormState

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Verification**:
```bash
# Ensure no remaining references
git grep "utils/debounce"
# Should return: no results

npm test
npm run lint
npm run build
```

**Effort**: 2 hours

**Total Phase 8.3 Effort**: 14 hours (4 days)

---

### Phase 8.4: Component Adoption (Week 5-6)

**Objective**: Gradually adopt new UI components in existing features

**Priority**: Low (can be done incrementally)

#### Target Components for Migration

**High Impact** (use new components):
1. FileExplorerSidebar (335 LOC)
   - Use: Panel, LoadingState, EmptyState
   - Estimated reduction: 40%

2. Canvas (258 LOC)
   - Use: LoadingState, ErrorState, Modal
   - Estimated reduction: 20%

3. RichTextEditor (245 LOC)
   - Use: Panel, Button, LoadingState
   - Estimated reduction: 15%

4. All forms
   - Use: useFormState, TextField, Button
   - Estimated reduction: 50%

**Approach**:
- One component per week
- Test thoroughly before moving to next
- No rush - maintain quality over speed

**Effort**: 20 hours (from TODO_BACKLOG.md)

---

### Phase 8.5: CSS Consolidation (Week 6)

**Objective**: Replace hardcoded CSS values with design tokens

**Tasks**:

1. **Audit CSS Files**
   ```bash
   # Find hardcoded colors
   git grep "#[0-9a-fA-F]\{6\}" -- "*.css"

   # Find hardcoded spacing
   git grep -E "[0-9]+px" -- "*.css"
   ```

2. **Replace with Tokens**

   Before:
   ```css
   .button {
     color: #EA2724;
     padding: 16px 24px;
     border-radius: 8px;
   }
   ```

   After:
   ```typescript
   import { colors, spacing, borders } from '@/styles/tokens';

   const buttonStyle = {
     color: colors.primary,
     padding: `${spacing[4]} ${spacing[6]}`,
     borderRadius: borders.radius.md,
   };
   ```

3. **Remove Duplicates**
   - Consolidate button styles
   - Consolidate spacing utilities
   - Remove redundant CSS

**Effort**: 8 hours (from TODO_BACKLOG.md)

---

## Risk Mitigation

### Risk 1: Breaking Changes During Swap

**Likelihood**: Medium
**Impact**: High

**Mitigation**:
- Comprehensive testing before swap (Phase 7 checklist)
- Manual QA by product owner
- Automated tests must pass
- Instant rollback procedure documented
- Backup branches for every swap

**Rollback Time**: < 5 minutes

---

### Risk 2: Test Failures Blocking Progress

**Likelihood**: Medium
**Impact**: Medium

**Mitigation**:
- Write tests incrementally
- Fix failures immediately
- Don't proceed until all green
- Use test coverage tools to verify completeness

---

### Risk 3: Migration Breaking Existing Features

**Likelihood**: Low
**Impact**: High

**Mitigation**:
- Migrate one component at a time
- Full regression testing after each migration
- Keep original files as backup
- User acceptance testing before archiving

---

### Risk 4: Incomplete Migration

**Likelihood**: Low
**Impact**: Low

**Mitigation**:
- Clear checklist for each migration
- Git grep verification before deleting old code
- Code review for each migration PR
- Track progress in this document

---

## Success Criteria

### Phase 8.1 (Testing) ✅ When:
- [ ] All hook tests implemented (100% coverage)
- [ ] All component tests implemented (90% coverage)
- [ ] Integration tests implemented (80% coverage)
- [ ] Overall coverage > 85%
- [ ] All tests passing in CI/CD
- [ ] Accessibility tests passing

### Phase 8.2 (Component Swap) ✅ When:
- [ ] DeployPanel swapped and verified
- [ ] ChatPanel swapped and verified
- [ ] AITrainingPanel swapped and verified
- [ ] All original files archived
- [ ] No regressions detected
- [ ] Production deployment successful

### Phase 8.3 (Utils Migration) ✅ When:
- [ ] All debounce usages migrated
- [ ] All throttle usages migrated
- [ ] All validation migrated (where applicable)
- [ ] Old utils removed
- [ ] No references to old utils remain
- [ ] All tests passing

### Phase 8.4 (Component Adoption) ✅ When:
- [ ] FileExplorerSidebar refactored
- [ ] Canvas refactored
- [ ] RichTextEditor refactored
- [ ] All forms using useFormState
- [ ] All tests passing

### Phase 8.5 (CSS Consolidation) ✅ When:
- [ ] All hardcoded colors replaced
- [ ] All hardcoded spacing replaced
- [ ] Duplicate styles removed
- [ ] Visual regression tests passing

---

## Timeline Overview

| Week | Phase | Tasks | Hours |
|------|-------|-------|-------|
| 1-2 | 8.1 | Test implementation | 80h |
| 3 | 8.2 | Component swaps | 12h |
| 4 | 8.3 | Utils migration | 14h |
| 5-6 | 8.4 | Component adoption | 20h |
| 6 | 8.5 | CSS consolidation | 8h |
| **Total** | | **All migrations** | **134h** |

**Timeline**: 6 weeks with 1 full-time developer
**Parallel Work**: Testing (8.1) can overlap with planning

---

## Rollout Strategy

### Development Environment

**Week 1-2**: Test implementation
- Branch: `feature/phase-8-testing`
- No impact on main branch
- Tests added incrementally

**Week 3**: Component swaps
- Branch: `feature/phase-8-swaps`
- One component per day
- Merge to main after each successful swap

**Week 4**: Utils migration
- Branch: `feature/phase-8-utils-migration`
- One migration per day
- Merge to main after verification

**Week 5-6**: Gradual adoption
- Branch: `feature/phase-8-adoption`
- One component per week
- Can be done in parallel with other work

---

### Staging Environment

**After Each Major Change**:
1. Deploy to staging
2. Full regression testing
3. Product owner approval
4. Monitor for 24 hours
5. Proceed to production

---

### Production Environment

**Rollout Approach**: Blue-Green Deployment

1. **Blue** (current): Old components running
2. **Green** (new): Refactored components deployed
3. **Gradual cutover**: Feature flags to control which version users see
4. **Monitor**: Error rates, performance, user feedback
5. **Rollback ready**: Instant switch back to blue if issues

**Monitoring**:
- Error tracking (Sentry or similar)
- Performance metrics (Core Web Vitals)
- User session recordings
- Console error alerts

**Success Metrics**:
- Zero increase in error rate
- Performance same or better
- No user complaints
- All tests passing

---

## Communication Plan

### Stakeholders

**Development Team**:
- Daily standup updates
- Weekly progress review
- Immediate notification of blockers

**Product Owner**:
- Weekly demo of completed work
- Sign-off required for component swaps
- UAT sessions scheduled

**QA Team**:
- Testing checklist provided (Phase 7)
- Early involvement in test writing
- Final regression testing

**End Users**:
- No communication needed (transparent migration)
- Monitor support tickets for issues

---

## Documentation Updates

### During Migration

**Update Weekly**:
- This document (MIGRATION_ROLLOUT_STRATEGY.md)
- TODO_BACKLOG.md (mark items complete)
- COMPONENT_CATALOG.md (add usage stats)

**Upon Completion**:
- ARCHITECTURE.md (update with lessons learned)
- README.md (update with new patterns)
- CHANGELOG.md (document all changes)

---

## Post-Migration Cleanup

### After All Migrations Complete

1. **Remove Archive**:
   ```bash
   # After 1 month of production stability
   git rm -r src/components/__archive
   git commit -m "chore: remove archived components after successful migration"
   ```

2. **Update Dependencies**:
   ```bash
   npm update
   npm audit fix
   ```

3. **Performance Audit**:
   - Run Lighthouse
   - Analyze bundle size
   - Optimize if needed

4. **Documentation Review**:
   - Update all docs with final state
   - Add "Migration Complete" badges
   - Archive Phase docs

---

## Retrospective

### After Phase 8 Complete

**Schedule**: Retrospective meeting with team

**Topics**:
- What went well?
- What could be improved?
- Lessons learned
- Future recommendations
- Celebrate wins! 🎉

**Document Outcomes**: Add to Phase 8 completion doc

---

## Emergency Procedures

### Critical Bug in Production

**Procedure**:

1. **Immediately rollback** to previous version
   ```bash
   git revert <commit-hash>
   git push origin main --force
   ```

2. **Deploy rollback** to production immediately

3. **Investigate** issue in development

4. **Fix** and test thoroughly

5. **Re-deploy** when verified

**Response Time**: < 15 minutes

---

### Complete Rollback Needed

If entire refactoring needs to be reverted:

```bash
# Restore all original files
git checkout backup/before-phase-8 -- src/

# Remove all Phase 1-7 additions
git rm -r src/hooks/
git rm -r src/components/ui/
# ... etc

# Commit
git add .
git commit -m "revert: complete rollback to pre-refactoring state"

# Deploy
git push origin main
```

**Last Resort**: This should never be needed due to incremental approach

---

## Appendix: Quick Reference Commands

### Verification Commands

```bash
# Check for old imports
git grep "from '@/utils/debounce'"
git grep "from '@/utils/validation'"

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Lint check
npm run lint

# Type check
npm run type-check

# Build check
npm run build

# Full verification
npm test && npm run lint && npm run build
```

### Git Workflow

```bash
# Start new migration
git checkout -b feature/migrate-<component-name>

# After changes
git add .
git commit -m "refactor: migrate <component> to use <hook/component>"

# Push and create PR
git push origin feature/migrate-<component-name>

# After PR approval, merge to main
git checkout main
git merge feature/migrate-<component-name>
git push origin main
```

---

## Summary

Phase 8 represents the culmination of 7 phases of planning, building, and documenting. This migration strategy ensures:

✅ **Safety First**: Incremental changes with instant rollback
✅ **Quality**: Testing before any production changes
✅ **Zero Downtime**: Blue-green deployment strategy
✅ **Zero Breaking Changes**: Comprehensive QA at every step
✅ **Clear Plan**: Week-by-week timeline with concrete deliverables
✅ **Risk Mitigation**: Documented procedures for every scenario

**Total Effort**: 134 hours over 6 weeks
**Expected Outcome**: Production codebase fully refactored with 69% code reduction

---

**Next Steps**:
1. Review and approve this strategy
2. Begin Phase 8.1 (Test Implementation)
3. Follow timeline week by week
4. Update this document with progress

---

**Status**: 📋 Ready for Approval
**Last Updated**: 2025-11-19
