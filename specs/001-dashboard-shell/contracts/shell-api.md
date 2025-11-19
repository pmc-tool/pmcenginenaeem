# Component API Contracts: Dashboard Shell

**Feature**: Dashboard Shell
**Date**: 2025-11-16
**Purpose**: Define internal component interfaces and event contracts for shell regions

## Overview

This document specifies the prop interfaces and event contracts for all 5 shell region components and 4 UI primitive components. These contracts ensure consistent communication patterns and enable independent development/testing of each component per user story priorities.

---

## Shell Region Components

### 1. Shell (Root Container)

**Purpose**: Orchestrates layout and manages global Zustand state subscription

**Component Interface**:
```typescript
interface ShellProps {
  /** Optional className for custom styling */
  className?: string
  /** Optional children to render (future extensibility) */
  children?: React.ReactNode
}
```

**Responsibilities**:
- Subscribe to Zustand store and provide state context
- Render 5 shell regions in CSS Grid layout
- Handle responsive breakpoint transitions (<768px, <1024px)
- Manage keyboard shortcut registry (Escape, Tab, etc.)
- Coordinate state synchronization across regions (<100ms)

**Layout Contract** (CSS Grid):
```css
grid-template-columns: 60px 1fr 360px;  /* left-rail | canvas | inspector */
grid-template-rows: 64px 1fr;            /* top-bar | content */

/* Responsive breakpoints (FR-007) */
@media (max-width: 768px) {
  grid-template-columns: 60px 1fr;
  grid-template-rows: 64px 1fr 360px;  /* Stack inspector below */
}
```

**Exported Events**: None (root component, consumes events from children)

**State Subscriptions**:
```typescript
const mode = useDashboardStore(state => state.shell.mode)
const previewMode = useDashboardStore(state => state.canvas.previewMode)
```

---

### 2. TopBar

**Purpose**: Persistent header with site controls and status indicators

**Component Interface**:
```typescript
interface TopBarProps {
  /** Site name for display and editing */
  siteName: string
  /** Logo URL or null for placeholder */
  logoUrl: string | null
  /** Save status text ('All changes saved', 'Saving...', 'Failed to save') */
  saveStatus: string
  /** Whether preview mode is active */
  isPreviewMode: boolean
  /** Remaining AI credits count */
  aiCredits: number
  /** Whether help panel is visible */
  isHelpPanelOpen: boolean

  /** Callback when preview toggle button clicked */
  onPreviewToggle: () => void
  /** Callback when publish button clicked */
  onPublish: () => void
  /** Callback when help icon clicked */
  onHelpToggle: () => void
  /** Callback when site name edited (debounced) */
  onSiteNameChange: (newName: string) => void
}
```

**Responsibilities**:
- Display logo, site name (editable inline), save indicator, preview toggle, publish button, AI credits, help icon (FR-001)
- Change AI credits color to amber when <50 (FR-022)
- Emit events for user actions (preview toggle, publish, help)
- Show contextual save status with retry button on failure

**Event Contracts**:
```typescript
// Preview toggle clicked
onPreviewToggle() -> ShellState.mode = 'preview', CanvasState.previewMode = true

// Publish button clicked
onPublish() -> Trigger publishing workflow (future feature)

// Help icon clicked
onHelpToggle() -> TopBarState.helpPanelVisible = !helpPanelVisible

// Site name changed (debounced 500ms)
onSiteNameChange(newName: string) -> TopBarState.siteName = newName, trigger auto-save
```

**Accessibility Requirements**:
- All buttons must have `aria-label` attributes (FR-017)
- Save status must have `role="status"` and `aria-live="polite"`
- Preview toggle must have `aria-pressed` state
- Keyboard shortcut: `Cmd+P` / `Ctrl+P` for preview toggle

---

### 3. LeftRail

**Purpose**: Vertical navigation rail with icon-based tabs

**Component Interface**:
```typescript
interface LeftRailProps {
  /** Currently active icon ('chat' | 'pages' | 'settings' | null) */
  activeIcon: LeftRailIcon
  /** Callback when icon clicked */
  onIconClick: (icon: LeftRailIcon) => void
}

type LeftRailIcon = 'chat' | 'pages' | 'settings' | null
```

**Responsibilities**:
- Render 3 navigation icons (Chat, Pages, Settings) with labels (FR-002)
- Highlight active icon with background color
- Show tooltip on hover
- Emit click events to activate/deactivate panels

**Event Contracts**:
```typescript
// Pages icon clicked (toggle page sidebar)
onIconClick('pages') -> LeftRailState.activeIcon = 'pages', PageSidebarState.open = true
onIconClick('pages') again -> LeftRailState.activeIcon = null, PageSidebarState.open = false

// Chat icon clicked (future: open chat panel in canvas)
onIconClick('chat') -> LeftRailState.activeIcon = 'chat', show chat overlay

// Settings icon clicked (future: navigate to settings mode)
onIconClick('settings') -> LeftRailState.activeIcon = 'settings', ShellState.mode = 'settings'
```

**Accessibility Requirements**:
- Each icon button must have `aria-label` (e.g., "Open pages navigation")
- Active icon must have `aria-current="true"`
- Tooltip must use `role="tooltip"` and `aria-describedby`
- Keyboard shortcut: `Cmd+B` / `Ctrl+B` to toggle page sidebar

---

### 4. PageSidebar

**Purpose**: Collapsible hierarchical page/section navigator

**Component Interface**:
```typescript
interface PageSidebarProps {
  /** Whether sidebar is open */
  isOpen: boolean
  /** Array of pages with nested sections */
  pages: PageNode[]
  /** Array of page IDs with expanded sections */
  expandedPageIds: string[]
  /** Currently selected page ID */
  selectedPageId: string | null
  /** Currently selected section ID */
  selectedSectionId: string | null

  /** Callback when sidebar close requested */
  onClose: () => void
  /** Callback when page clicked */
  onPageSelect: (pageId: string) => void
  /** Callback when page expand/collapse toggled */
  onPageToggle: (pageId: string) => void
  /** Callback when section clicked */
  onSectionSelect: (pageId: string, sectionId: string) => void
  /** Callback when page reordered via drag */
  onPageReorder: (fromIndex: number, toIndex: number) => void
}

interface PageNode {
  id: string
  name: string
  sections: SectionNode[]
}

interface SectionNode {
  id: string
  name: string
}
```

**Responsibilities**:
- Render hierarchical page/section tree with expand/collapse (FR-003)
- Show "No pages yet" empty state with "Create First Page" button (Edge Cases)
- Highlight selected page/section
- Support drag-to-reorder pages with visual feedback (User Story 2, Scenario 6)
- Slide open/closed with 250ms animation (FR-009)

**Event Contracts**:
```typescript
// Page clicked
onPageSelect(pageId) -> PageSidebarState.selectedPageId = pageId,
                        ShellState.selectedPageId = pageId,
                        CanvasState.currentPageId = pageId,
                        InspectorState.contentLoading = true,
                        Inspector fetches page-level fields,
                        InspectorState.contentLoading = false

// Section clicked
onSectionSelect(pageId, sectionId) -> PageSidebarState.selectedSectionId = sectionId,
                                      ShellState.selectedSectionId = sectionId,
                                      CanvasState.selectedSectionId = sectionId,
                                      Canvas scrolls to section,
                                      Canvas highlights section with 2px outline,
                                      InspectorState.contentLoading = true,
                                      Inspector fetches section-specific fields,
                                      InspectorState.contentLoading = false

// Page reordered
onPageReorder(fromIndex, toIndex) -> Update page order in theme data, trigger auto-save
```

**Accessibility Requirements**:
- Use `role="tree"` for page list
- Use `role="treeitem"` for pages and sections
- Expanded pages must have `aria-expanded="true"`
- Selected items must have `aria-selected="true"`
- Keyboard: Arrow keys for navigation, Enter to select, Space to toggle expand
- Drag-and-drop must be keyboard accessible (use roving tabindex + Enter to grab/drop)

---

### 5. Canvas

**Purpose**: Live site preview with section selection

**Component Interface**:
```typescript
interface CanvasProps {
  /** Current page ID to render */
  pageId: string | null
  /** Selected section ID (highlighted with outline) */
  selectedSectionId: string | null
  /** Whether in full-screen preview mode */
  isPreviewMode: boolean
  /** Scroll position to restore */
  scrollPosition: { x: number; y: number }

  /** Callback when section hovered */
  onSectionHover: (sectionId: string | null) => void
  /** Callback when section clicked */
  onSectionClick: (sectionId: string) => void
  /** Callback when scroll position changes */
  onScrollChange: (position: { x: number; y: number }) => void
}
```

**Responsibilities**:
- Render high-fidelity live site preview (no wireframes) (FR-004, Section 3.I Canvas is Sacred)
- Show section outlines on hover (1px low opacity) and selection (2px accent color) (FR-004)
- Scroll to selected section when changed via sidebar (FR-012)
- Hide UI chrome and expand to full viewport in preview mode (FR-008)
- Show welcome screen with quick start guide when no pages exist (Edge Cases)

**Event Contracts**:
```typescript
// Section hovered
onSectionHover(sectionId) -> CanvasState.hoveredSectionId = sectionId,
                             Show 1px low-opacity outline

// Section clicked
onSectionClick(sectionId) -> CanvasState.selectedSectionId = sectionId,
                             ShellState.selectedSectionId = sectionId,
                             PageSidebarState.selectedSectionId = sectionId,
                             Show 2px accent-color outline,
                             InspectorState.contentLoading = true,
                             Inspector fetches section-specific fields,
                             InspectorState.contentLoading = false

// Scroll position changed (debounced 100ms)
onScrollChange(position) -> CanvasState.scrollPosition = position
```

**Accessibility Requirements**:
- Canvas iframe must have `title` attribute describing content
- Section outlines must meet 4.5:1 contrast ratio (FR-016)
- Canvas must be keyboard accessible (Tab into iframe, navigate inside)
- Preview mode must announce to screen readers: "Entered preview mode, press Escape to exit"

---

### 6. Inspector

**Purpose**: Right panel with tabbed editing interface

**Component Interface**:
```typescript
interface InspectorProps {
  /** Currently active tab */
  activeTab: InspectorTab
  /** Selected page ID for context */
  selectedPageId: string | null
  /** Selected section ID for context */
  selectedSectionId: string | null
  /** Current panel width (280-600px) */
  panelWidth: number
  /** Whether content is loading */
  isLoading: boolean
  /** Schema-driven fields for current selection */
  schema: FieldSchema | null

  /** Callback when tab clicked */
  onTabChange: (tab: InspectorTab) => void
  /** Callback when panel resized */
  onWidthChange: (width: number) => void
  /** Callback when field value changed */
  onFieldChange: (fieldId: string, value: unknown) => void
}

type InspectorTab = 'content' | 'ai' | 'settings' | 'logic' | 'advanced'

interface FieldSchema {
  fields: FieldDefinition[]
}

interface FieldDefinition {
  id: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'boolean' | 'color' | 'image'
  label: string
  description?: string
  defaultValue?: unknown
  validation?: ValidationRule[]
}
```

**Responsibilities**:
- Render 5 tabs (Content, AI Assistant, Settings, Logic & Data, Advanced) (FR-005)
- Display schema-driven fields from theme configuration (Section 5.I Dynamic Schema)
- Visually de-emphasize Advanced tab content (smaller text, lighter color) (User Story 3, Scenario 3)
- Support horizontal resize via draggable handle (280-600px constrained) (FR-010)
- Show loading state during field fetch (InspectorState.contentLoading) (Edge Cases)
- Persist active tab across page/section navigation (FR-013)

**Event Contracts**:
```typescript
// Tab changed
onTabChange(tab) -> InspectorState.activeTab = tab,
                    Render tab-specific content (Content fields, AI chat, Settings, etc.)

// Panel resized (debounced 60fps = 16.67ms)
onWidthChange(width) -> InspectorState.panelWidth = clamp(width, 280, 600),
                        Inspector content reflows,
                        Container queries adjust field grid

// Field value changed (debounced 500ms for text inputs)
onFieldChange(fieldId, value) -> Update field value in theme data,
                                  Trigger auto-save after 30s or input blur (FR-020),
                                  Canvas live preview updates immediately
```

**Accessibility Requirements**:
- Tab list must use `role="tablist"`, tabs use `role="tab"`, panels use `role="tabpanel"`
- Active tab must have `aria-selected="true"`
- Inactive tab panels must have `hidden` attribute
- Resize handle must have `role="separator"`, `aria-orientation="vertical"`, `aria-valuenow`, `aria-valuemin="280"`, `aria-valuemax="600"`
- All form fields must have `<label>` elements or `aria-labelledby`
- Field help text must use `aria-describedby`

---

## UI Primitive Components

### 7. Button

**Purpose**: Reusable accessible button component

**Component Interface**:
```typescript
interface ButtonProps {
  /** Button variant (primary, secondary, ghost) */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Button size (sm, md, lg) */
  size?: 'sm' | 'md' | 'lg'
  /** Accessible label for screen readers */
  'aria-label': string
  /** Optional icon component */
  icon?: React.ComponentType<{ className?: string }>
  /** Button disabled state */
  disabled?: boolean
  /** Click handler */
  onClick: () => void
  /** Button children (text/content) */
  children?: React.ReactNode
}
```

**Styling Contract** (from constitution):
- Primary: Accent color background (#EA2724), white text
- Secondary: Light gray background (#F5F5F5), text primary color
- Ghost: Transparent background, text primary color
- Focus-visible: 2px solid accent outline, 2px offset (FR-016)
- Disabled: 50% opacity, cursor not-allowed

---

### 8. Icon

**Purpose**: Accessible icon component with ARIA labels

**Component Interface**:
```typescript
interface IconProps {
  /** Icon name from icon library */
  name: string
  /** Accessible label for screen readers */
  'aria-label': string
  /** Icon size in pixels */
  size?: number
  /** Icon color (defaults to current text color) */
  color?: string
  /** Optional className */
  className?: string
}
```

**Requirements**:
- All icons must have `aria-label` (FR-017)
- Use SVG sprites for performance
- Support 16px, 20px, 24px standard sizes
- Color inherits from parent text color by default

---

### 9. Tab

**Purpose**: Accessible tab component for inspector

**Component Interface**:
```typescript
interface TabProps {
  /** Tab label text */
  label: string
  /** Whether tab is currently active */
  isActive: boolean
  /** Click handler */
  onClick: () => void
  /** Optional icon */
  icon?: React.ComponentType
}
```

**Styling Contract**:
- Active: Border-bottom 2px accent color, text accent color
- Inactive: No border, text secondary color
- Hover: Background light gray (#F5F5F5)
- Focus-visible: 2px solid accent outline

---

### 10. ResizeHandle

**Purpose**: Draggable resize control for inspector panel

**Component Interface**:
```typescript
interface ResizeHandleProps {
  /** Current width value */
  value: number
  /** Minimum width */
  min: number
  /** Maximum width */
  max: number
  /** Callback during drag (debounced 60fps) */
  onChange: (width: number) => void
  /** Callback when drag starts */
  onDragStart?: () => void
  /** Callback when drag ends */
  onDragEnd?: () => void
}
```

**Interaction Contract**:
- Mousedown/touchstart triggers drag
- Mousemove/touchmove updates width (debounced 16.67ms for 60fps)
- Mouseup/touchend ends drag
- Keyboard: Arrow Left/Right adjusts by 10px increments
- Width clamped to min-max range (280-600px for inspector)

**Accessibility Requirements**:
- `role="separator"`, `aria-orientation="vertical"`
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` reflect current/min/max widths
- `aria-label="Resize inspector panel"`
- Keyboard accessible with Left/Right arrow keys

---

## Synchronization Event Flows

### Flow 1: Page Selection (User Story 2, Scenario 1-4)

```
User clicks page in PageSidebar
  ↓
PageSidebar.onPageSelect(pageId)
  ↓
1. PageSidebarState.selectedPageId = pageId        (0ms)
2. ShellState.selectedPageId = pageId              (+5ms, sync)
3. CanvasState.currentPageId = pageId              (+10ms, sync)
4. CanvasState.scrollPosition = { x: 0, y: 0 }     (+15ms, reset scroll)
5. InspectorState.contentLoading = true            (+20ms, loading state)
6. Inspector fetches page-level schema fields      (+25ms, async fetch)
7. Canvas re-renders with new page content         (+40ms, render)
8. InspectorState.contentLoading = false           (+80ms, fetch complete)
  ↓
Total synchronization time: ~80ms (<100ms requirement ✅)
```

### Flow 2: Section Selection (User Story 2, Scenario 3-4)

```
User clicks section in PageSidebar
  ↓
PageSidebar.onSectionSelect(pageId, sectionId)
  ↓
1. PageSidebarState.selectedSectionId = sectionId  (0ms)
2. ShellState.selectedSectionId = sectionId        (+5ms, sync)
3. CanvasState.selectedSectionId = sectionId       (+10ms, sync)
4. Canvas.scrollToSection(sectionId)               (+15ms, smooth scroll starts)
5. Canvas.highlightSection(sectionId)              (+20ms, 2px outline applied)
6. InspectorState.contentLoading = true            (+25ms, loading state)
7. Inspector fetches section-specific fields       (+30ms, async fetch)
8. InspectorState.contentLoading = false           (+75ms, fetch complete)
  ↓
Total synchronization time: ~75ms (<100ms requirement ✅)
Note: Smooth scroll animation runs in parallel (250ms CSS transition)
```

### Flow 3: Inspector Tab Switch (User Story 3, Scenario 1-5)

```
User clicks inspector tab
  ↓
Inspector.onTabChange(tab)
  ↓
1. InspectorState.activeTab = tab                  (0ms)
2. Inspector unmounts previous tab panel           (+5ms)
3. Inspector mounts new tab panel                  (+10ms)
4. Tab panel fetches tab-specific content          (+15ms, async if needed)
5. Tab panel renders content                       (+30ms)
  ↓
Total tab switch time: ~30ms (<50ms input feedback requirement ✅)
Note: Active tab persists when navigating to different page/section (FR-013)
```

### Flow 4: Inspector Resize (FR-010, SC-005)

```
User drags resize handle
  ↓
ResizeHandle.onChange(width) [debounced 16.67ms for 60fps]
  ↓
1. InspectorState.panelWidth = clamp(width, 280, 600)  (0ms)
2. Inspector CSS width updates                         (+1ms, CSS variable)
3. Container queries recalculate field grid            (+3ms, CSS reflow)
4. Inspector content reflows                           (+8ms, layout)
  ↓
Total resize update time: ~8ms (<16.67ms for 60fps ✅)
Note: Debouncing ensures max 60 updates per second during drag
```

---

## Testing Contracts

### Component Testing Requirements

Each component must have tests for:
1. **Rendering**: Verifies component renders with default props
2. **Props**: Verifies component updates when props change
3. **Events**: Verifies callbacks fire with correct arguments
4. **Accessibility**: Verifies ARIA attributes, keyboard navigation, focus management
5. **Edge Cases**: Verifies empty states, loading states, error states

**Example Component Test** (PageSidebar):
```typescript
// PageSidebar.test.tsx
describe('PageSidebar', () => {
  it('renders page list with sections', () => {
    render(<PageSidebar pages={mockPages} ... />)
    expect(screen.getByRole('tree')).toBeInTheDocument()
  })

  it('calls onPageSelect when page clicked', async () => {
    const onPageSelect = vi.fn()
    render(<PageSidebar onPageSelect={onPageSelect} ... />)
    await userEvent.click(screen.getByText('Home Page'))
    expect(onPageSelect).toHaveBeenCalledWith('page-1')
  })

  it('shows empty state when no pages', () => {
    render(<PageSidebar pages={[]} ... />)
    expect(screen.getByText('No pages yet')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create First Page' })).toBeInTheDocument()
  })

  it('passes axe accessibility audit', async () => {
    const { container } = render(<PageSidebar ... />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### Integration Testing Requirements

Integration tests must verify synchronization flows:
1. **Page Selection Flow**: PageSidebar → Shell → Canvas → Inspector sync (<100ms)
2. **Section Selection Flow**: PageSidebar → Canvas scroll → Inspector sync (<100ms)
3. **Tab Persistence Flow**: Inspector tab → Navigate pages → Tab persists
4. **Resize Performance Flow**: Drag resize handle → Verify 60fps updates

**Example Integration Test**:
```typescript
// shell-sync.test.tsx
describe('Shell Synchronization', () => {
  it('synchronizes page selection across regions within 100ms', async () => {
    const startTime = performance.now()

    render(<Shell />)
    const pageButton = screen.getByRole('treeitem', { name: 'About Page' })

    await userEvent.click(pageButton)

    // Verify all regions updated
    await waitFor(() => {
      expect(screen.getByRole('main')).toHaveTextContent('About Page Content')
      expect(screen.getByRole('complementary')).toHaveTextContent('Page Settings')
    })

    const endTime = performance.now()
    expect(endTime - startTime).toBeLessThan(100)
  })
})
```

---

## Next Steps

1. Implement each component following these prop interfaces
2. Write component tests verifying contracts
3. Implement integration tests for synchronization flows
4. Profile performance to verify <100ms sync, 60fps resize
5. Conduct accessibility audit with axe-core and manual screen reader testing
6. Document any contract deviations with rationale
