/**
 * useCodeGeneration Hook
 * Feature: 003-ai-coding-mode
 * Integrates AI code generation with Chat panel
 * Implements T027-T030 from tasks.md
 */

import { useCallback } from 'react';
import { useCodeStore } from '../store/codeStore';
import { useDashboardStore } from '../store/dashboardStore';
import { detectCodeCommand, createCodeGenerationRequest } from '../utils/codeCommandDetector';
import { requestCodeChange } from '../services/aiCodeService';
import type { Scope } from '../types/chat';
import type { OperationStep, DiffPreview } from '../types/code';

export interface CodeGenerationResult {
  wasCodeCommand: boolean;
  operationId: string | null;
}

/**
 * Hook for handling code generation requests from chat
 */
export function useCodeGeneration() {
  const { addOperation, updateOperation, addDiffPreview, setCodePanelVisibility, setActiveDiffId, setViewMode } = useCodeStore();
  const { addMessage } = useDashboardStore();

  /**
   * Process a chat message and trigger code generation if it's a code command
   * @param message - User's chat message
   * @param scope - Current chat scope
   * @param currentContext - Current selection context
   * @returns Result indicating if code generation was triggered
   */
  const processMessage = useCallback(
    (message: string, scope: Scope, currentContext: string): CodeGenerationResult => {
      try {
        // Detect if this is a code-related command
        const detection = detectCodeCommand(message, scope, currentContext);

        if (!detection.isCodeCommand) {
          return { wasCodeCommand: false, operationId: null };
        }

        // Create code generation request
        const request = createCodeGenerationRequest(message, detection, scope, currentContext);

        if (!request) {
          return { wasCodeCommand: false, operationId: null };
        }

        // Generate operation ID
        const operationId = `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Add initial operation to store
        addOperation({
          id: operationId,
          type: 'generate',
          status: 'pending',
          request,
          steps: [],
          progress: 0,
          startedAt: Date.now(),
          completedAt: null,
          error: null,
          diffPreviewId: null,
        });

        // Add log message to chat
        addMessage({
          type: 'log',
          text: `🔍 Analyzing code request...`,
          scope,
          isCollapsed: false,
          operationLog: {
            operationId,
            status: 'pending',
            messages: ['Analyzing code request...'],
          },
        });

        // Switch to Code view and show Code Panel
        setViewMode('code');
        setCodePanelVisibility(true);

        // Define progress handler
        const onProgress = (step: OperationStep) => {
          updateOperation(operationId, {
            status: 'in-progress',
            steps: (prev) => [...(prev || []), step],
            progress: calculateProgress(step),
          });

          // Add progress message to chat
          addMessage({
            type: 'log',
            text: `${step.icon || '⚙️'} ${step.message}`,
            scope,
            isCollapsed: false,
            operationLog: {
              operationId,
              status: 'running',
              messages: [step.message],
            },
          });
        };

        // Define completion handler
        const onComplete = (diffPreview: DiffPreview) => {
          // Add diff preview to store
          addDiffPreview(diffPreview);

          // Set as active diff (T029: Display diff in Code Panel)
          setActiveDiffId(diffPreview.id);

          // Update operation
          updateOperation(operationId, {
            status: 'completed',
            progress: 100,
            completedAt: Date.now(),
            diffPreviewId: diffPreview.id,
          });

          // Add success message to chat
          addMessage({
            type: 'log',
            text: `✅ Code generated successfully! Review the changes in the Code Panel.`,
            scope,
            isCollapsed: false,
            operationLog: {
              operationId,
              status: 'success',
              messages: ['Code generation completed'],
            },
          });

          // Add AI message with summary
          addMessage({
            type: 'ai',
            text: `I've generated the code changes. ${diffPreview.summary}\n\nPlease review the diff in the Code Panel and accept or reject the changes.`,
            scope,
            isCollapsed: false,
          });
        };

        // Define error handler
        const onError = (error: { message: string; code: string }) => {
          updateOperation(operationId, {
            status: 'failed',
            completedAt: Date.now(),
            error,
          });

          // Add error message to chat
          addMessage({
            type: 'log',
            text: `❌ Error: ${error.message}`,
            scope,
            isCollapsed: false,
            operationLog: {
              operationId,
              status: 'error',
              messages: [error.message],
            },
          });

          // Add AI error response
          addMessage({
            type: 'ai',
            text: `I encountered an error while generating the code: ${error.message}\n\nPlease try rephrasing your request or providing more context.`,
            scope,
            isCollapsed: false,
          });
        };

        // Start code generation with SSE
        const cancelFn = requestCodeChange(request, onProgress, onComplete, onError);

        // Store cancel function (could be added to operation store for cancellation support)
        // For MVP, we'll let it run to completion

        return { wasCodeCommand: true, operationId };
      } catch (error) {
        console.error('Error in code generation:', error);
        // Return false so it falls back to normal chat
        return { wasCodeCommand: false, operationId: null };
      }
    },
    [addOperation, updateOperation, addDiffPreview, addMessage, setCodePanelVisibility, setActiveDiffId, setViewMode]
  );

  return { processMessage };
}

/**
 * Calculate operation progress percentage based on step
 */
function calculateProgress(step: OperationStep): number {
  const progressMap: Record<string, number> = {
    analyze: 20,
    generate: 60,
    validate: 80,
    complete: 100,
  };

  return progressMap[step.icon || ''] || 50;
}
