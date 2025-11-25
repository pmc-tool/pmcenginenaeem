/**
 * Code Streaming Utilities
 * Provides typewriter/live coding animation effects
 */

export interface StreamConfig {
  speed: number // Characters per millisecond
  chunkSize: number // Number of characters to add per tick
  lineDelay?: number // Extra delay between lines (ms)
}

export const DEFAULT_STREAM_CONFIG: StreamConfig = {
  speed: 50, // 50ms per character
  chunkSize: 1, // One character at a time for smooth typing
  lineDelay: 100, // 100ms pause between lines
}

export type StreamCallback = (currentCode: string, isComplete: boolean) => void

/**
 * Stream code content with typewriter effect
 * @param targetCode - The complete code to stream
 * @param callback - Called with each update
 * @param config - Streaming configuration
 * @returns Cleanup function to cancel streaming
 */
export function streamCode(
  targetCode: string,
  callback: StreamCallback,
  config: StreamConfig = DEFAULT_STREAM_CONFIG
): () => void {
  let currentIndex = 0
  let lastLineIndex = 0
  let isCancelled = false
  let timeoutId: NodeJS.Timeout | null = null

  const tick = () => {
    if (isCancelled) return

    // Calculate next chunk
    const nextIndex = Math.min(currentIndex + config.chunkSize, targetCode.length)
    const currentCode = targetCode.slice(0, nextIndex)

    // Check if we crossed a newline
    const hasNewline = targetCode.slice(currentIndex, nextIndex).includes('\n')

    callback(currentCode, nextIndex >= targetCode.length)

    currentIndex = nextIndex

    // Continue streaming if not complete
    if (currentIndex < targetCode.length) {
      const delay = hasNewline && config.lineDelay
        ? config.speed + config.lineDelay
        : config.speed

      timeoutId = setTimeout(tick, delay)
    }
  }

  // Start streaming
  tick()

  // Return cleanup function
  return () => {
    isCancelled = true
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

/**
 * Calculate estimated duration for streaming given code
 */
export function estimateStreamDuration(code: string, config: StreamConfig = DEFAULT_STREAM_CONFIG): number {
  const lines = code.split('\n')
  const totalChars = code.length
  const lineDelayTotal = (lines.length - 1) * (config.lineDelay || 0)

  return (totalChars * config.speed) + lineDelayTotal
}

/**
 * Stream code line by line (faster than character-by-character)
 */
export function streamCodeByLine(
  targetCode: string,
  callback: StreamCallback,
  lineDelay: number = 150
): () => void {
  const lines = targetCode.split('\n')
  let currentLineIndex = 0
  let isCancelled = false
  let timeoutId: NodeJS.Timeout | null = null

  const tick = () => {
    if (isCancelled) return

    const currentCode = lines.slice(0, currentLineIndex + 1).join('\n')
    const isComplete = currentLineIndex >= lines.length - 1

    callback(currentCode, isComplete)

    currentLineIndex++

    if (currentLineIndex < lines.length) {
      timeoutId = setTimeout(tick, lineDelay)
    }
  }

  tick()

  return () => {
    isCancelled = true
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}
