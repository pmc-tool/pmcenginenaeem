/**
 * TypeScript type definitions for AI Coding Mode
 * Feature: 003-ai-coding-mode
 * Source: data-model.md
 */
// ============================================================================
// Core Types
// ============================================================================

export type SyntaxLanguage = 'typescript' | 'javascript' | 'tsx' | 'jsx' | 'css' | 'html';

export type DiffStatus = 'pending' | 'accepted' | 'rejected';

export type OperationStatus = 'pending' | 'running' | 'success' | 'error';

export type OperationIcon = 'analyze' | 'generate' | 'validate' | 'check' | 'error';

export type ErrorType =
  | 'ambiguous-request'
  | 'validation-failed'
  | 'network-error'
  | 'ai-service-error'
  | 'timeout'
  | 'unknown';

export type RequestStatus = 'queued' | 'processing' | 'completed' | 'failed';

// ============================================================================
// Code Panel State
// ============================================================================

export interface CodeRange {
  startLine: number;
  endLine: number;
  type: 'addition' | 'deletion' | 'modification';
}

export interface MonacoEditorOptions {
  readOnly: true; // Always true per constitution Section 3.IV
  minimap: { enabled: boolean };
  lineNumbers: 'on' | 'off';
  theme: 'vs-light' | 'vs-dark';
  fontSize: number;
  wordWrap: 'on' | 'off';
}

export interface CodePanelState {
  // Core Display
  isVisible: boolean;
  currentCode: string;
  filePath: string;
  language: SyntaxLanguage;

  // Selection & Highlighting
  selectedLineStart: number | null;
  selectedLineEnd: number | null;
  highlightedRanges: CodeRange[];

  // Monaco Editor Config
  editorOptions: MonacoEditorOptions;

  // Metadata
  lastUpdated: number; // Unix timestamp (ms)
  isDirty: boolean;
}

// ============================================================================
// Diff Preview
// ============================================================================

export interface DiffChange {
  lineNumber: number;
  type: 'addition' | 'deletion' | 'modification' | 'context';
  oldContent: string | null;
  newContent: string | null;
}

export interface DiffScope {
  type: 'page' | 'section' | 'element';
  targetName: string;
  filePath: string;
}

export interface ValidationError {
  severity: 'error' | 'warning';
  message: string;
  line: number | null;
  code: string; // e.g., 'TS2304', 'syntax-error'
}

export interface DiffPreview {
  // Identity
  id: string; // UUID
  operationId: string; // Parent operation UUID

  // Code Comparison
  oldCode: string;
  newCode: string;
  changes: DiffChange[];

  // User-Facing Summary
  summary: string; // Plain-language explanation
  scope: DiffScope;

  // Status
  status: DiffStatus;
  createdAt: number; // Unix timestamp (ms)
  respondedAt: number | null;

  // Validation
  isValid: boolean;
  validationErrors: ValidationError[];
}

// ============================================================================
// Code Operation
// ============================================================================

export interface OperationStep {
  message: string;
  status: 'pending' | 'running' | 'complete' | 'failed';
  timestamp: number; // Unix timestamp (ms)
  icon: OperationIcon;
}

export interface OperationError {
  message: string; // User-friendly
  type: ErrorType;
  recoverable: boolean;
  details: string | null; // Technical details for debugging
}

export interface CodeOperation {
  // Identity
  id: string; // UUID
  requestId: string; // Associated AICodeRequest UUID

  // Progress Tracking
  status: OperationStatus;
  currentStep: string;
  stepHistory: OperationStep[];

  // Result
  diffPreview: DiffPreview | null;
  error: OperationError | null;

  // Timing
  createdAt: number; // Unix timestamp (ms)
  completedAt: number | null;

  // Metadata
  estimatedDuration: number; // in ms
}

// ============================================================================
// Undo Snapshot
// ============================================================================

export interface UndoSnapshot {
  // Identity
  id: string; // UUID
  operationId: string;

  // Code State
  codeBefore: string;
  codeAfter: string;
  filePath: string;

  // Metadata
  timestamp: number; // Unix timestamp (ms)
  description: string; // Human-readable

  // Snapshot Position
  index: number; // 0 = oldest
  isCurrent: boolean;
}

// ============================================================================
// AI Code Request
// ============================================================================

export interface RequestScope {
  type: 'page' | 'section' | 'element' | 'global';
  targetId: string | null;
  targetName: string;
  filePath: string;
}

export interface PageMetadata {
  pageId: string;
  pageName: string;
  componentLibrary: string[];
  styleVariables: Record<string, string>;
}

export interface RequestContext {
  currentCode: string;
  selectedElement: string | null;
  pageMetadata: PageMetadata;
}

export interface AICodeRequest {
  // Identity
  id: string; // UUID
  chatMessageId: string;

  // Request Details
  requestText: string;
  scope: RequestScope;
  context: RequestContext;

  // Status
  status: RequestStatus;
  operationId: string | null;

  // Timing
  createdAt: number; // Unix timestamp (ms)
  processedAt: number | null;
  completedAt: number | null;
}

// ============================================================================
// Service Layer Types
// ============================================================================

export interface CodeGenerationRequest {
  requestText: string;
  scope: {
    type: 'page' | 'section' | 'element';
    targetName: string;
    filePath: string;
  };
  context: {
    currentCode: string;
    selectedElement: string | null;
    pageMetadata: PageMetadata;
  };
}

export interface DiffResult {
  oldLines: string[];
  newLines: string[];
  changes: DiffChange[];
  totalAdded: number;
  totalRemoved: number;
  totalModified: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}
