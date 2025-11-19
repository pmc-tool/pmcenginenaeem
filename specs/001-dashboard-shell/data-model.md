# Data Model: Dashboard Shell

**Feature**: Dashboard Shell
**Date**: 2025-11-16
**Source**: Extracted from [spec.md](./spec.md) Key Entities section

## Overview

The dashboard shell state is composed of 6 primary entities managed through Zustand state management. All entities are browser-based (no backend persistence for shell state). State synchronization across shell regions must complete within 100ms (SC-003).

---

## Entity Definitions

### 1. Shell State

**Purpose**: Top-level application mode and coordination state

**Fields**:

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `mode` | `enum` | `'wizard' \| 'edit' \| 'preview' \| 'settings'` | `'edit'` | Current application mode (FR-006) |
| `activeLeftRailTab` | `string \| null` | `'chat' \| 'pages' \| 'settings' \| null` | `null` | Which left rail icon is active |
| `pageSidebarVisible` | `boolean` | - | `false` | Whether page sidebar is open (FR-003) |
| `inspectorActiveTab` | `string` | `'content' \| 'ai' \| 'settings' \| 'logic' \| 'advanced'` | `'content'` | Active inspector tab (FR-005) |
| `selectedPageId` | `string \| null` | Must reference valid page | `null` | Currently selected page UUID |
| `selectedSectionId` | `string \| null` | Must reference valid section | `null` | Currently selected section UUID |
| `saveStatus` | `enum` | `'idle' \| 'saving' \| 'saved' \| 'failed'` | `'saved'` | Auto-save status (FR-019) |
| `aiCreditsCount` | `number` | >= 0 | `1000` | Remaining AI operation credits (FR-021) |

**Validation Rules**:
- `mode` must be one of four allowed values
- `selectedPageId` / `selectedSectionId` must reference existing theme entities (validated against theme data)
- `aiCreditsCount` cannot be negative
- When `mode === 'preview'`, `pageSidebarVisible` must be `false` (FR-008)

**State Transitions**:
```
mode: wizard -> edit -> preview -> edit -> settings -> edit
saveStatus: idle -> saving -> saved (success) OR failed (error)
aiCreditsCount: decrements after each AI operation, resets on credit purchase
```

**Relationships**:
- References `TopBarState.siteLogoUrl`, `TopBarState.siteName` for display
- Coordinates with `PageSidebarState.selectedPageId`, `CanvasState.currentPageId` (must sync)
- Drives `InspectorState.activeTab` persistence across navigation

---

### 2. Top Bar State

**Purpose**: Persistent top bar display and action state

**Fields**:

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `siteName` | `string` | 1-100 characters | `'Untitled Site'` | Editable site name displayed in top bar (FR-001) |
| `siteLogoUrl` | `string \| null` | Valid URL or null | `null` | Logo image URL or null for placeholder |
| `saveStatusText` | `string` | - | `'All changes saved'` | Human-readable save status (FR-019) |
| `previewMode` | `boolean` | - | `false` | Whether preview mode is active (FR-008) |
| `aiCreditsCount` | `number` | >= 0, <50 triggers warning | `1000` | Mirrored from Shell State for display (FR-021, FR-022) |
| `helpPanelVisible` | `boolean` | - | `false` | Whether help panel is open (User Story 4) |

**Validation Rules**:
- `siteName` must not be empty string
- `siteLogoUrl` must be valid URL format if non-null
- `aiCreditsCount` < 50 triggers amber color display (FR-022)

**State Transitions**:
```
previewMode: false <-> true (toggle on preview button click)
helpPanelVisible: false <-> true (toggle on help icon click)
saveStatusText: 'All changes saved' -> 'Saving...' -> 'All changes saved' | 'Failed to save'
```

**Relationships**:
- `previewMode === true` sets `ShellState.mode = 'preview'` and hides all shell UI except canvas
- `saveStatusText` derives from `ShellState.saveStatus` enum
- `aiCreditsCount` mirrors `ShellState.aiCreditsCount`

---

### 3. Left Rail State

**Purpose**: Vertical navigation rail icon states

**Fields**:

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `activeIcon` | `string \| null` | `'chat' \| 'pages' \| 'settings' \| null` | `null` | Which icon is currently active (FR-002) |
| `hoverIcon` | `string \| null` | `'chat' \| 'pages' \| 'settings' \| null` | `null` | Which icon is being hovered (for tooltip) |

**Validation Rules**:
- Only one icon can be active at a time
- `activeIcon === 'pages'` opens page sidebar (`ShellState.pageSidebarVisible = true`)

**State Transitions**:
```
activeIcon: null -> 'pages' (click Pages icon, opens page sidebar)
activeIcon: 'pages' -> null (click Pages icon again, closes page sidebar)
hoverIcon: null -> 'chat' (mouse enter) -> null (mouse leave)
```

**Relationships**:
- `activeIcon === 'pages'` triggers `PageSidebarState.open = true` (FR-009)
- `activeIcon === 'chat'` shows Chat panel in canvas area (future feature)
- `activeIcon === 'settings'` shows Settings view (future feature)

---

### 4. Page Sidebar State

**Purpose**: Hierarchical page/section navigation state

**Fields**:

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `open` | `boolean` | - | `false` | Whether sidebar is visible (FR-003) |
| `expandedPageIds` | `string[]` | Each ID must reference valid page | `[]` | Array of page UUIDs with expanded sections visible |
| `selectedPageId` | `string \| null` | Must reference valid page | `null` | Currently selected page UUID (syncs with Shell State) |
| `selectedSectionId` | `string \| null` | Must reference valid section within selected page | `null` | Currently selected section UUID (syncs with Shell State) |
| `dragOperationActive` | `boolean` | - | `false` | Whether page reordering drag is in progress |
| `draggedPageId` | `string \| null` | Must reference valid page if non-null | `null` | Page UUID being dragged |

**Validation Rules**:
- `selectedSectionId` must belong to `selectedPageId` if both are non-null
- `expandedPageIds` cannot contain duplicates
- `draggedPageId` must be in `expandedPageIds` array when drag active

**State Transitions**:
```
open: false <-> true (toggle via left rail Pages icon click)
expandedPageIds: [] -> ['page-1'] (click to expand) -> ['page-1', 'page-2'] (expand second page)
selectedPageId: null -> 'page-1' (click page) -> 'page-2' (click different page)
selectedSectionId: null -> 'section-1' (click section within page) -> null (click different page)
dragOperationActive: false -> true (mousedown on page) -> false (mouseup)
```

**Relationships**:
- `selectedPageId` must sync with `ShellState.selectedPageId` and `CanvasState.currentPageId` (FR-014)
- `selectedSectionId` must sync with `ShellState.selectedSectionId` and `CanvasState.selectedSectionId` (FR-014)
- `open === true` triggered by `LeftRailState.activeIcon === 'pages'`

---

### 5. Inspector State

**Purpose**: Right panel inspector UI state

**Fields**:

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `activeTab` | `string` | `'content' \| 'ai' \| 'settings' \| 'logic' \| 'advanced'` | `'content'` | Active inspector tab (FR-005) |
| `panelWidth` | `number` | 280-600 (px) | `360` | Inspector panel width in pixels (FR-010) |
| `contentLoading` | `boolean` | - | `false` | Whether inspector content is fetching (debounced during rapid navigation) |
| `resizeActive` | `boolean` | - | `false` | Whether resize drag handle is being dragged |

**Validation Rules**:
- `panelWidth` must be clamped to 280-600px range (FR-010)
- `activeTab === 'advanced'` should visually de-emphasize content (smaller text, lighter color per User Story 3)

**State Transitions**:
```
activeTab: 'content' <-> 'ai' <-> 'settings' <-> 'logic' <-> 'advanced' (tab clicks)
panelWidth: 360 -> 450 (drag resize handle right) -> 280 (drag to minimum) -> 600 (drag to maximum)
contentLoading: false -> true (new page selected) -> false (content loaded)
resizeActive: false -> true (mousedown on resize handle) -> false (mouseup)
```

**Relationships**:
- `activeTab` persists across page/section navigation (FR-013)
- `contentLoading === true` during debounced canvas/sidebar sync operations (max 1 update per 100ms per Edge Cases)
- `panelWidth` updates constrained to 60fps during resize (FR-010, SC-005)

---

### 6. Canvas State

**Purpose**: Live site preview viewport state

**Fields**:

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `currentPageId` | `string \| null` | Must reference valid page | `null` | Page UUID currently rendered in canvas (FR-004) |
| `scrollPosition` | `{ x: number, y: number }` | x >= 0, y >= 0 | `{ x: 0, y: 0 }` | Canvas viewport scroll offset in pixels |
| `hoveredSectionId` | `string \| null` | Must reference valid section | `null` | Section UUID currently being hovered (shows outline) |
| `selectedSectionId` | `string \| null` | Must reference valid section | `null` | Section UUID currently selected (shows thicker outline) |
| `zoomLevel` | `number` | 0.25-2.0 (25%-200%) | `1.0` | Canvas zoom multiplier (future feature) |
| `previewMode` | `boolean` | - | `false` | Whether canvas is in full-screen preview (FR-008) |

**Validation Rules**:
- `currentPageId` must sync with `ShellState.selectedPageId` and `PageSidebarState.selectedPageId` (FR-014)
- `selectedSectionId` must sync with `ShellState.selectedSectionId` and `PageSidebarState.selectedSectionId` (FR-014)
- `hoveredSectionId` and `selectedSectionId` must reference sections within `currentPageId`
- When `previewMode === true`, shell UI hides and only canvas shows (FR-008)

**State Transitions**:
```
currentPageId: null -> 'page-1' (load initial page) -> 'page-2' (navigate to different page)
scrollPosition: { x: 0, y: 0 } -> { x: 0, y: 500 } (scroll down) -> { x: 0, y: 0 } (scroll to top)
hoveredSectionId: null -> 'section-1' (mouse enter section) -> null (mouse leave)
selectedSectionId: null -> 'section-1' (click section) -> 'section-2' (click different section)
previewMode: false <-> true (toggle via top bar preview button)
```

**Relationships**:
- `currentPageId`, `selectedSectionId` must stay synchronized with `PageSidebarState` and `ShellState` (FR-014)
- Selecting section in canvas updates `InspectorState.contentLoading = true` while fields load (FR-012)
- `hoveredSectionId` triggers 1px low-opacity outline; `selectedSectionId` triggers 2px accent-color outline (FR-004)

---

## State Synchronization Requirements

### Critical Sync Paths (must complete <100ms per SC-003):

1. **Page Selection Flow**:
   ```
   User clicks page in PageSidebar
   -> PageSidebarState.selectedPageId updates
   -> ShellState.selectedPageId updates (sync)
   -> CanvasState.currentPageId updates (sync)
   -> CanvasState.scrollPosition resets to { x: 0, y: 0 }
   -> InspectorState.contentLoading = true
   -> Inspector fetches page-level fields
   -> InspectorState.contentLoading = false
   Total time: <100ms
   ```

2. **Section Selection Flow**:
   ```
   User clicks section in PageSidebar
   -> PageSidebarState.selectedSectionId updates
   -> ShellState.selectedSectionId updates (sync)
   -> CanvasState.selectedSectionId updates (sync)
   -> Canvas scrolls to section (smooth scroll)
   -> Canvas highlights section with 2px outline
   -> InspectorState.contentLoading = true
   -> Inspector fetches section-specific fields
   -> InspectorState.contentLoading = false
   Total time: <100ms (excluding smooth scroll animation)
   ```

3. **Mode Switch Flow**:
   ```
   User clicks preview toggle
   -> TopBarState.previewMode = true
   -> ShellState.mode = 'preview'
   -> CanvasState.previewMode = true
   -> Shell UI hides (top bar, left rail, sidebars, inspector)
   -> Canvas expands to full viewport
   Total time: <50ms (visual transition is 250ms CSS animation per FR-009)
   ```

### Debouncing Requirements:

- **Rapid page/section switching**: Cancel pending updates, only execute latest selection (Edge Cases)
- **Inspector resize**: Update at max 60fps (16.67ms intervals) during drag (SC-005)
- **Auto-save**: Trigger 30 seconds after last change OR immediately on input blur (FR-020)

---

## Persistence Strategy

### Browser Storage Mapping:

**IndexedDB (primary, <5MB state)**:
- Stores serialized Zustand state with partialize configuration
- Persists: `selectedPageId`, `selectedSectionId`, `siteName`, `inspectorTab`, `inspectorWidth`, `expandedPageIds`
- Excludes transient state: `saveStatus`, `contentLoading`, `hoverIcon`, `dragOperationActive`

**localStorage (fallback, 5-10MB)**:
- Used when IndexedDB unavailable (Safari private mode)
- Same partialize configuration as IndexedDB
- JSON stringified state stored under key `pmc-dashboard-v1`

### Recovery Strategy:

**Auto-save Recovery** (Edge Case: save failure):
```
1. User makes edit
2. Auto-save triggered after 30s
3. Save fails (network error)
4. ShellState.saveStatus = 'failed'
5. TopBarState.saveStatusText = 'Failed to save'
6. Visual toast appears with "Retry" button
7. Changes preserved in browser storage
8. User clicks "Retry" OR page reload recovers from storage
```

**Undo/Redo** (FR-023):
```
Zustand history middleware maintains 50-action circular buffer
Each state mutation captured as snapshot
Undo: _historyIndex--, restore previous snapshot
Redo: _historyIndex++, restore next snapshot
History survives page reload via persistence
```

---

## TypeScript Interfaces

```typescript
// src/types/shellState.ts

export type AppMode = 'wizard' | 'edit' | 'preview' | 'settings'
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'failed'
export type LeftRailIcon = 'chat' | 'pages' | 'settings' | null
export type InspectorTab = 'content' | 'ai' | 'settings' | 'logic' | 'advanced'

export interface ShellState {
  mode: AppMode
  activeLeftRailTab: LeftRailIcon
  pageSidebarVisible: boolean
  inspectorActiveTab: InspectorTab
  selectedPageId: string | null
  selectedSectionId: string | null
  saveStatus: SaveStatus
  aiCreditsCount: number
}

export interface TopBarState {
  siteName: string
  siteLogoUrl: string | null
  saveStatusText: string
  previewMode: boolean
  aiCreditsCount: number
  helpPanelVisible: boolean
}

export interface LeftRailState {
  activeIcon: LeftRailIcon
  hoverIcon: LeftRailIcon
}

export interface PageSidebarState {
  open: boolean
  expandedPageIds: string[]
  selectedPageId: string | null
  selectedSectionId: string | null
  dragOperationActive: boolean
  draggedPageId: string | null
}

export interface InspectorState {
  activeTab: InspectorTab
  panelWidth: number // 280-600px
  contentLoading: boolean
  resizeActive: boolean
}

export interface CanvasState {
  currentPageId: string | null
  scrollPosition: { x: number; y: number }
  hoveredSectionId: string | null
  selectedSectionId: string | null
  zoomLevel: number // 0.25-2.0
  previewMode: boolean
}

// Combined dashboard store interface
export interface DashboardStore {
  // State slices
  shell: ShellState
  topBar: TopBarState
  leftRail: LeftRailState
  pageSidebar: PageSidebarState
  inspector: InspectorState
  canvas: CanvasState

  // Actions
  setMode: (mode: AppMode) => void
  selectPage: (pageId: string) => void
  selectSection: (sectionId: string) => void
  togglePageSidebar: () => void
  setInspectorTab: (tab: InspectorTab) => void
  setInspectorWidth: (width: number) => void
  setSaveStatus: (status: SaveStatus) => void
  updateAiCredits: (count: number) => void

  // Undo/Redo
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}
```

---

## Validation Schema

```typescript
// src/utils/validation.ts
import { z } from 'zod'

export const shellStateSchema = z.object({
  mode: z.enum(['wizard', 'edit', 'preview', 'settings']),
  activeLeftRailTab: z.enum(['chat', 'pages', 'settings']).nullable(),
  pageSidebarVisible: z.boolean(),
  inspectorActiveTab: z.enum(['content', 'ai', 'settings', 'logic', 'advanced']),
  selectedPageId: z.string().uuid().nullable(),
  selectedSectionId: z.string().uuid().nullable(),
  saveStatus: z.enum(['idle', 'saving', 'saved', 'failed']),
  aiCreditsCount: z.number().int().nonnegative(),
})

export const inspectorStateSchema = z.object({
  activeTab: z.enum(['content', 'ai', 'settings', 'logic', 'advanced']),
  panelWidth: z.number().min(280).max(600),
  contentLoading: z.boolean(),
  resizeActive: z.boolean(),
})

// ... (similar schemas for other entities)
```

---

## Next Steps

1. Implement Zustand store with these 6 entity slices
2. Add Zod validation middleware to enforce constraints
3. Configure persistence with partialize for non-transient state
4. Implement synchronization logic for critical paths (<100ms requirement)
5. Add history middleware for 50-action undo/redo
6. Create selector hooks for fine-grained subscriptions
7. Write integration tests for sync flows (see contracts/shell-api.md)
