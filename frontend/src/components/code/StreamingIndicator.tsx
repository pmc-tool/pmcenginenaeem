/**
 * StreamingIndicator Component
 * Shows AI coding progress with file-by-file visualization
 */

import React from 'react'
import { useCodeStore } from '../../store/codeStore'
import { useDashboardStore } from '../../store/dashboardStore'
import './StreamingIndicator.css'

export const StreamingIndicator: React.FC = () => {
  const {
    isStreaming,
    streamingSession,
    currentStreamingFile,
    fileStreamProgress,
  } = useCodeStore()

  const isAITrainingOpen = useDashboardStore((state) => state.shell.isAITrainingOpen)

  // Hide streaming indicator when AI Training panel is open to prevent visual conflicts
  if (!isStreaming || !streamingSession || isAITrainingOpen) {
    return null
  }

  const { files, currentFileIndex } = streamingSession
  const totalFiles = files.length
  const overallProgress = ((currentFileIndex / totalFiles) * 100) + ((fileStreamProgress / totalFiles))

  return (
    <div className="streaming-indicator">
      <div className="streaming-indicator__header">
        <div className="streaming-indicator__title">
          <span className="streaming-indicator__icon">✨</span>
          <span className="streaming-indicator__text">AI is coding...</span>
        </div>
        <div className="streaming-indicator__stats">
          {currentFileIndex + 1} / {totalFiles} files
        </div>
      </div>

      {currentStreamingFile && (
        <div className="streaming-indicator__current-file">
          <div className="streaming-indicator__file-info">
            <span className="streaming-indicator__file-icon">
              {currentStreamingFile.action === 'create' ? '✚' : '✎'}
            </span>
            <span className="streaming-indicator__file-path">
              {currentStreamingFile.filePath}
            </span>
            <span className="streaming-indicator__file-action">
              {currentStreamingFile.action === 'create' ? 'Creating' : 'Modifying'}
            </span>
          </div>
          <div className="streaming-indicator__progress-bar">
            <div
              className="streaming-indicator__progress-fill"
              style={{ width: `${fileStreamProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upcoming files */}
      {currentFileIndex < totalFiles - 1 && (
        <div className="streaming-indicator__queue">
          <div className="streaming-indicator__queue-title">Next up:</div>
          <div className="streaming-indicator__queue-list">
            {files.slice(currentFileIndex + 1, currentFileIndex + 4).map((file, idx) => (
              <div key={idx} className="streaming-indicator__queue-item">
                <span className="streaming-indicator__queue-icon">
                  {file.action === 'create' ? '✚' : '✎'}
                </span>
                <span className="streaming-indicator__queue-path">{file.filePath}</span>
              </div>
            ))}
            {totalFiles - currentFileIndex > 4 && (
              <div className="streaming-indicator__queue-more">
                +{totalFiles - currentFileIndex - 4} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overall progress */}
      <div className="streaming-indicator__overall">
        <div className="streaming-indicator__overall-bar">
          <div
            className="streaming-indicator__overall-fill"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="streaming-indicator__overall-text">
          {Math.round(overallProgress)}% complete
        </div>
      </div>
    </div>
  )
}
