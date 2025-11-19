# Migration Guide: Utils to Hooks

**Purpose**: Guide for migrating from old utility functions to Phase 3 custom hooks
**Status**: Ready for use
**Date**: 2025-11-19

---

## Overview

Phase 3 introduced custom hooks that replace old utility functions with better React integration, type safety, and reusability.

This guide shows how to migrate from:
- ❌ `utils/debounce.ts` → ✅ `hooks/async/useDebounce.ts`
- ❌ `utils/validation.ts` → ✅ `hooks/forms/useFormValidation.ts`

---

## Migration 1: Debounce → useDebounce

### Old Pattern (utils/debounce.ts)

```typescript
import { debounce } from '../../utils/debounce';

function MyComponent() {
  const [searchTerm, setSearchTerm] = useState('');

  // Create debounced function with useRef
  const debouncedSearchRef = useRef(
    debounce((term: string) => {
      fetchSearchResults(term);
    }, 500)
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedSearchRef.current(searchTerm);
    }
  }, [searchTerm]);

  return <input onChange={(e) => setSearchTerm(e.target.value)} />;
}
```

**Problems**:
- Manual ref management
- Requires useEffect
- 10+ lines of boilerplate
- Cleanup not automatic

---

### New Pattern (useDebounce hook)

```typescript
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks';

function MyComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      fetchSearchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return <input onChange={(e) => setSearchTerm(e.target.value)} />;
}
```

**Benefits**:
- ✅ No ref management
- ✅ Automatic cleanup
- ✅ Only 3 lines
- ✅ Type-safe

**Reduction**: 70% less code

---

### Alternative: useDebouncedCallback

For debouncing functions instead of values:

```typescript
import { useDebouncedCallback } from '@/hooks';

function MyComponent() {
  const handleSearch = useDebouncedCallback((term: string) => {
    fetchSearchResults(term);
  }, 500);

  return <input onChange={(e) => handleSearch(e.target.value)} />;
}
```

---

## Migration 2: Throttle → useThrottle

### Old Pattern (utils/debounce.ts - throttle)

```typescript
import { throttle } from '../../utils/debounce';

function ScrollComponent() {
  const [scrollY, setScrollY] = useState(0);

  const handleScrollRef = useRef(
    throttle(() => {
      setScrollY(window.scrollY);
    }, 200)
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScrollRef.current);
    return () => window.removeEventListener('scroll', handleScrollRef.current);
  }, []);

  return <div>Scroll position: {scrollY}</div>;
}
```

---

### New Pattern (useThrottle hook)

```typescript
import { useState, useEffect } from 'react';
import { useThrottle } from '@/hooks';

function ScrollComponent() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 200);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div>Scroll position: {throttledScrollY}</div>;
}
```

---

### Alternative: useThrottledCallback

```typescript
import { useEffect } from 'react';
import { useThrottledCallback } from '@/hooks';

function ScrollComponent() {
  const handleScroll = useThrottledCallback(() => {
    console.log('Scrolled!', window.scrollY);
  }, 200);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return <div>Scroll to see throttled logs</div>;
}
```

---

## Migration 3: Validation → useFormValidation

### Old Pattern (utils/validation.ts)

```typescript
import { isValidEmail } from '../../utils/validation';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!isValidEmail(email)) {
      setError('Invalid email');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail()) return;
    // Submit...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={validateEmail}
      />
      {error && <span>{error}</span>}
    </form>
  );
}
```

**Problems**:
- Manual error state
- Repetitive validation logic
- No touched state
- Hard to reuse

---

### New Pattern (useFormState + validators)

```typescript
import { useFormState, validators } from '@/hooks';

function LoginForm() {
  const form = useFormState({
    initialValues: { email: '' },
    onSubmit: async (values) => {
      await login(values.email);
    },
    validate: (values) => {
      const errors: any = {};
      const emailRequired = validators.required()(values.email);
      const emailFormat = validators.email()(values.email);

      if (emailRequired) errors.email = emailRequired;
      else if (emailFormat) errors.email = emailFormat;

      return errors;
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.getFieldProps('email')} />
      {form.touched.email && form.errors.email && (
        <span>{form.errors.email}</span>
      )}
    </form>
  );
}
```

**Benefits**:
- ✅ Built-in touched state
- ✅ Reusable validators
- ✅ Type-safe
- ✅ Less boilerplate

---

## Real-World Example: ChatPanel Migration

### Before (using utils/debounce.ts)

```typescript
import { debounce } from '../../utils/debounce';

export const ChatPanel: React.FC = () => {
  // ... other code

  // Manual debounce with ref
  const debouncedUpdateContextRef = useRef(
    debounce((pageId: string | null, sectionId: string | null) => {
      let context = '';
      if (sectionId) {
        context = `Section ${sectionId}`;
      } else if (pageId) {
        context = `Page ${pageId}`;
      }
      setCurrentContext(context);
    }, 100)
  );

  // Sync context when selection changes
  useEffect(() => {
    debouncedUpdateContextRef.current(selectedPageId, selectedSectionId);
  }, [selectedPageId, selectedSectionId]);

  // ... rest of component
};
```

---

### After (using useDebounce hook)

```typescript
import { useDebounce } from '@/hooks';

export const ChatPanel: React.FC = () => {
  // ... other code

  // Simple debounced value
  const debouncedSelection = useDebounce(
    { pageId: selectedPageId, sectionId: selectedSectionId },
    100
  );

  useEffect(() => {
    let context = '';
    if (debouncedSelection.sectionId) {
      context = `Section ${debouncedSelection.sectionId}`;
    } else if (debouncedSelection.pageId) {
      context = `Page ${debouncedSelection.pageId}`;
    }
    setCurrentContext(context);
  }, [debouncedSelection]);

  // ... rest of component
};
```

**Improvement**:
- Removed manual ref
- Simpler logic
- Easier to understand

---

## Migration Checklist

### For Each Component

- [ ] 1. Identify old utility usage
  ```bash
  grep -r "from.*utils/debounce" src/
  grep -r "from.*utils/validation" src/
  ```

- [ ] 2. Replace with appropriate hook
  - debounce → useDebounce or useDebouncedCallback
  - throttle → useThrottle or useThrottledCallback
  - validation → useFormValidation + validators

- [ ] 3. Remove old imports
  ```diff
  - import { debounce } from '../../utils/debounce';
  + import { useDebounce } from '@/hooks';
  ```

- [ ] 4. Test the component
  - Verify debounce/throttle timing
  - Check validation still works
  - Test edge cases

- [ ] 5. Commit changes
  ```bash
  git add <file>
  git commit -m "refactor: migrate <component> from utils to hooks"
  ```

---

## Files to Migrate

### Current Usage (as of Phase 5)

**debounce.ts users**:
- `src/components/chat/ChatPanel.tsx` ✅ Has refactored version
- `src/components/shell/TopBar.tsx` ⏭️ Needs migration

**validation.ts users**:
- Unknown (need to grep for usage)

---

## After Migration

Once all files are migrated:

1. **Remove old utility files**:
   ```bash
   git rm src/utils/debounce.ts
   git rm src/utils/validation.ts  # if fully migrated
   ```

2. **Update documentation**:
   - Remove old util docs
   - Point to Phase 3 hook docs

3. **Add deprecation notice** (temporary):
   ```typescript
   // src/utils/debounce.ts
   /**
    * @deprecated Use useDebounce or useDebouncedCallback from @/hooks instead
    * This file will be removed in the next version
    */
   ```

---

## Benefits Summary

| Metric | Before (Utils) | After (Hooks) | Improvement |
|--------|----------------|---------------|-------------|
| Average LOC | 10-15 lines | 3-5 lines | 70% reduction |
| Type Safety | Partial | Full | ✅ Better |
| Cleanup | Manual | Automatic | ✅ Safer |
| Reusability | Function-level | Hook-level | ✅ Better DX |
| Testing | Harder | Easier | ✅ More testable |

---

## Questions?

**Q: Can I use both old utils and new hooks?**
A: Yes, during migration period. But goal is to remove old utils entirely.

**Q: What if I can't migrate immediately?**
A: That's fine! Keep using old utils until you're ready. They still work.

**Q: Do the new hooks perform better?**
A: Performance is similar, but hooks integrate better with React lifecycle.

**Q: Will old utils be removed?**
A: Yes, after all usages are migrated. We'll add deprecation warnings first.

---

## Support

If you encounter issues during migration:
1. Check this guide
2. See Phase 3 docs: `/docs/REFACTORING_PHASE3_COMPLETE.md`
3. Review example: `/src/components/chat/ChatPanel.refactored.tsx`
