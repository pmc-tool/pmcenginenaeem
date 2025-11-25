/**
 * Code Command Detector
 * Feature: 003-ai-coding-mode
 * Detects code-related commands in chat messages
 * Implements T026 from tasks.md
 */

import type { Scope } from '../types/chat';
import type { SyntaxLanguage, CodeGenerationRequest } from '../types/code';

/**
 * Patterns that indicate a code-related request
 */
const CODE_COMMAND_PATTERNS = [
  // Direct code requests
  /\b(write|create|generate|add|make)\s+(a\s+)?(function|component|class|method|hook|interface|type)\b/i,
  /\b(implement|code|build)\s+/i,
  /\b(refactor|optimize|improve)\s+(this\s+)?(code|function|component)\b/i,

  // Code modifications
  /\b(update|modify|change|edit|fix)\s+(the\s+)?(code|function|component|method)\b/i,
  /\b(add|remove|delete)\s+(a\s+)?(parameter|prop|argument|field|property)\b/i,

  // Bug fixes
  /\b(fix|debug|resolve)\s+(the\s+)?(bug|error|issue|problem)\b/i,

  // Technical operations
  /\b(extract|split|combine|merge)\s+(into\s+)?(function|component|method)\b/i,
  /\b(rename|move)\s+/i,

  // Code snippets or examples
  /```/,
  /\bcode\s+for\b/i,
  /\bshow\s+me\s+(how|the|a)\b/i,
];

/**
 * Language detection patterns based on keywords in the prompt
 */
const LANGUAGE_PATTERNS: Record<SyntaxLanguage, RegExp[]> = {
  typescript: [
    /\btypescript\b/i,
    /\bts\b/i,
    /\binterface\b/i,
    /\btype\s+\w+\s*=/i,
  ],
  javascript: [
    /\bjavascript\b/i,
    /\bjs\b/i,
  ],
  jsx: [
    /\bjsx\b/i,
    /\breact\s+component\b/i,
  ],
  tsx: [
    /\btsx\b/i,
    /\breact\s+typescript\b/i,
  ],
  css: [
    /\bcss\b/i,
    /\bstyles?\b/i,
    /\bstyling\b/i,
  ],
  html: [
    /\bhtml\b/i,
    /\bmarkup\b/i,
  ],
  json: [
    /\bjson\b/i,
  ],
};

/**
 * Scope-to-language mapping (default language based on scope)
 */
const SCOPE_LANGUAGE_MAP: Record<Scope, SyntaxLanguage> = {
  field: 'tsx', // Fields are typically React components
  section: 'tsx', // Sections are typically React components
  page: 'tsx', // Pages are typically React components
  feature: 'typescript', // Features can be any TypeScript
};

export interface CodeCommandDetectionResult {
  isCodeCommand: boolean;
  confidence: number; // 0-1 scale
  detectedLanguage: SyntaxLanguage | null;
  suggestedFilePath: string | null;
  targetName: string | null;
}

/**
 * Detect if a chat message is a code-related command
 * @param message - The user's chat message
 * @param scope - Current chat scope
 * @param currentContext - Current selection context (e.g., "Home / Hero")
 * @returns Detection result with confidence score
 */
export function detectCodeCommand(
  message: string,
  scope: Scope,
  currentContext: string
): CodeCommandDetectionResult {
  let confidence = 0;
  let detectedLanguage: SyntaxLanguage | null = null;
  let suggestedFilePath: string | null = null;
  let targetName: string | null = null;

  // Check against code command patterns
  const matchedPatterns = CODE_COMMAND_PATTERNS.filter((pattern) =>
    pattern.test(message)
  );

  if (matchedPatterns.length > 0) {
    // Base confidence from pattern matches (0.3 - 0.8)
    confidence = Math.min(0.3 + matchedPatterns.length * 0.15, 0.8);
  }

  // Detect language from message
  for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    const hasMatch = patterns.some((pattern) => pattern.test(message));
    if (hasMatch) {
      detectedLanguage = lang as SyntaxLanguage;
      confidence += 0.2;
      break;
    }
  }

  // If no language detected, use scope default
  if (!detectedLanguage && confidence > 0) {
    detectedLanguage = SCOPE_LANGUAGE_MAP[scope];
  }

  // Extract target name from context
  if (confidence > 0 && currentContext) {
    // Parse context like "Home / Hero" or "Section Button"
    const parts = currentContext.split('/').map((s) => s.trim());
    targetName = parts[parts.length - 1] || null;
  }

  // Generate suggested file path based on scope and context
  if (confidence > 0 && targetName) {
    suggestedFilePath = generateFilePath(scope, targetName, detectedLanguage);
  }

  // Cap confidence at 1.0
  confidence = Math.min(confidence, 1.0);

  return {
    isCodeCommand: confidence >= 0.3, // Threshold for considering it a code command
    confidence,
    detectedLanguage,
    suggestedFilePath,
    targetName,
  };
}

/**
 * Generate a suggested file path based on scope and context
 */
function generateFilePath(
  scope: Scope,
  targetName: string,
  language: SyntaxLanguage | null
): string {
  const basePath = 'src/components';
  const extension = language === 'tsx' ? 'tsx' : language === 'css' ? 'css' : 'ts';

  // Sanitize target name for file system
  const fileName = targetName
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9-_]/g, '');

  switch (scope) {
    case 'field':
      return `${basePath}/fields/${fileName}.${extension}`;
    case 'section':
      return `${basePath}/sections/${fileName}.${extension}`;
    case 'page':
      return `${basePath}/pages/${fileName}.${extension}`;
    case 'feature':
      return `${basePath}/features/${fileName}.${extension}`;
    default:
      return `${basePath}/${fileName}.${extension}`;
  }
}

/**
 * Create a CodeGenerationRequest from a detected code command
 */
export function createCodeGenerationRequest(
  message: string,
  detection: CodeCommandDetectionResult,
  scope: Scope,
  currentContext: string
): CodeGenerationRequest | null {
  if (!detection.isCodeCommand || !detection.detectedLanguage) {
    return null;
  }

  return {
    requestText: message,
    scope: {
      type: scope as 'page' | 'section' | 'element',
      targetName: detection.targetName || currentContext || 'unknown',
      filePath: detection.suggestedFilePath || 'unknown',
    },
    context: {
      currentCode: '', // Will be populated by the handler if editing existing code
      selectedElement: null,
      pageMetadata: {
        id: 'unknown',
        title: currentContext || 'Unknown Page',
        route: '/',
        sections: [],
      },
    },
  };
}
