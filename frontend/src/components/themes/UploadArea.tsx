/**
 * UploadArea - Drag-and-drop zone for custom theme upload
 * Feature: 006-themes-and-deploy (US2)
 *
 * Accepts .zip files up to 50 MB
 * Shows drag-over state, file validation, and error feedback
 */

import React, { useRef, useState } from 'react';
import { useThemesStore } from '../../store/themesStore';
import { themeService } from '../../services/themeService';
import './UploadArea.css';

interface UploadAreaProps {
  siteId: string;
  userId: string;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ siteId, userId }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createUploadSession = useThemesStore((state) => state.createUploadSession);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);

    // Validate file type
    if (!file.name.endsWith('.zip')) {
      setError('Please upload a .zip file');
      return;
    }

    // Validate file size (50 MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError('File size exceeds 50 MB limit');
      return;
    }

    try {
      // Process upload using themeService
      await themeService.processUpload(
        file,
        siteId,
        userId,
        createUploadSession
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-area">
      <div
        className={`upload-area__dropzone ${isDragging ? 'upload-area__dropzone--dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        aria-label="Upload theme file area"
        tabIndex={0}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div className="upload-area__icon">📦</div>
          <div>
            <h3 className="upload-area__title">Upload your own theme</h3>
            <p className="upload-area__description">
              Drag & drop .zip file or click browse (Max 50 MB)
            </p>
          </div>
        </div>

        <button
          className="upload-area__browse-btn"
          onClick={handleBrowseClick}
          type="button"
          aria-label="Browse for theme file"
        >
          Browse files
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileSelect}
          className="upload-area__file-input"
          aria-label="Upload theme file"
        />
      </div>

      {error && (
        <div className="upload-area__error" role="alert">
          <span className="upload-area__error-icon">⚠️</span>
          <span className="upload-area__error-message">{error}</span>
        </div>
      )}
    </div>
  );
};
