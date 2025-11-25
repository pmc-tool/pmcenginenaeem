/**
 * Mock AI Service for Chat Panel
 * Simulates AI responses and operation logging for frontend testing
 * Feature: 002-chat-panel
 *
 * FR-060 through FR-065: Mock AI requirements
 * Enhanced for feature 005-basic-ai-training: AI responses now use training context
 */

import type { ChatMessage, Scope } from '../types/chat'
import { injectTrainingContext } from './aiContextService'

/**
 * Action keywords detected from user messages
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
  | 'general'

/**
 * Mock configuration for testing different scenarios
 */
interface MockConfig {
  minDelay: number
  maxDelay: number
  creditsPerOperation: number
  failureProbability: number
}

let config: MockConfig = {
  minDelay: 2000, // 2 seconds
  maxDelay: 3000, // 3 seconds
  creditsPerOperation: 10,
  failureProbability: 0, // No failures by default
}

/**
 * Update mock configuration
 * Useful for testing different scenarios
 */
export function setMockConfig(newConfig: Partial<MockConfig>): void {
  config = { ...config, ...newConfig }
}

/**
 * Get current mock configuration
 */
export function getMockConfig(): MockConfig {
  return { ...config }
}

/**
 * Random delay between min and max milliseconds
 */
function randomDelay(min: number, max: number): Promise<void> {
  const delay = Math.random() * (max - min) + min
  return new Promise((resolve) => setTimeout(resolve, delay))
}

/**
 * Detect action keyword from user message
 * FR-061: Mock handler parses keywords
 *
 * @param text User message text
 * @returns Detected action keyword or 'general'
 */
export function detectAction(text: string): ActionKeyword {
  const lowerText = text.toLowerCase()

  if (lowerText.includes('rewrite')) return 'rewrite'
  if (lowerText.includes('improve')) return 'improve'
  if (lowerText.includes('generate')) return 'generate'
  if (lowerText.includes('fix')) return 'fix'
  if (lowerText.includes('shorten')) return 'shorten'
  if (lowerText.includes('expand')) return 'expand'
  if (lowerText.includes('audit')) return 'audit'
  if (lowerText.includes('analyze')) return 'analyze'

  return 'general'
}

/**
 * Get mock response template based on action and scope
 *
 * @param action Detected action keyword
 * @param scope Scope of operation
 * @returns Canned response text
 */
function getResponseTemplate(action: ActionKeyword, scope: Scope): string {
  const templates: Record<ActionKeyword, Record<Scope, string>> = {
    rewrite: {
      field: "I've rewritten this field with clearer, more engaging language.",
      section: "I've rewritten your section content with a more compelling approach, focusing on user benefits and clear value propositions.",
      page: "I've rewritten your page content to improve flow, clarity, and engagement throughout all sections.",
      feature: "I've rewritten content across this feature to maintain consistent messaging and tone.",
    },
    improve: {
      field: "I've improved this field to be more concise and impactful.",
      section: "I've improved this section by enhancing readability, adding stronger calls-to-action, and refining the messaging.",
      page: "I've improved the page with better structure, clearer headings, and more engaging copy.",
      feature: "I've improved content across this feature for better consistency and user experience.",
    },
    generate: {
      field: "I've generated new content for this field based on best practices.",
      section: "I've generated a complete section with relevant content, headings, and supporting text.",
      page: "I've generated comprehensive page content including hero, features, benefits, and call-to-action sections.",
      feature: "I've generated consistent content across this feature following your brand guidelines.",
    },
    fix: {
      field: "I've fixed grammatical errors and improved clarity in this field.",
      section: "I've fixed issues with tone, grammar, and structure in this section.",
      page: "I've fixed content issues across the page including typos, inconsistencies, and unclear messaging.",
      feature: "I've fixed content problems throughout this feature for better quality.",
    },
    shorten: {
      field: "I've shortened this field while preserving the key message.",
      section: "I've condensed this section to be more concise while maintaining impact.",
      page: "I've shortened the page content, removing redundancy and focusing on essentials.",
      feature: "I've shortened content across this feature for better scannability.",
    },
    expand: {
      field: "I've expanded this field with additional supporting details.",
      section: "I've expanded this section with more comprehensive information and examples.",
      page: "I've expanded the page with richer content, more details, and supporting evidence.",
      feature: "I've expanded content across this feature to provide deeper value.",
    },
    audit: {
      field: "I've audited this field - it's clear and effective.",
      section: "I've audited this section and identified 3 opportunities for improvement: stronger headline, clearer benefits, and more specific call-to-action.",
      page: "I've audited the entire page and found 5 areas to enhance: hero message clarity, feature descriptions, social proof, trust signals, and call-to-action placement.",
      feature: "I've audited this feature for SEO, readability, and conversion optimization - detailed report available.",
    },
    analyze: {
      field: "I've analyzed this field - it effectively communicates the key point.",
      section: "I've analyzed this section's performance potential: good structure, could benefit from more specific benefits and social proof.",
      page: "I've analyzed the page: strong visual hierarchy, clear value proposition, opportunities to strengthen credibility elements.",
      feature: "I've analyzed this feature comprehensively across content quality, user experience, and conversion potential.",
    },
    general: {
      field: "I understand you're asking about this field. How can I help improve it?",
      section: "I'm ready to help with this section. I can rewrite, improve, expand, or make specific changes based on your needs.",
      page: "I can help optimize this page. Let me know what specific improvements you'd like to see.",
      feature: "I'm here to assist with this feature. What would you like me to focus on?",
    },
  }

  return templates[action][scope]
}

/**
 * Format human-readable log message
 * FR-028: Must NOT show technical stack traces
 *
 * @param status Operation status
 * @param scope Operation scope
 * @param progress Optional progress indicator
 * @returns Human-readable log message
 */
export function formatLogMessage(
  status: 'analyzing' | 'processing' | 'complete' | 'error',
  scope: Scope,
  progress?: string
): string {
  const scopeLabel = scope.charAt(0).toUpperCase() + scope.slice(1)

  switch (status) {
    case 'analyzing':
      return `Analyzing ${scopeLabel.toLowerCase()} structure...`
    case 'processing':
      return progress
        ? `Processing ${scopeLabel.toLowerCase()} content (${progress})...`
        : `Processing ${scopeLabel.toLowerCase()} content...`
    case 'complete':
      return `Complete! ${scopeLabel} has been updated.`
    case 'error':
      return `Operation failed: Unable to process ${scopeLabel.toLowerCase()}. Please try again.`
  }
}

/**
 * Generate mock AI response
 * FR-060: Simulates 2-3 second delay then returns canned response
 * FR-061: Parses keywords and returns appropriate action
 * Enhanced: Injects training context when available (feature 005-basic-ai-training)
 *
 * @param userMessage User's message text
 * @param scope Scope of operation
 * @param siteId Optional site ID to load training context (defaults to demo_site_001)
 * @returns Promise resolving to AI response after delay
 */
export async function generateMockResponse(
  userMessage: string,
  scope: Scope,
  siteId: string = 'demo_site_001'
): Promise<Omit<ChatMessage, 'id' | 'createdAt'>> {
  // Simulate random delay (2-3 seconds by default)
  await randomDelay(config.minDelay, config.maxDelay)

  // Detect action from message
  const action = detectAction(userMessage)

  // Get appropriate response template
  let responseText = getResponseTemplate(action, scope)

  // Inject training context if available
  const trainingContext = injectTrainingContext(siteId)
  if (trainingContext) {
    console.log('[MockAI] Using training context for site:', siteId)
    console.log('[MockAI] Training context:', trainingContext)
    // Add brand-aware suffix to show AI is using training data
    responseText = enhanceResponseWithTraining(responseText, trainingContext, action)
  } else {
    console.log('[MockAI] No training context found for site:', siteId)
  }

  return {
    type: 'ai',
    text: responseText,
    scope,
    action,
    isCollapsed: responseText.length > 400, // Collapse long responses
  }
}

/**
 * Enhance AI response with training context awareness
 * Shows user that AI is using their brand information
 *
 * @param baseResponse Base template response
 * @param trainingContext Training context string
 * @param action Detected action
 * @returns Enhanced response text
 */
function enhanceResponseWithTraining(
  baseResponse: string,
  trainingContext: string,
  action: ActionKeyword
): string {
  // Extract brand name from context if available
  const brandMatch = trainingContext.match(/Brand: (.+?)(?:\n|$)/)
  const brandName = brandMatch ? brandMatch[1].trim() : null

  // Add brand-aware context to certain actions
  if (brandName && (action === 'generate' || action === 'rewrite' || action === 'improve')) {
    return `${baseResponse}\n\nI've tailored this content to align with ${brandName}'s brand voice and messaging guidelines from your AI training profile.`
  }

  return baseResponse
}

/**
 * Simulate AI operation with progressive logging
 * FR-062: Generates log messages showing progression
 * T044: Enhanced to generate operation log data for OperationLog component
 *
 * @param userMessage User's message text
 * @param scope Scope of operation
 * @param targetEntityId Entity being modified
 * @returns Async generator yielding log messages with operation data
 */
export async function* simulateOperation(
  userMessage: string,
  scope: Scope,
  targetEntityId: string
): AsyncGenerator<Omit<ChatMessage, 'id' | 'createdAt'>, void, unknown> {
  const action = detectAction(userMessage)
  const operationId = `op-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const messages: string[] = []

  // Step 1: Analyzing (after 500ms)
  await randomDelay(500, 800)
  messages.push(formatLogMessage('analyzing', scope))
  yield {
    type: 'log',
    text: formatLogMessage('analyzing', scope),
    scope,
    action,
    isCollapsed: false,
    operationLog: {
      operationId,
      status: 'running',
      messages: [...messages],
    },
  }

  // Step 2: Processing (after another 800ms)
  await randomDelay(800, 1200)

  // For multi-step operations, show progress
  if (scope === 'page' || scope === 'feature') {
    messages.push(formatLogMessage('processing', scope, '1 of 3'))
    yield {
      type: 'log',
      text: formatLogMessage('processing', scope, '1 of 3'),
      scope,
      action,
      isCollapsed: false,
      operationLog: {
        operationId,
        status: 'running',
        messages: [...messages],
      },
    }

    await randomDelay(400, 600)
    messages.push(formatLogMessage('processing', scope, '2 of 3'))
    yield {
      type: 'log',
      text: formatLogMessage('processing', scope, '2 of 3'),
      scope,
      action,
      isCollapsed: false,
      operationLog: {
        operationId,
        status: 'running',
        messages: [...messages],
      },
    }

    await randomDelay(400, 600)
    messages.push(formatLogMessage('processing', scope, '3 of 3'))
    yield {
      type: 'log',
      text: formatLogMessage('processing', scope, '3 of 3'),
      scope,
      action,
      isCollapsed: false,
      operationLog: {
        operationId,
        status: 'running',
        messages: [...messages],
      },
    }
  } else {
    messages.push(formatLogMessage('processing', scope))
    yield {
      type: 'log',
      text: formatLogMessage('processing', scope),
      scope,
      action,
      isCollapsed: false,
      operationLog: {
        operationId,
        status: 'running',
        messages: [...messages],
      },
    }
  }

  // Step 3: Complete (after final delay)
  await randomDelay(300, 500)
  messages.push(formatLogMessage('complete', scope))
  yield {
    type: 'log',
    text: formatLogMessage('complete', scope),
    scope,
    action,
    relatedEntityId: targetEntityId,
    isCollapsed: false,
    operationLog: {
      operationId,
      status: 'success',
      messages: [...messages],
    },
  }
}
