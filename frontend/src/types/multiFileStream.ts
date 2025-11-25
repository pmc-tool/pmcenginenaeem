/**
 * Multi-File Streaming Types
 * For AI code editor style file-by-file streaming
 */

export interface FileChange {
  filePath: string
  content: string
  action: 'create' | 'modify' | 'delete'
  language?: string
}

export interface StreamingSession {
  id: string
  files: FileChange[]
  currentFileIndex: number
  status: 'idle' | 'streaming' | 'completed' | 'cancelled'
  startedAt: number
  completedAt?: number
}

export interface FileStreamProgress {
  sessionId: string
  currentFile: FileChange | null
  currentFileIndex: number
  totalFiles: number
  currentFileProgress: number // 0-100
  overallProgress: number // 0-100
  isStreaming: boolean
}
