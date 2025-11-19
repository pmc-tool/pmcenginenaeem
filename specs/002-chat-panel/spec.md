# Feature Specification: AI Chat Panel & Command Center

**Feature Branch**: `002-chat-panel`
**Created**: 2025-11-17
**Status**: Draft
**Input**: User description: "Create the AI Chat Panel & Command Center inside the existing PMC Engine dashboard shell for user-AI interaction, scoped commands, and operation logging"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open Chat and Send Basic Message (Priority: P1)

A site owner wants to improve their homepage hero section but doesn't know where to start. They click the Chat icon in the left rail, the Chat panel slides open from the right side showing an empty chat with a prompt composer at the bottom. They select the hero section in the canvas, type "Make this headline more compelling", and press Enter. The AI responds with a suggested rewrite showing it understood the context (Home / Hero section).

**Why this priority**: This is the foundational interaction for the entire Chat feature. Without the ability to open chat, see context, and send/receive messages, no other AI-powered functionality can exist. This provides immediate value by connecting users to AI assistance within their editing workflow.

**Independent Test**: Can be fully tested by clicking Chat icon, verifying panel opens with correct layout (header, message list, composer), typing a message, sending it, and receiving a mock AI response. Delivers value by establishing the core communication channel between user and AI.

**Acceptance Scenarios**:

1. **Given** user is viewing the dashboard, **When** they click the Chat icon in left rail, **Then** Chat panel slides in from right (360-420px wide) overlaying canvas
2. **Given** user has selected a section in canvas, **When** Chat panel opens, **Then** composer shows contextual chip "Target: [Page Name] / [Section Name]"
3. **Given** Chat panel is open, **When** user types message in composer and presses Enter, **Then** user message appears in message list with timestamp
4. **Given** user sent a message, **When** AI begins processing, **Then** message list shows "Analyzing..." log message with animated indicator
5. **Given** AI completes response, **When** response arrives, **Then** AI message appears in list with formatted text and timestamp
6. **Given** Chat panel is open, **When** user clicks Chat icon again OR clicks close button in header, **Then** panel slides out and closes

---

### User Story 2 - Use Scoped Commands with Operation Logging (Priority: P2)

A user wants to rewrite their About page content. They open Chat, click the scope selector in the composer, change from "Section" to "Page", select the About page in the page sidebar, and send the message "Rewrite this page to be more professional". The AI shows a thinking state ("Analyzing About page...", "Identifying content sections..."), then completes with "Updated 3 sections on About page" with clickable "View change" links. User clicks a link and the canvas scrolls to that section while the inspector highlights the changed fields.

**Why this priority**: Once basic chat works (P1), users need granular control over AI scope to ensure changes happen exactly where intended (constitutional principle of "scoped AI actions"). Operation logging provides transparency and trust, showing exactly what the AI changed. This prevents "magic changes" that erode user confidence.

**Independent Test**: Can be tested by selecting different scope levels (Field, Section, Page, Feature), sending commands for each scope, verifying AI responses include proper scope badges, and checking that operation logs show step-by-step progress with final status. Delivers value by giving users predictable, bounded AI actions.

**Acceptance Scenarios**:

1. **Given** user has Chat open, **When** they click the scope selector dropdown, **Then** four options appear: Field, Section, Page, Feature
2. **Given** user selects "Page" scope, **When** they send a command, **Then** AI message includes badge "SCOPE: Page" showing target
3. **Given** AI processes page-level command, **When** operation runs, **Then** log messages appear: "Analyzing About page...", "Finding content sections...", "Updating section 1 of 3..."
4. **Given** AI completes operation, **When** final status arrives, **Then** completion message shows "Updated 3 sections on About page" with "View change" links
5. **Given** operation log shows "View change" link, **When** user clicks link, **Then** canvas scrolls to that section and inspector opens to show changed fields
6. **Given** user has insufficient AI credits, **When** they try to send message, **Then** composer is disabled with message "Insufficient credits. You have [N] credits remaining."

---

### User Story 3 - Use Quick Action Chips for Common Tasks (Priority: P3)

A user wants to quickly improve their section without typing full instructions. They open Chat with a section selected, see quick action chips below the composer ("Rewrite section", "Improve headline", "Generate FAQs", "Fix layout copy"), click "Improve headline", and the AI immediately understands the intent without additional typing. The AI rewrites just the headline field with a more engaging version.

**Why this priority**: Quick actions reduce friction for common tasks and guide users toward effective prompts. While chat works without them (P1-P2), they significantly improve efficiency for repeat workflows. This is valuable but can be added after core chat and scoping are proven.

**Independent Test**: Can be tested by selecting different elements (sections with headlines, content areas, FAQ sections), verifying appropriate quick action chips appear, clicking chips, and confirming AI executes the implied command with correct scope. Delivers value through reduced typing and discovery of AI capabilities.

**Acceptance Scenarios**:

1. **Given** user has section with headline selected, **When** Chat opens, **Then** composer shows chip "Improve headline"
2. **Given** user has content section selected, **When** Chat opens, **Then** composer shows chips "Rewrite section", "Shorten content", "Expand details"
3. **Given** user clicks "Generate FAQs" chip, **When** chip activates, **Then** composer fills with "Generate FAQ section" and chip highlights
4. **Given** user clicks quick action chip, **When** they press Enter, **Then** AI executes action on currently scoped element without additional clarification
5. **Given** user types custom message after clicking chip, **When** they modify text, **Then** chip deselects and custom message is sent instead

---

### User Story 4 - Expand/Collapse Long Responses and Review History (Priority: P4)

A user asked the AI to "Audit my entire site for SEO issues" which generated a long response with 15 recommendations. The response initially shows first 5 lines with "Show more" button. They click it and see the full response. Later they want to reference an earlier conversation from yesterday, they scroll up in the message list and see previous messages with timestamps, and click "Clear" in the header overflow menu to start fresh.

**Why this priority**: Message management is important for usability but doesn't block core functionality (P1-P3). Users can have productive conversations without collapsing long messages or clearing history. This adds polish and scalability for power users with long chat sessions.

**Independent Test**: Can be tested by triggering a long AI response (e.g., site audit), verifying it collapses initially, expanding it, scrolling message history, and using the Clear function. Delivers value by keeping the chat interface manageable during extended use.

**Acceptance Scenarios**:

1. **Given** AI response exceeds 8 lines of text, **When** message renders, **Then** only first 5 lines show with "Show more" button at bottom
2. **Given** collapsed message exists, **When** user clicks "Show more", **Then** full message expands and button changes to "Show less"
3. **Given** user has 20+ messages in history, **When** they scroll message list, **Then** older messages load smoothly and timestamps show relative time ("2 hours ago", "Yesterday")
4. **Given** user wants fresh start, **When** they click header overflow menu (three dots) and select "Clear", **Then** confirmation dialog appears
5. **Given** user confirms clear action, **When** confirmation completes, **Then** all messages remove from list and composer resets to default state
6. **Given** message list has mixed types (user, AI, log), **When** user reviews history, **Then** each type has distinct visual style (user: right-aligned, AI: left-aligned, log: centered with muted styling)

---

### Edge Cases

- **What happens when user closes Chat panel with operation in progress?** Panel closes but operation continues, next time panel opens user sees completion status in message list
- **How does system handle network failure during AI request?** Show error log message "Connection lost, please try again" with retry button, preserve user's message in composer
- **What happens when user selects new page/section while AI is responding?** Current operation completes with original scope, new context chip updates for next message, no interruption to active request
- **How does Chat handle rapid scope changes before message is sent?** Composer debounces context updates (300ms), always uses latest scope when Enter is pressed
- **What happens when user types "undo" in Chat?** AI cannot undo through chat, shows message "Please use Ctrl+Z to undo changes" (undo/redo handled by separate system per constitution)
- **How does system handle when user has multiple browser tabs open?** Each tab maintains independent chat state, no cross-tab synchronization (state is in-memory only, not persisted)
- **What happens when AI operation fails mid-execution?** Log shows progression until failure point, final status shows "Operation failed: [reason]", all changes before failure point are preserved, user can retry
- **How does Chat behave when user switches to preview mode?** Chat panel closes automatically (preview mode hides all shell UI), reopens at same state when user exits preview
- **What happens when AI credits hit zero during typing?** Composer becomes disabled real-time as credits update, placeholder text changes to "Out of credits - purchase more to continue"

## Requirements *(mandatory)*

### Functional Requirements

#### Chat Panel Layout & Behavior

- **FR-001**: System MUST render Chat panel as right-side overlay (360-420px wide on desktop) when Chat icon in left rail is clicked
- **FR-002**: System MUST position Chat panel above Canvas and Inspector but below modal overlays (z-index ordering)
- **FR-003**: Chat panel MUST NOT modify or destroy the existing shell layout (TopBar, LeftRail, PageSidebar, Canvas, Inspector remain in place)
- **FR-004**: System MUST provide ResizeHandle on left edge of Chat panel allowing users to resize between 360-600px width
- **FR-005**: System MUST close Chat panel when Chat icon is clicked again OR when close button in Chat header is clicked
- **FR-006**: Chat panel MUST show 250ms slide-in animation from right edge (consistent with constitutional animation timing)
- **FR-007**: On mobile viewports (<768px), Chat panel MUST expand to full width with slide-in animation from bottom or right

#### Chat Panel Header

- **FR-008**: Chat header MUST display title "Chat with PMC Engine" prominently
- **FR-009**: Chat header MUST show current context label below title (e.g., "Editing: Home / Hero") synced with selected page/section
- **FR-010**: Chat header MUST provide overflow menu (three dots icon) containing "Clear conversation" action
- **FR-011**: When "Clear conversation" is selected, system MUST show confirmation dialog before removing messages
- **FR-012**: Chat header MUST include close button (X icon) on right side

#### Message List & Types

- **FR-013**: System MUST support three message types: user (user-sent prompts), ai (assistant responses), log (system operations)
- **FR-014**: User messages MUST display right-aligned with distinct background color
- **FR-015**: AI messages MUST display left-aligned with assistant avatar/icon
- **FR-016**: Log messages MUST display center-aligned with muted styling and system icon
- **FR-017**: All messages MUST include timestamp displayed as relative time (e.g., "2 min ago", "Yesterday at 3:15 PM")
- **FR-018**: AI messages MUST support inline badges showing scope (e.g., "SCOPE: Section") and action type (e.g., "ACTION: Update content")
- **FR-019**: System MUST collapse AI messages longer than 8 lines, showing first 5 lines with "Show more" button
- **FR-020**: When user clicks "Show more", system MUST expand full message and change button to "Show less"
- **FR-021**: Message list MUST auto-scroll to bottom when new message is added
- **FR-022**: System MUST show "Analyzing..." thinking state in message list when AI operation begins

#### Operation Logging in Messages

- **FR-023**: When AI operation runs, system MUST append log messages showing progression (e.g., "Finding header in header.tsx...", "Updating 2 of 4 fields...")
- **FR-024**: When AI operation completes, system MUST show completion log with summary (e.g., "Updated logo in header.tsx")
- **FR-025**: Completion logs MUST include "View change" link that scrolls canvas to relevant section and opens inspector to changed fields
- **FR-026**: When "View change" link is clicked, system MUST focus the related section in canvas and inspector without sending new message
- **FR-027**: Failed operations MUST show error log with status "Operation failed: [human-readable reason]"
- **FR-028**: System MUST NOT show technical stack traces or code errors in log messages (constitutional requirement: human-readable only)

#### Prompt Composer

- **FR-029**: Composer MUST provide multi-line textarea at bottom of Chat panel with placeholder "Ask PMC Engine anything..."
- **FR-030**: System MUST show scope selector dropdown above textarea with options: Field, Section, Page, Feature
- **FR-031**: When no scope is explicitly selected, system MUST default to "Section" scope
- **FR-032**: Scope selector MUST show tooltip "AI will act only on [selected scope]" on hover
- **FR-033**: Composer MUST display current AI credits count (e.g., "250 credits") reading from shell aiCreditsCount state
- **FR-034**: When AI credits fall below 50, credits display MUST show amber warning color
- **FR-035**: When AI credits reach zero, composer textarea MUST become disabled with message "Out of credits - purchase more to continue"
- **FR-036**: Composer MUST send message when user presses Enter key (without Shift modifier)
- **FR-037**: Composer MUST insert new line when user presses Shift+Enter
- **FR-038**: System MUST show quick action chips below textarea when relevant to selected element (e.g., "Rewrite section", "Improve headline", "Generate FAQs", "Fix layout copy")
- **FR-039**: When quick action chip is clicked, composer textarea MUST fill with associated prompt text and chip MUST highlight
- **FR-040**: When user modifies chip-inserted text, chip highlight MUST clear (allowing custom message)

#### Context Synchronization

- **FR-041**: Chat panel MUST display contextual chip in composer showing current target (e.g., "Target: Home / Hero") synced with shell selectedPageId and selectedSectionId
- **FR-042**: When user changes selected page/section while Chat is open, context chip MUST update within 100ms (constitutional sync requirement)
- **FR-043**: System MUST use latest context at time Enter is pressed, not context when user started typing
- **FR-044**: When no page/section is selected, context chip MUST show "Target: Site" defaulting to feature-level scope

#### State Management

- **FR-045**: System MUST add chatState slice to dashboard store containing: messages (array), isOpen (boolean), scope (enum), isBusy (boolean)
- **FR-046**: Each message object MUST include: id, type (user|ai|log), text, scope, action, createdAt, relatedEntityId (optional)
- **FR-047**: System MUST set isBusy to true when AI operation starts and false when operation completes or fails
- **FR-048**: When isBusy is true, composer send button MUST show loading spinner and be disabled
- **FR-049**: Chat state MUST NOT persist between browser sessions (in-memory only, constitutional requirement: no persistent chat logs)
- **FR-050**: System MUST reset chat state (empty messages, default scope) when user clicks "Clear conversation" after confirmation

#### Accessibility

- **FR-051**: Chat panel MUST use role="complementary" on outer container
- **FR-052**: Message list region MUST use role="log" with aria-live="polite" so screen readers announce new messages
- **FR-053**: When Chat panel opens, focus MUST move to Chat header close button
- **FR-054**: Tab order MUST flow: header → messages → composer textarea → scope selector → send button → quick action chips
- **FR-055**: All buttons MUST have aria-label attributes (e.g., "Send message", "Close chat", "Clear conversation")
- **FR-056**: Screen readers MUST announce "New AI message" when AI response appears
- **FR-057**: Screen readers MUST announce "Operation succeeded" or "Operation failed" for log status messages
- **FR-058**: All interactive elements MUST show visible focus rings (2px solid #EA2724 per constitutional design)
- **FR-059**: Composer textarea MUST have aria-label "Chat message input" and aria-describedby pointing to scope indicator

#### Mock AI Handlers (for frontend testing)

- **FR-060**: System MUST implement mock AI response handler that simulates 2-3 second delay then returns canned response
- **FR-061**: Mock handler MUST parse user message for keywords ("rewrite", "improve", "generate") and return appropriate simulated action
- **FR-062**: Mock handler MUST generate log messages showing progression: "Analyzing..." → "Processing..." → "Complete"
- **FR-063**: Mock operation log MUST include: operationId (UUID), scope (from composer), targetEntityId, status (pending → running → success/error), messages (array of log lines)
- **FR-064**: When mock operation succeeds, system MUST decrement AI credits by 10 (simulated cost)
- **FR-065**: Mock responses MUST include "View change" links with relatedEntityId matching selected section/page

### Key Entities

- **ChatMessage**: Represents a single message in the chat history
  - Attributes: id (string), type (user|ai|log), text (string), scope (field|section|page|feature), action (string, optional), createdAt (timestamp), relatedEntityId (string, optional, links to page/section), isCollapsed (boolean for long messages)
  - Relationships: None (flat message list structure)

- **ChatOperationLog**: Represents the execution log of an AI operation
  - Attributes: operationId (UUID), scope (field|section|page|feature), targetEntityId (string, page/section ID), status (pending|running|success|error), messages (array of log line strings), createdAt (timestamp), completedAt (timestamp, optional)
  - Relationships: Associated with one or more ChatMessage entries of type "log"

- **ChatState**: Frontend state slice managing chat panel
  - Attributes: messages (ChatMessage[]), isOpen (boolean), scope (field|section|page|feature), isBusy (boolean), currentContext (string, formatted "Page / Section" label)
  - Relationships: Reads from shell selectedPageId, selectedSectionId, aiCreditsCount

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can open Chat panel and see it slide in within 250ms (matching constitutional animation timing)
- **SC-002**: Users can send a message and receive mock AI response within 3 seconds
- **SC-003**: Users can navigate 100+ messages in chat history without performance degradation (smooth scrolling, no lag)
- **SC-004**: Users can change selected section and see context chip update in composer within 100ms (meeting sync requirement)
- **SC-005**: Users can complete full Chat workflow (open → send message → view AI response → close) using only keyboard navigation
- **SC-006**: Screen reader users hear appropriate announcements ("New AI message", "Operation succeeded") without needing to navigate to message list
- **SC-007**: Users can resize Chat panel to any width between 360-600px and panel maintains usable layout
- **SC-008**: 100% of AI operation logs show human-readable status messages with zero technical stack traces or error codes visible
- **SC-009**: Users can identify AI-modified content by clicking "View change" link which highlights exactly what changed (no guessing required)
- **SC-010**: Users with low AI credits (<50) see warning indication before hitting zero (proactive notice)
- **SC-011**: Users attempting to chat with zero credits receive clear explanation and cannot send messages (preventing confusion)
- **SC-012**: Chat panel integration adds zero visual disruption to existing shell layout (TopBar, LeftRail, PageSidebar, Canvas, Inspector positions unchanged)
