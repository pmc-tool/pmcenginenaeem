/**
 * Zustand Code Store
 * Feature: 003-ai-coding-mode
 * Source: data-model.md, state-schema.json
 */

import { create } from 'zustand';
import type {
  CodePanelState,
  CodeOperation,
  DiffPreview,
  UndoSnapshot,
  OperationStep,
  OperationError,
} from '../types/code';
import type { FileChange, StreamingSession } from '../types/multiFileStream';

// ============================================================================
// Store Interface
// ============================================================================

export interface CodeStore {
  // View Mode: 'canvas' (preview) or 'code' (editor)
  viewMode: 'canvas' | 'code';

  // Code Panel State
  codePanel: CodePanelState;

  // Streaming State (for live coding effect)
  isStreaming: boolean;
  streamingTarget: string | null; // Target code to stream to
  streamingProgress: number; // 0-100 percentage

  // Multi-File Streaming
  streamingSession: StreamingSession | null;
  currentStreamingFile: FileChange | null;
  fileStreamProgress: number; // Progress of current file (0-100)

  // Operations Queue
  operations: Record<string, CodeOperation>;
  operationQueue: string[]; // Array of operation IDs in FIFO order

  // Diff Previews
  diffPreviews: Record<string, DiffPreview>;
  activeDiffId: string | null;

  // Undo Stack
  undoStack: UndoSnapshot[];
  currentSnapshotIndex: number;
  canUndo: boolean; // Derived: currentSnapshotIndex > 0
  canRedo: boolean; // Derived: currentSnapshotIndex < stack.length - 1

  // Actions
  setViewMode: (mode: 'canvas' | 'code') => void;
  toggleViewMode: () => void;
  setCodePanelVisibility: (visible: boolean) => void;
  loadFile: (filePath: string, content: string) => void;
  updateCurrentCode: (code: string) => void;
  setSelectedLines: (startLine: number | null, endLine: number | null) => void;

  // Streaming Actions
  startStreaming: (targetCode: string, filePath: string) => void;
  updateStreamingProgress: (code: string, progress: number) => void;
  completeStreaming: () => void;
  cancelStreaming: () => void;

  // Multi-File Streaming Actions
  startMultiFileStream: (files: FileChange[]) => void;
  updateFileStreamProgress: (code: string, progress: number) => void;
  completeCurrentFile: () => void;
  completeMultiFileStream: () => void;
  cancelMultiFileStream: () => void;

  queueCodeRequest: (operationId: string, operation: CodeOperation) => void;
  addOperation: (operation: CodeOperation) => void;
  updateOperation: (operationId: string, updates: Partial<CodeOperation>) => void;
  updateOperationProgress: (operationId: string, step: OperationStep) => void;
  completeOperation: (operationId: string, diff: DiffPreview) => void;
  failOperation: (operationId: string, error: OperationError) => void;

  addDiffPreview: (diff: DiffPreview) => void;

  acceptDiff: (diffId: string) => void;
  rejectDiff: (diffId: string) => void;
  setActiveDiffId: (diffId: string | null) => void;

  performUndo: () => void;
  performRedo: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialCodePanelState: CodePanelState = {
  isVisible: false,
  currentCode: '',
  filePath: '',
  language: 'tsx',
  selectedLineStart: null,
  selectedLineEnd: null,
  highlightedRanges: [],
  editorOptions: {
    readOnly: false, // Editable with warning modal
    minimap: { enabled: false },
    lineNumbers: 'on',
    theme: 'vs-light',
    fontSize: 14,
    wordWrap: 'off',
  },
  lastUpdated: Date.now(),
  isDirty: false,
};

// ============================================================================
// Store Implementation
// ============================================================================

export const useCodeStore = create<CodeStore>((set, get) => ({
  // Initial State
  viewMode: 'code', // Default to code view with file manager visible
  codePanel: initialCodePanelState,
  isStreaming: false,
  streamingTarget: null,
  streamingProgress: 0,
  streamingSession: null,
  currentStreamingFile: null,
  fileStreamProgress: 0,
  operations: {},
  operationQueue: [],
  diffPreviews: {},
  activeDiffId: null,
  undoStack: [],
  currentSnapshotIndex: -1,
  canUndo: false,
  canRedo: false,

  // View Mode Actions
  setViewMode: (mode: 'canvas' | 'code') =>
    set({ viewMode: mode }),

  toggleViewMode: () =>
    set((state) => ({
      viewMode: state.viewMode === 'canvas' ? 'code' : 'canvas',
    })),

  // Code Panel Actions
  setCodePanelVisibility: (visible: boolean) =>
    set((state) => ({
      codePanel: {
        ...state.codePanel,
        isVisible: visible,
      },
    })),

  loadFile: (filePath: string, content: string) => {
    // Determine language from file extension
    const getLanguage = (path: string): string => {
      const ext = path.split('.').pop()?.toLowerCase() || '';
      const langMap: Record<string, string> = {
        tsx: 'typescript',
        ts: 'typescript',
        jsx: 'javascript',
        js: 'javascript',
        css: 'css',
        json: 'json',
        md: 'markdown',
        html: 'html',
      };
      return langMap[ext] || 'plaintext';
    };

    set((state) => ({
      codePanel: {
        ...state.codePanel,
        isVisible: true,
        filePath,
        language: getLanguage(filePath),
        currentCode: content,
        selectedLineStart: null,
        selectedLineEnd: null,
        highlightedRanges: [],
        lastUpdated: Date.now(),
        isDirty: false,
      },
    }));
  },

  updateCurrentCode: (code: string) =>
    set((state) => ({
      codePanel: {
        ...state.codePanel,
        currentCode: code,
        lastUpdated: Date.now(),
        isDirty: false,
      },
    })),

  setSelectedLines: (startLine: number | null, endLine: number | null) =>
    set((state) => ({
      codePanel: {
        ...state.codePanel,
        selectedLineStart: startLine,
        selectedLineEnd: endLine,
      },
    })),

  // Streaming Actions
  startStreaming: (targetCode: string, filePath: string) => {
    const getLanguage = (path: string): string => {
      const ext = path.split('.').pop()?.toLowerCase() || '';
      const langMap: Record<string, string> = {
        tsx: 'typescript',
        ts: 'typescript',
        jsx: 'javascript',
        js: 'javascript',
        css: 'css',
        json: 'json',
        md: 'markdown',
        html: 'html',
      };
      return langMap[ext] || 'plaintext';
    };

    set((state) => ({
      isStreaming: true,
      streamingTarget: targetCode,
      streamingProgress: 0,
      viewMode: 'code', // Auto-switch to code mode
      codePanel: {
        ...state.codePanel,
        isVisible: true,
        filePath,
        language: getLanguage(filePath),
        currentCode: '', // Start with empty code
        isDirty: true,
      },
    }));
  },

  updateStreamingProgress: (code: string, progress: number) =>
    set((state) => ({
      streamingProgress: progress,
      codePanel: {
        ...state.codePanel,
        currentCode: code,
        lastUpdated: Date.now(),
      },
    })),

  completeStreaming: () =>
    set((state) => ({
      isStreaming: false,
      streamingTarget: null,
      streamingProgress: 100,
      codePanel: {
        ...state.codePanel,
        currentCode: state.streamingTarget || state.codePanel.currentCode,
        isDirty: false,
        lastUpdated: Date.now(),
      },
    })),

  cancelStreaming: () =>
    set({
      isStreaming: false,
      streamingTarget: null,
      streamingProgress: 0,
    }),

  // Multi-File Streaming Actions
  startMultiFileStream: (files: FileChange[]) => {
    if (files.length === 0) return;

    const firstFile = files[0];
    const session: StreamingSession = {
      id: `session_${Date.now()}`,
      files,
      currentFileIndex: 0,
      status: 'streaming',
      startedAt: Date.now(),
    };

    const getLanguage = (path: string): string => {
      const ext = path.split('.').pop()?.toLowerCase() || '';
      const langMap: Record<string, string> = {
        tsx: 'typescript',
        ts: 'typescript',
        jsx: 'javascript',
        js: 'javascript',
        css: 'css',
        json: 'json',
        md: 'markdown',
        html: 'html',
      };
      return langMap[ext] || 'plaintext';
    };

    set({
      viewMode: 'code', // Auto-switch to code mode
      streamingSession: session,
      currentStreamingFile: firstFile,
      isStreaming: true,
      streamingTarget: firstFile.content,
      fileStreamProgress: 0,
      codePanel: {
        ...get().codePanel,
        isVisible: true,
        filePath: firstFile.filePath,
        language: firstFile.language || getLanguage(firstFile.filePath),
        currentCode: '', // Start empty
        isDirty: true,
        lastUpdated: Date.now(),
      },
    });
  },

  updateFileStreamProgress: (code: string, progress: number) =>
    set((state) => ({
      fileStreamProgress: progress,
      codePanel: {
        ...state.codePanel,
        currentCode: code,
        lastUpdated: Date.now(),
      },
    })),

  completeCurrentFile: () => {
    const state = get();
    if (!state.streamingSession) return;

    const nextIndex = state.streamingSession.currentFileIndex + 1;
    const hasMoreFiles = nextIndex < state.streamingSession.files.length;

    if (hasMoreFiles) {
      // Move to next file
      const nextFile = state.streamingSession.files[nextIndex];
      const getLanguage = (path: string): string => {
        const ext = path.split('.').pop()?.toLowerCase() || '';
        const langMap: Record<string, string> = {
          tsx: 'typescript',
          ts: 'typescript',
          jsx: 'javascript',
          js: 'javascript',
          css: 'css',
          json: 'json',
          md: 'markdown',
          html: 'html',
        };
        return langMap[ext] || 'plaintext';
      };

      set({
        streamingSession: {
          ...state.streamingSession,
          currentFileIndex: nextIndex,
        },
        currentStreamingFile: nextFile,
        streamingTarget: nextFile.content,
        fileStreamProgress: 0,
        codePanel: {
          ...state.codePanel,
          filePath: nextFile.filePath,
          language: nextFile.language || getLanguage(nextFile.filePath),
          currentCode: '', // Start empty for next file
          lastUpdated: Date.now(),
        },
      });
    } else {
      // All files complete
      get().completeMultiFileStream();
    }
  },

  completeMultiFileStream: () =>
    set((state) => ({
      streamingSession: state.streamingSession
        ? {
            ...state.streamingSession,
            status: 'completed',
            completedAt: Date.now(),
          }
        : null,
      isStreaming: false,
      streamingTarget: null,
      currentStreamingFile: null,
      fileStreamProgress: 100,
      codePanel: {
        ...state.codePanel,
        isDirty: false,
      },
    })),

  cancelMultiFileStream: () =>
    set({
      streamingSession: null,
      currentStreamingFile: null,
      isStreaming: false,
      streamingTarget: null,
      fileStreamProgress: 0,
    }),

  // Operation Actions
  queueCodeRequest: (operationId: string, operation: CodeOperation) =>
    set((state) => ({
      operations: {
        ...state.operations,
        [operationId]: operation,
      },
      operationQueue: [...state.operationQueue, operationId],
    })),

  addOperation: (operation: CodeOperation) =>
    set((state) => ({
      operations: {
        ...state.operations,
        [operation.id]: operation,
      },
      operationQueue: [...state.operationQueue, operation.id],
    })),

  updateOperation: (operationId: string, updates: Partial<CodeOperation> | ((prev: CodeOperation) => Partial<CodeOperation>)) =>
    set((state) => {
      const operation = state.operations[operationId];
      if (!operation) return state;

      const updateObj = typeof updates === 'function' ? updates(operation) : updates;

      return {
        operations: {
          ...state.operations,
          [operationId]: {
            ...operation,
            ...updateObj,
          },
        },
      };
    }),

  updateOperationProgress: (operationId: string, step: OperationStep) =>
    set((state) => {
      const operation = state.operations[operationId];
      if (!operation) return state;

      return {
        operations: {
          ...state.operations,
          [operationId]: {
            ...operation,
            currentStep: step.message,
            stepHistory: [...operation.stepHistory, step],
          },
        },
      };
    }),

  completeOperation: (operationId: string, diff: DiffPreview) =>
    set((state) => {
      const operation = state.operations[operationId];
      if (!operation) return state;

      return {
        operations: {
          ...state.operations,
          [operationId]: {
            ...operation,
            status: 'success',
            diffPreview: diff,
            completedAt: Date.now(),
          },
        },
        diffPreviews: {
          ...state.diffPreviews,
          [diff.id]: diff,
        },
        activeDiffId: diff.id,
        codePanel: {
          ...state.codePanel,
          isDirty: true,
        },
      };
    }),

  failOperation: (operationId: string, error: OperationError) =>
    set((state) => {
      const operation = state.operations[operationId];
      if (!operation) return state;

      return {
        operations: {
          ...state.operations,
          [operationId]: {
            ...operation,
            status: 'error',
            error,
            completedAt: Date.now(),
          },
        },
      };
    }),

  // Diff Actions
  addDiffPreview: (diff: DiffPreview) =>
    set((state) => ({
      diffPreviews: {
        ...state.diffPreviews,
        [diff.id]: diff,
      },
    })),

  acceptDiff: (diffId: string) =>
    set((state) => {
      const diff = state.diffPreviews[diffId];
      if (!diff || !diff.isValid) return state;

      // Update diff status
      const updatedDiff: DiffPreview = {
        ...diff,
        status: 'accepted',
        respondedAt: Date.now(),
      };

      // Apply code change
      return {
        diffPreviews: {
          ...state.diffPreviews,
          [diffId]: updatedDiff,
        },
        codePanel: {
          ...state.codePanel,
          currentCode: diff.newCode,
          lastUpdated: Date.now(),
          isDirty: false,
        },
        activeDiffId: null,
      };
    }),

  rejectDiff: (diffId: string) =>
    set((state) => {
      const diff = state.diffPreviews[diffId];
      if (!diff) return state;

      const updatedDiff: DiffPreview = {
        ...diff,
        status: 'rejected',
        respondedAt: Date.now(),
      };

      return {
        diffPreviews: {
          ...state.diffPreviews,
          [diffId]: updatedDiff,
        },
        activeDiffId: null,
        codePanel: {
          ...state.codePanel,
          isDirty: false,
        },
      };
    }),

  setActiveDiffId: (diffId: string | null) =>
    set({
      activeDiffId: diffId,
    }),

  // Undo/Redo Actions
  performUndo: () =>
    set((state) => {
      if (state.currentSnapshotIndex <= 0) return state;

      const newIndex = state.currentSnapshotIndex - 1;
      const snapshot = state.undoStack[newIndex];

      return {
        currentSnapshotIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
        codePanel: {
          ...state.codePanel,
          currentCode: snapshot.codeBefore,
          lastUpdated: Date.now(),
        },
        undoStack: state.undoStack.map((s, i) => ({
          ...s,
          isCurrent: i === newIndex,
        })),
      };
    }),

  performRedo: () =>
    set((state) => {
      if (state.currentSnapshotIndex >= state.undoStack.length - 1) return state;

      const newIndex = state.currentSnapshotIndex + 1;
      const snapshot = state.undoStack[newIndex];

      return {
        currentSnapshotIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < state.undoStack.length - 1,
        codePanel: {
          ...state.codePanel,
          currentCode: snapshot.codeAfter,
          lastUpdated: Date.now(),
        },
        undoStack: state.undoStack.map((s, i) => ({
          ...s,
          isCurrent: i === newIndex,
        })),
      };
    }),
}));
