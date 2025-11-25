/**
 * AI Code Service
 * Feature: 003-ai-coding-mode
 * Mock implementation with Server-Sent Events simulation
 * Source: research.md
 *
 * TODO: Replace with production API integration
 */

import type {
  CodeGenerationRequest,
  DiffPreview,
  OperationStep,
  OperationError,
  PageMetadata,
} from '../types/code';
import { generateDiff, generateChangeSummary } from './diffGenerator';
import { validateCode } from './codeValidator';

/**
 * Request code generation from AI service
 * Implements Server-Sent Events (SSE) pattern for real-time progress updates
 * Implements FR-004, FR-005, FR-006 from spec.md
 *
 * @param request - Code generation request with natural language prompt
 * @param onProgress - Callback for progress step updates
 * @param onComplete - Callback when diff preview is ready
 * @param onError - Callback for error handling
 * @returns Cancel function to abort the request
 */
export function requestCodeChange(
  request: CodeGenerationRequest,
  onProgress: (step: OperationStep) => void,
  onComplete: (diffPreview: DiffPreview) => void,
  onError: (error: OperationError) => void
): () => void {
  // Mock SSE simulation with setTimeout
  const steps: Array<{ message: string; icon: OperationStep['icon']; delay: number }> = [
    { message: 'Analyzing request...', icon: 'analyze', delay: 500 },
    { message: 'Generating code...', icon: 'generate', delay: 1500 },
    { message: 'Validating changes...', icon: 'validate', delay: 800 },
  ];

  let currentStepIndex = 0;
  let timeouts: NodeJS.Timeout[] = [];
  let cancelled = false;

  function runNextStep() {
    if (cancelled) {
      return;
    }

    if (currentStepIndex >= steps.length) {
      // All steps complete - generate final diff
      generateFinalDiff(request, onComplete, onError);
      return;
    }

    const step = steps[currentStepIndex];

    // Send "running" status
    onProgress({
      message: step.message,
      status: 'running',
      timestamp: Date.now(),
      icon: step.icon,
    });

    const timeout = setTimeout(() => {
      if (cancelled) return;

      // Send "complete" status for this step
      onProgress({
        message: step.message,
        status: 'complete',
        timestamp: Date.now(),
        icon: step.icon,
      });

      currentStepIndex++;
      runNextStep();
    }, step.delay);

    timeouts.push(timeout);
  }

  // Start processing
  runNextStep();

  // Return cancel function
  return () => {
    cancelled = true;
    timeouts.forEach(clearTimeout);
  };
}

/**
 * Generate final diff preview from mock AI response
 * In production, this would be the AI service response parsing
 */
async function generateFinalDiff(
  request: CodeGenerationRequest,
  onComplete: (diffPreview: DiffPreview) => void,
  onError: (error: OperationError) => void
): Promise<void> {
  try {
    // Mock code generation based on request
    const newCode = generateMockCode(request);

    // Validate generated code
    const validation = await validateCode(newCode, 'tsx');

    if (!validation.isValid) {
      onError({
        message: 'Generated code has syntax errors. Please try rephrasing your request.',
        type: 'validation-failed',
        recoverable: true,
        details: validation.errors.map((e) => e.message).join('; '),
      });
      return;
    }

    // Generate diff
    const diffResult = generateDiff(request.context.currentCode, newCode);

    // Create diff preview
    const diffPreview: DiffPreview = {
      id: crypto.randomUUID(),
      operationId: crypto.randomUUID(), // In real implementation, this comes from CodeOperation
      oldCode: request.context.currentCode,
      newCode,
      changes: diffResult.changes,
      summary: generateChangeSummary(diffResult.changes, request.scope.targetName),
      scope: {
        type: request.scope.type,
        targetName: request.scope.targetName,
        filePath: request.scope.filePath,
      },
      status: 'pending',
      createdAt: Date.now(),
      respondedAt: null,
      isValid: true,
      validationErrors: validation.errors,
    };

    onComplete(diffPreview);
  } catch (error) {
    onError({
      message: 'An unexpected error occurred while generating code. Please try again.',
      type: 'unknown',
      recoverable: true,
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Mock code generation logic
 * TODO: Replace with actual AI API call
 *
 * This mock handles both:
 * 1. Code generation (creating new code from scratch)
 * 2. Code modification (editing existing code)
 */
function generateMockCode(request: CodeGenerationRequest): string {
  const { requestText, context, scope } = request;
  let { currentCode } = context;

  // Normalize request text
  const normalizedRequest = requestText.toLowerCase().trim();

  // ========================================================================
  // CODE GENERATION: Create new code from scratch
  // ========================================================================
  if (!currentCode || currentCode.trim().length === 0) {
    // Pattern: "create/write/generate/implement a function"
    if (normalizedRequest.match(/(create|write|generate|implement|add|make).*function/i)) {
      // Generate a TypeScript function based on the request
      if (normalizedRequest.includes('validate') && normalizedRequest.includes('email')) {
        return `/**
 * Validates an email address format
 * @param email - The email address to validate
 * @returns true if email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}`;
      }

      if (normalizedRequest.includes('calculate') || normalizedRequest.includes('total')) {
        return `/**
 * Calculates the total sum of an array of numbers
 * @param numbers - Array of numbers to sum
 * @returns The total sum
 */
export function calculateTotal(numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}`;
      }

      // Default function
      return `/**
 * Generated function based on: "${requestText}"
 */
export function generatedFunction() {
  // TODO: Implement function logic
  console.log('Function created');
}`;
    }

    // Pattern: "create/write a component"
    if (normalizedRequest.match(/(create|write|generate|implement|add|make).*(component|react)/i)) {
      const componentName = normalizedRequest.includes('button') ? 'Button' :
                           normalizedRequest.includes('card') ? 'Card' :
                           normalizedRequest.includes('login') ? 'LoginForm' :
                           'CustomComponent';

      if (normalizedRequest.includes('button')) {
        return `import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  return (
    <button
      className={\`btn btn--\${variant}\`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Button"
    >
      {children}
    </button>
  );
}`;
      }

      if (normalizedRequest.includes('login')) {
        return `import React, { useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn-primary">
        Log In
      </button>
    </form>
  );
}`;
      }

      // Default component
      return `import React from 'react';

interface ${componentName}Props {
  // Add props here
}

export function ${componentName}(props: ${componentName}Props) {
  return (
    <div className="${componentName.toLowerCase()}">
      <h2>${componentName}</h2>
      <p>Component created from: ${requestText}</p>
    </div>
  );
}`;
    }

    // Pattern: "create/write an interface"
    if (normalizedRequest.match(/(create|write|generate).*(interface|type)/i)) {
      if (normalizedRequest.includes('user')) {
        return `export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'admin' | 'user' | 'guest';
}`;
      }

      // Default interface
      return `export interface GeneratedInterface {
  id: string;
  name: string;
  // Add more fields as needed
}`;
    }

    // If we can't match a pattern, generate a generic code snippet
    return `/**
 * Generated code for: "${requestText}"
 *
 * This is a placeholder. In production, this would be
 * generated by an AI model based on your request.
 */

export function generatedCode() {
  console.log('Code generated based on your request');
  // TODO: Implement actual logic
}`;
  }

  // ========================================================================
  // CODE MODIFICATION: Edit existing code
  // ========================================================================

  // Pattern: "change [element] color to [color]"
  const colorMatch = normalizedRequest.match(/change.*color.*to\s+(\w+)/i);
  if (colorMatch) {
    const newColor = colorMatch[1];
    // Replace color: 'xxx' or color="xxx" with new color
    currentCode = currentCode.replace(
      /(color[:=]\s*['"])\w+(["'])/gi,
      `$1${newColor}$2`
    );
  }

  // Pattern: "make [element] larger" or "increase [element] size"
  const sizeIncreaseMatch = normalizedRequest.match(/(make.*larger|increase.*size)/i);
  if (sizeIncreaseMatch) {
    // Replace fontSize with larger value
    currentCode = currentCode.replace(
      /(fontSize[:=]\s*['"]?)(\d+)(px['"]?)/gi,
      (match, prefix, size, suffix) => {
        const newSize = parseInt(size) + 4;
        return `${prefix}${newSize}${suffix}`;
      }
    );
  }

  // Pattern: "add padding to [element]"
  const paddingMatch = normalizedRequest.match(/add\s+padding/i);
  if (paddingMatch) {
    // Add or increase padding
    if (currentCode.includes('padding')) {
      currentCode = currentCode.replace(
        /(padding[:=]\s*['"]?)(\d+)(px['"]?)/gi,
        (match, prefix, size, suffix) => {
          const newSize = parseInt(size) + 8;
          return `${prefix}${newSize}${suffix}`;
        }
      );
    } else {
      // Add padding: 16px to style object
      currentCode = currentCode.replace(
        /(style=\{\{)/g,
        '$1 padding: \'16px\','
      );
    }
  }

  // Pattern: "change text to [new text]"
  const textMatch = normalizedRequest.match(/change\s+text\s+to\s+['""](.+)['"]/i);
  if (textMatch) {
    const newText = textMatch[1];
    // Replace text content in JSX
    currentCode = currentCode.replace(
      /(>\s*)[^<>]+(\s*<)/g,
      `$1${newText}$2`
    );
  }

  return currentCode;
}

/**
 * Create mock page metadata for testing
 */
export function createMockPageMetadata(): PageMetadata {
  return {
    pageId: 'home',
    pageName: 'Home Page',
    componentLibrary: ['Button', 'Card', 'Input', 'Heading', 'Text'],
    styleVariables: {
      primaryColor: '#EA2724',
      secondaryColor: '#1a1a1a',
      backgroundColor: '#ffffff',
      textColor: '#333333',
    },
  };
}
