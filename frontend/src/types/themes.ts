// Theme Management Types for PMC Engine Editor
// Feature: 006-themes-and-deploy

/**
 * Theme entity - Represents a PMC Engine-compatible website template
 * Can be either purchased from PackMyCode or uploaded by user
 */
export interface Theme {
  id: string;
  name: string;
  description?: string;
  version: string; // semver format: "1.0.0"
  framework: 'next.js' | 'gatsby' | 'laravel' | 'wordpress' | 'static';
  thumbnailUrl?: string;
  tags?: string[];
  source: 'purchased' | 'uploaded';
  sourceMetadata?: PurchasedMetadata | UploadedMetadata;
  deploymentStatus: 'available' | 'active' | 'failed' | 'deploying';
  siteId: string;
  uploadedBy?: string; // User ID who uploaded (null for purchased)
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * Metadata for purchased themes from PackMyCode marketplace
 */
export interface PurchasedMetadata {
  purchaseId: string;
  purchasedAt: string; // ISO 8601 timestamp
  downloadUrl: string;
  marketplaceUrl: string;
}

/**
 * Metadata for user-uploaded themes
 */
export interface UploadedMetadata {
  uploadSessionId: string;
  originalFilename: string;
  fileSizeBytes: number;
  storagePath: string; // IndexedDB key or S3 path
}

/**
 * UploadSession - Temporary entity tracking in-progress theme uploads
 */
export interface UploadSession {
  id: string;
  siteId: string;
  userId: string;
  fileName: string;
  fileSizeBytes: number;
  fileReference: File | Blob;
  progressPercent: number; // 0-100
  validationState: 'pending' | 'validating' | 'success' | 'error';
  errorMessage?: string;
  manifestData?: ThemeManifest;
  createdAt: string; // ISO 8601 timestamp
  completedAt?: string; // ISO 8601 timestamp
}

/**
 * Theme manifest structure (from manifest.json in theme .zip)
 */
export interface ThemeManifest {
  name: string;
  version: string; // semver
  framework: 'next.js' | 'gatsby' | 'laravel' | 'wordpress' | 'static';
  description?: string;
  author?: string;
  license?: string;
  dependencies?: {
    node?: string;
    npm_packages?: Record<string, string>;
  };
  config?: {
    env_vars?: string[];
    build_command?: string;
    output_dir?: string;
  };
}

/**
 * DeploymentSession - Represents a theme deployment process
 */
export interface DeploymentSession {
  id: string;
  themeId: string;
  siteId: string;
  userId: string;
  currentStep: 'detecting_stack' | 'preparing_env' | 'building' | 'deploying' | 'done';
  steps: StepStatus[];
  techStackDetected?: string; // e.g., "Next.js 13.4"
  buildLogs: string[]; // Raw terminal output (ephemeral, max 1000 lines)
  errorDetails?: ErrorDetails;
  finalState: 'success' | 'failed' | 'cancelled' | 'in_progress';
  deployedUrl?: string; // Preview URL if deployment succeeded
  startedAt: string; // ISO 8601 timestamp
  completedAt?: string; // ISO 8601 timestamp
  durationMs?: number; // Total deployment time
}

/**
 * Status of individual deployment step
 */
export interface StepStatus {
  name: 'detecting_stack' | 'preparing_env' | 'building' | 'deploying' | 'done';
  status: 'idle' | 'in_progress' | 'success' | 'error';
  message: string; // Human-readable status text
  startedAt?: string; // ISO 8601 timestamp
  completedAt?: string; // ISO 8601 timestamp
  durationMs?: number; // Time spent on this step
}

/**
 * Error details when deployment fails
 */
export interface ErrorDetails {
  failingStep: 'detecting_stack' | 'preparing_env' | 'building' | 'deploying';
  errorMessage: string; // High-level error description
  errorSnippet: string; // Extract from logs (5-10 lines around error)
  errorCode?: string; // e.g., "BUILD_FAILED", "MANIFEST_INVALID"
  suggestedAction?: string; // What user should do next
}

/**
 * DeploymentLog - Raw build/deploy output for debugging
 * (In-memory only, not persisted to IndexedDB)
 */
export interface DeploymentLog {
  id: string;
  deploymentSessionId: string;
  timestamp: string; // ISO 8601 with milliseconds
  logLevel: 'info' | 'warning' | 'error' | 'debug';
  logSource: 'system' | 'build_tool' | 'deployment_service';
  message: string; // Raw output (max 10,000 chars)
}

/**
 * ThemeSummary - Read-only computed view for inspector after successful deployment
 */
export interface ThemeSummary {
  activeThemeId: string;
  activeThemeName: string;
  activeThemeThumbnail?: string;
  quickActions: QuickAction[];
  deployedAt: string; // ISO 8601 timestamp
  deploymentDuration: number; // milliseconds
}

/**
 * Quick action link in Theme Summary
 */
export interface QuickAction {
  label: string; // e.g., "Open Pages & Sections"
  icon?: string;
  action: 'navigate' | 'command';
  target: string; // Navigation path or command to execute
}
