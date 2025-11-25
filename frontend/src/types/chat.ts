/**
 * Type definitions for AI Chat Panel & Command Center
 * Feature: 002-chat-panel
 */

export type MessageType = 'user' | 'ai' | 'log'
export type Scope = 'field' | 'section' | 'page' | 'feature'
export type OperationStatus = 'pending' | 'running' | 'success' | 'error'
export type AIModel = 'chatgpt' | 'claude' | 'gemini'

/**
 * Represents a single message in the chat history
 */
export interface ChatMessage {
  /** Unique message identifier (UUID v4) */
  id: string

  /** Message type */
  type: MessageType

  /** Message content (markdown supported for AI messages) */
  text: string

  /** Scope of the message */
  scope: Scope

  /** Optional action type (e.g., "rewrite", "improve", "generate") */
  action?: string

  /** Unix timestamp in milliseconds */
  createdAt: number

  /** Optional link to page/section ID for "View change" functionality */
  relatedEntityId?: string

  /** Whether message is collapsed (for messages >8 lines) */
  isCollapsed: boolean

  /** Optional operation log data (for type: 'log' messages with operation details) */
  operationLog?: {
    operationId: string
    status: OperationStatus
    messages: string[]
  }
}

/**
 * Represents the execution log of an AI operation
 */
export interface ChatOperationLog {
  /** Unique operation identifier (UUID v4) */
  operationId: string

  /** Scope at time of operation start */
  scope: Scope

  /** Page/section ID being modified */
  targetEntityId: string

  /** Current operation status */
  status: OperationStatus

  /** Array of log lines showing progression */
  messages: string[]

  /** When operation started */
  createdAt: number

  /** When operation finished (success or error) */
  completedAt?: number
}

/**
 * Frontend state slice managing the chat panel
 */
export interface ChatState {
  /** Full message history (user, ai, log) */
  messages: ChatMessage[]

  /** Whether chat panel is visible */
  isOpen: boolean

  /** Currently selected scope in composer */
  scope: Scope

  /** Whether AI operation is in progress */
  isBusy: boolean

  /** Formatted context label (e.g., "Home / Hero") */
  currentContext: string

  /** Current width in pixels (360-600px) */
  panelWidth: number

  /** Currently selected AI model */
  selectedModel: AIModel
}
