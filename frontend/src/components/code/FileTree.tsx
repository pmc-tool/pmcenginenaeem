/**
 * FileTree Component
 * Feature: 003-ai-coding-mode
 * VS Code-style file explorer for Code Panel
 */

import { useState } from 'react';
import { FileIcon } from './vscodeIcons';
import './FileTree.css';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean;
}

interface FileTreeProps {
  files: FileNode[];
  selectedFile: string | null;
  streamingFile?: string | null;
  onFileSelect: (path: string) => void;
}

export function FileTree({ files, selectedFile, streamingFile, onFileSelect }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/features', 'src/features/auth', 'src/hooks', 'src/services', 'src/types']));

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile === node.path;
    const isStreaming = streamingFile === node.path;

    if (node.type === 'folder') {
      return (
        <div key={node.path} className="file-tree__folder">
          <button
            className={`file-tree__item file-tree__item--folder ${
              isExpanded ? 'file-tree__item--expanded' : ''
            }`}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => toggleFolder(node.path)}
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} folder ${node.name}`}
          >
            <span className="file-tree__icon" aria-hidden="true">
              {isExpanded ? '▼' : '▶'}
            </span>
            <FileIcon
              filename={node.name}
              isFolder={true}
              isOpen={isExpanded}
              className="file-tree__folder-icon"
            />
            <span className="file-tree__name">{node.name}</span>
          </button>
          {isExpanded && node.children && (
            <div className="file-tree__children">
              {node.children.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={node.path}
        className={`file-tree__item file-tree__item--file ${
          isSelected ? 'file-tree__item--selected' : ''
        } ${isStreaming ? 'file-tree__item--streaming' : ''}`}
        style={{ paddingLeft: `${depth * 12 + 28}px` }}
        onClick={() => onFileSelect(node.path)}
        aria-label={`Open file ${node.name}`}
        aria-current={isSelected ? 'true' : undefined}
      >
        <FileIcon
          filename={node.name}
          className="file-tree__file-icon"
        />
        <span className="file-tree__name">{node.name}</span>
      </button>
    );
  };

  return (
    <div className="file-tree" role="tree" aria-label="File Explorer">
      <div className="file-tree__content">
        {files.map((node) => renderNode(node, 0))}
      </div>
    </div>
  );
}

