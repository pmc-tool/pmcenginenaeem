/**
 * FileExplorerSidebar Component
 * Feature: 003-ai-coding-mode
 * Replaces PageSidebar when Code Panel is open
 * Positioned in the grid's sidebar area
 */

import { useState, useCallback, useEffect } from 'react';
import { FileTree, type FileNode } from './FileTree';
import { useCodeStore } from '../../store/codeStore';
import { useBreakpoint } from '../../hooks/responsive';
import { BottomSheet } from '../shell/BottomSheet';
import { useDashboardStore } from '../../store/dashboardStore';
import './FileExplorerSidebar.css';

export function FileExplorerSidebar() {
  const { isMobile } = useBreakpoint();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(240); // Default width
  const loadFile = useCodeStore((state) => state.loadFile);
  const setActiveLeftRailTab = useDashboardStore((state) => state.setActiveLeftRailTab);

  // Watch for streaming file changes
  const currentStreamingFile = useCodeStore((state) => state.currentStreamingFile);
  const codePanelFilePath = useCodeStore((state) => state.codePanel.filePath);

  // Auto-select file when AI is streaming
  useEffect(() => {
    if (currentStreamingFile?.filePath) {
      setSelectedFile(currentStreamingFile.filePath);
    } else if (codePanelFilePath) {
      setSelectedFile(codePanelFilePath);
    }
  }, [currentStreamingFile, codePanelFilePath]);

  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
    // Load file content in Code Panel
    const mockContent = getMockFileContent(path);
    loadFile(path, mockContent);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle resize drag
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      const startX = e.clientX;
      const startWidth = width;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = Math.max(150, Math.min(500, startWidth + deltaX));
        setWidth(newWidth);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    },
    [width]
  );

  // File explorer content for mobile (simplified)
  const mobileContent = (
    <div className="file-explorer-sidebar__content">
      <FileTree
        files={getMockFileTree()}
        selectedFile={selectedFile}
        streamingFile={currentStreamingFile?.filePath || null}
        onFileSelect={handleFileSelect}
      />
    </div>
  );

  // File explorer content for desktop (full features)
  const desktopContent = (
    <>
      <div className="file-explorer-sidebar__header">
        <button
          className="file-explorer-sidebar__toggle"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? 'Expand file explorer' : 'Collapse file explorer'}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
        {!isCollapsed && <span className="file-explorer-sidebar__title">EXPLORER</span>}
      </div>

      {!isCollapsed && (
        <div className="file-explorer-sidebar__content">
          <FileTree
            files={getMockFileTree()}
            selectedFile={selectedFile}
            streamingFile={currentStreamingFile?.filePath || null}
            onFileSelect={handleFileSelect}
          />
        </div>
      )}

      {isCollapsed && (
        <div className="file-explorer-sidebar__icons">
          <button
            className="file-explorer-sidebar__icon"
            onClick={toggleCollapse}
            aria-label="Files"
            title="Files"
          >
            📁
          </button>
        </div>
      )}

      {/* Resize handle - only visible when expanded */}
      {!isCollapsed && (
        <div
          className="file-explorer-sidebar__resize-handle"
          onMouseDown={handleResizeStart}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize file explorer"
          tabIndex={0}
        />
      )}
    </>
  );

  // On mobile, render as BottomSheet
  if (isMobile) {
    return (
      <BottomSheet
        isOpen={true}
        onClose={() => setActiveLeftRailTab(null)}
        snapPoint="half"
        title="Files"
      >
        <div className="file-explorer-sidebar file-explorer-sidebar--mobile">
          {mobileContent}
        </div>
      </BottomSheet>
    );
  }

  // On desktop, render as sidebar
  return (
    <aside
      className="file-explorer-sidebar shell-sidebar"
      data-visible="true"
      data-collapsed={isCollapsed}
      style={{ width: isCollapsed ? '48px' : `${width}px` }}
    >
      {desktopContent}
    </aside>
  );
}

/**
 * Generate mock file content based on file path
 * TODO: Replace with actual file content loading
 */
function getMockFileContent(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || '';

  // TypeScript/JavaScript files
  if (ext === 'tsx' || ext === 'ts') {
    return `/**
 * ${path.split('/').pop()}
 * Feature: Mock file content
 */

import React from 'react';

export interface ${path.split('/').pop()?.replace('.tsx', '').replace('.ts', '')}Props {
  id: string;
  name: string;
}

export const ${path.split('/').pop()?.replace('.tsx', '').replace('.ts', '')}: React.FC<${path.split('/').pop()?.replace('.tsx', '').replace('.ts', '')}Props> = ({ id, name }) => {
  return (
    <div className="component">
      <h2>{name}</h2>
      <p>ID: {id}</p>
    </div>
  );
};
`;
  }

  // CSS files
  if (ext === 'css') {
    return `/* ${path.split('/').pop()} */

.component {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.component h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}
`;
  }

  // JSON files
  if (ext === 'json') {
    return `{
  "name": "${path.split('/').pop()?.replace('.json', '')}",
  "version": "1.0.0",
  "description": "Mock JSON content",
  "dependencies": {},
  "devDependencies": {}
}
`;
  }

  // Markdown files
  if (ext === 'md') {
    return `# ${path.split('/').pop()?.replace('.md', '')}

This is a mock markdown file.

## Features
- Feature 1
- Feature 2
- Feature 3

## Usage
\`\`\`typescript
import { Component } from './Component';
\`\`\`
`;
  }

  // Default fallback
  return `// ${path}\n// Mock file content\n\nconsole.log('File loaded: ${path}');`;
}

/**
 * Mock file tree structure
 * TODO: Replace with actual project file structure
 */
function getMockFileTree(): FileNode[] {
  return [
    {
      name: 'src',
      path: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          path: 'src/components',
          type: 'folder',
          children: [
            {
              name: 'chat',
              path: 'src/components/chat',
              type: 'folder',
              children: [
                { name: 'ChatPanel.tsx', path: 'src/components/chat/ChatPanel.tsx', type: 'file' },
                { name: 'ChatPanel.css', path: 'src/components/chat/ChatPanel.css', type: 'file' },
                { name: 'MessageBubble.tsx', path: 'src/components/chat/MessageBubble.tsx', type: 'file' },
              ],
            },
            {
              name: 'ui',
              path: 'src/components/ui',
              type: 'folder',
              children: [
                { name: 'Button.tsx', path: 'src/components/ui/Button.tsx', type: 'file' },
                { name: 'Input.tsx', path: 'src/components/ui/Input.tsx', type: 'file' },
              ],
            },
            {
              name: 'code',
              path: 'src/components/code',
              type: 'folder',
              children: [
                { name: 'CodePanel.tsx', path: 'src/components/code/CodePanel.tsx', type: 'file' },
                { name: 'CodePanel.css', path: 'src/components/code/CodePanel.css', type: 'file' },
                { name: 'DiffPreview.tsx', path: 'src/components/code/DiffPreview.tsx', type: 'file' },
                { name: 'FileTree.tsx', path: 'src/components/code/FileTree.tsx', type: 'file' },
              ],
            },
            {
              name: 'shell',
              path: 'src/components/shell',
              type: 'folder',
              children: [
                { name: 'Shell.tsx', path: 'src/components/shell/Shell.tsx', type: 'file' },
                { name: 'TopBar.tsx', path: 'src/components/shell/TopBar.tsx', type: 'file' },
                { name: 'LeftRail.tsx', path: 'src/components/shell/LeftRail.tsx', type: 'file' },
              ],
            },
          ],
        },
        {
          name: 'features',
          path: 'src/features',
          type: 'folder',
          children: [
            {
              name: 'auth',
              path: 'src/features/auth',
              type: 'folder',
              children: [
                { name: 'LoginForm.tsx', path: 'src/features/auth/LoginForm.tsx', type: 'file' },
                { name: 'LoginForm.css', path: 'src/features/auth/LoginForm.css', type: 'file' },
              ],
            },
          ],
        },
        {
          name: 'hooks',
          path: 'src/hooks',
          type: 'folder',
          children: [
            { name: 'useAuth.ts', path: 'src/hooks/useAuth.ts', type: 'file' },
          ],
        },
        {
          name: 'services',
          path: 'src/services',
          type: 'folder',
          children: [
            { name: 'authService.ts', path: 'src/services/authService.ts', type: 'file' },
          ],
        },
        {
          name: 'store',
          path: 'src/store',
          type: 'folder',
          children: [
            { name: 'codeStore.ts', path: 'src/store/codeStore.ts', type: 'file' },
            { name: 'dashboardStore.ts', path: 'src/store/dashboardStore.ts', type: 'file' },
          ],
        },
        {
          name: 'types',
          path: 'src/types',
          type: 'folder',
          children: [
            { name: 'auth.ts', path: 'src/types/auth.ts', type: 'file' },
            { name: 'code.ts', path: 'src/types/code.ts', type: 'file' },
            { name: 'chat.ts', path: 'src/types/chat.ts', type: 'file' },
          ],
        },
        { name: 'App.tsx', path: 'src/App.tsx', type: 'file' },
        { name: 'main.tsx', path: 'src/main.tsx', type: 'file' },
      ],
    },
    { name: 'package.json', path: 'package.json', type: 'file' },
    { name: 'tsconfig.json', path: 'tsconfig.json', type: 'file' },
    { name: 'vite.config.ts', path: 'vite.config.ts', type: 'file' },
  ];
}
