# Data Model: Themes Page, Theme Upload & AI Deploy Panel

**Feature**: 006-themes-and-deploy
**Date**: 2025-11-18
**Source**: Extracted from spec.md Key Entities + research.md decisions

## Entity Overview

This feature introduces 5 core entities to manage themes, uploads, and deployments:

1. **Theme** - Represents a PMC Engine-compatible website template
2. **UploadSession** - Temporary entity tracking in-progress theme uploads
3. **DeploymentSession** - Represents a theme deployment process
4. **DeploymentLog** - Raw build/deploy output for debugging
5. **ThemeSummary** - Read-only view for inspector panel after successful deployment

---

## 1. Theme

**Purpose**: Represents a PMC Engine-compatible website template/design, either purchased from PackMyCode marketplace or uploaded by the user.

### Fields

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `id` | string (UUID) | Yes | Unique identifier for the theme | Auto-generated on creation |
| `name` | string | Yes | Human-readable theme name | 1-100 characters, from manifest.json |
| `description` | string | No | Short description of theme purpose/style | Max 500 characters, from manifest or PackMyCode API |
| `version` | string (semver) | Yes | Theme version in semver format | Must match `X.Y.Z` pattern (e.g., "1.2.0") |
| `framework` | enum string | Yes | Tech stack/framework this theme uses | One of: "next.js", "gatsby", "laravel", "wordpress", "static" |
| `thumbnailUrl` | string (URL) | No | Preview image URL | Valid HTTP(S) URL or data URI |
| `tags` | array of strings | No | Category tags for filtering | e.g., ["saas", "portfolio", "blog"] |
| `source` | enum string | Yes | Origin of the theme | One of: "purchased", "uploaded" |
| `sourceMetadata` | object | No | Source-specific details | See below |
| `deploymentStatus` | enum string | Yes | Current deployment state for this site | One of: "available", "active", "failed", "deploying" |
| `siteId` | string (UUID) | Yes | Site this theme is associated with | Foreign key to Site entity |
| `uploadedBy` | string (UUID) | No | User ID who uploaded (null for purchased) | Foreign key to User entity |
| `createdAt` | timestamp | Yes | When theme was added to user's library | ISO 8601 format |
| `updatedAt` | timestamp | Yes | Last modification timestamp | ISO 8601 format |

### Source Metadata Structure

**For `source: "purchased"`**:
```typescript
{
  purchaseId: string;          // PackMyCode purchase transaction ID
  purchasedAt: string;         // ISO 8601 timestamp
  downloadUrl: string;         // CDN URL for theme .zip file
  marketplaceUrl: string;      // Link to theme page on PackMyCode
}
```

**For `source: "uploaded"`**:
```typescript
{
  uploadSessionId: string;     // Reference to UploadSession that created this theme
  originalFilename: string;    // Original .zip filename
  fileSizeBytes: number;       // Size of uploaded file
  storagePath: string;         // Where theme files are stored (e.g., IndexedDB key or S3 path)
}
```

### State Transitions

```text
available → deploying → active
          ↓
          failed → deploying (retry)
```

- **available**: Theme exists in library but not deployed to this site
- **deploying**: Deployment in progress (corresponds to active DeploymentSession)
- **active**: Currently deployed and running on this site (only ONE theme can be active per site)
- **failed**: Last deployment attempt failed (error details in DeploymentSession)

### Relationships

- **One** Theme → **Many** DeploymentSessions (historical deployments)
- **Many** Themes → **One** Site (multiple themes in library, but one active)

### Indexes

- Primary key: `id`
- Secondary indexes:
  - `(siteId, deploymentStatus='active')` - Find active theme for a site (unique constraint)
  - `(siteId, source)` - Filter purchased vs uploaded themes
  - `(siteId, tags)` - Tag-based filtering for search

---

## 2. UploadSession

**Purpose**: Temporary entity representing an in-progress theme upload, tracking validation and progress.

### Fields

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `id` | string (UUID) | Yes | Unique upload session identifier | Auto-generated |
| `siteId` | string (UUID) | Yes | Site uploading to | Foreign key to Site |
| `userId` | string (UUID) | Yes | User performing upload | Foreign key to User |
| `fileName` | string | Yes | Original filename of uploaded .zip | As provided by browser |
| `fileSizeBytes` | number | Yes | Size of upload file | Must be <= 52,428,800 (50 MB) |
| `fileReference` | Blob or File | Yes | In-memory reference to uploaded file | Browser File object |
| `progressPercent` | number | Yes | Upload progress (0-100) | Integer 0-100 |
| `validationState` | enum string | Yes | Current validation status | One of: "pending", "validating", "success", "error" |
| `errorMessage` | string | No | Error details if validation failed | User-friendly message (not stack trace) |
| `manifestData` | object | No | Parsed manifest.json after extraction | null until validation starts |
| `createdAt` | timestamp | Yes | When upload session started | ISO 8601 format |
| `completedAt` | timestamp | No | When upload/validation finished | null if still in progress |

### State Transitions

```text
pending → validating → success (creates Theme entity)
        ↓
        error (shows error message, no Theme created)
```

- **pending**: File selected, upload not yet started or in progress
- **validating**: File uploaded, extracting .zip and checking manifest
- **success**: Validation passed, Theme entity created, session can be cleaned up
- **error**: Validation failed (file too large, wrong type, invalid manifest, etc.)

### Lifecycle

- **Created**: When user selects file via dropzone or file picker
- **Destroyed**: After 5 minutes of completion (success or error) OR when user navigates away from Themes page
- **Storage**: In-memory only (Zustand store); not persisted to localStorage/IndexedDB

### Validation Flow

1. Create UploadSession with `validationState: "pending"`
2. Check file size (<= 50 MB) and type (application/zip)
3. If fails → Set `validationState: "error"`, set `errorMessage`
4. Start upload (if needed), update `progressPercent`
5. Set `validationState: "validating"`
6. Extract .zip using `jszip`
7. Parse `manifest.json`
8. Validate manifest against JSON Schema (required: name, version, framework)
9. If valid → Set `validationState: "success"`, create Theme entity
10. If invalid → Set `validationState: "error"`, set `errorMessage`

---

## 3. DeploymentSession

**Purpose**: Represents a theme deployment process, tracking all steps, logs, errors, and final state.

### Fields

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `id` | string (UUID) | Yes | Unique deployment session identifier | Auto-generated |
| `themeId` | string (UUID) | Yes | Theme being deployed | Foreign key to Theme |
| `siteId` | string (UUID) | Yes | Site deploying to | Foreign key to Site |
| `userId` | string (UUID) | Yes | User who initiated deployment | Foreign key to User |
| `currentStep` | enum string | Yes | Current deployment step | See step enum below |
| `steps` | array of StepStatus | Yes | Status of all deployment steps | See StepStatus structure |
| `techStackDetected` | string | No | Detected framework/tech stack | e.g., "Next.js 13.4", "Laravel 10.x" |
| `buildLogs` | array of strings | Yes | Raw terminal output lines | Ephemeral; max 1000 lines |
| `errorDetails` | object | No | Error information if deployment failed | See ErrorDetails structure |
| `finalState` | enum string | Yes | Final deployment outcome | One of: "success", "failed", "cancelled", "in_progress" |
| `deployedUrl` | string (URL) | No | Preview URL if deployment succeeded | e.g., "/preview" or sandbox iframe src |
| `startedAt` | timestamp | Yes | When deployment began | ISO 8601 format |
| `completedAt` | timestamp | No | When deployment finished | null if still in progress |
| `durationMs` | number | No | Total deployment time in milliseconds | Calculated: completedAt - startedAt |

### Step Enum

```typescript
type DeploymentStep =
  | "detecting_stack"
  | "preparing_env"
  | "building"
  | "deploying"
  | "done";
```

### StepStatus Structure

```typescript
interface StepStatus {
  name: DeploymentStep;
  status: "idle" | "in_progress" | "success" | "error";
  message: string;              // Human-readable status text
  startedAt?: timestamp;        // When step started
  completedAt?: timestamp;      // When step finished
  durationMs?: number;          // Time spent on this step
}
```

### ErrorDetails Structure

```typescript
interface ErrorDetails {
  failingStep: DeploymentStep;       // Which step failed
  errorMessage: string;              // High-level error description
  errorSnippet: string;              // Extract from logs (5-10 lines around error)
  errorCode?: string;                // Optional error code (e.g., "BUILD_FAILED", "MANIFEST_INVALID")
  suggestedAction?: string;          // What user should do next
}
```

### State Transitions

```text
in_progress (currentStep: detecting_stack)
     ↓
in_progress (currentStep: preparing_env)
     ↓
in_progress (currentStep: building)
     ↓
in_progress (currentStep: deploying)
     ↓
success (finalState: success) OR failed (finalState: failed)
```

- **in_progress**: Deployment actively running
- **success**: All steps completed successfully
- **failed**: One or more steps failed
- **cancelled**: User cancelled deployment (optional feature, may not be in MVP)

### Lifecycle

- **Created**: When user clicks "Use this theme" button
- **Updated**: Every time a step changes status (in_progress → success/error)
- **Destroyed**: After 24 hours (older sessions cleaned up for storage efficiency)
- **Storage**: IndexedDB for active session; key lifecycle events logged to persistent storage per FR-006-052

### Logging Strategy

Per FR-006-052 and FR-006-053:
- **Persistent logs**: Only key lifecycle events (deployment start, step completions, errors, final state)
- **Ephemeral logs**: Full terminal output (`buildLogs` array) stored only in-memory during session; discarded after completion
- **Log retention**: Deployment sessions kept for 24 hours for debugging; full logs viewable only during active session

---

## 4. DeploymentLog

**Purpose**: Raw build/deploy output for debugging and transparency.

### Fields

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `id` | string (UUID) | Yes | Unique log entry identifier | Auto-generated |
| `deploymentSessionId` | string (UUID) | Yes | Associated deployment session | Foreign key to DeploymentSession |
| `timestamp` | timestamp | Yes | When log entry was created | ISO 8601 format with milliseconds |
| `logLevel` | enum string | Yes | Severity level | One of: "info", "warning", "error", "debug" |
| `logSource` | enum string | Yes | Where log originated | One of: "system", "build_tool", "deployment_service" |
| `message` | string | Yes | Log message text | Raw output from build tool or system |

### Lifecycle

- **Created**: As deployment progresses, each build tool output line creates a log entry
- **Displayed**: In TerminalLog component (expandable section in Deploy Panel)
- **Destroyed**: When deployment session completes; logs NOT persisted to IndexedDB per FR-006-053
- **Storage**: In-memory only (Zustand store); max 1000 entries per session to prevent memory bloat

### Usage

- **Terminal Log UI**: Displays `message` field in monospaced font with syntax highlighting for errors/warnings
- **Error Snippet Extraction**: When deployment fails, extract 5-10 lines around first error-level log entry for `DeploymentSession.errorDetails.errorSnippet`
- **Filtering**: Allow users to filter by `logLevel` (e.g., show only errors/warnings)

---

## 5. ThemeSummary

**Purpose**: Read-only view entity shown in inspector after successful deployment, providing quick actions and metadata.

### Fields

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `activeThemeId` | string (UUID) | Yes | ID of currently active theme | Foreign key to Theme |
| `activeThemeName` | string | Yes | Name of active theme | From Theme.name |
| `activeThemeThumbnail` | string (URL) | No | Thumbnail URL of active theme | From Theme.thumbnailUrl |
| `quickActions` | array of QuickAction | Yes | Action links for user | See QuickAction structure |
| `deployedAt` | timestamp | Yes | When this theme was deployed | From most recent DeploymentSession.completedAt |
| `deploymentDuration` | number | Yes | How long deployment took | From DeploymentSession.durationMs |

### QuickAction Structure

```typescript
interface QuickAction {
  label: string;          // Button text (e.g., "Open Pages & Sections")
  icon?: string;          // Optional icon name
  action: string;         // Action type: "navigate" or "command"
  target: string;         // Where to navigate or command to execute
}
```

### Predefined Quick Actions

Per FR-006-034:
1. **"Open Pages & Sections"**: Navigate to Pages sidebar, open first page
2. **"Open AI Coding mode"**: Switch to Code Panel view mode
3. **"Edit Business Profile"**: Navigate to Settings → AI Training panel

### Lifecycle

- **Created**: When deployment completes successfully (DeploymentSession.finalState === "success")
- **Displayed**: In Inspector panel on right side of shell
- **Updated**: When user deploys a different theme
- **Storage**: Derived from Theme + DeploymentSession entities; no separate storage needed

### Computation

ThemeSummary is a computed/derived entity, not stored directly:

```typescript
function computeThemeSummary(siteId: string): ThemeSummary | null {
  const activeTheme = getActiveTheme(siteId);
  if (!activeTheme) return null;

  const latestDeployment = getMostRecentSuccessfulDeployment(activeTheme.id);
  if (!latestDeployment) return null;

  return {
    activeThemeId: activeTheme.id,
    activeThemeName: activeTheme.name,
    activeThemeThumbnail: activeTheme.thumbnailUrl,
    quickActions: [
      { label: "Open Pages & Sections", action: "navigate", target: "/pages" },
      { label: "Open AI Coding mode", action: "command", target: "switchToCodeMode" },
      { label: "Edit Business Profile", action: "navigate", target: "/settings/ai-training" }
    ],
    deployedAt: latestDeployment.completedAt!,
    deploymentDuration: latestDeployment.durationMs!
  };
}
```

---

## Entity Relationships Diagram

```text
User (1) ──┬── (M) Theme [via uploadedBy]
           │
           └── (M) UploadSession [via userId]
           │
           └── (M) DeploymentSession [via userId]

Site (1) ──┬── (M) Theme [via siteId]
           │   ├── deploymentStatus: "available"
           │   ├── deploymentStatus: "deploying"
           │   └── deploymentStatus: "active" [UNIQUE CONSTRAINT: only 1 per site]
           │
           └── (M) UploadSession [via siteId]
           │
           └── (M) DeploymentSession [via siteId]

Theme (1) ─── (M) DeploymentSession [via themeId]

DeploymentSession (1) ─── (M) DeploymentLog [via deploymentSessionId]

ThemeSummary (computed) ← Theme (active) + DeploymentSession (latest success)
```

---

## Storage Strategy

| Entity | Primary Storage | Secondary/Cache | Retention Policy |
|--------|-----------------|-----------------|------------------|
| Theme | IndexedDB (table: `themes`) | localStorage (metadata only) | Persistent until user deletes theme |
| UploadSession | Zustand store (in-memory) | None | 5 minutes after completion OR page navigation |
| DeploymentSession | IndexedDB (table: `deployment_sessions`) | Zustand for active session | 24 hours after completion |
| DeploymentLog | Zustand store (in-memory) | None | Cleared when deployment completes |
| ThemeSummary | Computed (not stored) | None | Recomputed on demand |

### IndexedDB Schema

**Database Name**: `pmc_engine_themes`
**Version**: 1

**Object Stores**:
1. `themes` (keyPath: `id`, indexes: `siteId`, `[siteId+deploymentStatus]`)
2. `deployment_sessions` (keyPath: `id`, indexes: `siteId`, `themeId`, `startedAt`)

**localStorage Keys**:
- `pmc_purchased_themes_{userId}`: Cached PackMyCode API response (JSON)
- `pmc_theme_cache_timestamp_{userId}`: When cache was last updated

---

## Validation Rules Summary

### Theme Entity
- `name`: 1-100 chars, required
- `version`: Semver format (X.Y.Z), required
- `framework`: Enum validation, required
- `deploymentStatus`: Only ONE theme per site can have status "active" (unique constraint)

### UploadSession Entity
- `fileSizeBytes`: Must be <= 52,428,800 (50 MB)
- `fileName`: Must end with `.zip`
- `progressPercent`: Integer 0-100

### DeploymentSession Entity
- `buildLogs`: Max 1000 entries to prevent memory bloat
- `currentStep`: Must follow sequential order (detecting_stack → preparing_env → building → deploying → done)

### DeploymentLog Entity
- `message`: Max 10,000 characters per entry (truncate if longer)

---

## Next Steps

Proceed to:
- Generate `/contracts/theme-api.yaml` (OpenAPI spec for theme CRUD)
- Generate `/contracts/deployment-api.yaml` (OpenAPI spec for deployment orchestration)
- Generate `quickstart.md` (developer implementation guide)
