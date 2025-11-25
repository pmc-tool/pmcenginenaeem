/**
 * useCodeStreaming Hook
 * Manages live code streaming animation with multi-file support
 */

import { useEffect, useRef } from 'react'
import { useCodeStore } from '../store/codeStore'
import { streamCode, DEFAULT_STREAM_CONFIG } from '../utils/codeStreaming'

export function useCodeStreaming() {
  const {
    isStreaming,
    streamingTarget,
    streamingSession,
    currentStreamingFile,
    updateStreamingProgress,
    updateFileStreamProgress,
    completeStreaming,
    completeCurrentFile,
  } = useCodeStore()

  const cleanupRef = useRef<(() => void) | null>(null)
  const currentFileRef = useRef<string | null>(null)

  useEffect(() => {
    // Start streaming when isStreaming becomes true
    if (isStreaming && streamingTarget) {
      // Check if we switched to a new file
      const currentFilePath = currentStreamingFile?.filePath || null
      const hasFileChanged = currentFilePath !== currentFileRef.current

      // Clean up previous stream if file changed or just starting
      if (cleanupRef.current && hasFileChanged) {
        cleanupRef.current()
        cleanupRef.current = null
      }

      // Update current file reference
      currentFileRef.current = currentFilePath

      // Start new stream (or continue existing)
      if (!cleanupRef.current) {
        cleanupRef.current = streamCode(
          streamingTarget,
          (currentCode, isComplete) => {
            const progress = (currentCode.length / streamingTarget.length) * 100

            // Use multi-file progress if in a session
            if (streamingSession) {
              updateFileStreamProgress(currentCode, progress)

              if (isComplete) {
                // Complete current file and move to next
                setTimeout(() => {
                  completeCurrentFile()
                }, 75) // Very brief pause before next file (4x faster: was 300ms)
              }
            } else {
              // Single file streaming
              updateStreamingProgress(currentCode, progress)

              if (isComplete) {
                completeStreaming()
              }
            }
          },
          {
            ...DEFAULT_STREAM_CONFIG,
            speed: 6, // 6ms per character (4x faster: was 25ms)
            chunkSize: 5, // 5 characters at a time for faster flow
            lineDelay: 15, // Very brief pause between lines (4x faster: was 60ms)
          }
        )
      }
    }

    // Cleanup on unmount or when streaming stops
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [
    isStreaming,
    streamingTarget,
    streamingSession,
    currentStreamingFile,
    updateStreamingProgress,
    updateFileStreamProgress,
    completeStreaming,
    completeCurrentFile,
  ])
}
