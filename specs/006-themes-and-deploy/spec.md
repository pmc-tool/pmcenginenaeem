# Feature Specification: Themes Page, Theme Upload & AI Deploy Panel

**Feature Branch**: `006-themes-and-deploy`
**Created**: 2025-11-18
**Status**: Draft
**Input**: User description: "Feature: Themes Page, Theme Upload & AI Deploy Panel - Add new Themes area in PMC Engine left rail with combined My Themes view (purchased + uploaded), simple Upload Theme flow (buyer-side), AI-driven deploy panel with human-friendly steps + expandable terminal log, and error path that opens Chat panel to fix issues including redeploy"

## Clarifications

### Session 2025-11-18

- Q: Should uploaded themes be scanned for malicious code/viruses, or is manifest validation + sandboxed deployment sufficient? → A: Sandboxed deployment only (no pre-scan); rely on manifest validation + sandboxed deployment environment with restricted permissions
- Q: If deployment fails mid-process, should retry/resume from last successful step or restart from beginning? → A: Restart from beginning (simpler, ensures clean state, full re-run of all steps)
- Q: What deployment events should be logged/tracked for monitoring and debugging? → A: Key lifecycle events only (deployment start, each step completion, errors, final state, user actions like "Open AI help") - balanced observability without overwhelming storage
- Q: How should purchased themes from PackMyCode be synchronized (real-time, cached, manual refresh)? → A: Cached with manual refresh (cache locally, provide "Refresh themes" button to re-sync from PackMyCode)
- Q: What fields are required in the PMC Engine theme manifest for validation? → A: name, version, framework (3 core fields)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and Browse Available Themes (Priority: P1)

A site owner opens the Themes page to see all themes they can use for their site, including both purchased themes from PackMyCode and themes uploaded by their developer.

**Why this priority**: This is the foundational capability - users must be able to see what themes are available before they can upload or deploy anything. Without this, no other functionality is usable.

**Independent Test**: Can be fully tested by navigating to the Themes page and verifying that purchased and uploaded themes are displayed in a unified list with appropriate status indicators and thumbnails. Delivers value by letting users see their theme options.

**Acceptance Scenarios**:

1. **Given** user is logged into PMC Engine, **When** they click the Themes icon in the left rail, **Then** the central canvas displays the Themes page with header, upload area, and My Themes list
2. **Given** user has purchased themes from their PMC account, **When** they view My Themes list, **Then** all purchased PMC Engine-compatible themes are displayed with thumbnails, names, descriptions, and status pills (from cached data)
3. **Given** user has recently purchased new themes from PackMyCode, **When** they click "Refresh themes" button on Themes page, **Then** system re-syncs with PackMyCode API and newly purchased themes appear in My Themes list
4. **Given** user has previously uploaded custom themes, **When** they view My Themes list, **Then** uploaded themes appear with "Uploaded theme" badge
5. **Given** one theme is currently active on the site, **When** user views My Themes list, **Then** that theme shows "Active on this site" status pill
6. **Given** user views the Themes page, **When** they use the search input, **Then** the theme list filters by name in real-time
7. **Given** user views the Themes page, **When** they click tag filters (SaaS, Portfolio, Blog), **Then** only themes matching those tags are displayed

---

### User Story 2 - Upload Custom Theme (Priority: P2)

A site owner or developer uploads a PMC Engine-compatible theme zip file so it becomes available for deployment on this site.

**Why this priority**: This is a core value-add feature that differentiates the platform - allowing custom themes alongside marketplace themes. Must work before users can deploy custom themes, but purchased themes can still be used without this.

**Independent Test**: Can be tested independently by uploading a valid theme zip file, then verifying it appears in My Themes with proper badge. Can also test error cases with invalid files. Delivers value by expanding theme options beyond marketplace.

**Acceptance Scenarios**:

1. **Given** user is on Themes page, **When** they drag and drop a valid PMC Engine theme zip file onto the upload dropzone, **Then** progress indicator shows "Uploading and validating theme..." followed by success message
2. **Given** user is on Themes page, **When** they click "Browse files" and select a valid theme zip, **Then** file uploads and validates successfully
3. **Given** upload succeeds, **When** validation completes, **Then** new theme appears at top of My Themes list with placeholder thumbnail, theme name, and "Uploaded theme" tag
4. **Given** user uploads a file larger than 50 MB, **When** validation runs, **Then** friendly inline error displays: "This file is too large. Max size is 50 MB."
5. **Given** user uploads a non-zip file, **When** validation runs, **Then** error displays: "This doesn't look like a PMC Engine theme zip file. Please upload the theme zip from your developer."
6. **Given** user uploads a zip without valid manifest, **When** validation runs, **Then** error displays: "We couldn't read this theme as PMC Engine–ready. Ask your developer to export a PMC Engine–compatible theme, or [learn more]."
7. **Given** upload or validation fails, **When** error is shown, **Then** the invalid theme does NOT appear in My Themes list

---

### User Story 3 - Deploy Theme with AI Guidance (Priority: P1)

A user selects a theme and deploys it to their site with real-time progress feedback, automated tech stack detection, and friendly step-by-step guidance.

**Why this priority**: This is the primary action users want to take - actually getting a theme live on their site. Without deployment, the themes are just static listings. This is equally critical to viewing themes (both are P1).

**Independent Test**: Can be tested by selecting any available theme, clicking "Use this theme", and observing the Deploy Panel walk through all deployment steps with live updates. Success case shows preview mode; failure case shows errors. Delivers immediate value by making the site functional.

**Acceptance Scenarios**:

1. **Given** user views a theme card in My Themes, **When** they click "Next" or "Use this theme" button, **Then** light confirmation note appears: "We'll deploy this theme as the base for your site. You can change content later."
2. **Given** user confirms theme selection, **When** deployment begins, **Then** AI Deploy Panel opens (as right-side panel or centered modal) with title "Setting up your site"
3. **Given** Deploy Panel is open, **When** deployment runs, **Then** step-by-step status list displays with vertical timeline: "Detecting tech stack...", "Preparing build environment...", "Building your site...", "Deploying to PMC Engine...", "Done – first version is live."
4. **Given** deployment is in progress, **When** each step starts, **Then** that step shows spinner icon and "in progress" state with live status text updates
5. **Given** deployment is in progress, **When** each step completes successfully, **Then** that step shows checkmark icon and success state
6. **Given** deployment is in progress, **When** user clicks "View build details", **Then** terminal-style log expands showing monospaced build output in light background
7. **Given** terminal log is expanded, **When** user clicks "Hide details", **Then** log collapses back to default state
8. **Given** terminal log is visible, **When** content exceeds panel height, **Then** log is scrollable with mouse and keyboard
9. **Given** deployment runs, **When** tech stack is detected (e.g., Next.js, Laravel), **Then** step updates to show "Detected tech stack: [framework name]"
10. **Given** all steps complete successfully, **When** deployment finishes, **Then** success message displays: "Your site is live in Preview mode. You can now explore and edit it." with "Go to Preview" button
11. **Given** deployment succeeds and success message shows, **When** 2-3 seconds elapse or user clicks "Go to Preview", **Then** Deploy Panel closes and central canvas switches to Preview mode
12. **Given** deployment succeeds and panel closes, **When** user views the shell, **Then** top bar Preview toggle reflects Preview state, and inspector shows Theme Summary with theme name, thumbnail, and quick action links

---

### User Story 4 - Recover from Deployment Errors with AI Help (Priority: P2)

When a theme deployment fails (build error, manifest issue, dependency problem), the user is guided into a Chat-based troubleshooting flow where AI explains the problem and helps fix it, then allows re-deployment.

**Why this priority**: While critical for production use, this is secondary to successful deployment. Users need the happy path (P1) working first. However, error handling is essential for real-world usage and developer-uploaded themes that may have issues.

**Independent Test**: Can be tested by triggering a known deployment failure (invalid manifest, missing dependencies, build error), then verifying error display, Chat integration, AI explanation, and re-deploy flow. Delivers value by preventing users from getting stuck on errors.

**Acceptance Scenarios**:

1. **Given** deployment encounters a failure (e.g., build step fails), **When** error occurs, **Then** failing step shows error icon and red text describing the failure (e.g., "Build failed at: npm run build")
2. **Given** deployment fails, **When** error occurs, **Then** terminal log automatically expands, scrolls to error lines, and subtly highlights them
3. **Given** deployment fails, **When** error panel shows, **Then** summary text displays: "We couldn't finish the deployment. Let's fix this together." with "Open AI help to fix this" button
4. **Given** user sees deployment error, **When** they click "Open AI help to fix this", **Then** Chat panel opens within the existing shell (left side or overlay)
5. **Given** Chat panel opens from deployment error, **When** Chat initializes, **Then** it receives context: selected theme ID, failing step name, and extracted error snippet from logs
6. **Given** Chat panel opens with error context, **When** Chat loads, **Then** first AI message explains in plain English what went wrong and proposes next steps (e.g., "Your theme is missing a manifest field. I can propose a fix.")
7. **Given** user is in Chat after deployment failure, **When** they see "Deploy again" button or chat command, **Then** they can click it to re-trigger the Deploy Panel flow
8. **Given** user clicks "Deploy again" from Chat, **When** re-deployment starts, **Then** Deploy Panel opens with steps reset, logs cleared (or new session), and new deployment attempt begins
9. **Given** re-deployment runs, **When** it completes, **Then** success/error behavior follows same rules as initial deployment (steps 10-12 of User Story 3 or steps 1-3 of User Story 4)
10. **Given** user closes Deploy Panel without opening Chat, **When** panel closes with error state, **Then** subtle warning persists in Themes page or top bar: "Last deployment failed – open AI help to resolve."

---

### Edge Cases

- **What happens when user tries to deploy a theme while another deployment is in progress?**
  Interactions on My Themes background are frozen while Deploy Panel is open. Only one deployment can run at a time. If user somehow triggers a second deploy, system should show message "Deployment already in progress" and prevent duplicate runs.

- **What happens when user loses internet connection during deployment?**
  Deploy Panel should detect connection loss, pause progress, show "Connection lost" message, and allow retry when connection resumes. If connection is lost for >30 seconds, treat as deployment failure and offer AI help. When user retries (either via "Retry" button or Chat "Deploy again"), deployment restarts from beginning with clean state (no partial resume).

- **What happens when a purchased theme is incompatible with PMC Engine?**
  Purchased themes should be pre-validated by PackMyCode marketplace before they appear in user's account. If an incompatible theme somehow appears, attempting deployment should fail at "Detecting tech stack" step with clear error message directing user to contact support or theme author.

- **What happens when uploaded theme has missing or partial files?**
  Validation during upload should catch missing manifest. If validation passes but files are incomplete, deployment will fail at "Preparing build environment" or "Building your site" step. Terminal log will show specific missing files/dependencies, and AI Chat can guide user to fix.

- **What happens when user navigates away from Themes page while deployment is running?**
  Deploy Panel should remain visible as a modal/overlay regardless of which left rail tab is active (shell should not unmount Deploy Panel). If user force-closes browser/tab, deployment continues on backend but user will see "Last deployment failed" warning on next visit.

- **What happens when user tries to deploy the currently active theme again?**
  System allows re-deployment (useful for testing changes). Show confirmation: "This theme is already active. Re-deploying will restart your site. Continue?" If user confirms, proceed with deployment.

- **What happens when theme requires environment variables or API keys?**
  During deployment, if system detects missing required config (from manifest), pause at "Preparing build environment" step and prompt user in Deploy Panel or Chat to provide missing values before continuing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-006-001**: System MUST add a "Themes" icon and label to the left rail navigation within the PMC Engine shell
- **FR-006-002**: System MUST display Themes page in central canvas when user clicks Themes icon, while preserving top bar, left rail, and inspector shell components
- **FR-006-003**: Themes page MUST display header with title "Themes for this site" and subtitle help text explaining theme selection and upload
- **FR-006-004**: Themes page MUST display upload area card at top with "Upload theme" title, dropzone, "Browse files" button, and short explanation of requirements
- **FR-006-005**: System MUST support theme file upload via drag-and-drop onto dropzone OR file picker dialog
- **FR-006-006**: System MUST show inline upload progress with progress bar or spinner and text "Uploading and validating theme..." during theme upload
- **FR-006-007**: System MUST validate uploaded theme files for: file size (max 50 MB), file type (must be .zip), and valid PMC Engine manifest containing required fields (name, version, framework)
- **FR-006-007a**: System MUST deploy all themes (purchased and uploaded) in sandboxed environment with restricted permissions to prevent malicious code execution; pre-upload virus scanning is NOT required
- **FR-006-008**: System MUST show friendly inline error messages for validation failures: file too large, non-zip file, or missing/invalid manifest
- **FR-006-009**: System MUST NOT add invalid themes to My Themes list - only successfully validated themes appear
- **FR-006-010**: System MUST show inline success message "Theme uploaded successfully. You can now select it from My Themes below." when upload and validation succeed
- **FR-006-011**: Themes page MUST display "My Themes" list below upload area, combining purchased PMC Engine-compatible themes and uploaded themes in unified grid/list view
- **FR-006-011a**: System MUST cache purchased themes from PackMyCode locally and display cached data by default when user opens Themes page (no real-time API call on every page load)
- **FR-006-011b**: Themes page MUST display "Refresh themes" button that, when clicked, re-syncs purchased themes from PackMyCode API and updates My Themes list with any newly purchased themes
- **FR-006-012**: Each theme card MUST display: thumbnail (or placeholder), theme name, short description (one line, truncated with ellipsis), and tag chips (e.g., SaaS, Portfolio, Blog)
- **FR-006-013**: Each theme card MUST display status pill indicating: "Active on this site" (currently deployed theme), "Available" (other themes), or "Uploaded theme" badge (for user-uploaded themes)
- **FR-006-014**: Each theme card MUST display action buttons: primary "Next" or "Use this theme" button, and optional "View details" secondary link
- **FR-006-015**: My Themes list MUST support real-time search filtering by theme name via search input labeled "Search themes..."
- **FR-006-016**: My Themes list MUST support optional tag filters (SaaS, Portfolio, Blog, One-page) to show only themes matching selected tags
- **FR-006-017**: System MUST show light confirmation note "We'll deploy this theme as the base for your site. You can change content later." when user clicks "Next/Use this theme"
- **FR-006-018**: System MUST open AI Deploy Panel (as right-side slide-in panel OR centered modal overlay) immediately after user confirms theme selection
- **FR-006-019**: System MUST freeze interactions on My Themes page background while Deploy Panel is open to prevent double-click and race conditions
- **FR-006-020**: Deploy Panel MUST display title "Setting up your site" and intro text "PMC Engine is analyzing your theme and deploying the first version of your site. This usually takes under a minute."
- **FR-006-021**: Deploy Panel MUST display step-by-step status list in vertical timeline style with these steps: "Detecting tech stack...", "Preparing build environment...", "Building your site...", "Deploying to PMC Engine...", "Done – first version is live."
- **FR-006-022**: Each deployment step MUST show state icon: idle (dot), in progress (spinner), success (checkmark), or error (warning icon)
- **FR-006-023**: System MUST update step status text live during deployment (e.g., "Detecting tech stack..." updates to "Detected tech stack: Next.js")
- **FR-006-024**: Deploy Panel MUST display terminal-style log container below steps, collapsed by default, with "View build details" link/button to expand
- **FR-006-025**: Terminal log MUST display monospaced build output in light (not dark) background when expanded, with scrollable content if output exceeds panel height
- **FR-006-026**: Terminal log MUST support keyboard scrolling (PageUp, PageDown, arrow keys) and show "Hide details" button to collapse back
- **FR-006-027**: Deploy Panel MAY display "Cancel deployment" button (optional, can be disabled at unsafe steps where cancellation would corrupt state)
- **FR-006-028**: System MUST detect theme's tech stack during deployment and update step text with detected framework (e.g., "Detected tech stack: Node.js / Next.js")
- **FR-006-029**: System MUST show all steps with green checkmarks/success icons when deployment completes successfully
- **FR-006-030**: System MUST display success message "Your site is live in Preview mode. You can now explore and edit it." with "Go to Preview" button when deployment succeeds
- **FR-006-031**: System MUST auto-close Deploy Panel after 2-3 seconds on success, OR immediately when user clicks "Go to Preview" button
- **FR-006-032**: System MUST switch central canvas to Preview mode of newly deployed site when Deploy Panel closes after success
- **FR-006-033**: System MUST update top bar Preview toggle to reflect Preview state when deployment succeeds and panel closes
- **FR-006-034**: System MUST update inspector to show Theme Summary panel when deployment succeeds, displaying: active theme name + thumbnail, "Open Pages & Sections" link, "Open AI Coding mode" link, "Edit Business Profile" link
- **FR-006-035**: System MUST NOT automatically open Chat panel on successful deployment (user stays in Preview mode)
- **FR-006-036**: System MUST display error icon and red text on failing step when deployment encounters any failure (e.g., "Build failed at: npm run build")
- **FR-006-037**: System MUST automatically expand terminal log, scroll to relevant error lines, and subtly highlight them when deployment fails
- **FR-006-038**: System MUST display error summary text "We couldn't finish the deployment. Let's fix this together." with "Open AI help to fix this" button when deployment fails
- **FR-006-039**: System MUST open Chat panel within existing shell (NOT separate app) when user clicks "Open AI help to fix this" button
- **FR-006-040**: Chat panel MUST receive deployment failure context when opened from error: selected theme ID, failing step name, and extracted error snippet from logs
- **FR-006-041**: Chat panel MUST display initial AI message explaining error in plain English and proposing next steps (e.g., "Your theme is missing a manifest field. I can propose a fix.") when opened from deployment error
- **FR-006-042**: Chat panel MUST display "Deploy again" button or chat command that allows user to re-trigger deployment after fixing issues
- **FR-006-043**: System MUST re-open Deploy Panel with all steps reset to idle state and logs cleared (new deployment session) when user initiates re-deployment from Chat; deployment MUST restart from beginning (no partial resume from failed steps)
- **FR-006-044**: System MUST follow same success/failure behavior rules for re-deployment as initial deployment (recursive: steps FR-006-029 to FR-006-034 for success, or FR-006-036 to FR-006-041 for failure)
- **FR-006-045**: System MUST display persistent subtle warning "Last deployment failed – open AI help to resolve." in Themes page or top bar if user closes Deploy Panel without opening Chat after error
- **FR-006-046**: Themes page MUST NOT display marketplace UI elements: no pricing, no seller profiles, no author bios, no "sell your theme" flows
- **FR-006-047**: All interactive elements (buttons, cards, links) MUST meet WCAG AA contrast requirements and support keyboard focus (Tab, Shift+Tab) with visible focus outlines
- **FR-006-048**: Terminal log MUST use semantic HTML elements (`<pre>` or `<code>`) with appropriate ARIA labeling for accessibility
- **FR-006-049**: Deploy Panel (if modal) MUST implement focus trap, `role="dialog"`, and `aria-modal="true"` for accessibility
- **FR-006-050**: Deploy Panel (if sidebar) MUST be announced as "Deployment status" using `aria-labelledby` for accessibility
- **FR-006-051**: All deployment step status updates MUST use ARIA live regions to announce changes to screen readers (e.g., "Analyzing theme... updated to: Detected tech stack: Node.js")
- **FR-006-052**: System MUST log key deployment lifecycle events for monitoring and debugging: deployment session start (with theme ID, site ID, timestamp), each step completion/failure (step name, status, duration), errors (failing step, error message, error snippet), final deployment state (success/failed/cancelled), and user actions (theme selection, "Open AI help" clicks, "Deploy again" triggers)
- **FR-006-053**: System MUST NOT log full terminal output to persistent storage by default; terminal logs are ephemeral per deployment session and viewable only in Deploy Panel UI during and immediately after deployment

### Key Entities

- **Theme**: Represents a PMC Engine-compatible website template/design, with attributes: unique ID, name, description, thumbnail/preview image, tags (categories like SaaS, Portfolio, Blog), source (purchased from PackMyCode OR uploaded by user), compatibility manifest with required fields (name, version, framework) and optional fields (dependencies, config, description), deployment status (available, active on site, failed), and related site ID
- **Upload Session**: Temporary entity representing an in-progress theme upload, with attributes: upload ID, file reference, progress percentage (0-100), validation state (pending, validating, success, error), error message (if validation fails), and associated theme ID upon success
- **Deployment Session**: Represents a theme deployment process, with attributes: deployment ID, theme ID being deployed, site ID target, current step (tech stack detection, environment prep, build, deploy, done), step statuses (idle, in progress, success, error), tech stack detected (framework name/version), build logs (raw terminal output), error details (failing step, error message, error snippet), and final state (success, failed, cancelled)
- **Deployment Log**: Raw build/deploy output, with attributes: log ID, deployment session ID, timestamp, log level (info, warning, error), log source (system, build tool, deployment service), and message text
- **Theme Summary**: Read-only view entity shown in inspector after successful deployment, with attributes: active theme ID, active theme name, active theme thumbnail, and quick action links (Pages & Sections, AI Coding mode, Business Profile)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-006-001**: Users can complete theme browsing (viewing all purchased and uploaded themes with search/filter) and locate a desired theme in under 30 seconds
- **SC-006-002**: Users can successfully upload a valid PMC Engine theme zip file (drag-and-drop or file picker) and see it appear in My Themes list in under 10 seconds for files up to 50 MB
- **SC-006-003**: Invalid theme uploads (wrong file type, missing manifest, oversized file) show clear error messages within 3 seconds, and users understand what went wrong without needing support
- **SC-006-004**: Users can initiate theme deployment and see the Deploy Panel with live step-by-step progress within 2 seconds of clicking "Use this theme"
- **SC-006-005**: Successful theme deployments complete end-to-end (tech stack detection through final deploy) in under 90 seconds for typical themes, with Preview mode automatically activated
- **SC-006-006**: When theme deployment succeeds, 95% of users successfully view their new site in Preview mode without additional clicks or confusion (measured by tracking Preview mode entry after deploy)
- **SC-006-007**: When theme deployment fails, 90% of users click "Open AI help to fix this" and engage with Chat-based troubleshooting (measured by Chat open rate after deploy errors)
- **SC-006-008**: Users who encounter deployment errors and use Chat assistance successfully re-deploy within 3 attempts in 80% of cases (measured by tracking re-deploy success rate)
- **SC-006-009**: Terminal build logs (when expanded) are readable and understandable to technical users (developers), enabling them to diagnose issues without external documentation in 70% of error cases
- **SC-006-010**: Themes page maintains consistent shell layout (top bar, left rail, inspector remain unchanged) 100% of the time, with no layout shifts or unexpected behavior when navigating to/from Themes
- **SC-006-011**: All accessibility requirements (WCAG AA contrast, keyboard navigation, ARIA live regions, focus management) pass automated and manual accessibility audits with zero critical violations
- **SC-006-012**: Zero users accidentally trigger duplicate deployments due to double-clicks or race conditions (interactions frozen correctly during deployment)
