# Technology Research: Dashboard Shell

**Feature**: Dashboard Shell
**Date**: 2025-11-16
**Purpose**: Resolve all NEEDS CLARIFICATION items from Technical Context

## Summary of Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| UI Framework | React 18+ with TypeScript | Mature ecosystem, excellent TypeScript integration, <100ms state synchronization proven, largest talent pool |
| State Management | Zustand | <1KB bundle, <100ms sync performance, built-in dev tools, undo/redo middleware support |
| Component Testing | Vitest + React Testing Library | 10-20x faster than Jest, native ESM, behavior-driven testing |
| E2E Testing | Playwright | Cross-browser support, keyboard navigation testing, auto-wait reliability |
| Accessibility Testing | @axe-core/playwright + vitest-axe | Automated WCAG AA checks at component and E2E levels |
| CSS Architecture | Vanilla Extract + CSS Modules | Zero-runtime CSS-in-JS, type-safe design tokens, <100KB bundle, 60fps resize |
| Type Safety | TypeScript 5+ (strict mode) | Compile-time safety, IDE autocomplete, refactoring confidence |
| Browser Storage | IndexedDB with localStorage fallback | <5MB state support, async non-blocking, Safari private mode fallback |

---

## 1. UI Framework Selection

### Decision: React 18+ with TypeScript

### Rationale
React 18 provides the optimal balance of performance, ecosystem maturity, and developer experience for the PMC Engine Editor dashboard shell. While Svelte offers superior raw performance metrics, React's proven scalability for complex applications, extensive component library ecosystem, and industry-leading TypeScript integration make it the better choice for a production enterprise dashboard requiring sub-100ms synchronization across multiple regions.

### Key Strengths
- **Ecosystem Maturity**: 11+ million websites running React; comprehensive component library ecosystem (shadcn/ui, Radix UI, Headless UI) with WCAG AA compliance built-in
- **TypeScript Excellence**: Industry-leading TypeScript integration with comprehensive type definitions across entire ecosystem
- **State Management**: Zustand (<1KB) provides lightweight, fast state synchronization proven for <100ms real-time updates
- **Concurrent Rendering**: React 18's concurrent features handle complex, frequent updates efficiently; Suspense and transitions support responsive UIs under load
- **Accessibility**: Rich ecosystem of accessible component solutions with proper ARIA, keyboard navigation, and screen reader support
- **Long-term Viability**: React 19 released December 2024; continuous investment from Meta ensures stability

### Trade-offs Accepted
- **Bundle Size**: React's bundle (40-50KB gzipped) is larger than Svelte (1.7KB); mitigated through code splitting and lazy loading
- **Performance Ceiling**: Raw performance doesn't match Svelte's compiled approach; however, React 18's concurrent mode meets <100ms and 60fps requirements

### Alternatives Considered
- **Vue 3+**: Excellent framework with solid TypeScript support, but ecosystem is 1/5 the size of React; fewer component libraries and less tooling maturity
- **Svelte 4+**: Superior raw performance (1.7KB framework), but TypeScript support incomplete in Svelte 4, nascent ecosystem, limited component libraries

### Implementation Guide
```bash
# Initialize React 18 + TypeScript project
npm create vite@latest pmc-editor-frontend -- --template react-ts
cd pmc-editor-frontend
npm install

# Core dependencies
npm install react@18 react-dom@18
npm install -D typescript@5 @types/react @types/react-dom

# Development tooling
npm install -D vite@5 @vitejs/plugin-react
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier

# Component libraries (Phase 1)
npm install @radix-ui/react-* # Select needed primitives
# OR
npm install -D shadcn-ui # Copy-paste components
```

**TypeScript Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 2. State Management Pattern

### Decision: Zustand

### Rationale
Zustand combines minimal boilerplate with exceptional synchronization performance (well under 100ms), built-in middleware support for time-travel debugging and persistence, and a framework-agnostic API. Its 1KB bundle size is negligible, and it provides superior render performance through selective subscription patterns compared to Context API, while avoiding the experimental status and complexity of alternatives like Recoil.

### Key Strengths
- **Synchronization Performance**: Achieves <100ms state propagation through fine-grained selector-based subscriptions
- **Bundle Size**: 1KB gzipped with no runtime overhead
- **Time-Travel Debugging**: Integrated Redux DevTools support with full action replay and state snapshots
- **Undo/Redo Built-In**: Middleware architecture naturally supports history tracking
- **Persistence**: Native `persist` middleware with hybrid storage support (IndexedDB/localStorage)
- **TypeScript Support**: Excellent type inference with strict mode; zero boilerplate
- **Framework-Agnostic Core**: Store logic independent of UI framework

### Integration Pattern
See detailed code examples in agent research output above. Key patterns:
- Create store with `create()` and middleware (devtools, persist, subscribeWithSelector, immer)
- Define typed state interface with 6 entities (Shell, TopBar, LeftRail, PageSidebar, Inspector, Canvas)
- Use selector hooks for fine-grained subscriptions (`useShellMode`, `useSelectedPage`, etc.)
- Implement history middleware for 50-action undo/redo stack
- Configure hybrid persistence (IndexedDB primary, localStorage fallback)

### Alternatives Considered
- **Recoil**: Experimental (<1.0), atom string-key complexity, React-specific, no built-in time-travel
- **Vue Pinia**: Excellent for Vue 3 (2KB), but framework-specific lock-in
- **Context API + useReducer**: Zero dependencies, but Context re-renders all consumers (violates <100ms requirement)

---

## 3. Testing Strategy

### Decision: Vitest + React Testing Library (Component) | Playwright (E2E) | @axe-core/playwright + vitest-axe (Accessibility)

### Component Testing: Vitest + React Testing Library

**Rationale**: Vitest delivers 10-20x faster test execution compared to Jest, providing rapid feedback loops critical for dashboard development. Combined with React Testing Library's user-centric testing philosophy, it enables behavior-driven assertions for 5 shell regions and 4 UI primitives.

**Key Tools**:
- Vitest: Fast, native ESM, Jest API compatibility
- React Testing Library: User-focused testing, accessibility-first
- @testing-library/user-event: Realistic user interactions
- vitest-axe: Component-level WCAG AA automated checks

### E2E Testing: Playwright

**Rationale**: Playwright provides native cross-browser support (Chromium, Firefox, WebKit), auto-waiting to reduce flakiness, and dedicated keyboard navigation APIs essential for testing keyboard accessibility requirements. Chrome DevTools Protocol access enables frame rate measurement for 60fps animation validation.

**Key Features**:
- Cross-browser testing for responsive verification
- Keyboard navigation testing (`page.keyboard.press()`)
- Focus assertions (`toBeFocused()`)
- Performance metrics (frame rate, sync latency)
- @axe-core/playwright integration for E2E accessibility

### Accessibility Testing: @axe-core/playwright + vitest-axe

**Rationale**: Dual-layer approach catches ~57% of WCAG AA issues automatically. Component-level tests (vitest-axe) catch primitive accessibility issues early; E2E tests (@axe-core/playwright) validate realistic user scenarios. Manual screen reader testing supplements for remaining 43% of issues.

**Testing Stack Setup**:
```bash
# Component testing
npm install -D vitest @vitest/ui @testing-library/react @testing-library/user-event vitest-axe

# E2E testing
npm install -D @playwright/test axe-playwright

# Install browsers
npx playwright install --with-deps
```

### Alternatives Considered
- **Jest**: Industry standard, but 10-20x slower than Vitest
- **Cypress**: Excellent DX, but no Safari support, single-process limits parallel testing

---

## 4. CSS Architecture

### Decision: Vanilla Extract + CSS Modules Hybrid

### Rationale
Vanilla Extract provides zero-runtime CSS-in-JS with TypeScript-first design token integration, perfect for constitutional design tokens while maintaining <100KB CSS footprint. Supplementing with CSS Modules for layout-heavy shell components ensures excellent responsive performance (60fps resize) without JavaScript overhead.

### Key Strengths
- **Zero-Runtime Overhead**: All CSS tokens compiled to CSS custom properties at build time
- **Constitutional Alignment**: TypeScript contract ensures all design tokens match constitution
- **Type-Safe Tokens**: IDE autocomplete for spacing, colors, typography, animations
- **Container Queries**: Inspector panel resizes smoothly (60fps) without JavaScript
- **Framework Agnostic**: Works with React, Vue, Svelte
- **Build-Time Optimization**: Dead code elimination, unused tokens don't ship

### Design Token Integration
Constitutional tokens (spacing: 8px base, colors: #FFFFFF/#F5F5F5/#EA2724, typography: Inter) mapped to TypeScript theme contract. See detailed token definitions in research agent output above.

### CSS Stack Setup
```bash
# Vanilla Extract
npm install -D @vanilla-extract/css @vanilla-extract/vite-plugin

# CSS Modules (built into Vite, no install needed)

# Vite config
# vite.config.ts
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()]
})
```

### Alternatives Considered
- **Tailwind CSS**: Utility-first creates token indirection, verbose class names in JSX
- **Emotion**: Runtime CSS-in-JS adds ~10KB overhead, slower than zero-runtime on 60fps resize
- **Styled Components**: ~12KB runtime cost, React-specific lock-in
- **CSS Modules Alone**: No central token management, difficult constitutional enforcement

---

## 5. Type Safety Approach

### Decision: TypeScript 5+ (strict mode)

### Rationale
TypeScript provides compile-time safety, comprehensive IDE autocomplete, and refactoring confidence essential for a multi-region dashboard with complex state synchronization. Strict mode enforces best practices and catches null/undefined errors at build time.

**Configuration**: See tsconfig.json in section 1 above

**Key Benefits**:
- Compile-time type checking prevents runtime errors
- IDE autocomplete accelerates development
- Refactoring safety (rename symbol works across codebase)
- Self-documenting code through type signatures
- Integration with Zustand, Vanilla Extract, React ecosystem

**Alternatives Considered**:
- **JavaScript + JSDoc**: Lighter build complexity, but no compile-time enforcement, weaker IDE support

---

## 6. Browser Storage Strategy

### Decision: IndexedDB (primary) with localStorage fallback

### Rationale
IndexedDB supports >5MB state storage requirement with async non-blocking API, ensuring auto-save doesn't impact 60fps performance. localStorage fallback handles Safari private mode and provides universal compatibility.

**Implementation Pattern**:
```typescript
// Zustand persist middleware with hybrid storage
import { persist } from 'zustand/middleware'

const hybridStorage = (() => {
  if (typeof window !== 'undefined' && 'indexedDB' in window) {
    return createIndexedDBStorage('pmc-editor', 'dashboard-state')
  }
  return localStorage // Fallback
})()

const store = create(
  persist(
    (set, get) => ({ /* state */ }),
    {
      name: 'pmc-dashboard',
      storage: hybridStorage,
      partialize: (state) => ({
        // Only persist essential state, exclude transient data
      })
    }
  )
)
```

**Key Features**:
- IndexedDB: Async API, >5MB quota, structured data storage
- localStorage: Synchronous fallback, 5-10MB quota, string storage
- Safari private mode compatibility via fallback
- Partialize: Only persist essential state to minimize storage footprint

**Alternatives Considered**:
- **localStorage only**: Limited to 5-10MB, synchronous blocks UI
- **IndexedDB only**: No fallback for unsupported environments

---

## 7. Responsive Layout Best Practices

### Decision: CSS Grid (shell layout) + Flexbox (component layout) + Container Queries (inspector responsiveness)

### Rationale
CSS Grid provides precise control for 5-region shell layout with defined grid areas (top bar spanning full width, left rail, canvas, inspector). Flexbox handles component-level alignment within regions. Container queries enable inspector panel to adapt content based on its current width (280-600px resizable range), independent of viewport size.

**Layout Architecture**:
```css
/* Shell grid (src/styles/shellLayout.css.ts) */
.shellContainer {
  display: grid;
  grid-template-columns: 60px 1fr 360px; /* left-rail | canvas | inspector */
  grid-template-rows: 64px 1fr;         /* top-bar | content */
  height: 100vh;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .shellContainer {
    grid-template-columns: 60px 1fr;
    grid-template-rows: 64px 1fr 360px; /* Stack inspector below */
  }
}

/* Container queries for inspector */
@container (max-width: 280px) {
  .fieldGrid {
    grid-template-columns: 1fr; /* Single column */
  }
}

@container (min-width: 400px) {
  .fieldGrid {
    grid-template-columns: repeat(2, 1fr); /* Two columns */
  }
}
```

**Breakpoints** (from FR-007):
- Mobile: <768px (stack inspector below canvas)
- Tablet: 768px-1024px (narrower inspector: 280px)
- Desktop: >1024px (default inspector: 360px)

**Performance**: CSS Grid and Flexbox are hardware-accelerated in modern browsers, achieving 60fps resize without JavaScript.

**Alternatives Considered**:
- **Flexbox only**: Less precise for complex multi-region layouts, harder to maintain grid alignment
- **JavaScript-based resize**: Slower than CSS, risks janky 60fps performance

---

## 8. Keyboard Navigation Patterns

### Decision: Roving tabindex + focus trap + skip links

### Rationale
Roving tabindex enables efficient keyboard navigation through homogeneous lists (page sidebar, inspector tabs) with arrow keys. Focus trap contains focus within modals/panels (help panel, wizard overlay). Skip links provide shortcuts to main content regions for screen reader users.

**Implementation Patterns**:

**Roving Tabindex** (for page sidebar list):
```typescript
// hooks/useRovingTabindex.ts
import { useEffect, useRef, useState } from 'react'

export function useRovingTabindex(itemCount: number) {
  const [activeIndex, setActiveIndex] = useState(0)
  const itemRefs = useRef<HTMLElement[]>([])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % itemCount)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((prev) => (prev - 1 + itemCount) % itemCount)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [itemCount])

  useEffect(() => {
    itemRefs.current[activeIndex]?.focus()
  }, [activeIndex])

  return { activeIndex, itemRefs }
}
```

**Focus Trap** (for modal dialogs):
```typescript
// hooks/useFocusTrap.ts
import { useEffect, useRef } from 'react'

export function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    container.addEventListener('keydown', handleTab)
    firstElement?.focus()

    return () => container.removeEventListener('keydown', handleTab)
  }, [isOpen])

  return containerRef
}
```

**Skip Links** (for main navigation):
```tsx
// components/SkipLinks.tsx
export function SkipLinks() {
  return (
    <div className="skip-links" aria-label="Skip links">
      <a href="#main-content">Skip to main content</a>
      <a href="#inspector-panel">Skip to inspector</a>
      <a href="#page-navigation">Skip to page navigation</a>
    </div>
  )
}

/* src/styles/skipLinks.css.ts */
.skipLinks {
  position: absolute;
  top: -100px;
  left: 0;
  z-index: 9999;
}

.skipLinks:focus-within {
  top: 0;
}
```

**WCAG 2.1 Level AA Requirements**:
- All interactive elements keyboard accessible (Tab, Enter, Space, Escape, Arrow keys)
- Focus order follows logical reading order (FR-018)
- Focus-visible outlines meet 4.5:1 contrast (FR-016, SC-009)
- ARIA labels on all icons (FR-017)
- Screen reader announces region changes

**Testing Integration**:
```typescript
// tests/keyboard-navigation.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('keyboard navigation through shell regions', async () => {
  const user = userEvent.setup()
  render(<Shell />)

  await user.tab() // Focus first element
  expect(screen.getByRole('button', { name: /menu/i })).toHaveFocus()

  await user.tab()
  expect(screen.getAllByRole('link')[0]).toHaveFocus()

  // Continue tabbing through all regions
})
```

**Alternatives Considered**:
- **Tabindex on all items**: Creates tab trap, inefficient navigation through long lists
- **JavaScript focus management**: More complex than native roving tabindex, harder to maintain

---

## Technology Stack Summary

```
Frontend Framework:    React 18+ with TypeScript 5 (strict)
State Management:      Zustand 4+ with middleware (devtools, persist, immer)
Styling:              Vanilla Extract + CSS Modules
Component Testing:     Vitest + React Testing Library + vitest-axe
E2E Testing:          Playwright with @axe-core/playwright
Build Tool:           Vite 5+
Browser Storage:       IndexedDB (primary) + localStorage (fallback)
Layout:               CSS Grid (shell) + Flexbox (components) + Container Queries
Keyboard Nav:         Roving tabindex + focus trap + skip links
Component Library:     Radix UI or shadcn/ui (WCAG AA compliant)
Accessibility:        WCAG 2.1 Level AA minimum, AAA for contrast where feasible
```

## Next Steps

1. Initialize React 18 + TypeScript project with Vite
2. Install Zustand and configure store with 6 state entities
3. Set up Vanilla Extract with constitutional design tokens
4. Install Vitest + Playwright + axe-core for testing
5. Configure IndexedDB/localStorage hybrid persistence
6. Implement roving tabindex, focus trap, skip links for keyboard navigation
7. Begin Phase 1: Design & Contracts (data-model.md, contracts/, quickstart.md)
