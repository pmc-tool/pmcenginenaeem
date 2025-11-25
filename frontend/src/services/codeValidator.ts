/**
 * Code Validator Service
 * Feature: 003-ai-coding-mode
 * Validates generated code using TypeScript + ESLint
 * Source: research.md
 * Performance target: <300ms per validation
 */

import type { ValidationError, ValidationResult } from '../types/code';

/**
 * Validate TypeScript/JSX code syntax and best practices
 * Implements FR-014: validate generated code before presenting to users
 *
 * NOTE: This is a simplified validation for MVP.
 * Production version should integrate full TypeScript Compiler API + ESLint.
 */
export async function validateCode(code: string, language: string): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    // Basic syntax validation checks
    if (language === 'tsx' || language === 'jsx') {
      validateJSXSyntax(code, errors);
    }

    if (language === 'typescript' || language === 'tsx') {
      validateTypeScriptSyntax(code, errors, warnings);
    }

    // Common code quality checks
    validateCodeQuality(code, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    // Catch any unexpected errors
    errors.push({
      severity: 'error',
      message: 'Unexpected validation error occurred',
      line: null,
      code: 'VALIDATION_ERROR',
    });

    return {
      isValid: false,
      errors,
      warnings,
    };
  }
}

/**
 * Validate JSX syntax (basic checks)
 * In production, use TypeScript Compiler API for full validation
 */
function validateJSXSyntax(code: string, errors: ValidationError[]): void {
  // Check for unclosed JSX tags
  const openTags = code.match(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g) || [];
  const closeTags = code.match(/<\/([a-zA-Z][a-zA-Z0-9]*)>/g) || [];

  const openTagNames = openTags
    .map((tag) => tag.match(/<([a-zA-Z][a-zA-Z0-9]*)/)?.[1])
    .filter((name): name is string => name !== undefined && !name.match(/\/>$/));

  const closeTagNames = closeTags
    .map((tag) => tag.match(/<\/([a-zA-Z][a-zA-Z0-9]*)>/)?.[1])
    .filter((name): name is string => name !== undefined);

  // Simple tag balance check (not perfect, but catches common issues)
  if (openTagNames.length !== closeTagNames.length) {
    errors.push({
      severity: 'error',
      message: 'JSX element has mismatched opening and closing tags',
      line: null,
      code: 'JSX_TAG_MISMATCH',
    });
  }

  // Check for self-closing tags without />
  const invalidSelfClosing = code.match(/<(br|hr|img|input|meta|link|area|base|col|embed|source|track|wbr)[^/>]*>/gi);
  if (invalidSelfClosing && invalidSelfClosing.length > 0) {
    errors.push({
      severity: 'error',
      message: 'Self-closing JSX elements must end with />',
      line: null,
      code: 'JSX_SELF_CLOSING',
    });
  }
}

/**
 * Validate TypeScript syntax (basic checks)
 * In production, use TypeScript Compiler API for full type checking
 */
function validateTypeScriptSyntax(code: string, errors: ValidationError[], warnings: ValidationError[]): void {
  // Check for common TypeScript syntax errors

  // Unmatched braces
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push({
      severity: 'error',
      message: 'Unmatched curly braces in code',
      line: null,
      code: 'TS_UNMATCHED_BRACES',
    });
  }

  // Unmatched parentheses
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push({
      severity: 'error',
      message: 'Unmatched parentheses in code',
      line: null,
      code: 'TS_UNMATCHED_PARENS',
    });
  }

  // Check for any type usage (basic detection)
  const hasAnyType = code.includes(': any');
  if (hasAnyType) {
    warnings.push({
      severity: 'warning',
      message: 'Usage of "any" type detected - consider using specific types',
      line: null,
      code: 'TS_ANY_TYPE',
    });
  }
}

/**
 * Validate code quality and best practices
 */
function validateCodeQuality(code: string, warnings: ValidationError[]): void {
  // Check for console.log statements
  const hasConsoleLog = code.includes('console.log');
  if (hasConsoleLog) {
    warnings.push({
      severity: 'warning',
      message: 'console.log statement detected - remove before production',
      line: null,
      code: 'QUALITY_CONSOLE_LOG',
    });
  }

  // Check for TODO/FIXME comments
  const hasTodo = code.match(/\/\/\s*(TODO|FIXME)/i);
  if (hasTodo) {
    warnings.push({
      severity: 'warning',
      message: 'TODO/FIXME comment detected - address before completion',
      line: null,
      code: 'QUALITY_TODO',
    });
  }

  // Check for extremely long lines (>200 chars)
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    if (line.length > 200) {
      warnings.push({
        severity: 'warning',
        message: 'Line exceeds recommended length (200 characters)',
        line: index + 1,
        code: 'QUALITY_LINE_LENGTH',
      });
    }
  });
}

/**
 * Quick validation check - returns true if code appears syntactically valid
 * Used for fast pre-checks before running full validation
 */
export function isCodeSyntacticallyValid(code: string): boolean {
  // Quick checks for obvious syntax errors
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;

  return openBraces === closeBraces && openParens === closeParens;
}
