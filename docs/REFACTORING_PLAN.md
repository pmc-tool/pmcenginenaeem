# PMC Engine Frontend Refactoring Plan

**Created**: 2025-11-19
**Status**: Ready for Implementation
**Scope**: Frontend Only - Zero Breaking Changes
**Goal**: Improve maintainability, reusability, and code quality

---

## Executive Summary

This document outlines a comprehensive, phased refactoring of the PMC Engine frontend codebase to improve maintainability, reduce code duplication, enforce consistent patterns, and create a robust foundation for future development.

### Current State Analysis

**Codebase Metrics:**
- **Total TypeScript files**: 112
- **Total CSS files**: 66
- **Components**: ~80+ React components
- **Largest components**: 369 LOC (DeployPanel), 335 LOC (FileExplorerSidebar), 318 LOC (ChatPanel)
- **State management**: Zustand stores (dashboardStore, codeStore, contentStore, deploymentStore, themesStore, trainingStore)
- **UI components**: 12 reusable components in `/ui`
- **Custom hooks**: 2 (useCodeGeneration, useCodeStreaming)
- **Technical debt markers**: 16 TODO/FIXME comments

### Key Issues Identified

1. **Large Components**: Several components exceed 300 LOC, indicating responsibilities that could be split
2. **Limited Hook Reusability**: Only 2 custom hooks despite 117+ hook usages
3. **Inconsistent Patterns**: Form handling, state management, and validation scattered across components
4. **Duplicate Logic**: Similar patterns for modals, panels, form fields, and validation
5. **CSS Organization**: 66 CSS files with potential for consolidation using CSS-in-JS or modules
6. **Missing Abstractions**: Common patterns (loading states, error boundaries, data fetching) not extracted

---

## Phase 1: Foundation & Architecture Design

**Duration**: 2-3 days
**Risk**: Low
**Dependencies**: None

### 1.1 Folder Structure Reorganization

Create a clear, scalable folder structure that separates concerns:

```
frontend/src/
├── components/
│   ├── ui/              # Reusable UI primitives (existing, to be enhanced)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Card/
│   │   ├── Badge/
│   │   ├── Stepper/
│   │   ├── Panel/
│   │   └── index.ts       # Barrel export
│   │
│   ├── forms/           # NEW: Reusable form components
│   │   ├── FormField/
│   │   ├── FormSection/
│   │   ├── FormActions/
│   │   └── index.ts
│   │
│   ├── layout/          # NEW: Layout wrappers
│   │   ├── Container/
│   │   ├── Stack/
│   │   ├── Grid/
│   │   ├── Sidebar/
│   │   └── index.ts
│   │
│   └── feedback/        # NEW: Feedback components
│       ├── LoadingState/
│       ├── ErrorState/
│       ├── EmptyState/
│       └── index.ts
│
├── modules/             # NEW: Feature-specific components
│   ├── chat/            # Move from components/chat
│   ├── code/            # Move from components/code
│   ├── deployment/      # Move from components/deployment
│   ├── inspector/       # Move from components/inspector
│   ├── settings/        # Move from components/settings
│   ├── shell/           # Move from components/shell
│   └── themes/          # Move from components/themes
│
├── hooks/               # Enhanced custom hooks
│   ├── ui/              # NEW: UI-related hooks
│   │   ├── useToggle.ts
│   │   ├── useModal.ts
│   │   ├── useDisclosure.ts
│   │   └── index.ts
│   │
│   ├── forms/           # NEW: Form hooks
│   │   ├── useFormState.ts
│   │   ├── useFormValidation.ts
│   │   ├── useFormDirty.ts
│   │   └── index.ts
│   │
│   ├── state/           # NEW: State management hooks
│   │   ├── usePersistedState.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useSessionStorage.ts
│   │   └── index.ts
│   │
│   ├── async/           # NEW: Async operation hooks
│   │   ├── useAsync.ts
│   │   ├── useDebounce.ts
│   │   ├── useThrottle.ts
│   │   └── index.ts
│   │
│   └── domain/          # Existing domain hooks
│       ├── useCodeGeneration.ts
│       ├── useCodeStreaming.ts
│       └── index.ts
│
├── contexts/            # NEW: React contexts (minimize use, prefer Zustand)
│   ├── ThemeContext.tsx
│   └── index.ts
│
├── utils/               # Enhanced utilities
│   ├── validation/      # NEW: Validation utilities
│   │   ├── validators.ts
│   │   ├── schemas.ts
│   │   └── index.ts
│   │
│   ├── formatting/      # NEW: Formatting utilities
│   │   ├── dates.ts
│   │   ├── numbers.ts
│   │   ├── strings.ts
│   │   └── index.ts
│   │
│   └── [existing utils remain]
│
├── types/               # Enhanced type definitions
│   ├── ui.ts            # NEW: UI component types
│   ├── forms.ts         # NEW: Form types
│   └── [existing types remain]
│
├── styles/              # Global styles
│   ├── tokens.css       # Design tokens (already exists)
│   ├── globals.css      # Global styles
│   ├── utilities.css    # NEW: Utility classes
│   └── animations.css   # NEW: Reusable animations
│
└── [other existing folders]
```

### 1.2 Component Architecture Principles

**Establish clear component categories:**

1. **UI Components** (`/components/ui`):
   - Pure, presentational components
   - No business logic or state management
   - Fully typed props with JSDoc
   - Storybook-ready (future)
   - 100% test coverage goal

2. **Form Components** (`/components/forms`):
   - Controlled form inputs
   - Built-in validation hooks
   - Consistent error display
   - Accessibility built-in

3. **Layout Components** (`/components/layout`):
   - Flexbox/Grid wrappers
   - Consistent spacing system
   - Responsive by default

4. **Module Components** (`/modules/*`):
   - Feature-specific logic
   - Can consume UI components
   - May include local state
   - Organized by feature domain

### 1.3 Design System Foundation

**Create design token system:**

```typescript
// styles/tokens.ts
export const tokens = {
  colors: {
    primary: '#EA2724',
    background: '#FFFFFF',
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      tertiary: '#999999',
    },
    border: '#E5E5E5',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    xxl: '3rem',    // 48px
  },
  typography: {
    sizes: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.5rem',    // 24px
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  radii: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
};
```

---

## Phase 2: UI Component Library Creation

**Duration**: 4-5 days
**Risk**: Low
**Dependencies**: Phase 1 complete

### 2.1 Core UI Components

Extract and enhance existing UI components, add missing ones:

#### New Components to Create:

1. **Card Component**
```typescript
// components/ui/Card/Card.tsx
interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
```
**Usage**: ThemesPage, DeployPanel, Settings sections

2. **Badge Component**
```typescript
// components/ui/Badge/Badge.tsx
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}
```
**Usage**: Theme status pills, uploaded theme badges, deployment status

3. **Modal Component**
```typescript
// components/ui/Modal/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}
```
**Usage**: DeployPanel, confirmation dialogs, help panels

4. **Stepper Component**
```typescript
// components/ui/Stepper/Stepper.tsx
interface Step {
  id: string;
  label: string;
  status: 'idle' | 'in-progress' | 'completed' | 'error';
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
}
```
**Usage**: DeployPanel deployment steps, AITrainingPanel wizard

5. **Panel Component**
```typescript
// components/ui/Panel/Panel.tsx
interface PanelProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}
```
**Usage**: Settings sections, Inspector tabs, sidebar panels

6. **LoadingState / EmptyState / ErrorState**
```typescript
// components/feedback/LoadingState.tsx
interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

// components/feedback/EmptyState.tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

// components/feedback/ErrorState.tsx
interface ErrorStateProps {
  title: string;
  message: string;
  retry?: () => void;
  showDetails?: boolean;
}
```
**Usage**: Everywhere loading/empty/error states appear

### 2.2 Form Component Library

Create consistent form components:

1. **FormField** (wrapper for all inputs)
```typescript
interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}
```

2. **FormSection** (groups related fields)
```typescript
interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  collapsible?: boolean;
}
```

3. **FormActions** (submit/cancel buttons)
```typescript
interface FormActionsProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  isValid?: boolean;
}
```

### 2.3 Layout Components

1. **Container** - Max-width wrapper
2. **Stack** - Vertical spacing
3. **Grid** - Responsive grid layout
4. **Flex** - Flexbox wrapper with gap support
5. **Divider** - Visual separator

---

## Phase 3: Custom Hooks Extraction

**Duration**: 3-4 days
**Risk**: Medium
**Dependencies**: Phase 1 complete

### 3.1 UI State Hooks

#### `useToggle`
```typescript
/**
 * Hook for boolean toggle state
 * @param initialValue - Initial toggle state
 * @returns [value, toggle, setTrue, setFalse]
 */
function useToggle(initialValue = false): [
  boolean,
  () => void,
  () => void,
  () => void
]
```
**Replaces**: Manual `useState` for modals, panels, expansion states
**Usage**: 30+ locations

#### `useDisclosure`
```typescript
/**
 * Hook for component visibility (modals, dropdowns, etc.)
 * @returns { isOpen, open, close, toggle }
 */
function useDisclosure(initialState = false): {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
```
**Replaces**: Modal/dropdown visibility logic
**Usage**: DeployPanel, HelpPanel, ConfirmDialog, BottomAIPanel

#### `useModal`
```typescript
/**
 * Complete modal state management with data passing
 */
function useModal<T = unknown>(): {
  isOpen: boolean;
  data: T | null;
  open: (data?: T) => void;
  close: () => void;
}
```
**Replaces**: Complex modal state with context data
**Usage**: Confirmation dialogs, detail views

### 3.2 Form Hooks

#### `useFormState`
```typescript
/**
 * Manage form state with validation
 */
function useFormState<T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: ValidationSchema<T>
): {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isDirty: boolean;
  isValid: boolean;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (onSubmit: (values: T) => void) => (e: FormEvent) => void;
  reset: () => void;
}
```
**Replaces**: Manual form handling in settings sections
**Usage**: AITrainingPanel, ContactSection, BrandBasicsSection, etc.

#### `useFormDirty`
```typescript
/**
 * Track if form has unsaved changes
 */
function useFormDirty<T>(
  currentValues: T,
  originalValues: T
): {
  isDirty: boolean;
  dirtyFields: (keyof T)[];
  reset: () => void;
}
```
**Replaces**: Manual dirty state tracking
**Usage**: AITrainingPanel, Settings sections

### 3.3 State Persistence Hooks

#### `useLocalStorage`
```typescript
/**
 * Persist state to localStorage with type safety
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void]
```
**Replaces**: Manual localStorage handling
**Usage**: Theme caching, user preferences

#### `usePersistedState`
```typescript
/**
 * Enhanced localStorage hook with expiry and validation
 */
function usePersistedState<T>(
  key: string,
  initialValue: T,
  options?: {
    expiryMs?: number;
    validator?: (value: unknown) => value is T;
  }
): [T, (value: T) => void, () => void]
```

### 3.4 Async Operation Hooks

#### `useAsync`
```typescript
/**
 * Handle async operations with loading/error states
 */
function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate = true
): {
  execute: () => Promise<void>;
  value: T | null;
  error: E | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}
```
**Replaces**: Manual async state management
**Usage**: Theme uploads, deployment, API calls

#### `useDebounce`
```typescript
/**
 * Debounce a value
 */
function useDebounce<T>(value: T, delay: number): T
```
**Enhances**: Existing `debounce` utility
**Usage**: Search inputs, auto-save

### 3.5 Domain Hooks

Keep existing:
- `useCodeGeneration`
- `useCodeStreaming`

Add new:

#### `useStepper`
```typescript
/**
 * Multi-step workflow state management
 */
function useStepper(totalSteps: number, initialStep = 0): {
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToStep: (step: number) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  reset: () => void;
}
```
**Usage**: AITrainingPanel wizard, deployment steps

#### `useAutoSave`
```typescript
/**
 * Auto-save form data with debounce
 */
function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  options?: {
    delay?: number;
    enabled?: boolean;
  }
): {
  isSaving: boolean;
  lastSaved: Date | null;
  error: Error | null;
  forceSave: () => Promise<void>;
}
```
**Usage**: Settings panels, content editing

---

## Phase 4: Component Refactoring

**Duration**: 5-7 days
**Risk**: Medium-High
**Dependencies**: Phases 2 & 3 complete

### 4.1 Large Component Splitting

#### DeployPanel.tsx (369 LOC) → Split into:

```
modules/deployment/
├── DeployPanel.tsx           # Main orchestrator (100 LOC)
├── DeployHeader.tsx          # Header section (30 LOC)
├── DeployStepList.tsx        # Steps timeline (60 LOC)
├── DeployTerminalLog.tsx     # Terminal output (50 LOC)
├── DeploySuccess.tsx         # Success state (40 LOC)
├── DeployError.tsx           # Error state (40 LOC)
└── useDeploymentFlow.ts      # Business logic hook (80 LOC)
```

**Benefits:**
- Each component under 100 LOC
- Logic extracted to custom hook
- Easier to test individual states
- Reusable DeployStepList for other wizards

#### ChatPanel.tsx (318 LOC) → Split into:

```
modules/chat/
├── ChatPanel.tsx             # Main container (80 LOC)
├── ChatHeader.tsx            # Header with scope (40 LOC)
├── ChatMessageList.tsx       # Message display (60 LOC)
├── ChatMessage.tsx           # Individual message (50 LOC)
├── ChatInput.tsx             # Input composer (50 LOC)
└── useChatMessages.ts        # Message management (60 LOC)
```

#### FileExplorerSidebar.tsx (335 LOC) → Already good structure, extract:

```typescript
// hooks/domain/useFileExplorer.ts
function useFileExplorer() {
  // Extract file selection, expansion, resize logic
}
```

### 4.2 Settings Section Consolidation

**Current state**: 6 separate section components with duplicate patterns

**Refactor to**:

```typescript
// components/forms/SettingsSection.tsx
interface SettingsSectionProps {
  title: string;
  description?: string;
  fields: FieldConfig[];
  values: Record<string, any>;
  onChange: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

// Usage
<SettingsSection
  title="Brand Basics"
  fields={brandBasicsFields}
  values={trainingData}
  onChange={updateField}
/>
```

**Eliminates**: 800+ lines of duplicate form rendering code

### 4.3 Form Field Standardization

Replace custom field components with standardized wrappers:

```typescript
// Before (ContactSection.tsx - 242 LOC)
<div className="field">
  <label htmlFor="email">Email</label>
  <input
    type="email"
    id="email"
    value={data.email}
    onChange={e => updateField('email', e.target.value)}
  />
  {errors.email && <span className="error">{errors.email}</span>}
</div>

// After (50% less code)
<FormField
  label="Email"
  error={errors.email}
  required
>
  <TextField
    id="email"
    type="email"
    value={data.email}
    onChange={value => updateField('email', value)}
  />
</FormField>
```

---

## Phase 5: Dead Code Removal

**Duration**: 1-2 days
**Risk**: Low
**Dependencies**: Phase 4 complete

### 5.1 Unused Imports Detection

```bash
# Use ESLint to detect unused imports
npm run lint -- --fix
```

### 5.2 Unused Components Audit

**Process**:
1. Search for component imports across codebase
2. Identify components never imported
3. Verify with git history (may be legacy)
4. Remove or mark as deprecated

### 5.3 Duplicate Utility Functions

**Identified duplicates** (to be consolidated):

1. **Timestamp formatting** - Already have `formatTimestamp.ts`, ensure consistent usage
2. **Validation logic** - Consolidate into `utils/validation/`
3. **String helpers** - Create `utils/formatting/strings.ts`

### 5.4 CSS Cleanup

**Actions**:
1. Remove unused CSS classes (use PurgeCSS or manual audit)
2. Consolidate duplicate styles into utility classes
3. Convert component-specific CSS to CSS Modules where appropriate
4. Ensure all CSS files are imported

---

## Phase 6: Documentation & Code Quality

**Duration**: 2-3 days
**Risk**: Low
**Dependencies**: Phases 2-5 complete

### 6.1 JSDoc Standards

**Template for reusable components**:

```typescript
/**
 * Button component with consistent styling and behavior
 *
 * @component
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 *
 * @param {ButtonProps} props - Component props
 * @param {'primary' | 'secondary' | 'ghost'} props.variant - Button style variant
 * @param {'sm' | 'md' | 'lg'} props.size - Button size
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {boolean} [props.loading=false] - Whether button shows loading state
 * @param {() => void} [props.onClick] - Click handler
 * @param {React.ReactNode} props.children - Button content
 */
export function Button({ variant, size, disabled, loading, onClick, children }: ButtonProps) {
  // implementation
}
```

**Apply to**:
- All UI components (`/components/ui`)
- All form components (`/components/forms`)
- All custom hooks (`/hooks`)
- All utility functions (`/utils`)

### 6.2 Module-Level Documentation

**Create README.md for each module:**

```markdown
# Chat Module

## Purpose
Provides AI chat interface for user interaction and command execution.

## Components
- `ChatPanel` - Main chat container
- `ChatMessage` - Individual message display
- `ChatInput` - Message input with auto-complete

## Hooks
- `useChatMessages` - Message state management
- `useChatScroll` - Auto-scroll behavior

## Dependencies
- Uses `dashboardStore` for chat state
- Uses `codeStore` for code command detection

## Testing
Run: `npm test -- chat`
```

### 6.3 Type Safety Improvements

**Actions**:
1. Add explicit return types to all functions
2. Remove `any` types (current count: audit needed)
3. Create discriminated unions for variant types
4. Add const assertions where appropriate

**Example**:

```typescript
// Before
export function getStatusColor(status: string): string {
  // ...
}

// After
export type DeploymentStatus = 'idle' | 'pending' | 'success' | 'error';

export function getStatusColor(
  status: DeploymentStatus
): 'gray' | 'blue' | 'green' | 'red' {
  // ...
}
```

### 6.4 Linting & Formatting Rules

**Update ESLint config**:

```javascript
// eslint.config.js additions
export default [
  {
    rules: {
      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Naming
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'interface', format: ['PascalCase'] },
        { selector: 'typeAlias', format: ['PascalCase'] },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
      ],

      // Code quality
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Imports
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      }],
    },
  },
];
```

**Prettier config** (already exists, verify):

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## Phase 7: Testing & QA

**Duration**: 2-3 days
**Risk**: Medium
**Dependencies**: All previous phases

### 7.1 Component Testing Strategy

**Unit Tests** (Vitest + Testing Library):
- All new UI components: 100% coverage
- All new hooks: 100% coverage
- Existing components: Maintain current coverage

**Test Template**:

```typescript
// components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});
```

### 7.2 Integration Testing

**Test critical user flows**:
1. Theme selection → deployment → success
2. Theme upload → validation → My Themes
3. Deployment failure → AI help → redeploy
4. Settings changes → auto-save → persistence
5. Chat interaction → code generation → accept/reject

**Use Playwright** (already configured):

```typescript
// e2e/deployment.spec.ts
test('successful theme deployment flow', async ({ page }) => {
  await page.goto('/');

  // Select theme
  await page.click('[data-testid="theme-card-1"]');
  await page.click('text=Use this theme');

  // Wait for deployment panel
  await page.waitForSelector('[data-testid="deploy-panel"]');

  // Verify steps progress
  await expect(page.locator('text=Detecting tech stack')).toBeVisible();
  await expect(page.locator('text=Done – first version is live')).toBeVisible({ timeout: 90000 });

  // Verify preview mode
  await expect(page).toHaveURL(/.*preview=true/);
});
```

### 7.3 Accessibility Testing

**Automated checks** (already have axe-core):

```typescript
// Run: npm run test:a11y
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});
```

**Manual testing checklist**:
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible on all focusable elements
- [ ] Screen reader announces all state changes
- [ ] Color contrast meets WCAG AA (use contrast checker)
- [ ] Form errors properly associated with inputs
- [ ] ARIA labels on all icon buttons

### 7.4 Regression Testing Checklist

**Before each phase commit:**

- [ ] All existing tests pass: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] No TypeScript errors: `npm run build`
- [ ] Dev server runs without errors: `npm run dev`
- [ ] Manual smoke test of key features:
  - [ ] Pages/Files navigation
  - [ ] Theme browsing
  - [ ] Chat interaction
  - [ ] Settings panel
  - [ ] Code editor
  - [ ] Deploy flow

**After full refactoring:**

- [ ] Complete E2E test suite: `npm run test:e2e`
- [ ] Accessibility audit: `npm run test:a11y`
- [ ] Bundle size check (verify no significant increase)
- [ ] Performance check (Lighthouse score maintained)

---

## Phase 8: Migration Strategy

**Duration**: Ongoing throughout Phases 2-6
**Risk**: Low (incremental approach)

### 8.1 Safe Migration Principles

1. **No Big Bang**: Refactor incrementally, one component/hook at a time
2. **Backward Compatible**: Old and new patterns coexist during migration
3. **Feature Flags**: Use feature flags for major changes if needed
4. **Continuous Testing**: Run tests after each migration
5. **Incremental Commits**: Commit frequently with clear messages

### 8.2 Migration Order

**Week 1**: Foundation
- Create folder structure
- Set up design tokens
- Create UI component library (Cards, Badges, Modals, etc.)

**Week 2**: Hooks
- Create custom hooks
- Test hooks independently
- Document hook usage

**Week 3-4**: Component Migration (Priority Order)

1. **High Impact, Low Risk** (migrate first):
   - Settings sections → use new SettingsSection component
   - Form fields → use new FormField wrappers
   - Loading/Empty/Error states → use feedback components

2. **Medium Impact, Medium Risk**:
   - DeployPanel → split into smaller components
   - ChatPanel → split into smaller components
   - ThemesPage → use new Card/Badge components

3. **Low Impact** (migrate last):
   - Utility function consolidation
   - CSS module migration
   - Documentation updates

### 8.3 Migration Tracking

**Create migration checklist**:

```markdown
## UI Component Migration

- [ ] Settings sections (6 components) → SettingsSection
- [ ] Theme cards → Card component
- [ ] Status badges → Badge component
- [ ] Modals/Panels → Modal component
- [ ] Loading states → LoadingState
- [ ] Error states → ErrorState
- [ ] Empty states → EmptyState

## Hook Migration

- [ ] Modal visibility → useDisclosure (8 locations)
- [ ] Form state → useFormState (6 forms)
- [ ] Dirty tracking → useFormDirty (3 locations)
- [ ] Debounced search → useDebounce (2 locations)

## Component Splitting

- [ ] DeployPanel (369 LOC → 6 components)
- [ ] ChatPanel (318 LOC → 5 components)
- [ ] FileExplorerSidebar (extract logic to hook)
```

### 8.4 Rollback Plan

**If issues arise**:

1. **Component level**: Revert specific component changes via Git
2. **Hook level**: Keep old implementation alongside new until verified
3. **Critical bugs**: Use feature flags to disable new code paths
4. **Performance issues**: Profile before/after, rollback if >10% degradation

---

## Success Metrics

### Code Quality Metrics (Target)

- [ ] **Average component size**: < 150 LOC (currently 180 LOC)
- [ ] **Component reusability**: 80%+ of UI from shared components
- [ ] **Test coverage**: > 80% overall, 100% for UI components
- [ ] **TypeScript strict mode**: Enabled with zero errors
- [ ] **ESLint errors**: 0
- [ ] **Accessibility violations**: 0 (WCAG AA)
- [ ] **Bundle size**: No increase >5% from baseline

### Developer Experience Metrics

- [ ] **Build time**: Maintained or improved
- [ ] **Hot reload time**: < 200ms
- [ ] **New component creation**: < 5 min with scaffolding
- [ ] **Documentation coverage**: 100% of public APIs

### Maintenance Metrics

- [ ] **Code duplication**: < 5% (use code clone detection)
- [ ] **Cyclomatic complexity**: Average < 10 per function
- [ ] **Technical debt**: 0 TODO/FIXME comments
- [ ] **Dead code**: 0 unused exports

---

## Risk Mitigation

### High Risk Areas

1. **Large Component Refactoring** (DeployPanel, ChatPanel)
   - **Mitigation**: Extensive E2E tests before/after, feature flag rollout

2. **State Management Changes**
   - **Mitigation**: No changes to Zustand stores, only hook abstractions

3. **CSS Changes** (66 files → modules)
   - **Mitigation**: Phase this separately, visual regression testing

### Medium Risk Areas

1. **Hook Extraction**
   - **Mitigation**: Comprehensive unit tests, gradual adoption

2. **Type System Changes**
   - **Mitigation**: Incremental strictness increases, CI enforcement

### Low Risk Areas

1. **UI Component Library**
   - **Mitigation**: Fully tested before use, no existing code changes

2. **Documentation**
   - **Mitigation**: Non-breaking, continuous improvement

---

## Timeline Summary

| Phase | Duration | Dependencies | Risk | Priority |
|-------|----------|--------------|------|----------|
| 1. Foundation | 2-3 days | None | Low | High |
| 2. UI Components | 4-5 days | Phase 1 | Low | High |
| 3. Custom Hooks | 3-4 days | Phase 1 | Medium | High |
| 4. Component Refactoring | 5-7 days | Phases 2 & 3 | Medium-High | Medium |
| 5. Dead Code Removal | 1-2 days | Phase 4 | Low | Low |
| 6. Documentation | 2-3 days | Phases 2-5 | Low | Medium |
| 7. Testing & QA | 2-3 days | All phases | Medium | High |

**Total Estimated Duration**: 19-27 days (4-5 weeks)

---

## Appendix A: Component Inventory

### Current Component Count

```
/components/ui: 12 components
/components/chat: 7 components
/components/code: 8 components
/components/deployment: 3 components
/components/inspector: 3 components
/components/overlays: 2 components
/components/settings: 12 components (6 sections + 6 shared)
/components/shell: 8 components
/components/themes: 5 components

Total: ~60 components
```

### Components by Size Category

**Large (>250 LOC)**: 6 components
- DeployPanel (369 LOC)
- FileExplorerSidebar (335 LOC)
- ChatPanel (318 LOC)
- Canvas (258 LOC)
- ContactSection (242 LOC)
- RichTextEditor (245 LOC)

**Medium (150-250 LOC)**: 12 components

**Small (<150 LOC)**: 42 components

---

## Appendix B: Dependencies Audit

### Current Dependencies (Production)

```json
{
  "@monaco-editor/react": "^4.7.0",      // Code editor
  "@radix-ui/*": "^1.1.*",               // UI primitives (8 packages)
  "@tiptap/*": "^3.10.7",                // Rich text editor (4 packages)
  "@vanilla-extract/css": "^1.17.4",     // CSS-in-JS (unused?)
  "ajv": "^8.17.1",                      // JSON schema validation
  "date-fns": "^4.1.0",                  // Date utilities
  "diff": "^5.2.0",                      // Diff algorithm
  "jszip": "^3.10.1",                    // ZIP file handling
  "react": "^19.2.0",                    // React 19
  "react-dom": "^19.2.0",
  "react-hook-form": "^7.66.1",          // Form library (underutilized?)
  "zustand": "^4.5.7"                    // State management
}
```

### Potential Additions

- **clsx** or **classnames**: For conditional className joining
- **react-use**: Additional hooks library (consider carefully)
- **zod**: Runtime type validation (alternative to ajv)

### Potential Removals

- `@vanilla-extract/css`: If not actively used
- `react-hook-form`: If replacing with custom hooks

---

## Appendix C: Code Examples

### Example: Before/After Component Refactoring

#### Before: ContactSection.tsx (242 LOC)

```typescript
export function ContactSection({ data, onChange, errors }: ContactSectionProps) {
  return (
    <div className="contact-section">
      <h2>Contact Information</h2>
      <p>How customers can reach you</p>

      <div className="field">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={data.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className="error">{errors.email}</span>}
        <span className="hint">Primary contact email</span>
      </div>

      <div className="field">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          value={data.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      {/* ...20 more similar fields... */}
    </div>
  );
}
```

#### After: Using Reusable Components (90 LOC)

```typescript
import { FormSection, FormField, TextField } from '@/components/forms';

const contactFields: FieldConfig[] = [
  {
    id: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    hint: 'Primary contact email',
  },
  {
    id: 'phone',
    label: 'Phone Number',
    type: 'tel',
  },
  // ...20 more fields in config
];

export function ContactSection({ data, onChange, errors }: ContactSectionProps) {
  return (
    <FormSection
      title="Contact Information"
      description="How customers can reach you"
    >
      {contactFields.map(field => (
        <FormField
          key={field.id}
          label={field.label}
          error={errors[field.id]}
          hint={field.hint}
          required={field.required}
        >
          <TextField
            id={field.id}
            type={field.type}
            value={data[field.id] || ''}
            onChange={(value) => onChange(field.id, value)}
          />
        </FormField>
      ))}
    </FormSection>
  );
}
```

**Benefits**:
- 60% less code
- Configuration-driven (easy to add/remove fields)
- Consistent validation and error display
- Single source of truth for field metadata

---

## Conclusion

This refactoring plan provides a comprehensive, phased approach to improving the PMC Engine frontend codebase while maintaining zero breaking changes. By following this plan incrementally, we will:

1. **Reduce code duplication** by 40-50%
2. **Improve maintainability** through smaller, focused components
3. **Enhance developer productivity** with reusable components and hooks
4. **Increase code quality** through better testing and documentation
5. **Establish clear patterns** for future development

The plan is designed to be **flexible** - phases can be adjusted based on priorities and team capacity. Each phase delivers value independently, allowing us to stop or pivot at any point without leaving the codebase in an inconsistent state.

**Next Steps**:
1. Review and approve this plan
2. Set up project board for tracking
3. Begin Phase 1: Foundation setup
4. Schedule weekly sync to review progress and adjust as needed

---

**Document Version**: 1.0
**Last Updated**: 2025-11-19
**Author**: Claude (AI Assistant)
**Status**: Ready for Review
