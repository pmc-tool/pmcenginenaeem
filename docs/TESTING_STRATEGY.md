# Testing Strategy

**Purpose**: Comprehensive testing approach for refactored codebase
**Last Updated**: 2025-11-19
**Status**: Ready for implementation

---

## Overview

This document outlines the testing strategy for all components and hooks created during the refactoring (Phases 1-6).

**Testing Goals**:
- ✅ 100% coverage of custom hooks
- ✅ 90%+ coverage of UI components
- ✅ Critical user flows tested end-to-end
- ✅ Accessibility compliance verified
- ✅ Zero regressions from refactoring

---

## Testing Pyramid

```
        /\
       /  \  E2E Tests (10%)
      /────\  - Critical user flows
     /      \  - Happy paths
    /────────\ Integration Tests (20%)
   /          \ - Component + Hook combinations
  /────────────\ - Multi-component interactions
 /              \
/────────────────\ Unit Tests (70%)
  - Individual hooks
  - Individual components
  - Utility functions
```

---

## Test Technology Stack

### Testing Libraries

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/react-hooks": "^8.0.1",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "jsdom": "^23.0.0",
    "axe-core": "^4.8.0"
  }
}
```

### Test Runner: Vitest

**Why Vitest?**
- Fast (uses Vite's transform pipeline)
- ESM support out of the box
- Compatible with Jest API
- Better TypeScript support
- Watch mode with HMR

**Configuration** (`vitest.config.ts`):
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/',
      ],
    },
  },
});
```

---

## Unit Tests

### 1. Testing Custom Hooks

#### Example: useToggle

**File**: `src/hooks/ui/__tests__/useToggle.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react';
import { useToggle } from '../useToggle';

describe('useToggle', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('should toggle value', () => {
    const { result } = renderHook(() => useToggle(false));
    const [, toggle] = result.current;

    act(() => {
      toggle();
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      toggle();
    });

    expect(result.current[0]).toBe(false);
  });

  it('should set to true', () => {
    const { result } = renderHook(() => useToggle(false));
    const [, , setTrue] = result.current;

    act(() => {
      setTrue();
    });

    expect(result.current[0]).toBe(true);
  });

  it('should set to false', () => {
    const { result } = renderHook(() => useToggle(true));
    const [, , , setFalse] = result.current;

    act(() => {
      setFalse();
    });

    expect(result.current[0]).toBe(false);
  });
});
```

---

#### Example: useFormState

**File**: `src/hooks/forms/__tests__/useFormState.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react';
import { useFormState } from '../useFormState';

describe('useFormState', () => {
  it('should initialize with initial values', () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { email: '', password: '' },
        onSubmit: jest.fn(),
      })
    );

    expect(result.current.values).toEqual({ email: '', password: '' });
    expect(result.current.isDirty).toBe(false);
  });

  it('should update field value', () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { email: '' },
        onSubmit: jest.fn(),
      })
    );

    act(() => {
      result.current.setFieldValue('email', 'test@example.com');
    });

    expect(result.current.values.email).toBe('test@example.com');
    expect(result.current.isDirty).toBe(true);
  });

  it('should validate on field change', () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { email: '' },
        onSubmit: jest.fn(),
        validate: (values) => {
          const errors: any = {};
          if (!values.email) errors.email = 'Required';
          return errors;
        },
      })
    );

    expect(result.current.errors.email).toBe('Required');

    act(() => {
      result.current.setFieldValue('email', 'test@example.com');
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('should handle form submission', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { email: 'test@example.com' },
        onSubmit,
      })
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('should not submit if validation fails', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { email: '' },
        onSubmit,
        validate: (values) => {
          const errors: any = {};
          if (!values.email) errors.email = 'Required';
          return errors;
        },
      })
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should reset form', () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { email: '' },
        onSubmit: jest.fn(),
      })
    );

    act(() => {
      result.current.setFieldValue('email', 'test@example.com');
    });

    expect(result.current.values.email).toBe('test@example.com');

    act(() => {
      result.current.reset();
    });

    expect(result.current.values.email).toBe('');
    expect(result.current.isDirty).toBe(false);
  });
});
```

---

#### Example: useAsync

**File**: `src/hooks/async/__tests__/useAsync.test.ts`

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsync } from '../useAsync';

describe('useAsync', () => {
  it('should initialize in idle state', () => {
    const asyncFn = jest.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsync(asyncFn));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.called).toBe(false);
  });

  it('should handle successful execution', async () => {
    const asyncFn = jest.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsync(asyncFn));

    act(() => {
      result.current.execute();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('success');
    expect(result.current.error).toBeUndefined();
    expect(result.current.called).toBe(true);
  });

  it('should handle errors', async () => {
    const error = new Error('Failed');
    const asyncFn = jest.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useAsync(asyncFn));

    act(() => {
      result.current.execute();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeUndefined();
  });

  it('should handle race conditions', async () => {
    let resolve1: any, resolve2: any;
    const promise1 = new Promise((r) => (resolve1 = r));
    const promise2 = new Promise((r) => (resolve2 = r));

    const asyncFn = jest
      .fn()
      .mockReturnValueOnce(promise1)
      .mockReturnValueOnce(promise2);

    const { result } = renderHook(() => useAsync(asyncFn));

    // Start first request
    act(() => {
      result.current.execute();
    });

    // Start second request (should supersede first)
    act(() => {
      result.current.execute();
    });

    // Resolve first request (should be ignored)
    await act(async () => {
      resolve1('first');
      await promise1;
    });

    // Resolve second request
    await act(async () => {
      resolve2('second');
      await promise2;
    });

    expect(result.current.data).toBe('second');
  });

  it('should reset state', async () => {
    const asyncFn = jest.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsync(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBe('data');

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.called).toBe(false);
  });
});
```

---

### 2. Testing UI Components

#### Example: Button

**File**: `src/components/ui/Button/__tests__/Button.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply variant className', () => {
    const { container } = render(<Button variant="primary">Click me</Button>);
    expect(container.firstChild).toHaveClass('button--primary');
  });

  it('should apply size className', () => {
    const { container } = render(<Button size="lg">Click me</Button>);
    expect(container.firstChild).toHaveClass('button--lg');
  });

  it('should be keyboard accessible', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByText('Click me');
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(handleClick).toHaveBeenCalled();
  });
});
```

---

#### Example: Modal

**File**: `src/components/ui/Modal/__tests__/Modal.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';

describe('Modal', () => {
  it('should render when open', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
        Modal content
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()} title="Test Modal">
        Modal content
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should call onClose when close button clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    );

    fireEvent.click(screen.getByLabelText(/close/i));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when ESC key pressed', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalled();
  });

  it('should trap focus inside modal', async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
        <button>First</button>
        <button>Last</button>
      </Modal>
    );

    const firstButton = screen.getByText('First');
    const lastButton = screen.getByText('Last');

    firstButton.focus();
    expect(document.activeElement).toBe(firstButton);

    // Tab to last button
    await user.tab();
    expect(document.activeElement).toBe(lastButton);

    // Tab should wrap back to first
    await user.tab();
    expect(document.activeElement).toBe(firstButton);
  });

  it('should have correct ARIA attributes', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
        Content
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });
});
```

---

#### Example: LoadingState

**File**: `src/components/feedback/__tests__/LoadingState.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { LoadingState } from '../LoadingState';

describe('LoadingState', () => {
  it('should render with default message', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render custom message', () => {
    render(<LoadingState message="Loading themes..." />);
    expect(screen.getByText('Loading themes...')).toBeInTheDocument();
  });

  it('should apply size classes', () => {
    const { container } = render(<LoadingState size="lg" />);
    expect(container.firstChild).toHaveClass('loading-state--lg');
  });

  it('should have live region for screen readers', () => {
    render(<LoadingState message="Loading..." />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('should render spinner', () => {
    const { container } = render(<LoadingState />);
    expect(container.querySelector('.loading-state__spinner')).toBeInTheDocument();
  });
});
```

---

## Integration Tests

### Example: Form Flow

**File**: `src/components/forms/__tests__/LoginForm.integration.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';

describe('LoginForm Integration', () => {
  it('should complete full login flow', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(<LoginForm onSubmit={onSubmit} />);

    // Fill out form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Should call onSubmit with values
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show validation errors', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    // Submit without filling
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Should show errors
    expect(await screen.findByText(/email.*required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password.*required/i)).toBeInTheDocument();
  });

  it('should disable submit during submission', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Should be disabled during submission
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
```

---

## Accessibility Tests

### Using axe-core

**File**: `src/test/axe.helper.ts`

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
export { axe };

expect.extend(toHaveNoViolations);
```

**Example Test**:

```typescript
import { render } from '@testing-library/react';
import { axe } from '../test/axe.helper';
import { Button } from './Button';

describe('Button Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## Test Coverage Goals

### By Category

| Category | Target | Current | Priority |
|----------|--------|---------|----------|
| Custom Hooks | 100% | 0% | High |
| UI Components | 90% | 0% | High |
| Utility Functions | 80% | 0% | Medium |
| Integration | Key flows | 0% | High |
| E2E | Critical paths | 0% | Medium |

### Critical Components to Test First

**Phase 1**:
1. useToggle, useDisclosure, useModal
2. Button, Card, Badge
3. Form submission flow

**Phase 2**:
4. useFormState, useFormValidation
5. useAsync, useDebounce
6. Modal, LoadingState, ErrorState

**Phase 3**:
7. Refactored components (DeployPanel, ChatPanel, AITrainingPanel)
8. Full user workflows

---

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- Button.test.tsx

# Run tests matching pattern
npm test -- useForm

# Run with UI
npm test -- --ui

# Run only changed files
npm test -- --changed
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
```

---

## Best Practices

### 1. Arrange-Act-Assert Pattern

```typescript
it('should toggle value', () => {
  // Arrange
  const { result } = renderHook(() => useToggle(false));

  // Act
  act(() => {
    result.current[1]();
  });

  // Assert
  expect(result.current[0]).toBe(true);
});
```

### 2. Test User Behavior, Not Implementation

```typescript
// ❌ Bad - testing implementation
it('should call setState', () => {
  const setState = jest.spyOn(React, 'useState');
  // ...
});

// ✅ Good - testing behavior
it('should display error message', () => {
  render(<Form />);
  fireEvent.submit(screen.getByRole('button'));
  expect(screen.getByText(/error/i)).toBeInTheDocument();
});
```

### 3. Use Testing Library Queries Correctly

**Priority Order**:
1. `getByRole` (most accessible)
2. `getByLabelText` (forms)
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` (last resort)

```typescript
// ✅ Good
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email/i);

// ❌ Bad
screen.getByTestId('submit-button');
```

### 4. Avoid Testing Implementation Details

```typescript
// ❌ Bad
expect(component.state.count).toBe(1);

// ✅ Good
expect(screen.getByText('Count: 1')).toBeInTheDocument();
```

### 5. Clean Up After Tests

```typescript
afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});
```

---

## Next Steps

### Immediate Actions

1. **Set up test infrastructure**
   - Install testing libraries
   - Configure Vitest
   - Set up test helpers
   - Estimated: 2 hours

2. **Write hook tests** (highest priority)
   - All UI hooks
   - All form hooks
   - All async hooks
   - Estimated: 8 hours

3. **Write component tests**
   - Critical UI components
   - Feedback components
   - Estimated: 12 hours

4. **Integration tests**
   - Form flows
   - Deployment flow
   - Chat flow
   - Estimated: 8 hours

**Total Estimated Effort**: 30 hours

---

**Last Updated**: 2025-11-19
**Status**: Ready for implementation
