# Frontend Architecture

**Purpose**: Document the frontend architecture and patterns established through refactoring
**Last Updated**: 2025-11-19
**Status**: Living document

---

## Overview

The PMC Engine frontend has been refactored to follow modern React patterns with emphasis on:
- **Reusability**: Components and hooks can be reused across features
- **Maintainability**: Clear separation of concerns, small focused files
- **Type Safety**: Full TypeScript with strict mode
- **Accessibility**: WCAG AA standards throughout
- **Performance**: Optimized with hooks and proper memoization

---

## Directory Structure

```
src/
├── components/          # All React components
│   ├── ui/             # Reusable UI components (20 components)
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Panel/
│   │   ├── Stepper/
│   │   └── ...
│   ├── feedback/       # Feedback components
│   │   ├── LoadingState.tsx
│   │   ├── EmptyState.tsx
│   │   └── ErrorState.tsx
│   ├── forms/          # Form-specific components
│   ├── layout/         # Layout components
│   ├── chat/           # Chat feature components
│   ├── code/           # Code editor components
│   ├── deployment/     # Deployment feature components
│   ├── settings/       # Settings feature components
│   ├── shell/          # Shell/dashboard components
│   └── themes/         # Themes feature components
│
├── hooks/              # Custom React hooks (16 hooks)
│   ├── ui/             # UI-related hooks (useToggle, useDisclosure, useModal)
│   ├── forms/          # Form hooks (useFormState, useFormValidation, useFormDirty)
│   ├── async/          # Async hooks (useAsync, useDebounce, useThrottle)
│   ├── state/          # State hooks (usePersistedState, useLocalStorage)
│   ├── domain/         # Domain hooks (useStepper, useAutoSave)
│   └── index.ts        # Barrel export
│
├── stores/             # Zustand state stores
│   ├── dashboardStore.ts
│   ├── codeStore.ts
│   ├── deploymentStore.ts
│   ├── themesStore.ts
│   └── trainingStore.ts
│
├── services/           # Business logic and API services
│   ├── deploymentService.ts
│   ├── trainingService.ts
│   ├── codeValidator.ts
│   └── mockAI.ts
│
├── utils/              # Utility functions
│   ├── validation.ts
│   ├── formatTimestamp.ts
│   ├── a11y.ts
│   └── ...
│
├── styles/             # Global styles and design tokens
│   ├── tokens.ts       # Design system tokens
│   ├── globals.css
│   └── layout.css
│
└── types/              # TypeScript type definitions
    ├── chat.ts
    ├── themes.ts
    └── ...
```

---

## Architectural Patterns

### 1. Component Composition

**Pattern**: Build complex UIs from small, focused components

**Example**:
```
ChatPanel (Main Component)
├── ChatHeader
│   ├── ContextBadge
│   └── ModelSelector
├── MessageList
│   └── MessageBubble (repeated)
├── BottomAIPanel
│   └── ScopeSelector
└── ChatInputBar
    └── Button
```

**Benefits**:
- Each component has single responsibility
- Easy to test in isolation
- Highly reusable

---

### 2. Custom Hooks for Logic

**Pattern**: Extract business logic into custom hooks, keep components purely presentational

**Before**:
```tsx
// Component with mixed logic and UI (369 LOC)
export const DeployPanel = ({ themeId, siteId }) => {
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [logsExpanded, setLogsExpanded] = useState(false);

  const handleConfirmDeploy = async () => { /* 50 lines */ };
  const handleClose = () => { /* ... */ };
  const handleGoToPreview = () => { /* ... */ };
  const handleEditWithAI = () => { /* 30 lines */ };
  const handleRetryDeployment = () => { /* ... */ };

  return ( /* 150 lines of JSX */ );
};
```

**After**:
```tsx
// Hook with all logic (215 LOC)
export function useDeploymentFlow({ themeId, siteId, userId }) {
  // All state and logic here
  return { session, confirmDeploy, closePanel, goToPreview, ... };
}

// Component purely presentational (100 LOC)
export const DeployPanel = ({ themeId, siteId, userId }) => {
  const flow = useDeploymentFlow({ themeId, siteId, userId });

  if (flow.showConfirmation) {
    return <DeployConfirmation onConfirm={flow.confirmDeploy} />;
  }

  return <aside>{ /* Clean JSX */ }</aside>;
};
```

**Benefits**:
- Logic can be tested without mounting components
- Components are easier to understand
- Logic is reusable across components

---

### 3. Design Token System

**Pattern**: Centralized design values in `styles/tokens.ts`

**Structure**:
```typescript
export const colors = {
  primary: '#EA2724',
  text: { primary: '#1A1A1A', secondary: '#666666' },
  // ...
};

export const spacing = {
  0: '0', px: '1px', 1: '0.25rem', 2: '0.5rem', // 4px grid
  // ...
};

export const typography = {
  fontFamily: { sans: 'Inter, Geist, SF Pro', mono: 'JetBrains Mono' },
  fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem' },
  // ...
};
```

**Usage**:
```typescript
import { colors, spacing } from '@/styles/tokens';

const styles = {
  color: colors.text.primary,
  padding: `${spacing[4]} ${spacing[6]}`,
};
```

**Benefits**:
- Consistent design across app
- Easy theme changes
- Single source of truth

---

### 4. State Management Strategy

**Global State (Zustand)**:
```
dashboardStore    → Shell, UI state, navigation
codeStore         → Code editor state, file tree
deploymentStore   → Deployment sessions
themesStore       → Themes catalog
trainingStore     → AI training data
```

**Local State (React hooks)**:
```
Component-specific → useState
Form state → useFormState (custom hook)
Derived state → useMemo
Side effects → useEffect
```

**Persistent State**:
```
localStorage → usePersistedState, useLocalStorage
```

**Decision Matrix**:
- Shared across many components → Zustand store
- Component-specific → useState
- Form data → useFormState
- Needs persistence → usePersistedState

---

### 5. Type Safety

**All TypeScript files use strict mode**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**Patterns**:
```typescript
// Component props
interface ButtonProps {
  variant: 'primary' | 'secondary';  // Union types for variants
  onClick?: () => void;               // Optional callbacks
  children: React.ReactNode;          // Proper children type
}

// Generic hooks
function useFormState<T extends Record<string, any>>(config) {
  // T ensures type safety for form values
}

// Discriminated unions for state
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

---

### 6. Accessibility Architecture

**Every component follows WCAG AA**:

**Keyboard Navigation**:
```tsx
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
>
```

**ARIA Attributes**:
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
```

**Focus Management**:
```tsx
useEffect(() => {
  if (isOpen) {
    previousFocusRef.current = document.activeElement;
    modalRef.current?.focus();
  }
  return () => {
    previousFocusRef.current?.focus();
  };
}, [isOpen]);
```

**Screen Reader Support**:
```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  {loading && "Loading data..."}
</div>

<span className="sr-only">
  Screen reader only text
</span>
```

---

## Data Flow

### Component → Hook → Store → Service

```
┌─────────────┐
│  Component  │ ← Presentational, no business logic
└──────┬──────┘
       │ uses
┌──────▼──────┐
│ Custom Hook │ ← Business logic, state management
└──────┬──────┘
       │ reads/writes
┌──────▼──────┐
│   Store     │ ← Global state (Zustand)
└──────┬──────┘
       │ calls
┌──────▼──────┐
│  Service    │ ← API calls, data transformation
└─────────────┘
```

**Example: DeployPanel**

```typescript
// Component (presentational)
export const DeployPanel = ({ themeId, siteId, userId }) => {
  const flow = useDeploymentFlow({ themeId, siteId, userId });
  return <aside>{/* UI */}</aside>;
};

// Hook (business logic)
export function useDeploymentFlow({ themeId, siteId, userId }) {
  const session = useDeploymentStore((state) => state.getSessionBySite(siteId));
  const updateTheme = useThemesStore((state) => state.updateTheme);

  const confirmDeploy = async () => {
    updateTheme(themeId, { deploymentStatus: 'deploying' });
    await deploymentService.mockDeployment(themeId, siteId, userId, callback);
  };

  return { session, confirmDeploy, ... };
}

// Store (global state)
export const useDeploymentStore = create<DeploymentState>((set, get) => ({
  sessions: [],
  getSessionBySite: (siteId) => get().sessions.find(...),
  updateSession: (siteId, session) => set(...),
}));

// Service (API layer)
export const deploymentService = {
  async mockDeployment(themeId, siteId, userId, onProgress) {
    // API call logic
  },
};
```

---

## Performance Patterns

### 1. Memoization

**useMemo for expensive calculations**:
```typescript
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

**useCallback for stable function references**:
```typescript
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

---

### 2. Code Splitting

**Lazy loading for routes**:
```typescript
const ThemesPage = lazy(() => import('./pages/ThemesPage'));

<Suspense fallback={<LoadingState />}>
  <ThemesPage />
</Suspense>
```

---

### 3. Debouncing/Throttling

**Search inputs**:
```typescript
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    fetchResults(debouncedSearch);
  }
}, [debouncedSearch]);
```

**Scroll/resize handlers**:
```typescript
const handleScroll = useThrottledCallback(() => {
  updateScrollPosition();
}, 16); // 60fps
```

---

## Testing Strategy

### Unit Tests (Hooks)
```typescript
import { renderHook, act } from '@testing-library/react';
import { useToggle } from './useToggle';

test('useToggle toggles value', () => {
  const { result } = renderHook(() => useToggle(false));

  expect(result.current[0]).toBe(false);

  act(() => {
    result.current[1](); // toggle
  });

  expect(result.current[0]).toBe(true);
});
```

### Component Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

test('button calls onClick', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  fireEvent.click(screen.getByText('Click me'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Integration Tests
```typescript
test('form submission flow', async () => {
  const handleSubmit = jest.fn();
  render(<LoginForm onSubmit={handleSubmit} />);

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'test@example.com' },
  });

  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
  });
});
```

---

## Error Handling

### Component Level
```typescript
function MyComponent() {
  const { data, error } = useAsync(fetchData);

  if (error) {
    return <ErrorState title="Failed to load" message={error.message} retry={refetch} />;
  }

  return <div>{data}</div>;
}
```

### Hook Level
```typescript
export function useCustomHook() {
  const [error, setError] = useState<Error | null>(null);

  const doSomething = async () => {
    try {
      await riskyOperation();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Operation failed:', error);
    }
  };

  return { error, doSomething };
}
```

### Global Error Boundary
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorState title="Something went wrong" />;
    }
    return this.props.children;
  }
}
```

---

## Code Organization Principles

### 1. Single Responsibility
Each file/component/hook does one thing well

### 2. DRY (Don't Repeat Yourself)
Shared logic goes into hooks, shared UI goes into components

### 3. Composition over Inheritance
Build complex components from simple ones

### 4. Explicit over Implicit
Clear prop names, no magic behavior

### 5. Type Safety
TypeScript for everything, strict mode enabled

---

## Migration Path

### From Old to New Architecture

**Phase 1-3**: ✅ Build new components and hooks
**Phase 4**: ✅ Refactor large components
**Phase 5**: ✅ Identify old code to remove
**Phase 6**: 🔄 Document everything (current)
**Phase 7**: ⏭️ Test refactored components
**Phase 8**: ⏭️ Gradually migrate and remove old code

---

## Best Practices

### Component Development

1. **Start with types**
   ```typescript
   interface MyComponentProps {
     title: string;
     onClose: () => void;
   }
   ```

2. **Keep components small** (< 150 LOC)

3. **Extract complex logic to hooks**

4. **Use design tokens, not hardcoded values**
   ```typescript
   // ❌ Bad
   style={{ color: '#EA2724', padding: '16px' }}

   // ✅ Good
   style={{ color: colors.primary, padding: spacing[4] }}
   ```

5. **Add accessibility from start**
   ```tsx
   <button
     aria-label="Close dialog"
     onClick={onClose}
   >
   ```

### Hook Development

1. **Follow naming convention**: `use<Name>`

2. **Return stable references**
   ```typescript
   const handleClick = useCallback(() => {}, [deps]);
   ```

3. **Clean up effects**
   ```typescript
   useEffect(() => {
     const subscription = subscribe();
     return () => subscription.unsubscribe();
   }, []);
   ```

4. **Document with JSDoc**
   ```typescript
   /**
    * Hook to manage form state
    * @param initialValues - Initial form values
    * @returns Form state and handlers
    */
   export function useFormState<T>(initialValues: T) {
     // ...
   }
   ```

---

## Future Improvements

### Short Term
- [ ] Add unit tests for all hooks
- [ ] Add component tests for UI library
- [ ] Complete migration from old utils to new hooks
- [ ] Swap refactored components

### Long Term
- [ ] Add Storybook for component documentation
- [ ] Implement visual regression testing
- [ ] Add performance monitoring
- [ ] Create design system documentation site

---

**Last Updated**: 2025-11-19
**Version**: 1.0 (Post-Refactoring Phases 1-5)
