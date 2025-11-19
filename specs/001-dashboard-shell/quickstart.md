# Quickstart Guide: Dashboard Shell

**Feature**: Dashboard Shell
**Date**: 2025-11-16
**Audience**: Developers implementing the dashboard shell

## Prerequisites

- Node.js 20+ and npm 9+
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Git
- Code editor with TypeScript support (VS Code recommended)

---

## Setup Instructions

### 1. Initialize Project

```bash
# Create React + TypeScript project with Vite
npm create vite@latest pmc-editor-frontend -- --template react-ts
cd pmc-editor-frontend

# Install core dependencies
npm install react@18 react-dom@18
npm install zustand@4 zustand-middleware-immer
npm install @vanilla-extract/css @vanilla-extract/vite-plugin

# Install development dependencies
npm install -D typescript@5 @types/react @types/react-dom
npm install -D vitest @vitest/ui @testing-library/react @testing-library/user-event vitest-axe
npm install -D @playwright/test axe-playwright
npm install -D eslint @typescript-eslint/parser prettier

# Install UI primitives (Radix UI recommended)
npm install @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-separator
```

### 2. Configure Build Tools

**vite.config.ts**:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

**tsconfig.json** (already configured by Vite template, verify `strict: true`)

### 3. Install Browsers for E2E Testing

```bash
npx playwright install --with-deps
```

---

## Run Development Server

```bash
npm run dev
```

Navigate to: http://localhost:3000

---

## Expected Initial State

When you load the editor for the first time:

### User Story 1 Validation (Access Core Editing Interface)

**Top Bar** (FR-001):
- Logo: PMC Engine placeholder logo (left)
- Site name: "Untitled Site" (editable inline)
- Save status: "All changes saved" (center-left)
- Preview toggle: Button with icon (center-right)
- Publish button: Disabled initially (center-right)
- AI credits: "1000 credits" (right)
- Help icon: "?" button (far right)

**Left Rail** (FR-002):
- Width: 60px
- Icons (top to bottom): Chat, Pages, Settings
- No icon active initially

**Canvas** (FR-004):
- Welcome screen: "Welcome to PMC Engine Editor"
- Quick start guide with "Create First Page" button
- Background: White (#FFFFFF)

**Inspector** (FR-005):
- Width: 360px
- Tabs visible: Content, AI Assistant, Settings, Logic & Data, Advanced
- Active tab: "Content" (default)
- Content area: "Select a page to edit" placeholder message

**Page Sidebar** (FR-003):
- Initially hidden (collapsed)
- Click "Pages" icon in left rail to open

### Visual Verification

Verify constitutional compliance:
- ✅ Spacing: 8px base unit between elements
- ✅ Typography: Inter font, defined hierarchy (24px titles, 14px body)
- ✅ Colors: #FFFFFF background, #EA2724 accent
- ✅ Focus rings: 2px solid accent, 2px offset
- ✅ Layout: Consistent grid across all states

---

## Testing Shell Regions Independently

### Test Top Bar

```bash
# Component test
npm run test -- TopBar.test.tsx

# Expected: All 7 elements render, save status updates, preview toggle works
```

**Manual verification**:
1. Click site name → Should become editable inline
2. Edit name → Should show "Saving..." → "All changes saved" after 3s
3. Click preview toggle → Shell UI should hide, canvas fullscreen
4. Click help icon → Help panel should slide in from right

### Test Left Rail

```bash
npm run test -- LeftRail.test.tsx
```

**Manual verification**:
1. Hover Chat icon → Tooltip should appear
2. Click Pages icon → Page sidebar should slide open (250ms animation)
3. Click Pages icon again → Page sidebar should slide closed
4. Tab through icons → Focus-visible outline should be 2px solid #EA2724

### Test Page Sidebar

```bash
npm run test -- PageSidebar.test.tsx
```

**Manual verification** (requires mock page data):
1. Open page sidebar (click Pages icon)
2. Click page name → Page should expand to show sections
3. Click section name → Canvas should scroll to section, inspector should update
4. Drag page entry → Visual feedback should show valid drop zones
5. Press Escape → Sidebar should close

### Test Canvas

```bash
npm run test -- Canvas.test.tsx
```

**Manual verification**:
1. Hover section → 1px low-opacity outline should appear
2. Click section → 2px accent-color outline should appear
3. Inspector should update with section-specific fields
4. Scroll canvas → Scroll position should persist when navigating away and back

### Test Inspector

```bash
npm run test -- Inspector.test.tsx
```

**Manual verification**:
1. Click each tab (Content, AI Assistant, Settings, Logic & Data, Advanced)
2. Verify tab content updates
3. Navigate to different page → Active tab should persist (FR-013)
4. Drag resize handle → Panel should resize smoothly (280-600px range)
5. Drag to <280px → Should stop at minimum
6. Drag to >600px → Should stop at maximum

---

## Triggering User Story Scenarios

### User Story 1: Access Core Editing Interface (P1)

**Scenario 1**: Dashboard loads with all regions visible
```
Action: Load http://localhost:3000
Expected: Top bar, left rail, canvas, inspector all render
Verify: All 5 regions visible, layout matches constitution
```

**Scenario 2**: Resize browser window
```
Action: Resize viewport to 768px width
Expected: Inspector moves below canvas (stacked layout)
Verify: No layout shift >5px, all critical UI accessible
```

### User Story 2: Navigate Pages and Sections (P2)

**Scenario 1-6**: See "Test Page Sidebar" section above

### User Story 3: Customize Inspector View (P3)

**Scenario 1**: Switch to AI Assistant tab
```
Action: Click "AI Assistant" tab in inspector
Expected: AI chat interface appears with scope selector
Verify: Prompt field, scope dropdown (field/section/page/feature)
```

**Scenario 3**: Switch to Advanced tab
```
Action: Click "Advanced" tab
Expected: Developer-focused settings appear with visual de-emphasis
Verify: Smaller text (12px), lighter color (#666666)
```

### User Story 4: Access Help and Status Information (P4)

**Scenario 2**: Watch save status update
```
Action: Edit site name in top bar
Expected: "Saving..." → "All changes saved" within 3s
Verify: Save status text updates, no errors in console
```

**Scenario 4**: Toggle preview mode
```
Action: Click preview toggle button
Expected: Shell UI hides, canvas expands to full viewport
Action: Press Escape key
Expected: Shell UI reappears, edit mode restores
```

---

## Accessibility Testing (Keyboard-Only Navigation)

### Full Keyboard Navigation Test

```bash
# Automated accessibility test
npm run test:a11y

# Manual keyboard test (no mouse allowed)
```

**Test sequence**:
1. Load editor
2. Press Tab → First interactive element (logo or site name) should focus
3. Press Tab repeatedly → Focus should move through: site name, preview toggle, publish, AI credits, help icon
4. Press Tab → Focus should enter left rail: Chat icon, Pages icon, Settings icon
5. Click Pages icon (Enter key) → Page sidebar should open
6. Press Tab → Focus should enter page sidebar: page list
7. Use Arrow Down/Up → Navigate through pages (roving tabindex)
8. Press Enter on page → Page expands to show sections
9. Use Arrow Down → Navigate to section
10. Press Enter on section → Canvas scrolls to section, inspector updates
11. Press Tab → Focus should enter inspector tabs
12. Use Arrow Left/Right → Navigate through tabs
13. Press Enter → Activate tab
14. Press Tab → Focus should enter inspector content (form fields)
15. Press Escape → Modals/panels should close

**Success criteria**:
- ✅ Every interactive element reachable via keyboard
- ✅ Focus-visible outline always visible (2px #EA2724)
- ✅ Logical focus order (left to right, top to bottom)
- ✅ No keyboard traps
- ✅ Escape key closes modals/panels

---

## Performance Profiling

### Verify <100ms Sync Requirement

```bash
npm run test:integration -- shell-sync.test.tsx
```

**Manual profiling**:
1. Open Chrome DevTools → Performance tab
2. Start recording
3. Click page in page sidebar
4. Stop recording after canvas/inspector update
5. Measure time from click to inspector content loaded
6. Expected: <100ms total (SC-003)

### Verify 60fps Resize

```bash
npm run test:integration -- shell-resize.test.tsx
```

**Manual profiling**:
1. Open Chrome DevTools → Performance tab → Enable "FPS" meter
2. Drag inspector resize handle
3. Monitor FPS meter during drag
4. Expected: Consistent 60fps, no drops below 55fps (SC-005)

---

## Common Issues & Troubleshooting

### Issue: "Failed to save" appears on every edit

**Cause**: Auto-save trying to persist to server, but server not implemented yet
**Solution**: Configure Zustand persist middleware to use `localStorage` only (no server sync)

```typescript
// src/store/dashboardStore.ts
persist(
  (set, get) => ({ /* state */ }),
  {
    name: 'pmc-dashboard-local',
    storage: localStorage, // Local-only for now
  }
)
```

### Issue: Inspector resize is janky (<60fps)

**Cause**: Not debouncing resize updates to 60fps (16.67ms)
**Solution**: Use `requestAnimationFrame` or debounce to 16.67ms

```typescript
// hooks/useResize.ts
const debouncedUpdate = debounce((width) => {
  setInspectorWidth(width)
}, 16.67) // 60fps
```

### Issue: Canvas and inspector out of sync

**Cause**: Not using Zustand selectors, re-rendering entire tree
**Solution**: Use fine-grained selectors

```typescript
// ❌ Bad: Re-renders on any state change
const state = useDashboardStore()

// ✅ Good: Only re-renders when selectedPageId changes
const selectedPageId = useDashboardStore(state => state.shell.selectedPageId)
```

### Issue: Accessibility audit failures

**Cause**: Missing ARIA labels, incorrect roles, or insufficient contrast
**Solution**: Run automated audit

```bash
npm run test:a11y

# Review axe-core violations and fix one by one
```

---

## Next Steps After Quickstart

1. ✅ Verify all shell regions render correctly
2. ✅ Test keyboard navigation through all regions
3. ✅ Profile performance (<100ms sync, 60fps resize)
4. ✅ Run accessibility audit (WCAG AA compliance)
5. **Proceed to `/speckit.tasks`** to generate implementation task list
6. Begin implementation following task priorities (P1 → P2 → P3 → P4)

---

## Useful Commands

```bash
# Development
npm run dev                    # Start dev server (port 3000)
npm run build                  # Production build
npm run preview                # Preview production build

# Testing
npm run test                   # Run component tests (Vitest)
npm run test:ui                # Visual test runner
npm run test:e2e               # Run E2E tests (Playwright)
npm run test:a11y              # Accessibility audit

# Linting & Formatting
npm run lint                   # ESLint
npm run format                 # Prettier
```

---

## Resources

- [React 18 Documentation](https://react.dev)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Vanilla Extract Documentation](https://vanilla-extract.style)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [PMC Engine Constitution](../.specify/memory/constitution.md)
