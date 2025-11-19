# Research: Themes Page, Theme Upload & AI Deploy Panel

**Feature**: 006-themes-and-deploy
**Date**: 2025-11-18
**Purpose**: Technical research to resolve unknowns from plan.md Technical Context

## Research Areas

### 1. Theme Manifest Validation

**Decision**: Use JSON Schema Draft 7 for manifest validation with required fields: `name` (string), `version` (semver string), `framework` (enum)

**Rationale**:
- JSON Schema provides declarative validation that's easy to test and maintain
- Semver versioning (e.g., "1.0.0") enables future compatibility checks and upgrade paths
- Framework enum ensures only supported stacks are accepted (e.g., "next.js", "laravel", "gatsby", "static")
- Validation happens client-side before upload completes, providing instant feedback

**Manifest Structure (JSON)**:
```json
{
  "name": "string (required, 1-100 chars, alphanumeric + spaces/hyphens)",
  "version": "string (required, semver format: X.Y.Z)",
  "framework": "enum (required, one of: next.js, gatsby, laravel, wordpress, static)",
  "description": "string (optional, max 500 chars)",
  "author": "string (optional)",
  "license": "string (optional, e.g., MIT, GPL-3.0)",
  "dependencies": {
    "node": "string (optional, semver range, e.g., >=14.0.0)",
    "npm_packages": "object (optional, package.json-style deps)"
  },
  "config": {
    "env_vars": "array of strings (optional, required env var names)",
    "build_command": "string (optional, default: npm run build)",
    "output_dir": "string (optional, default: dist or build)"
  }
}
```

**Validation Library**: Use `ajv` (fastest JSON Schema validator for JavaScript)
- Compile schema once at app startup
- Validate on file parse (after unzipping manifest.json from uploaded .zip)
- Error messages map to user-friendly text per FR-006-008

**Alternatives Considered**:
- **Custom validation functions**: Rejected due to higher maintenance burden and lack of declarative structure
- **TypeScript interfaces only**: Rejected because runtime validation needed for uploaded files
- **XML/YAML manifests**: Rejected to keep parsing simple; JSON is universal in modern web development

---

### 2. Sandboxed Deployment Strategy

**Decision**: Use sandboxed `<iframe>` with restrictive CSP (Content Security Policy) and `sandbox` attribute for theme preview/deployment

**Rationale**:
- Iframe sandboxing prevents uploaded theme code from accessing parent window, cookies, localStorage, or making cross-origin requests
- CSP headers block inline scripts, unsafe-eval, and restrict resource loading to theme-specific origins
- Browser-native security model (no server-side VM required for MVP)
- Deployed site runs in isolated context; malicious code cannot affect editor shell

**Implementation Details**:

**HTML Sandbox Attributes**:
```html
<iframe
  sandbox="allow-scripts allow-same-origin"
  csp="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  src="/deployed-site/index.html"
></iframe>
```

- `allow-scripts`: Necessary for theme JavaScript to run
- `allow-same-origin`: Allows theme to access its own localStorage (scoped to iframe origin)
- `csp` attribute: Restricts resource loading; no `unsafe-eval`, no external script origins except theme's own domain

**Deployment Flow**:
1. Upload .zip → Extract to in-memory file system (using `jszip` library)
2. Validate manifest.json
3. Detect framework from manifest
4. Run mock build process (simulate steps for MVP; real build in future backend)
5. Inject built files into sandboxed iframe with `srcdoc` or Blob URL
6. Monitor iframe load events to track deployment progress

**Security Boundaries**:
- Theme code cannot call `window.parent` or `window.top` (sandbox prevents access)
- Theme cannot read editor's localStorage/cookies (different origin context)
- Theme cannot make fetch() requests to arbitrary domains (CSP restricts)
- XSS attacks in theme only affect sandbox, not editor

**Alternatives Considered**:
- **Service Workers for isolation**: Rejected due to complexity; service workers don't provide memory isolation
- **Web Workers for build**: Rejected because themes need DOM access for rendering
- **Server-side VM (Docker/Firecracker)**: Ideal for production but overkill for MVP; deferred to backend iteration

---

### 3. PackMyCode API Integration

**Decision**: Use cached GET requests with manual refresh button; localStorage stores theme metadata, IndexedDB stores thumbnails/large assets

**Rationale**:
- PackMyCode API likely returns JSON list of purchased themes with metadata (name, description, thumbnail URL, download URL)
- Caching prevents rate limiting and improves page load performance (FR-006-011a)
- Manual refresh gives users control over sync timing (after purchasing new themes)
- localStorage sufficient for metadata (<10 MB for 50 themes); IndexedDB handles binary data (thumbnails)

**API Contract (Assumed)**:

**Endpoint**: `GET /api/v1/users/{userId}/purchased-themes`
**Headers**: `Authorization: Bearer {apiKey}`
**Response**:
```json
{
  "themes": [
    {
      "id": "theme-uuid",
      "name": "SaaS Pro Theme",
      "description": "Modern SaaS landing page...",
      "tags": ["saas", "landing"],
      "thumbnail_url": "https://cdn.packmycode.com/thumbs/...",
      "download_url": "https://cdn.packmycode.com/themes/theme-uuid.zip",
      "version": "1.2.0",
      "framework": "next.js",
      "purchased_at": "2025-11-10T14:30:00Z"
    },
    ...
  ]
}
```

**Caching Strategy**:
1. On first Themes page load → Fetch from PackMyCode API
2. Store response in `localStorage` under key `pmc_purchased_themes_{userId}`
3. Store thumbnails in IndexedDB under key `theme_thumbnails`
4. On subsequent loads → Read from cache (no API call)
5. "Refresh themes" button → Re-fetch API, update cache, merge with uploaded themes

**Cache Invalidation**:
- Manual refresh button (user-triggered)
- Optional: TTL of 24 hours (auto-refresh if cache older than 1 day)
- Clear cache on logout

**Error Handling**:
- API 401 Unauthorized → Prompt user to re-authenticate or provide API key in settings
- API 429 Rate Limit → Show friendly message: "Too many requests. Please wait a moment and refresh again."
- API 5xx Server Error → Fall back to cached data with warning banner: "Couldn't sync latest themes. Showing cached list."

**Alternatives Considered**:
- **Real-time sync via WebSocket**: Rejected as overkill; users don't purchase themes frequently enough to justify persistent connections
- **Polling every N minutes**: Rejected to avoid unnecessary API calls; manual refresh is sufficient
- **No caching (always fetch)**: Rejected due to latency and rate limiting concerns

---

### 4. Large File Upload Handling (50 MB Limit)

**Decision**: Use `FormData` + `XMLHttpRequest` (or `fetch` with progress tracking via `ReadableStream`) for chunked upload with progress bar

**Rationale**:
- 50 MB files can take 5-10 seconds to upload on typical broadband (FR-006-002: <10s target)
- Progress feedback essential for user experience (show percentage, not just spinner)
- Browser-native file upload via `<input type="file">` handles large files efficiently
- No need for chunked upload in MVP (50 MB within single-request limits for most servers)

**Implementation**:

**Frontend (Upload Component)**:
```typescript
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('theme', file);

  const xhr = new XMLHttpRequest();

  // Progress tracking
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percentComplete = (e.loaded / e.total) * 100;
      setUploadProgress(percentComplete);
    }
  });

  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      // Handle successful upload
    }
  });

  xhr.open('POST', '/api/themes/upload');
  xhr.send(formData);
};
```

**Validation Sequence**:
1. Client-side checks BEFORE upload:
   - File size <= 50 MB (FR-006-007)
   - File type === 'application/zip' or ends with '.zip'
   - If fails → Show error immediately (no upload attempt)

2. Upload file to backend (or mock endpoint in MVP)

3. Backend/service validates:
   - Unzip file
   - Check manifest.json exists
   - Validate manifest schema (JSON Schema)
   - If fails → Return 400 Bad Request with error details

4. Success → Return theme ID and metadata

**Progress UI States**:
- Idle: "Drag and drop or browse files"
- Uploading: Progress bar (0-100%) + "Uploading... 45%"
- Validating: Spinner + "Validating theme..."
- Success: Checkmark + "Theme uploaded successfully"
- Error: X icon + Friendly error message

**Alternatives Considered**:
- **Chunked upload (split 50 MB into 5 MB chunks)**: Rejected as unnecessary for MVP; adds complexity without clear benefit for 50 MB limit
- **Direct S3 upload**: Ideal for production but requires backend; deferred
- **File size limit < 50 MB**: Rejected; 50 MB reasonable for theme assets (images, fonts, compiled JS)

---

### 5. Deployment Progress Tracking

**Decision**: Use Server-Sent Events (SSE) for real-time progress updates if backend available; fall back to polling every 500ms for MVP mock deployment

**Rationale**:
- SSE provides server-push updates without WebSocket complexity (HTTP-based, auto-reconnect)
- Polling acceptable for MVP with fast interval (500ms) to simulate real-time feel
- Deployment steps update every 2-10 seconds (total 30-90s), so 500ms poll is sufficient
- Mock deployment in MVP can use `setTimeout` to simulate step progression

**SSE Implementation (Future Backend)**:

**Backend Endpoint**: `GET /api/deployments/{deploymentId}/stream`
**Response**: `Content-Type: text/event-stream`

```text
event: step_update
data: {"step": "detecting_stack", "status": "in_progress", "message": "Detecting tech stack..."}

event: step_update
data: {"step": "detecting_stack", "status": "success", "message": "Detected tech stack: Next.js", "duration_ms": 2400}

event: step_update
data: {"step": "building", "status": "in_progress", "message": "Building your site..."}

event: log
data: {"level": "info", "message": "> npm run build", "timestamp": "2025-11-18T15:30:45Z"}

event: complete
data: {"status": "success", "deployed_url": "https://preview.pmcengine.com/site-123"}
```

**Frontend SSE Client**:
```typescript
const eventSource = new EventSource(`/api/deployments/${deploymentId}/stream`);

eventSource.addEventListener('step_update', (e) => {
  const data = JSON.parse(e.data);
  updateDeploymentStep(data.step, data.status, data.message);
});

eventSource.addEventListener('log', (e) => {
  const data = JSON.parse(e.data);
  appendTerminalLog(data.message);
});

eventSource.addEventListener('complete', (e) => {
  const data = JSON.parse(e.data);
  finishDeployment(data.status, data.deployed_url);
  eventSource.close();
});
```

**Polling Implementation (MVP)**:

```typescript
const pollDeploymentStatus = async (deploymentId: string) => {
  const intervalId = setInterval(async () => {
    const response = await fetch(`/api/deployments/${deploymentId}/status`);
    const data = await response.json();

    updateDeploymentSteps(data.steps);

    if (data.status === 'complete' || data.status === 'failed') {
      clearInterval(intervalId);
      finishDeployment(data.status);
    }
  }, 500); // Poll every 500ms
};
```

**Mock Deployment (MVP)**:
```typescript
const mockDeployment = async (themeId: string) => {
  const steps = [
    { name: 'detecting_stack', duration: 2000, message: 'Detected tech stack: Next.js' },
    { name: 'preparing_env', duration: 5000, message: 'Environment prepared' },
    { name: 'building', duration: 30000, message: 'Build complete' },
    { name: 'deploying', duration: 10000, message: 'Deployment successful' }
  ];

  for (const step of steps) {
    await sleep(step.duration);
    updateDeploymentStep(step.name, 'success', step.message);
  }

  return { status: 'success', deployedUrl: '/preview' };
};
```

**Alternatives Considered**:
- **WebSockets**: More complex than SSE; requires bidirectional communication which isn't needed (deployment is server → client only)
- **Long polling**: Less efficient than SSE or standard polling; rejected
- **No real-time updates**: Rejected; user needs progress feedback per FR-006-023 (live status text updates)

---

## Summary of Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Manifest Validation** | JSON Schema Draft 7 with required fields: name, version, framework | Declarative, testable, client-side validation; semver for future compatibility |
| **Sandboxed Deployment** | Iframe with `sandbox` attribute + CSP headers | Browser-native security; prevents XSS/code injection in uploaded themes |
| **PackMyCode Integration** | Cached GET requests with manual refresh; localStorage + IndexedDB | Reduces API calls, prevents rate limiting, user-controlled sync |
| **File Upload** | FormData + XMLHttpRequest with progress tracking | Browser-native, supports large files (50 MB), progress feedback for UX |
| **Deployment Progress** | SSE for future backend; 500ms polling for MVP mock | Real-time feel without WebSocket complexity; polling sufficient for 30-90s deployments |

---

## Open Questions Resolved

1. **How to validate uploaded themes?**
   ✅ JSON Schema validation for manifest.json with 3 required fields (name, version, framework)

2. **How to safely deploy user-uploaded code?**
   ✅ Sandboxed iframe with CSP headers; prevents access to editor context

3. **How to sync with PackMyCode without overwhelming API?**
   ✅ Cache-first strategy with manual refresh button; localStorage for metadata

4. **How to handle 50 MB file uploads?**
   ✅ Standard FormData upload with progress tracking; no chunking needed for MVP

5. **How to show real-time deployment progress?**
   ✅ SSE for production; 500ms polling for MVP mock deployment

---

## Next Steps

Proceed to **Phase 1: Design & Contracts**
- Generate `data-model.md` (Theme, UploadSession, DeploymentSession, DeploymentLog, ThemeSummary entities)
- Generate `contracts/theme-api.yaml` (OpenAPI spec for theme CRUD)
- Generate `contracts/deployment-api.yaml` (OpenAPI spec for deployment orchestration)
- Generate `quickstart.md` (developer implementation guide)
- Update `.claude/CLAUDE.md` agent context with new technologies (ajv, jszip, etc.)
