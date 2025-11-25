/**
 * VSCode File Icons
 * SVG icons matching VSCode's file icon theme
 */

import React from 'react';

export interface FileIconProps {
  filename: string;
  isFolder?: boolean;
  isOpen?: boolean;
  className?: string;
}

/**
 * Get file icon component based on filename
 */
export function FileIcon({ filename, isFolder = false, isOpen = false, className = '' }: FileIconProps) {
  if (isFolder) {
    return isOpen ? <FolderOpenIcon className={className} /> : <FolderIcon className={className} />;
  }

  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const IconComponent = getIconByExtension(ext, filename);

  return <IconComponent className={className} />;
}

/**
 * Map file extension to icon component
 */
function getIconByExtension(ext: string, filename: string): React.FC<{ className?: string }> {
  // Check for specific filenames first
  if (filename === 'package.json') return PackageJsonIcon;
  if (filename === 'tsconfig.json') return TsConfigIcon;
  if (filename === 'vite.config.ts' || filename === 'vite.config.js') return ViteIcon;
  if (filename === '.gitignore') return GitIcon;
  if (filename === 'README.md') return ReadmeIcon;

  // Check by extension
  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    tsx: TypeScriptReactIcon,
    ts: TypeScriptIcon,
    jsx: JavaScriptReactIcon,
    js: JavaScriptIcon,
    css: CssIcon,
    json: JsonIcon,
    md: MarkdownIcon,
    html: HtmlIcon,
    svg: SvgIcon,
    png: ImageIcon,
    jpg: ImageIcon,
    jpeg: ImageIcon,
    gif: ImageIcon,
    webp: ImageIcon,
    ico: ImageIcon,
  };

  return iconMap[ext] || DefaultFileIcon;
}

// Folder Icons
const FolderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 3H7.71L6.85 2.15C6.54 1.84 6.12 1.67 5.68 1.67H1.5C0.67 1.67 0 2.34 0 3.17V12.83C0 13.66 0.67 14.33 1.5 14.33H14.5C15.33 14.33 16 13.66 16 12.83V4.5C16 3.67 15.33 3 14.5 3Z" fill="#C09553"/>
  </svg>
);

const FolderOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 3H7.71L6.85 2.15C6.54 1.84 6.12 1.67 5.68 1.67H1.5C0.67 1.67 0 2.34 0 3.17V4H15.5C15.78 4 16 4.22 16 4.5V12.83C16 13.66 15.33 14.33 14.5 14.33H1.5C0.67 14.33 0 13.66 0 12.83V3.17C0 2.34 0.67 1.67 1.5 1.67H5.68C6.12 1.67 6.54 1.84 6.85 2.15L7.71 3H14.5C15.33 3 16 3.67 16 4.5V4.5C16 4.22 15.78 4 15.5 4H0V12.83C0 13.66 0.67 14.33 1.5 14.33H14.5C15.33 14.33 16 13.66 16 12.83V4.5Z" fill="#DCB67A"/>
  </svg>
);

// TypeScript Icons
const TypeScriptIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#3178C6"/>
    <path d="M8.5 8.5V13H9.5V8.5H11V7.5H7V8.5H8.5Z" fill="white"/>
    <path d="M12 10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V11C13 11.8284 12.3284 12.5 11.5 12.5C10.6716 12.5 10 11.8284 10 11V10.5C10 10.2239 10.2239 10 10.5 10C10.7761 10 11 10.2239 11 10.5V11C11 11.2761 11.2239 11.5 11.5 11.5C11.7761 11.5 12 11.2761 12 11V10.5Z" fill="white"/>
  </svg>
);

const TypeScriptReactIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#3178C6"/>
    <path d="M8 9.5C8.69036 9.5 9.25 8.94036 9.25 8.25C9.25 7.55964 8.69036 7 8 7C7.30964 7 6.75 7.55964 6.75 8.25C6.75 8.94036 7.30964 9.5 8 9.5Z" fill="#61DAFB"/>
    <path d="M11.5 8.25C11.5 7.42 10.28 6.68 8.67 6.53C8.89 5.91 9 5.42 9 5.25C9 4.56 8.55 4 8 4C7.45 4 7 4.56 7 5.25C7 5.42 7.11 5.91 7.33 6.53C5.72 6.68 4.5 7.42 4.5 8.25C4.5 9.08 5.72 9.82 7.33 9.97C7.11 10.59 7 11.08 7 11.25C7 11.94 7.45 12.5 8 12.5C8.55 12.5 9 11.94 9 11.25C9 11.08 8.89 10.59 8.67 9.97C10.28 9.82 11.5 9.08 11.5 8.25Z" stroke="#61DAFB" strokeWidth="0.5" fill="none"/>
  </svg>
);

// JavaScript Icons
const JavaScriptIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#F7DF1E"/>
    <path d="M8.5 11.5C8.5 12.3284 7.82843 13 7 13C6.17157 13 5.5 12.3284 5.5 11.5V8.5H6.5V11.5C6.5 11.7761 6.72386 12 7 12C7.27614 12 7.5 11.7761 7.5 11.5V8.5H8.5V11.5Z" fill="#000000"/>
    <path d="M10 10.5C10 10.2239 10.2239 10 10.5 10C10.7761 10 11 10.2239 11 10.5V11C11 11.8284 10.3284 12.5 9.5 12.5C8.67157 12.5 8 11.8284 8 11V10.5C8 10.2239 8.22386 10 8.5 10C8.77614 10 9 10.2239 9 10.5V11C9 11.2761 9.22386 11.5 9.5 11.5C9.77614 11.5 10 11.2761 10 11V10.5Z" fill="#000000"/>
  </svg>
);

const JavaScriptReactIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#61DAFB"/>
    <circle cx="8" cy="8" r="1.5" fill="#282C34"/>
    <ellipse cx="8" cy="8" rx="4.5" ry="2" stroke="#282C34" strokeWidth="0.8" fill="none"/>
    <ellipse cx="8" cy="8" rx="4.5" ry="2" stroke="#282C34" strokeWidth="0.8" fill="none" transform="rotate(60 8 8)"/>
    <ellipse cx="8" cy="8" rx="4.5" ry="2" stroke="#282C34" strokeWidth="0.8" fill="none" transform="rotate(120 8 8)"/>
  </svg>
);

// CSS Icon
const CssIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2L3 13L8 14.5L13 13L14 2H2Z" fill="#1572B6"/>
    <path d="M8 3V13.5L12 12.3L12.8 3H8Z" fill="#33A9DC"/>
    <path d="M5 7L5.2 8.5H8V7H5ZM5.3 9.5L5.5 11L8 11.8V10.2L6.2 9.7L6.1 9.5H5.3ZM8 5.5V4H4.7L5 7H8V5.5Z" fill="white"/>
  </svg>
);

// HTML Icon
const HtmlIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2L3 13L8 14.5L13 13L14 2H2Z" fill="#E34F26"/>
    <path d="M8 3V13.5L12 12.3L12.8 3H8Z" fill="#EF652A"/>
    <path d="M5 5.5H8V7H6.5L6.7 8.5H8V10H5.3L5 5.5ZM8 10V11.5L10 11L10.2 8.5H8.8V7H10.5L10.8 5.5H8V4H11.2L10.7 11L8 11.8V10Z" fill="white"/>
  </svg>
);

// JSON Icon
const JsonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#FBC02D"/>
    <path d="M5 5.5C5 5.22386 5.22386 5 5.5 5H6V6H5.5C5.22386 6 5 5.77614 5 5.5ZM5 7H6V9H5V7ZM5.5 10H6V11H5.5C5.22386 11 5 10.7761 5 10.5C5 10.2239 5.22386 10 5.5 10Z" fill="#333333"/>
    <path d="M11 10.5C11 10.7761 10.7761 11 10.5 11H10V10H10.5C10.7761 10 11 10.2239 11 10.5ZM11 9H10V7H11V9ZM10.5 6H10V5H10.5C10.7761 5 11 5.22386 11 5.5C11 5.77614 10.7761 6 10.5 6Z" fill="#333333"/>
    <path d="M7 7H9V9H7V7Z" fill="#333333"/>
  </svg>
);

// Markdown Icon
const MarkdownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#083FA1"/>
    <path d="M3 5V11H4.5V8L6 10L7.5 8V11H9V5H7.5L6 7.5L4.5 5H3Z" fill="white"/>
    <path d="M10 11L12.5 8.5H11V5H10V8.5H8.5L11 11Z" fill="white"/>
  </svg>
);

// SVG Icon
const SvgIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#FFB13B"/>
    <path d="M5 4L8 7L5 10V4Z" fill="#333333"/>
    <path d="M11 6L8 9L11 12V6Z" fill="#333333"/>
  </svg>
);

// Image Icon
const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#7E57C2"/>
    <circle cx="6" cy="6" r="1.5" fill="white"/>
    <path d="M3 11L6 8L8 10L11 7L13 9V12C13 12.5523 12.5523 13 12 13H4C3.44772 13 3 12.5523 3 12V11Z" fill="white"/>
  </svg>
);

// Package.json Icon
const PackageJsonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#CB3837"/>
    <path d="M3 5H5V11H3V5ZM6 5H8V9H9V5H11V11H8V10H6V5Z" fill="white"/>
    <path d="M12 5H14V11H12V5Z" fill="white"/>
  </svg>
);

// tsconfig.json Icon
const TsConfigIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#3178C6"/>
    <path d="M3 5H5V11H3V5Z" fill="#FBC02D"/>
    <path d="M6 5H8V9H9V5H11V11H8V10H6V5Z" fill="#FBC02D"/>
  </svg>
);

// Vite Icon
const ViteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="viteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#41D1FF"/>
        <stop offset="100%" stopColor="#BD34FE"/>
      </linearGradient>
    </defs>
    <rect width="16" height="16" rx="2" fill="url(#viteGradient)"/>
    <path d="M12 4L8 13L4 4L8 6L12 4Z" fill="#FFC107"/>
    <path d="M12 4L8 6V13L12 4Z" fill="#FFE082"/>
  </svg>
);

// Git Icon
const GitIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#F05033"/>
    <path d="M7.5 2L2 7.5L7.5 13L13 7.5L7.5 2ZM7.5 6C8.05228 6 8.5 6.44772 8.5 7V8C8.5 8.55228 8.05228 9 7.5 9C6.94772 9 6.5 8.55228 6.5 8V7C6.5 6.44772 6.94772 6 7.5 6Z" fill="white"/>
  </svg>
);

// README Icon
const ReadmeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#4A90E2"/>
    <path d="M4 5H12V6H4V5Z" fill="white"/>
    <path d="M4 7H12V8H4V7Z" fill="white"/>
    <path d="M4 9H9V10H4V9Z" fill="white"/>
  </svg>
);

// Default File Icon
const DefaultFileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 2H3C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V7L9 2Z" fill="#A0A0A0"/>
    <path d="M9 2V7H14" fill="#808080"/>
  </svg>
);
