# Component Catalog

**Purpose**: Complete reference of all reusable components and hooks
**Last Updated**: 2025-11-19
**Status**: Living document

---

## Overview

This catalog documents all reusable components and hooks created during the refactoring (Phases 1-5).

**Total Inventory**:
- 20 UI Components
- 16 Custom Hooks
- 3 Refactored Major Components
- 1 Design Token System

---

## UI Components (20 Total)

### Form Components (6)

#### Button
**File**: `src/components/ui/Button/`
**Purpose**: Accessible button component with multiple variants

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Usage**:
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Save Changes
</Button>
```

---

#### TextField
**File**: `src/components/ui/TextField/`
**Purpose**: Text input with label and error support

**Props**:
```typescript
interface TextFieldProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}
```

**Usage**:
```tsx
<TextField
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  placeholder="you@example.com"
/>
```

---

#### TextareaField
**File**: `src/components/ui/TextareaField/`
**Purpose**: Multi-line text input

**Similar to TextField** with textarea-specific props (rows, cols)

---

#### SelectField
**File**: `src/components/ui/SelectField/`
**Purpose**: Dropdown select input

**Props**:
```typescript
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
}
```

---

#### ImageField
**File**: `src/components/ui/ImageField/`
**Purpose**: Image upload with preview

**Features**: Drag & drop, file validation, preview

---

#### RichTextEditor
**File**: `src/components/ui/RichTextEditor/`
**Purpose**: WYSIWYG text editor

**Features**: Formatting toolbar, markdown support

---

### Layout Components (5)

#### Card
**File**: `src/components/ui/Card/`
**Purpose**: Container with shadow and padding
**Phase**: 1

**Props**:
```typescript
interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Usage**:
```tsx
<Card variant="elevated" padding="md">
  <h3>Card Title</h3>
  <p>Card content here</p>
</Card>
```

---

#### Panel
**File**: `src/components/ui/Panel/`
**Purpose**: Collapsible section container
**Phase**: 2

**Props**:
```typescript
interface PanelProps {
  title: string;
  subtitle?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
}
```

**Usage**:
```tsx
<Panel
  title="Account Settings"
  subtitle="Manage your preferences"
  collapsible
  actions={<button>Edit</button>}
>
  {/* Panel content */}
</Panel>
```

---

#### Modal
**File**: `src/components/ui/Modal/`
**Purpose**: Accessible modal dialog
**Phase**: 2

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  preventClose?: boolean;
  children: React.ReactNode;
}
```

**Features**:
- Focus trap
- ESC to close
- Backdrop click to close
- Body scroll lock
- Keyboard accessible

**Usage**:
```tsx
const { isOpen, open, close } = useDisclosure();

<Modal isOpen={isOpen} onClose={close} title="Confirm Action" size="md">
  <p>Are you sure?</p>
  <button onClick={close}>Cancel</button>
</Modal>
```

---

#### Tab
**File**: `src/components/ui/Tab/`
**Purpose**: Tab navigation component

---

#### ResizeHandle
**File**: `src/components/ui/ResizeHandle/`
**Purpose**: Draggable resize handle for panels

---

### Feedback Components (3)

#### LoadingState
**File**: `src/components/feedback/LoadingState.tsx`
**Purpose**: Consistent loading indicator
**Phase**: 2

**Props**:
```typescript
interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}
```

**Features**:
- Animated spinner (respects reduced motion)
- ARIA live region
- Screen reader support

**Usage**:
```tsx
<LoadingState message="Loading themes..." size="md" />
```

---

#### EmptyState
**File**: `src/components/feedback/EmptyState.tsx`
**Purpose**: Friendly empty state display
**Phase**: 2

**Props**:
```typescript
interface EmptyStateProps {
  icon?: string | React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

**Usage**:
```tsx
<EmptyState
  icon="📁"
  title="No themes found"
  description="Upload a theme to get started"
  action={<button onClick={handleUpload}>Upload Theme</button>}
/>
```

---

#### ErrorState
**File**: `src/components/feedback/ErrorState.tsx`
**Purpose**: User-friendly error display
**Phase**: 2

**Props**:
```typescript
interface ErrorStateProps {
  title: string;
  message: string;
  retry?: () => void;
  details?: string;
  showDetails?: boolean;
}
```

**Features**:
- Retry button
- Collapsible technical details
- ARIA alert role

**Usage**:
```tsx
<ErrorState
  title="Failed to load"
  message="Connection error"
  retry={handleRetry}
  details={error.stack}
/>
```

---

### Navigation Components (1)

#### Stepper
**File**: `src/components/ui/Stepper/`
**Purpose**: Multi-step workflow visualizer
**Phase**: 2

**Props**:
```typescript
interface StepperProps {
  steps: Step[];
  currentStep?: number;
  orientation?: 'horizontal' | 'vertical';
}

interface Step {
  id: string;
  label: string;
  status: 'idle' | 'in-progress' | 'completed' | 'error';
  description?: string;
}
```

**Features**:
- Horizontal and vertical layouts
- Animated spinner for in-progress
- Status colors (idle, in-progress, completed, error)
- Responsive (horizontal → vertical on mobile)

**Usage**:
```tsx
const steps = [
  { id: '1', label: 'Account', status: 'completed' },
  { id: '2', label: 'Profile', status: 'in-progress' },
  { id: '3', label: 'Done', status: 'idle' },
];

<Stepper steps={steps} currentStep={1} orientation="vertical" />
```

---

### Utility Components (5)

#### Badge
**File**: `src/components/ui/Badge/`
**Purpose**: Status and label badges
**Phase**: 1

**Props**:
```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

**Usage**:
```tsx
<Badge variant="success" size="sm">Active</Badge>
<Badge variant="warning">Pending</Badge>
```

---

#### Icon
**File**: `src/components/ui/Icon/`
**Purpose**: Icon component

---

#### Toast
**File**: `src/components/ui/Toast/`
**Purpose**: Toast notification

---

#### ToastContainer
**File**: `src/components/ui/ToastContainer/`
**Purpose**: Container for toast notifications

---

#### SkipLinks
**File**: `src/components/ui/SkipLinks/`
**Purpose**: Accessibility skip navigation

---

## Custom Hooks (16 Total)

### UI Hooks (3)

#### useToggle
**File**: `src/hooks/ui/useToggle.ts`
**Purpose**: Boolean state management
**Phase**: 1

**Signature**:
```typescript
function useToggle(initialValue?: boolean): [
  boolean,        // current value
  () => void,     // toggle
  () => void,     // setTrue
  () => void      // setFalse
]
```

**Usage**:
```tsx
const [isOpen, toggle, open, close] = useToggle(false);

<button onClick={toggle}>Toggle</button>
<button onClick={open}>Open</button>
<button onClick={close}>Close</button>
```

---

#### useDisclosure
**File**: `src/hooks/ui/useDisclosure.ts`
**Purpose**: Modal/panel visibility management
**Phase**: 1

**Signature**:
```typescript
function useDisclosure(initialState?: boolean): {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
```

**Usage**:
```tsx
const modal = useDisclosure();

<button onClick={modal.open}>Open Modal</button>
<Modal isOpen={modal.isOpen} onClose={modal.close}>...</Modal>
```

---

#### useModal
**File**: `src/hooks/ui/useModal.ts`
**Purpose**: Modal with data passing
**Phase**: 1

**Signature**:
```typescript
function useModal<T>(): {
  isOpen: boolean;
  data: T | null;
  open: (data?: T) => void;
  close: () => void;
}
```

**Usage**:
```tsx
const deleteModal = useModal<{ id: string; name: string }>();

<button onClick={() => deleteModal.open({ id: '1', name: 'Item' })}>
  Delete
</button>

<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close}>
  Delete {deleteModal.data?.name}?
</Modal>
```

---

### Form Hooks (3)

#### useFormState
**File**: `src/hooks/forms/useFormState.ts`
**Purpose**: Complete form state management
**Phase**: 3

**Signature**:
```typescript
function useFormState<T>(config: {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  resetOnSubmit?: boolean;
}): {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setFieldTouched: <K extends keyof T>(field: K) => void;
  setFieldError: <K extends keyof T>(field: K, error: string) => void;
  reset: () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  getFieldProps: <K extends keyof T>(field: K) => { value, onChange, onBlur };
}
```

**Usage**:
```tsx
const form = useFormState({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => await login(values),
  validate: (values) => {
    const errors = {};
    if (!values.email) errors.email = 'Required';
    return errors;
  },
});

<input {...form.getFieldProps('email')} />
{form.errors.email && form.touched.email && <span>{form.errors.email}</span>}
```

---

#### useFormValidation
**File**: `src/hooks/forms/useFormValidation.ts`
**Purpose**: Schema-based validation with built-in validators
**Phase**: 3

**Built-in Validators**:
- `validators.required()`
- `validators.email()`
- `validators.minLength(n)`
- `validators.maxLength(n)`
- `validators.pattern(regex)`
- `validators.min(n)` / `validators.max(n)`
- `validators.url()`
- `validators.custom(fn)`
- `validators.matches(field)`

**Usage**:
```tsx
const schema = {
  email: [validators.required(), validators.email()],
  password: [validators.required(), validators.minLength(8)],
};

const { validateForm } = useFormValidation(schema);
const errors = validateForm(values);
```

---

#### useFormDirty
**File**: `src/hooks/forms/useFormDirty.ts`
**Purpose**: Track form modifications
**Phase**: 3

**Signature**:
```typescript
function useFormDirty<T>(initialValues: T, currentValues: T): {
  isDirty: boolean;
  dirtyFields: Set<string>;
  markClean: () => void;
  isFieldDirty: (fieldName: string) => boolean;
  getChangedValues: () => Record<string, any>;
}
```

---

### Async Hooks (5)

#### useAsync
**File**: `src/hooks/async/useAsync.ts`
**Purpose**: Async operation state management
**Phase**: 3

**Signature**:
```typescript
function useAsync<T, Args extends any[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  immediate?: boolean
): {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
  called: boolean;
  execute: (...args: Args) => Promise<T | undefined>;
  reset: () => void;
  setData: (data: T) => void;
  setError: (error: Error) => void;
}
```

**Features**:
- Automatic race condition handling
- Cleanup on unmount
- Manual execution control

**Usage**:
```tsx
const { data, loading, error, execute } = useAsync(fetchUser);

useEffect(() => {
  execute(userId);
}, [userId]);

if (loading) return <LoadingState />;
if (error) return <ErrorState retry={execute} />;
return <UserProfile data={data} />;
```

---

#### useDebounce
**File**: `src/hooks/async/useDebounce.ts`
**Purpose**: Debounce value changes
**Phase**: 3

**Signature**:
```typescript
function useDebounce<T>(value: T, delay?: number): T;
```

**Usage**:
```tsx
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    fetchResults(debouncedSearch);
  }
}, [debouncedSearch]);
```

---

#### useDebouncedCallback
**File**: `src/hooks/async/useDebounce.ts`
**Purpose**: Debounce callback functions
**Phase**: 3

**Usage**:
```tsx
const handleSearch = useDebouncedCallback((term: string) => {
  fetchResults(term);
}, 500);

<input onChange={(e) => handleSearch(e.target.value)} />
```

---

#### useThrottle / useThrottledCallback
**File**: `src/hooks/async/useThrottle.ts`
**Purpose**: Throttle value/callback updates
**Phase**: 3

**Similar to debounce** but ensures updates at regular intervals

---

### State Management Hooks (2)

#### usePersistedState
**File**: `src/hooks/state/usePersistedState.ts`
**Purpose**: Persist state to localStorage/sessionStorage
**Phase**: 3

**Signature**:
```typescript
function usePersistedState<T>(
  key: string,
  initialValue: T,
  options?: {
    storage?: 'local' | 'session';
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    syncTabs?: boolean;
    validate?: (value: any) => value is T;
  }
): [T, (value: T) => void, () => void];
```

**Features**:
- Tab synchronization
- Custom serialization
- Validation
- SSR-safe

**Usage**:
```tsx
const [theme, setTheme, clearTheme] = usePersistedState('theme', 'light', {
  storage: 'local',
  validate: (v) => ['light', 'dark'].includes(v),
});
```

---

#### useLocalStorage
**File**: `src/hooks/state/useLocalStorage.ts`
**Purpose**: Simplified localStorage interface
**Phase**: 3

**Signature**:
```typescript
function useLocalStorage<T>(key: string, initialValue: T): {
  value: T;
  setValue: (value: T) => void;
  remove: () => void;
  isLoaded: boolean;
  error: Error | null;
}
```

---

### Domain Hooks (2)

#### useStepper
**File**: `src/hooks/domain/useStepper.ts`
**Purpose**: Multi-step workflow management
**Phase**: 3

**Signature**:
```typescript
function useStepper(config: {
  steps: string[] | Step[];
  initialStep?: number;
  onComplete?: () => void;
  onStepChange?: (index: number, id: string) => void;
  validate?: (stepIndex: number) => boolean | Promise<boolean>;
}): {
  steps: Step[];
  currentStepIndex: number;
  currentStep: Step;
  isFirstStep: boolean;
  isLastStep: boolean;
  isCompleted: boolean;
  goToNext: () => Promise<void>;
  goToPrevious: () => void;
  goToStep: (index: number) => void;
  completeStep: () => Promise<void>;
  setStepError: (error?: string) => void;
  reset: () => void;
}
```

**Features**:
- Step validation
- Status tracking
- Navigation methods
- Integrates with Stepper component

**Usage**:
```tsx
const stepper = useStepper({
  steps: ['account', 'profile', 'done'],
  onComplete: handleFinish,
  validate: async (step) => step === 0 ? validateAccount() : true,
});

<Stepper steps={stepper.steps} currentStep={stepper.currentStepIndex} />
<button onClick={stepper.goToNext}>Next</button>
```

---

#### useAutoSave
**File**: `src/hooks/domain/useAutoSave.ts`
**Purpose**: Automatic data saving
**Phase**: 3

**Signature**:
```typescript
function useAutoSave<T>(config: {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  isEqual?: (a: T, b: T) => boolean;
}): {
  isSaving: boolean;
  lastSaved: Date | null;
  error: Error | null;
  hasUnsavedChanges: boolean;
  saveNow: () => Promise<void>;
  cancelPendingSave: () => void;
}
```

**Features**:
- Automatic save after delay
- Manual save trigger
- Save status tracking
- Custom equality check

**Usage**:
```tsx
const autoSave = useAutoSave({
  data: editorContent,
  onSave: async (content) => await saveToServer(content),
  delay: 2000,
});

{autoSave.isSaving && <span>Saving...</span>}
{autoSave.lastSaved && <span>Saved at {autoSave.lastSaved}</span>}
```

---

### Legacy Hooks (2)

#### useCodeStreaming
**File**: `src/hooks/useCodeStreaming.ts`
**Purpose**: Code streaming functionality (pre-refactor)

#### useCodeGeneration
**File**: `src/hooks/useCodeGeneration.ts`
**Purpose**: Code generation logic (pre-refactor)

---

## Design System

### Design Tokens
**File**: `src/styles/tokens.ts`
**Phase**: 1

**Categories**:
- Colors (primary, semantic, states)
- Spacing (4px grid system)
- Typography (families, sizes, weights, line heights)
- Border radii
- Shadows
- Z-index layers
- Animation durations and easings
- Breakpoints
- Component sizes

**Usage**:
```typescript
import { colors, spacing, typography } from '@/styles/tokens';

const styles = {
  color: colors.primary,
  padding: spacing[4],
  fontSize: typography.fontSize.base,
};
```

---

## Import Patterns

### Recommended Imports

**UI Components**:
```typescript
import {
  Button,
  Card,
  Badge,
  Modal,
  Panel,
  Stepper,
  LoadingState,
  EmptyState,
  ErrorState,
} from '@/components/ui';
```

**Hooks**:
```typescript
import {
  useToggle,
  useDisclosure,
  useModal,
  useFormState,
  useAsync,
  useDebounce,
  usePersistedState,
  useStepper,
  useAutoSave,
  validators,
} from '@/hooks';
```

**Design Tokens**:
```typescript
import { colors, spacing, typography } from '@/styles/tokens';
```

---

## Quick Reference

### When to Use What

**Form Management**:
- Simple form → `useFormState`
- Need validation → `useFormState` + `validators`
- Track dirty state → `useFormDirty`
- Auto-save → `useAutoSave`

**Async Operations**:
- API calls → `useAsync`
- Search input → `useDebounce`
- Scroll/resize → `useThrottle`

**UI State**:
- Boolean toggle → `useToggle`
- Modal/panel → `useDisclosure`
- Modal with data → `useModal`

**Multi-Step**:
- Wizard flow → `useStepper` + `Stepper` component

**Feedback**:
- Loading → `LoadingState`
- Empty state → `EmptyState`
- Error → `ErrorState`

**Persistence**:
- Save to localStorage → `usePersistedState` or `useLocalStorage`

---

## Component Combinations

### Common Patterns

**Form with Validation**:
```tsx
const form = useFormState({
  initialValues: { name: '', email: '' },
  validate: (values) => {
    const errors = {};
    if (!validators.required()(values.name)) errors.name = 'Required';
    if (!validators.email()(values.email)) errors.email = 'Invalid email';
    return errors;
  },
  onSubmit: async (values) => await save(values),
});

<TextField {...form.getFieldProps('name')} error={form.errors.name} />
<Button onClick={form.handleSubmit} disabled={!form.isValid}>Submit</Button>
```

**Async Data with States**:
```tsx
const { data, loading, error, execute } = useAsync(fetchData);

if (loading) return <LoadingState />;
if (error) return <ErrorState retry={execute} />;
if (!data) return <EmptyState title="No data" />;
return <DataView data={data} />;
```

**Modal with Confirmation**:
```tsx
const modal = useDisclosure();

<Button onClick={modal.open}>Delete</Button>
<Modal isOpen={modal.isOpen} onClose={modal.close} title="Confirm">
  Are you sure?
  <Button onClick={handleDelete}>Yes, delete</Button>
</Modal>
```

**Multi-Step Wizard**:
```tsx
const stepper = useStepper({ steps: ['account', 'profile', 'done'] });

<Stepper steps={stepper.steps} currentStep={stepper.currentStepIndex} />
<Panel title={stepper.currentStep.label}>
  {/* Step content */}
</Panel>
<Button onClick={stepper.goToPrevious} disabled={stepper.isFirstStep}>
  Back
</Button>
<Button onClick={stepper.goToNext} disabled={stepper.isLastStep}>
  Next
</Button>
```

---

## Accessibility Notes

All components implement WCAG AA standards:
- ✅ Keyboard navigation
- ✅ ARIA attributes
- ✅ Focus management
- ✅ Screen reader support
- ✅ Color contrast
- ✅ Reduced motion support

---

**Last Updated**: 2025-11-19
**Maintainer**: Development Team
**Status**: Complete through Phase 5
