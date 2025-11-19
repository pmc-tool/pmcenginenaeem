# Feature Specification: Dashboard Shell

**Feature Branch**: `001-dashboard-shell`
**Created**: 2025-11-16
**Status**: Draft
**Input**: User description: "Create the core dashboard shell for the PMC Engine Editor. The shell must maintain a unified layout across all states (wizard, edit, preview, settings). It includes: a persistent top bar with logo, site name, save state, preview toggle, publish, AI credits, and help; a left rail with icons for Chat, Pages, and Settings; a collapsible page sidebar for page/section navigation; a central canvas showing a live site preview; a right-side inspector panel with tabs (Content, AI Assistant, Settings, Logic & Data, Advanced); consistent spacing, typography, focus rings, and shell behavior according to the constitution; support for integrated AI logs, scoped actions, and undo/redo compatibility. This spec defines layout structure, resize rules, shell behavior, and interaction principles."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access Core Editing Interface (Priority: P1)

A non-technical site owner opens the PMC Engine Editor for the first time after purchasing a theme. They see a clean, unified dashboard with their site preview in the center, clear navigation on the left, and editing controls on the right. They can immediately identify where to edit content, preview changes, and access help without training.

**Why this priority**: This is the foundation for all other features. Without a functional shell, no editing, AI assistance, or preview functionality can exist. The shell establishes the visual consistency and spatial organization required by the constitution.

**Independent Test**: Can be fully tested by loading the editor and verifying all shell regions render correctly, remain visible during different modes (wizard, edit, preview, settings), and maintain their layout when browser is resized. Delivers immediate value by providing orientation and access to core functions.

**Acceptance Scenarios**:

1. **Given** user launches editor for first time, **When** dashboard loads, **Then** top bar displays logo, site name, save indicator, preview toggle, publish button, AI credits, and help icon
2. **Given** user is viewing dashboard, **When** they look at the left rail, **Then** they see clearly labeled icons for Chat, Pages, and Settings
3. **Given** user has editor open, **When** they view the center area, **Then** canvas shows live preview of their site with high fidelity rendering
4. **Given** user is on dashboard, **When** they look right, **Then** inspector panel shows tabs for Content, AI Assistant, Settings, Logic & Data, and Advanced
5. **Given** user switches between edit/preview/settings modes, **When** mode changes, **Then** shell layout remains consistent (same top bar, left rail, canvas position)
6. **Given** user resizes browser window, **When** viewport changes, **Then** shell maintains proportions and all critical UI remains accessible

---

### User Story 2 - Navigate Pages and Sections (Priority: P2)

A site owner needs to edit different pages of their site (Home, About, Services). They click the Pages icon in the left rail, the page sidebar slides open showing a list of pages, they expand a page to see its sections, select a section, and the canvas scrolls to that section while the inspector updates to show section-specific controls.

**Why this priority**: Once the shell exists, users need to navigate their site structure. Page/section navigation is essential for multi-page sites and is more critical than advanced inspector features.

**Independent Test**: Can be tested by creating a site with 3 pages and multiple sections per page. User clicks Pages icon, sees page list, expands pages, selects sections, and verifies canvas and inspector sync correctly. Delivers value by enabling structured navigation across site content.

**Acceptance Scenarios**:

1. **Given** user clicks Pages icon in left rail, **When** click completes, **Then** page sidebar slides open from left showing page list
2. **Given** page sidebar is open, **When** user clicks a page name, **Then** page expands to show its sections below
3. **Given** user views expanded page, **When** they click a section name, **Then** canvas scrolls to that section and highlights it with outline
4. **Given** user selects a section, **When** selection occurs, **Then** inspector panel updates to show section-specific content fields
5. **Given** page sidebar is open, **When** user clicks Pages icon again, **Then** sidebar collapses to icon-only view
6. **Given** user has multiple pages, **When** they drag a page entry, **Then** page order updates and visual feedback shows valid drop zones

---

### User Story 3 - Customize Inspector View (Priority: P3)

A user wants to use AI assistance for content generation. They click the "AI Assistant" tab in the inspector panel, the inspector content area switches to show AI chat interface with prompt field and scope selector (field, section, page). They can also switch to "Advanced" tab to access developer-focused settings that are normally hidden.

**Why this priority**: Inspector tab switching enables progressive disclosure of features. While important for full functionality, basic content editing (P1) and navigation (P2) provide more immediate value. This story enables power-user workflows.

**Independent Test**: Can be tested by clicking each inspector tab and verifying content area updates, appropriate controls appear, and tab state persists during canvas navigation. Delivers value by organizing complex functionality into manageable views.

**Acceptance Scenarios**:

1. **Given** user views inspector, **When** they click "AI Assistant" tab, **Then** inspector shows AI chat interface with scope selector
2. **Given** user is in AI Assistant tab, **When** they click "Content" tab, **Then** inspector shows schema-driven content editing fields
3. **Given** user clicks "Advanced" tab, **When** tab activates, **Then** inspector reveals developer-focused settings with visual de-emphasis (smaller text, lighter color)
4. **Given** user has "Settings" tab active, **When** they navigate to different section via Pages sidebar, **Then** Settings tab remains active showing settings for new section
5. **Given** user is in any inspector tab, **When** they select different page/section, **Then** inspector content updates for new selection while maintaining active tab

---

### User Story 4 - Access Help and Status Information (Priority: P4)

A user is confused about a feature and clicks the help icon in the top bar. A help panel slides in from the right showing contextual help based on current mode and selected element. They can also view save status ("All changes saved" or "Saving..."), see remaining AI credits, and toggle preview mode to see site as visitors would.

**Why this priority**: Help and status indicators improve user confidence and reduce support burden, but the core editing experience (P1-P3) must exist first. This story adds polish and reduces user anxiety.

**Independent Test**: Can be tested by clicking help icon, verifying contextual help appears, making an edit and watching save status update, using AI features and seeing credit count decrease, toggling preview mode and verifying UI chrome hides. Delivers value through improved user confidence and self-service support.

**Acceptance Scenarios**:

1. **Given** user clicks help icon in top bar, **When** help activates, **Then** help panel slides in from right with content relevant to current mode
2. **Given** user makes a content change, **When** change occurs, **Then** save indicator shows "Saving..." then "All changes saved" within 3 seconds
3. **Given** user views top bar, **When** they look at AI credits, **Then** display shows remaining credits as number with icon (e.g., "250 credits")
4. **Given** user clicks preview toggle, **When** toggle activates, **Then** shell UI (top bar, sidebars, inspector) hides and canvas shows full-screen site preview
5. **Given** user is in preview mode, **When** they press Escape or click exit preview, **Then** shell UI reappears and edit mode restores

---

### Edge Cases

- What happens when browser viewport is narrower than 768px (mobile/tablet)?
  - Left rail collapses to icon-only mode
  - Inspector panel moves below canvas (stacked layout)
  - Top bar items may collapse to hamburger menu
  - Page sidebar overlays canvas when open (not side-by-side)

- What happens when user has no pages/sections yet (brand new site)?
  - Pages sidebar shows "No pages yet" message with "Create First Page" button
  - Canvas shows welcome screen with quick start guide
  - Inspector shows disabled state with message "Select a page to edit"

- What happens when save fails (network error)?
  - Save indicator shows "Failed to save" with retry button
  - Visual alert appears (non-blocking toast)
  - Changes preserved in browser storage for recovery
  - Undo/redo remain functional locally

- What happens when AI credits reach zero?
  - AI credits display turns amber when <50 credits
  - AI Assistant tab shows "Low credits" warning
  - AI actions are disabled with "Purchase more credits" prompt
  - Non-AI features remain fully functional

- What happens when user rapidly switches between pages/sections?
  - Canvas updates debounced (max 1 update per 100ms)
  - Inspector loading state shows during content fetch
  - Pending updates cancel when new selection made
  - No janky re-renders or flickering

- What happens when user resizes inspector panel to minimum width?
  - Inspector maintains minimum 280px width
  - Content reflows but remains readable
  - Tab labels may truncate with ellipsis
  - Resize handle stops at minimum threshold

## Requirements *(mandatory)*

### Functional Requirements

#### Shell Layout Structure

- **FR-001**: System MUST render a persistent top bar spanning full viewport width containing logo, site name, save status indicator, preview toggle button, publish button, AI credits display, and help icon
- **FR-002**: System MUST render a left rail sidebar (60px wide icon-only mode, 240px expanded) containing navigation icons for Chat, Pages, and Settings
- **FR-003**: System MUST render a collapsible page sidebar (initially 280px wide) showing hierarchical page/section list when Pages icon is active
- **FR-004**: System MUST render a central canvas area displaying live site preview with section outlines on hover/selection
- **FR-005**: System MUST render a right inspector panel (360px default width, 280-600px resizable) containing tabbed interface with Content, AI Assistant, Settings, Logic & Data, and Advanced tabs

#### Shell Behavior & State

- **FR-006**: Shell layout MUST remain consistent when switching between wizard, edit, preview, and settings modes (same top bar, left rail, canvas, inspector positions)
- **FR-007**: System MUST maintain shell layout during browser resize, collapsing/stacking panels at breakpoints <768px (mobile) and <1024px (tablet)
- **FR-008**: Preview mode MUST hide all shell UI (top bar, left rail, sidebars, inspector) showing only canvas in full-screen
- **FR-009**: Page sidebar MUST slide open/closed with smooth 250ms animation when Pages icon clicked
- **FR-010**: Inspector panel MUST support horizontal resize via draggable handle, constrained to 280px minimum and 600px maximum width

#### Navigation & Synchronization

- **FR-011**: Selecting a page in page sidebar MUST update canvas to show that page and inspector to show page-level settings
- **FR-012**: Selecting a section in page sidebar MUST scroll canvas to that section, highlight it with 2px accent-color outline, and update inspector to show section-specific fields
- **FR-013**: Inspector active tab MUST persist when navigating between pages/sections (e.g., if AI Assistant tab active, it remains active after selecting different section)
- **FR-014**: Canvas, inspector, and page sidebar selection states MUST stay synchronized (selecting in canvas updates sidebar, selecting in sidebar updates canvas and inspector)

#### Visual & Accessibility

- **FR-015**: All shell regions MUST use constitution-defined spacing (8px base unit), typography (Inter font stack, defined hierarchy), and color palette (#FFFFFF background, #F5F5F5 secondary, #EA2724 accent)
- **FR-016**: All interactive elements MUST show high-contrast focus-visible outlines when keyboard-focused (2px solid accent color, 2px offset)
- **FR-017**: All icons in left rail and top bar MUST have aria-label attributes for screen readers
- **FR-018**: All shell regions MUST be fully keyboard navigable (Tab, Shift+Tab, Arrow keys for lists, Enter to activate, Escape to close panels)

#### Save & Status

- **FR-019**: Save status indicator MUST display current state: "All changes saved", "Saving...", or "Failed to save" with retry option
- **FR-020**: System MUST auto-save content changes within 30 seconds or immediately on blur of input field
- **FR-021**: AI credits display MUST show remaining credit count and update in real-time after AI operations
- **FR-022**: AI credits display MUST change color to amber (#F59E0B) when credits fall below 50

#### Integration Points

- **FR-023**: Shell MUST support undo/redo operations that affect canvas, inspector, and page sidebar states consistently
- **FR-024**: Shell MUST provide event hooks for AI operations to update inspector content, canvas preview, and operation logs in Chat panel
- **FR-025**: Shell MUST support wizard overlay rendering inside the same shell chrome (wizard overlays canvas, top bar and left rail remain visible but dimmed)

### Key Entities

- **Shell State**: Current mode (wizard, edit, preview, settings), active left rail tab, page sidebar visibility, inspector active tab, selected page ID, selected section ID, save status, AI credits count
- **Top Bar State**: Site name, logo URL, save status text, preview mode boolean, AI credits count, help panel visibility
- **Left Rail State**: Active icon (Chat, Pages, Settings, none), icon hover states
- **Page Sidebar State**: Open/collapsed boolean, expanded page IDs (array), selected page ID, selected section ID, drag operation state
- **Inspector State**: Active tab (Content, AI Assistant, Settings, Logic & Data, Advanced), panel width (px), content loading state
- **Canvas State**: Current page ID, scroll position, hovered section ID, selected section ID, zoom level, preview mode boolean

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify all shell regions (top bar, left rail, canvas, inspector) and their purpose within 10 seconds of first load without training
- **SC-002**: Shell layout remains consistent (no layout shift >5px) when switching between edit, preview, wizard, and settings modes
- **SC-003**: Canvas, inspector, and page sidebar synchronization completes within 100ms of user selection action (clicking page/section)
- **SC-004**: All interactive elements in shell (buttons, icons, tabs, resize handles) respond to user input within 50ms (visual feedback appears)
- **SC-005**: Inspector panel resizing performs smoothly at 60fps during drag operation (no jank or stuttering)
- **SC-006**: Shell adapts to viewport sizes from 320px to 3840px width without breaking layout or hiding critical controls
- **SC-007**: Users can navigate entire page/section hierarchy using only keyboard (no mouse required) with logical focus order
- **SC-008**: Save status indicator updates within 1 second of content change and shows "All changes saved" within 3 seconds under normal network conditions
- **SC-009**: All focus-visible outlines meet WCAG AA contrast requirements (4.5:1 minimum) against backgrounds
- **SC-010**: 90% of users can locate and use preview toggle, save status, and help icon without assistance during usability testing

### Assumptions

- Site name and logo are provided during wizard or set to defaults ("Untitled Site", placeholder logo)
- Initial page structure (at least 1 page with 1 section) exists from theme or wizard initialization
- AI credits are managed externally and provided to shell as reactive value
- Undo/redo state management is handled by global state store, shell consumes state for display
- Authentication and session management are handled outside shell scope
- Browser targets: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (modern evergreen browsers)
- Network conditions: Broadband minimum (1 Mbps), optimizations for slower connections handled via progressive loading
