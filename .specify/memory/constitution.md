<!--
SYNC IMPACT REPORT
==================
Version Change: [Initial] → 1.0.0
Modification Type: Initial constitution creation
Rationale: First version establishing comprehensive governance for PMC Engine Editor

Modified Principles:
- NEW: Product Purpose & Identity
- NEW: UX Principles (Consistency, Clarity, AI Scope Control, User Safety, Accessibility)
- NEW: Interaction Principles (Canvas, Inspector, Chat, Code Panel, Pages Sidebar)
- NEW: Visual Language
- NEW: Engineering Guardrails
- NEW: Tone of Voice
- NEW: Prohibited Patterns
- NEW: Success Criteria

Added Sections:
- Product Purpose (Section 1)
- Non-Negotiable UX Principles (Section 2)
- Interaction Principles (Section 3)
- Visual Language (Section 4)
- Engineering Guardrails (Section 5)
- Tone of Voice (Section 6)
- Prohibited Patterns (Section 7)
- Success Criteria (Section 8)
- Governance (Section 9)

Removed Sections: None

Templates Status:
✅ plan-template.md - Constitution Check gate present, aligns with quality principles
✅ spec-template.md - User scenarios and requirements align with UX principles
✅ tasks-template.md - Task structure supports independent testing per quality principles

Follow-up TODOs: None
-->

# PMC Engine Editor Constitution

## 1. Product Purpose & Identity

PMC Engine is an AI-first site editor used AFTER a buyer has purchased a PMC-Engine-compatible theme on PackMyCode.

**What PMC Engine IS**:
- A guided AI + schema-based editor
- A post-purchase theme customization tool
- A balance between simplicity for non-technical users and clarity for developers

**What PMC Engine IS NOT**:
- NOT a drag-and-drop builder
- NOT a marketplace
- NOT a code-upload tool
- NOT a wireframe or low-fidelity design tool

**Brand Experience Requirements**:

The editor MUST feel:
- Professional
- Calm
- Predictable
- Minimal
- Precise
- Safe
- Premium

All design, interaction, and engineering decisions MUST be evaluated against these seven brand pillars.

## 2. Non-Negotiable UX Principles

### I. Consistency

**Rule**: One single dashboard shell across all states (wizard, edit, preview, settings).

**Requirements**:
- Same top bar across all modes
- Same left rail structure across all modes
- Same page sidebar behavior across all modes
- Same inspector structure across all modes
- No secondary UIs that break the shell pattern
- No pop-out windows that leave the main interface
- No mode shock or context switching

**Rationale**: Consistency reduces cognitive load and builds user confidence through predictable patterns.

### II. Clarity & Cognitive Load Reduction

**Rules**:
- MUST always reduce cognitive load in every interface decision
- MUST show only what users need in the current context
- MUST use progressive disclosure for advanced features
- MUST visually de-emphasize advanced content
- MUST NOT surprise users with hidden bulk changes
- MUST make all system changes visible and traceable

**Progressive Disclosure Requirements**:
- Default view shows essential controls only
- Advanced features behind clearly labeled "Advanced" sections
- Advanced sections use visual hierarchy to indicate optional nature
- No critical features hidden in advanced sections

**Rationale**: Users can only process 7±2 items at once. Overwhelming interfaces cause errors and abandonment.

### III. AI Scope Control

**Rules**:
- AI MUST only act on one scope at a time: field, section, page, or theme-feature
- AI MUST NOT perform "rewrite whole site" or global destructive actions
- ALL AI actions REQUIRE preview + Accept/Reject workflow
- ALL AI actions MUST be undoable
- AI scope MUST be visually indicated before execution
- AI changes MUST be atomic (all-or-nothing within scope)

**Prohibited AI Actions**:
- Bulk site-wide rewrites
- Cross-page changes without explicit multi-page scope selection
- Changes to pages/sections not currently visible or selected
- Any action that affects >1 scope without explicit user confirmation

**Rationale**: Scoped AI prevents catastrophic mistakes and maintains user control and trust.

### IV. User Safety

**Rules**:
- Auto-save MUST prevent data loss (save every 30 seconds or after any change)
- Undo/redo MUST be consistent, predictable, and visible
- Destructive actions MUST require confirmation
- "Hire a Developer" option MUST always be available as a safety rail
- Error messages MUST be reassuring and actionable
- System MUST never blame the user for errors

**Confirmation Requirements**:
- Delete page: Confirm with page name verification
- Delete section: Confirm with section name
- Discard unsaved changes: Show diff preview
- Reset to default: Show before/after preview

**Recovery Requirements**:
- Every auto-save creates a restore point
- Undo stack maintains minimum 50 actions
- Version history accessible from settings
- Export full site data always available

**Rationale**: Users must feel safe to experiment without fear of catastrophic loss.

### V. Accessibility

**Rules**:
- MUST be fully keyboard navigable
- MUST meet WCAG AA minimum, WCAG AAA preferred for contrast
- ALL icons MUST have screen-reader labels (aria-label or aria-labelledby)
- Focus-visible outlines MUST always be enabled and high-contrast
- Interactive elements MUST meet 44×44px touch target minimum
- Color MUST NOT be the only means of conveying information

**Testing Requirements**:
- All features must pass keyboard-only navigation test
- All features must pass screen reader test (NVDA/JAWS/VoiceOver)
- Color contrast must be verified with automated tools
- Focus order must follow logical reading order

**Rationale**: Accessibility is not optional. 15% of users have some form of disability.

## 3. Interaction Principles

### I. The Canvas is Sacred

**Rules**:
- Canvas MUST always show high-fidelity live preview
- Canvas MUST NOT show wireframes, placeholders, or schematic UI
- Section outlines MUST only appear on hover or selection
- Canvas MUST update in real-time as Inspector changes
- Canvas MUST scroll independently from UI chrome

**Visual Feedback**:
- Hover: Thin outline (1px, low opacity)
- Selected: Thicker outline (2px, accent color)
- AI-changed: Soft yellow highlight fade (3s duration)
- Error state: Red outline with shake animation

**Rationale**: The canvas is the source of truth for "what the user's site looks like." It must never lie.

### II. Inspector is the Source of Truth for Data

**Rules**:
- ALL structured data editing MUST happen in the Inspector
- AI suggestions MUST populate the Inspector before updating canvas
- Inspector MUST dynamically reconfigure based on theme schema
- Inspector MUST NOT show fields not defined in schema
- Inspector MUST validate all inputs before canvas update
- Inspector MUST show field-level help text from schema

**Inspector Structure** (top to bottom):
1. Context header (selected page/section name)
2. Primary fields (from schema, order preserved)
3. Advanced fields (collapsed by default)
4. Actions (Delete, Duplicate, Move)

**Rationale**: Centralized data editing prevents confusion about where to make changes.

### III. Chat is the Command Center

**Rules**:
- ALL conversational changes MUST route through Chat panel
- Chat MUST display step-by-step operation logs for transparency
- Chat MUST NOT perform magical instant changes
- Chat MUST show: analysis → files touched → result
- Chat MUST allow users to Accept/Reject AI suggestions
- Chat MUST maintain conversation history across sessions

**Chat Message Structure**:
- User message (clean, prominent)
- AI thinking (collapsible, technical details hidden)
- AI proposal (clear, with preview)
- Accept/Reject buttons (always visible for pending actions)
- Result confirmation (what changed)

**Rationale**: Chat transparency builds trust and allows users to learn the system's logic.

### IV. Code Panel is Read-Only

**Rules**:
- Code Panel MUST be read-only (no direct editing)
- Code Panel MUST show diffs when AI edits code
- Code Panel MUST NOT require user to write code
- Changed lines MUST be highlighted with calm visual indicators
- Code Panel MUST use syntax highlighting
- Code Panel MUST show file name and path clearly

**Diff Display**:
- Removed lines: Soft red background
- Added lines: Soft green background
- Context lines: Normal background
- No distracting +/- symbols (use background color only)

**Rationale**: Non-technical users should never be forced into code. Technical users can verify AI changes.

### V. Pages Sidebar Defines Structure

**Rules**:
- Pages Sidebar MUST show clear, calm, lightweight page list
- Expanding a page MUST show its sections
- Page/section selection MUST sync with canvas + inspector
- Pages Sidebar MUST support drag-to-reorder
- Pages Sidebar MUST show page status icons (published, draft, error)

**Visual Hierarchy**:
- Pages (bold, larger text)
- Sections (indented, smaller text)
- Maximum 2 levels (no section nesting)

**Rationale**: Clear page structure allows users to navigate complex sites without getting lost.

## 4. Visual Language

### I. Aesthetic Rules

**Mandatory Palette**:
- Background: #FFFFFF (white)
- Secondary background: #F5F5F5 (very light gray)
- Borders/separators: #E5E5E5 (thin, 1px max)
- Text primary: #1A1A1A (near black)
- Text secondary: #666666 (medium gray)
- Accent: #EA2724 (PMC red) or theme-defined accent
- Success: #10B981 (green)
- Warning: #F59E0B (amber)
- Error: #EF4444 (red)

**Prohibited**:
- No gradients
- No drop shadows (except subtle focus shadows)
- No glass effects or blur backgrounds
- No neumorphism or skeuomorphism
- No textures or patterns

**Rationale**: Visual simplicity reduces cognitive load and maintains professional aesthetic.

### II. Typography

**Font Stack**:
- Primary: Inter, Geist, SF Pro, system-ui, sans-serif
- Monospace: JetBrains Mono, Fira Code, Consolas, monospace

**Hierarchy**:
- Page titles: 24px, 600 weight
- Section headings: 18px, 600 weight
- Labels: 14px, 500 weight
- Body text: 14px, 400 weight
- Helper text: 12px, 400 weight, secondary color

**Line Height**:
- Headings: 1.2
- Body: 1.5
- Helper text: 1.4

**Rationale**: Strong typographic hierarchy creates scannable, accessible interfaces.

### III. Motion & Feedback

**Animation Timing**:
- Micro-interactions: 150ms ease-out
- Panel transitions: 250ms ease-in-out
- Page transitions: 300ms ease-in-out
- Never exceed 400ms

**Feedback Patterns**:
- Canvas change: Soft yellow highlight, 3s fade
- AI working: Toast slides from top, subtle pulse
- Success: Checkmark icon, green flash (1s)
- Error: Shake animation (300ms), persist error message

**Easing**:
- Default: cubic-bezier(0.4, 0.0, 0.2, 1)
- Bounce (errors): cubic-bezier(0.68, -0.55, 0.265, 1.55)

**Rationale**: Subtle motion provides feedback without distraction. Excessive animation causes fatigue.

## 5. Engineering Guardrails

### I. Dynamic Schema Architecture

**Rules**:
- Everything in Inspector MUST be schema-defined
- Themes MUST NEVER break the editor
- Invalid schemas MUST trigger graceful fallback
- Unloaded schema → Inspector shows safe error state with recovery options
- Schema validation MUST happen on theme load
- Schema versioning MUST be enforced

**Schema Requirements**:
- JSON Schema Draft 7 minimum
- All fields must have: type, label, description
- Enums must provide human-readable labels
- Required fields must be marked explicitly
- Default values must be provided for optional fields

**Fallback Behavior**:
- Missing schema → Load default minimal schema
- Invalid field type → Treat as string with text input
- Missing required field → Use empty string default + warning

**Rationale**: Schema-driven architecture enables themes to extend editor without code changes.

### II. Live Sync

**Rules**:
- Canvas, Inspector, Chat Logs, and Code Panel MUST stay in sync
- Any AI or user change MUST update all layers instantly (within 16ms frame)
- State updates MUST be atomic (no partial updates visible)
- Sync failures MUST trigger error state with retry option

**Sync Architecture**:
- Single source of truth (global state store)
- All UI layers subscribe to relevant state slices
- Updates propagate through event system
- Optimistic UI updates with rollback on failure

**Rationale**: Out-of-sync UI destroys user trust and causes errors.

### III. Stateless Wizard

**Rules**:
- Wizard MUST overlay inside the same dashboard shell
- Wizard steps: Theme Selection → Page Selection → Business Profile → Launch Editor
- Wizard MUST be skippable at any step
- Wizard MUST be resumable from last completed step
- Wizard MUST NOT block access to editor chrome
- Wizard state MUST persist across browser sessions

**Visual Treatment**:
- Semi-transparent overlay (90% opacity black)
- Centered card (max 600px wide)
- Progress indicator (step 1 of 4)
- "Skip" button always visible (top-right)

**Rationale**: Stateless wizard allows flexible onboarding without trapping users.

### IV. State Management

**Rules**:
- MUST use central global store (Zustand, Recoil, or Signals recommended)
- AI commands MUST mutate state through single action pipeline
- ALL changes MUST be logged for undo timeline
- State MUST be serializable for persistence
- State MUST support time-travel debugging in development

**State Structure**:
- `pages`: Array of page objects
- `sections`: Map of section objects by ID
- `selectedPageId`: Current page selection
- `selectedSectionId`: Current section selection
- `undoStack`: Array of state snapshots
- `redoStack`: Array of state snapshots
- `aiOperations`: Queue of pending AI operations

**Rationale**: Centralized state management prevents race conditions and enables powerful debugging.

## 6. Tone of Voice

**Writing Principles**:
- Friendly but professional
- Simple language (8th-grade reading level maximum)
- No jargon unless inside "Advanced" view
- No threats or blame language
- Always reassuring
- Active voice preferred

**Reassurance Patterns**:
- "You can undo this"
- "This won't break your site"
- "Fixable with one click"
- "AI can help explain"
- "No changes will be published until you're ready"

**Error Message Template**:
```
[What happened] (simple, no blame)
[Why it happened] (if helpful)
[What you can do] (clear action)
[Reassurance] (it's safe/fixable)
```

**Example - Good**:
"We couldn't save your changes because the connection was lost. Your work is safe in your browser. Click 'Retry' to save."

**Example - Bad**:
"Error: Network timeout. Code 504. Check your connection and try again."

**Rationale**: Clear, kind language reduces user anxiety and support burden.

## 7. Prohibited Patterns

**NEVER Implement**:
- Drag-and-drop builder interface (conflicts with schema-driven principle)
- Alternative dark mode UI (violates consistency principle)
- Multiple dashboards with different layouts (violates consistency principle)
- Full-screen modals that hide the chrome (violates consistency principle)
- Cluttered controls in the Inspector (violates clarity principle)
- Technical logs exposed to non-technical users (use calm logs instead)
- AI actions without inspection and confirmation (violates AI scope control)
- Nested sections beyond 2 levels (violates simplicity principle)
- Auto-publishing changes without explicit user action (violates safety principle)
- Keyboard shortcuts that conflict with browser defaults (violates accessibility)

**Rationale**: These patterns have been explicitly rejected to maintain product integrity.

## 8. Success Criteria

**User Experience Goals**:

Users should feel:
- Confident in their changes
- Supported by AI assistance
- Always in control of the outcome
- Never overwhelmed by options or complexity
- Never confused about what changed or why
- Never lost inside the UI structure

**Product Experience Goals**:

The UI should feel:
- Lightweight and responsive (<100ms interaction feedback)
- Predictable in behavior and layout
- Professional-grade in polish
- Trustworthy in data handling
- Like a "smart assistant," not a "technical builder"

**Measurable Targets** (to be tracked post-launch):
- 90% of users complete first edit within 5 minutes
- <5% of users request "Hire a Developer" in first session
- 80% of AI suggestions accepted without modification
- Zero data loss incidents
- <2% accessibility audit failures

## 9. Governance

**Authority**:
This constitution supersedes all other product, design, and engineering practices for PMC Engine Editor. In case of conflict between this constitution and other documentation, this constitution takes precedence.

**Amendment Process**:
1. Propose amendment with rationale in writing
2. Document impact on existing features and templates
3. Update version number per semantic versioning rules
4. Update all dependent templates and documentation
5. Commit with clear amendment description

**Version Policy**:
- MAJOR (X.0.0): Backward-incompatible principle removals or redefinitions
- MINOR (x.Y.0): New principles added or materially expanded guidance
- PATCH (x.y.Z): Clarifications, wording fixes, non-semantic refinements

**Compliance Requirements**:
- ALL pull requests MUST verify compliance with this constitution
- ALL design decisions MUST reference applicable constitutional principles
- Code reviews MUST check for prohibited patterns
- Complexity MUST be justified against simplicity principle
- ANY deviation MUST be documented with rationale in pull request

**Enforcement**:
- Pull requests violating constitution principles may be blocked
- Deviation requires explicit acknowledgment and justification
- Product decisions overriding constitution require amendment process

**Review Schedule**:
- Quarterly constitution review for relevance
- Post-launch review after first 1000 users
- Annual comprehensive revision cycle

**Version**: 1.0.0 | **Ratified**: 2025-11-16 | **Last Amended**: 2025-11-16
