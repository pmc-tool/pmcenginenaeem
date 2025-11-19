/**
 * Mock AI API Contract
 *
 * Defines interfaces for mock AI response handlers used in frontend testing.
 * This contract will be replaced with real API integration in future feature.
 *
 * Requirements: FR-060 through FR-065
 */

import type { Scope } from '../../../frontend/src/types/chat'

// ============================================================================
// Request Types
// ============================================================================

/**
 * User message input for AI processing
 */
export interface AIMessageRequest {
  /** User's message text */
  text: string

  /** Scope of AI operation (field, section, page, feature) */
  scope: Scope

  /** Currently selected page ID for context */
  selectedPageId: string | null

  /** Currently selected section ID for context */
  selectedSectionId: string | null

  /** Current AI credits available */
  aiCreditsCount: number
}

/**
 * Action keywords for mock AI parsing
 * FR-061: Mock handler parses keywords to return appropriate response
 */
export type ActionKeyword =
  | 'rewrite'
  | 'improve'
  | 'generate'
  | 'fix'
  | 'shorten'
  | 'expand'
  | 'audit'
  | 'analyze'

// ============================================================================
// Response Types
// ============================================================================

/**
 * AI response with generated content
 */
export interface AIMessageResponse {
  /** Generated response text (supports markdown) */
  text: string

  /** Action performed (derived from keywords) */
  action: string

  /** Scope of the response */
  scope: Scope

  /** Optional reference to modified entity */
  relatedEntityId?: string

  /** Number of AI credits consumed (always 10 in mock per FR-064) */
  creditsConsumed: number
}

/**
 * Single log entry in operation progression
 * FR-062: Must show human-readable progression
 */
export interface OperationLogEntry {
  /** Log message text (human-readable, no technical details) */
  message: string

  /** Timestamp when log entry was created */
  timestamp: number

  /** Current status of operation */
  status: 'analyzing' | 'processing' | 'complete' | 'error'
}

/**
 * Complete operation log for an AI action
 * FR-063: Mock operation log structure
 */
export interface MockOperationLog {
  /** Unique operation identifier */
  operationId: string

  /** Scope of operation */
  scope: Scope

  /** Target entity being modified */
  targetEntityId: string

  /** Final status */
  status: 'pending' | 'running' | 'success' | 'error'

  /** Array of log entries showing progression */
  logs: OperationLogEntry[]

  /** Operation start time */
  createdAt: number

  /** Operation completion time (if finished) */
  completedAt?: number

  /** Human-readable summary for completion (FR-024) */
  summary?: string

  /** Optional link text for "View change" button (FR-025) */
  viewChangeLinkText?: string
}

// ============================================================================
// Mock Handler Functions
// ============================================================================

/**
 * Generate mock AI response based on user input
 *
 * FR-060: Simulates 2-3 second delay then returns canned response
 * FR-061: Parses keywords and returns appropriate action
 *
 * @param request User message and context
 * @returns Promise resolving to AI response after 2-3 second delay
 *
 * @example
 * const response = await generateMockResponse({
 *   text: "Rewrite this headline to be more compelling",
 *   scope: "section",
 *   selectedPageId: "page-home",
 *   selectedSectionId: "section-hero",
 *   aiCreditsCount: 250
 * })
 */
export async function generateMockResponse(
  request: AIMessageRequest
): Promise<AIMessageResponse>

/**
 * Simulate AI operation with progressive logging
 *
 * FR-062: Generates log messages showing progression
 * Returns async generator yielding log entries over time
 *
 * @param request User message and context
 * @returns Async generator yielding OperationLogEntry objects
 *
 * @example
 * for await (const logEntry of simulateOperation(request)) {
 *   console.log(logEntry.message)  // "Analyzing...", "Processing...", "Complete"
 * }
 */
export async function* simulateOperation(
  request: AIMessageRequest
): AsyncGenerator<OperationLogEntry, MockOperationLog, unknown>

/**
 * Parse user message for action keywords
 *
 * @param text User message text
 * @returns Detected action keyword or 'general' if none found
 *
 * @example
 * detectAction("Rewrite this section") // returns "rewrite"
 * detectAction("Make this better")     // returns "improve"
 * detectAction("Hello AI")             // returns "general"
 */
export function detectAction(text: string): ActionKeyword | 'general'

/**
 * Get mock response template for an action
 *
 * @param action Detected action keyword
 * @param scope Scope of operation
 * @returns Canned response text
 *
 * @example
 * getResponseTemplate("rewrite", "section")
 * // returns "I've rewritten your section content with a more compelling approach..."
 */
export function getResponseTemplate(
  action: ActionKeyword | 'general',
  scope: Scope
): string

/**
 * Format human-readable log message
 *
 * FR-028: Must NOT show technical stack traces or code errors
 *
 * @param status Current operation status
 * @param scope Operation scope
 * @param progress Optional progress indicator (e.g., "2 of 4 fields")
 * @returns Human-readable log message
 *
 * @example
 * formatLogMessage("analyzing", "section")
 * // returns "Analyzing section structure..."
 *
 * formatLogMessage("processing", "page", "3 of 5")
 * // returns "Processing page content (3 of 5)..."
 */
export function formatLogMessage(
  status: OperationLogEntry['status'],
  scope: Scope,
  progress?: string
): string

/**
 * Simulate random delay between min and max milliseconds
 * Used internally by mock handlers
 *
 * @param min Minimum delay in milliseconds
 * @param max Maximum delay in milliseconds
 * @returns Promise that resolves after random delay
 */
export function randomDelay(min: number, max: number): Promise<void>

// ============================================================================
// Error Types
// ============================================================================

/**
 * Mock AI error response
 * FR-027: Failed operations show human-readable error logs
 */
export interface MockAIError {
  /** Error type for handling */
  type: 'insufficient_credits' | 'network_error' | 'operation_failed'

  /** Human-readable error message (no technical details) */
  message: string

  /** Whether operation can be retried */
  retryable: boolean

  /** Original operation request for retry */
  originalRequest?: AIMessageRequest
}

/**
 * Create mock error based on conditions
 *
 * @param request Original request
 * @param type Error type
 * @returns MockAIError object
 *
 * @example
 * if (request.aiCreditsCount === 0) {
 *   throw createMockError(request, 'insufficient_credits')
 * }
 */
export function createMockError(
  request: AIMessageRequest,
  type: MockAIError['type']
): MockAIError

// ============================================================================
// Configuration
// ============================================================================

/**
 * Mock AI configuration
 * Can be adjusted for testing different scenarios
 */
export interface MockAIConfig {
  /** Minimum response delay in milliseconds (default: 2000) */
  minDelay: number

  /** Maximum response delay in milliseconds (default: 3000) */
  maxDelay: number

  /** Credits consumed per operation (default: 10) */
  creditsPerOperation: number

  /** Probability of operation failure (0-1, default: 0 for testing) */
  failureProbability: number

  /** Enable detailed logging to console (default: false) */
  debugMode: boolean
}

/**
 * Get current mock AI configuration
 */
export function getMockConfig(): MockAIConfig

/**
 * Update mock AI configuration
 * Useful for testing different scenarios
 *
 * @param config Partial configuration to merge with defaults
 *
 * @example
 * setMockConfig({ minDelay: 500, maxDelay: 1000 }) // Faster responses for testing
 * setMockConfig({ failureProbability: 0.1 })       // 10% chance of failure
 */
export function setMockConfig(config: Partial<MockAIConfig>): void

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if response is an error
 */
export function isMockAIError(
  response: AIMessageResponse | MockAIError
): response is MockAIError

/**
 * Check if action is a valid keyword
 */
export function isActionKeyword(
  action: string
): action is ActionKeyword

// ============================================================================
// Notes for Future Real API Integration
// ============================================================================

/**
 * When replacing mock with real API:
 *
 * 1. Replace generateMockResponse with actual API call
 *    - POST /api/ai/message
 *    - Body: { text, scope, context: { pageId, sectionId } }
 *    - Response: { text, action, scope, creditsConsumed }
 *
 * 2. Replace simulateOperation with WebSocket or SSE connection
 *    - WS: ws://api/ai/operations/{operationId}
 *    - SSE: GET /api/ai/operations/{operationId}/stream
 *    - Stream: Server-sent log entries until completion
 *
 * 3. Add authentication headers (JWT token from auth context)
 *
 * 4. Add error handling for network failures, timeouts, rate limits
 *
 * 5. Update error types to match real API error codes
 *
 * 6. Replace credits system with server-side validation
 *
 * 7. Add retry logic with exponential backoff
 *
 * 8. Add request queuing for offline support
 */

/**
 * Example real API implementation signature:
 *
 * async function generateRealAIResponse(
 *   request: AIMessageRequest,
 *   authToken: string
 * ): Promise<AIMessageResponse | APIError>
 *
 * async function* streamRealOperation(
 *   request: AIMessageRequest,
 *   authToken: string
 * ): AsyncGenerator<OperationLogEntry, MockOperationLog, unknown>
 */
