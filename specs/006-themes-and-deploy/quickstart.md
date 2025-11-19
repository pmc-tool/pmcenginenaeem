# Developer Quickstart: Themes Page, Theme Upload & AI Deploy Panel

**Feature**: 006-themes-and-deploy
**Branch**: `006-themes-and-deploy`
**Last Updated**: 2025-11-18

## Overview

This guide helps developers implement the Themes management system for PMC Engine Editor. The feature adds:

1. **Themes Page** - New left rail tab showing purchased + uploaded themes
2. **Theme Upload** - Drag-and-drop validation with 50 MB limit
3. **AI Deploy Panel** - Step-by-step deployment UI with real-time progress
4. **PackMyCode Integration** - Cached theme synchronization

**Implementation Approach**: Frontend-only MVP using TypeScript + React + Zustand, with mock deployment service for demonstration.

## Prerequisites

- Node.js 18+ (use nvm: `nvm use 18`)
- TypeScript 5+ installed
- Existing PMC Engine Editor codebase
- Familiarity with React 18, Zustand, Radix UI patterns

## Key Technologies

```bash
# Install dependencies (add to package.json if not present)
npm install ajv jszip date-fns
npm install -D @types/jszip
```

| Technology | Purpose | Documentation |
|------------|---------|---------------|
| **ajv** | JSON Schema validation for theme manifests | https://ajv.js.org/ |
| **jszip** | Extract .zip theme files client-side | https://stuk.github.io/jszip/ |
| **date-fns** | Format deployment timestamps | https://date-fns.org/ |
| **Radix UI** | Accessible dialog/dropdown primitives | https://www.radix-ui.com/ |
| **Zustand** | State management (already in project) | https://zustand-demo.pmndrs.org/ |

## Quick Start

```bash
# 1. Checkout feature branch
git checkout 006-themes-and-deploy

# 2. Install new dependencies
npm install ajv jszip date-fns
npm install -D @types/jszip

# 3. Run tests
npm test -- --run

# 4. Start dev server
npm run dev
```

## Implementation Guide

### 1. Define TypeScript Types

**File**: `frontend/src/types/themes.ts`

```typescript
export interface Theme {
  id: string;
  name: string;
  description?: string;
  version: string; // semver: "1.0.0"
  framework: 'next.js' | 'gatsby' | 'laravel' | 'wordpress' | 'static';
  thumbnailUrl?: string;
  tags?: string[];
  source: 'purchased' | 'uploaded';
  sourceMetadata?: PurchasedMetadata | UploadedMetadata;
  deploymentStatus: 'available' | 'active' | 'failed' | 'deploying';
  siteId: string;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeploymentSession {
  id: string;
  themeId: string;
  siteId: string;
  userId: string;
  currentStep: 'detecting_stack' | 'preparing_env' | 'building' | 'deploying' | 'done';
  steps: StepStatus[];
  techStackDetected?: string;
  buildLogs: string[];
  errorDetails?: ErrorDetails;
  finalState: 'success' | 'failed' | 'cancelled' | 'in_progress';
  deployedUrl?: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
}
```

See full type definitions in `data-model.md`.

### 2. Create Theme Validator

**File**: `frontend/src/utils/themeValidator.ts`

Uses **ajv** for JSON Schema validation and **jszip** for extracting manifest.json:

```typescript
import Ajv, { JSONSchemaType } from 'ajv';
import JSZip from 'jszip';

const MAX_SIZE = 52428800; // 50 MB

export async function validateThemeFile(file: File) {
  // 1. Check file size
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File size exceeds 50 MB limit' };
  }

  // 2. Check file type
  if (!file.name.endsWith('.zip')) {
    return { valid: false, error: 'File must be a .zip archive' };
  }

  // 3. Extract and validate manifest.json
  const zip = await JSZip.loadAsync(file);
  const manifestFile = zip.file('manifest.json');

  if (!manifestFile) {
    return { valid: false, error: 'Missing manifest.json in theme archive' };
  }

  const manifest = JSON.parse(await manifestFile.async('text'));

  // 4. Validate against schema
  // Required fields: name, version, framework
  if (!manifest.name || !manifest.version || !manifest.framework) {
    return { valid: false, error: 'Manifest missing required fields' };
  }

  return { valid: true, manifest };
}
```

### 3. Set Up Zustand Stores

**Themes Store** (`frontend/src/store/themesStore.ts`):

```typescript
import { create } from 'zustand';

interface ThemesState {
  themes: Theme[];
  uploadSessions: UploadSession[];
  activeFilter: 'all' | 'purchased' | 'uploaded';

  addTheme: (theme: Theme) => void;
  updateTheme: (id: string, updates: Partial<Theme>) => void;
  deleteTheme: (id: string) => void;
}

export const useThemesStore = create<ThemesState>((set) => ({
  themes: [],
  uploadSessions: [],
  activeFilter: 'all',

  addTheme: (theme) => set((state) => ({
    themes: [...state.themes, theme]
  })),

  updateTheme: (id, updates) => set((state) => ({
    themes: state.themes.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  deleteTheme: (id) => set((state) => ({
    themes: state.themes.filter(t => t.id !== id)
  })),
}));
```

**Deployment Store** (`frontend/src/store/deploymentStore.ts`):

```typescript
import { create } from 'zustand';

interface DeploymentState {
  activeSessions: Map<string, DeploymentSession>;

  createSession: (session: DeploymentSession) => void;
  updateSession: (siteId: string, updates: Partial<DeploymentSession>) => void;
}

export const useDeploymentStore = create<DeploymentState>((set) => ({
  activeSessions: new Map(),

  createSession: (session) => set((state) => {
    const newSessions = new Map(state.activeSessions);
    newSessions.set(session.siteId, session);
    return { activeSessions: newSessions };
  }),

  updateSession: (siteId, updates) => set((state) => {
    const existing = state.activeSessions.get(siteId);
    if (!existing) return state;

    const newSessions = new Map(state.activeSessions);
    newSessions.set(siteId, { ...existing, ...updates });
    return { activeSessions: newSessions };
  }),
}));
```

### 4. Implement Mock Deployment Service

**File**: `frontend/src/services/deploymentService.ts`

```typescript
export class DeploymentService {
  async mockDeployment(
    themeId: string,
    siteId: string,
    userId: string,
    onProgress: (session: DeploymentSession) => void
  ): Promise<DeploymentSession> {
    const steps = [
      { name: 'detecting_stack', duration: 2000, message: 'Detected Next.js 13.4' },
      { name: 'preparing_env', duration: 5000, message: 'Environment ready' },
      { name: 'building', duration: 30000, message: 'Build complete' },
      { name: 'deploying', duration: 10000, message: 'Deployment successful' },
    ];

    for (const step of steps) {
      // Update step to in_progress
      onProgress({ ...session, currentStep: step.name });

      await new Promise(resolve => setTimeout(resolve, step.duration));

      // Update step to success
      onProgress({ ...session, currentStep: step.name, buildLogs: [...session.buildLogs, step.message] });
    }

    return session;
  }
}
```

### 5. Build UI Components

**Themes Page** (`frontend/src/components/themes/ThemesPage.tsx`):

```tsx
export const ThemesPage: React.FC = () => {
  const { themes, activeFilter } = useThemesStore();

  const filteredThemes = themes.filter(t =>
    activeFilter === 'all' || t.source === activeFilter
  );

  return (
    <div className="themes-page">
      <header>
        <h1>Themes</h1>
        <p>Browse purchased themes or upload your own.</p>
      </header>

      <ThemeFilters />
      <ThemeUploadCard />
      <MyThemesList themes={filteredThemes} />
    </div>
  );
};
```

**Deploy Panel** (`frontend/src/components/deployment/DeployPanel.tsx`):

```tsx
export const DeployPanel: React.FC<{ themeId: string }> = ({ themeId }) => {
  const session = useDeploymentStore(state => state.getSessionBySite(currentSiteId));

  return (
    <div className="deploy-panel">
      <DeploymentSteps steps={session?.steps || []} />
      <TerminalLog logs={session?.buildLogs || []} />

      {session?.errorDetails && (
        <button onClick={() => openChat()}>
          Let's fix this together
        </button>
      )}
    </div>
  );
};
```

## Testing

### Unit Tests

```bash
# Test theme validator
npm test -- themeValidator.test.ts
```

```typescript
import { describe, it, expect } from 'vitest';
import { validateThemeFile } from '@/utils/themeValidator';

describe('Theme Validator', () => {
  it('rejects files larger than 50 MB', async () => {
    const largeFile = new File(['x'.repeat(60000000)], 'large.zip');
    const result = await validateThemeFile(largeFile);
    expect(result.valid).toBe(false);
  });

  it('rejects non-zip files', async () => {
    const txtFile = new File(['text'], 'theme.txt');
    const result = await validateThemeFile(txtFile);
    expect(result.valid).toBe(false);
  });
});
```

### E2E Tests

```bash
# Test upload and deploy flows
npx playwright test theme-upload.spec.ts
npx playwright test theme-deploy.spec.ts
```

```typescript
test('uploads valid theme successfully', async ({ page }) => {
  await page.goto('/');
  await page.click('[aria-label="Open Themes page"]');

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('./fixtures/valid-theme.zip');

  await expect(page.locator('.upload-success')).toBeVisible();
});
```

## Architecture Decisions

### Why JSON Schema for validation?
- Declarative validation that's easy to test
- Semver versioning enables future compatibility checks
- Client-side validation provides instant feedback

### Why sandboxed iframe for deployment?
- Browser-native security model (no server-side VM needed for MVP)
- Prevents uploaded code from accessing editor context
- CSP headers block inline scripts and unsafe-eval

### Why localStorage + IndexedDB?
- localStorage: Fast access for theme metadata (<10 MB)
- IndexedDB: Binary data (thumbnails, deployment sessions)
- No backend dependency for MVP

### Why mock deployment service?
- Demonstrates UX without backend infrastructure
- Easy to swap with real API using contracts in `/contracts/`
- Faster iteration during frontend development

## Common Pitfalls

1. **File size validation**: Always check BEFORE parsing with jszip
2. **Sandboxing**: Ensure iframe has `sandbox="allow-scripts allow-same-origin"`
3. **State cleanup**: Remove upload sessions after 5 minutes
4. **Error messages**: Use friendly language, not stack traces
5. **Accessibility**: All interactive elements need ARIA labels

## Deployment Checklist

- [ ] Install dependencies (ajv, jszip, date-fns)
- [ ] Define TypeScript types
- [ ] Implement theme validator
- [ ] Create Zustand stores (themes, deployment)
- [ ] Build mock deployment service
- [ ] Add Themes tab to LeftRail
- [ ] Create ThemesPage component
- [ ] Implement upload flow UI
- [ ] Implement deploy panel UI
- [ ] Write unit tests (validator, services)
- [ ] Write E2E tests (upload, deploy flows)
- [ ] Accessibility audit (WCAG AA)
- [ ] Manual testing (happy path + error cases)
- [ ] Code review

## Next Steps

After MVP:

1. **Backend Migration**: Replace mock with real API (see `/contracts/`)
2. **PackMyCode Integration**: Implement real API sync
3. **Theme History**: Add rollback to previous themes
4. **Security Scanning**: Add virus scan for uploads

## Support

- **Spec**: `specs/006-themes-and-deploy/spec.md`
- **Data Model**: `specs/006-themes-and-deploy/data-model.md`
- **API Contracts**: `specs/006-themes-and-deploy/contracts/`
- **Constitution**: `.specify/memory/constitution.md`
