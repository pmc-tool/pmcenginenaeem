/**
 * CodeViewer Component
 * Feature: 003-ai-coding-mode
 * Monaco Editor wrapper with editable mode and warning
 * Implements FR-001, FR-002, FR-003 from spec.md
 */

import { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';
import type { SyntaxLanguage, CodeRange } from '../../types/code';
import './CodeViewer.css';

export interface CodeViewerProps {
  code: string;
  language: SyntaxLanguage;
  highlightedRanges?: CodeRange[];
  onMount?: () => void;
  onChange?: (value: string) => void;
}

export function CodeViewer({ code, language, highlightedRanges = [], onMount, onChange }: CodeViewerProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [hasShownWarning, setHasShownWarning] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const isStreamingUpdate = useRef(false);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Add decorations for highlighted ranges
    if (highlightedRanges.length > 0) {
      updateHighlights(highlightedRanges, monaco);
    }

    onMount?.();
  }

  function updateHighlights(ranges: CodeRange[], monaco: Monaco) {
    if (!editorRef.current || !monaco) return;

    const decorations = ranges.map((range) => {
      const className = `code-viewer__highlight--${range.type}`;
      const glyphClassName = `code-viewer__glyph--${range.type}`;

      return {
        range: new monaco.Range(range.startLine, 1, range.endLine, 1),
        options: {
          isWholeLine: true,
          className,
          glyphMarginClassName: glyphClassName,
        },
      };
    });

    editorRef.current.deltaDecorations([], decorations);
  }

  useEffect(() => {
    if (monacoRef.current && highlightedRanges.length > 0) {
      updateHighlights(highlightedRanges, monacoRef.current);
    }
  }, [highlightedRanges]);

  // Force Monaco to update when code changes (for streaming)
  useEffect(() => {
    if (editorRef.current && code !== editorRef.current.getValue()) {
      isStreamingUpdate.current = true;
      const currentPosition = editorRef.current.getPosition();
      editorRef.current.setValue(code);

      // Auto-scroll to end during streaming
      const lineCount = editorRef.current.getModel()?.getLineCount() || 1;
      editorRef.current.revealLine(lineCount);

      isStreamingUpdate.current = false;
    }
  }, [code]);

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return;

    // Ignore changes from streaming updates
    if (isStreamingUpdate.current) return;

    // Show warning on first edit
    if (!hasShownWarning) {
      setShowWarningModal(true);
      setHasShownWarning(true);
    }

    // Call parent onChange handler
    onChange?.(value);
  };

  const handleCloseWarning = () => {
    setShowWarningModal(false);
  };

  return (
    <div className="code-viewer">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-light"
        options={{
          readOnly: false, // Now editable
          minimap: { enabled: false },
          lineNumbers: 'on',
          fontSize: 14,
          wordWrap: 'off',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          contextmenu: true,
          renderLineHighlight: 'all',
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
          },
        }}
        onMount={handleEditorDidMount}
        loading={<div className="code-viewer__loading">Loading code editor...</div>}
      />

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="code-viewer__warning-overlay" onClick={handleCloseWarning}>
          <div className="code-viewer__warning-modal" onClick={(e) => e.stopPropagation()}>
            <div className="code-viewer__warning-header">
              <span className="code-viewer__warning-icon">⚠</span>
              <h3 className="code-viewer__warning-title">Warning: Direct Code Editing</h3>
            </div>
            <p className="code-viewer__warning-message">
              You are editing code directly. Changes made here will not be tracked by the AI assistant and may be overwritten by future AI-generated code updates.
            </p>
            <p className="code-viewer__warning-note">
              Consider using the AI chat panel to request code changes instead for better tracking and version control.
            </p>
            <button
              type="button"
              className="code-viewer__warning-button"
              onClick={handleCloseWarning}
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
