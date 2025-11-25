/**
 * Stepper Hook
 *
 * Manages multi-step workflow state (wizards, onboarding, deployment flows).
 * Provides navigation, validation, and step status management.
 *
 * @example
 * ```tsx
 * const stepper = useStepper({
 *   steps: ['account', 'profile', 'preferences'],
 *   onComplete: handleComplete,
 * });
 *
 * <Stepper
 *   steps={stepper.steps}
 *   currentStep={stepper.currentStepIndex}
 * />
 *
 * <button onClick={stepper.goToNext}>Next</button>
 * <button onClick={stepper.goToPrevious}>Back</button>
 * ```
 */

import { useState, useCallback, useMemo } from 'react';
import type { Step, StepStatus } from '@/components/ui/Stepper';

export interface UseStepperConfig {
  /**
   * Step IDs or step objects
   */
  steps: string[] | Omit<Step, 'status'>[];

  /**
   * Initial step index
   * @default 0
   */
  initialStep?: number;

  /**
   * Called when all steps are completed
   */
  onComplete?: () => void;

  /**
   * Called when step changes
   */
  onStepChange?: (stepIndex: number, stepId: string) => void;

  /**
   * Validation function for current step
   * Return true to allow navigation, false to block
   */
  validate?: (stepIndex: number) => boolean | Promise<boolean>;
}

export interface UseStepperReturn {
  /**
   * Array of step objects with status
   */
  steps: Step[];

  /**
   * Current step index (0-based)
   */
  currentStepIndex: number;

  /**
   * Current step object
   */
  currentStep: Step;

  /**
   * Is first step
   */
  isFirstStep: boolean;

  /**
   * Is last step
   */
  isLastStep: boolean;

  /**
   * Is stepper completed (all steps done)
   */
  isCompleted: boolean;

  /**
   * Go to next step
   */
  goToNext: () => Promise<void>;

  /**
   * Go to previous step
   */
  goToPrevious: () => void;

  /**
   * Go to specific step by index
   */
  goToStep: (index: number) => void;

  /**
   * Mark current step as completed and go to next
   */
  completeStep: () => Promise<void>;

  /**
   * Mark current step as error
   */
  setStepError: (error?: string) => void;

  /**
   * Reset stepper to initial state
   */
  reset: () => void;
}

/**
 * Hook to manage stepper/wizard state
 */
export function useStepper({
  steps: stepsProp,
  initialStep = 0,
  onComplete,
  onStepChange,
  validate,
}: UseStepperConfig): UseStepperReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [errorSteps, setErrorSteps] = useState<Set<number>>(new Set());

  // Convert steps to Step objects
  const steps: Step[] = useMemo(() => {
    return stepsProp.map((step, index) => {
      const stepObj = typeof step === 'string' ? { id: step, label: step } : step;

      let status: StepStatus = 'idle';

      if (completedSteps.has(index)) {
        status = 'completed';
      } else if (errorSteps.has(index)) {
        status = 'error';
      } else if (index === currentStepIndex) {
        status = 'in-progress';
      }

      return {
        ...stepObj,
        status,
      };
    });
  }, [stepsProp, currentStepIndex, completedSteps, errorSteps]);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isCompleted = completedSteps.size === steps.length;

  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= steps.length) {
        console.warn(`Invalid step index: ${index}`);
        return;
      }

      setCurrentStepIndex(index);
      onStepChange?.(index, steps[index].id);
    },
    [steps, onStepChange]
  );

  const goToNext = useCallback(async () => {
    if (isLastStep) {
      return;
    }

    // Validate current step
    if (validate) {
      const isValid = await validate(currentStepIndex);
      if (!isValid) {
        setErrorSteps((prev) => new Set(prev).add(currentStepIndex));
        return;
      }
    }

    // Clear error if exists
    setErrorSteps((prev) => {
      const next = new Set(prev);
      next.delete(currentStepIndex);
      return next;
    });

    goToStep(currentStepIndex + 1);
  }, [currentStepIndex, isLastStep, validate, goToStep]);

  const goToPrevious = useCallback(() => {
    if (isFirstStep) {
      return;
    }

    goToStep(currentStepIndex - 1);
  }, [currentStepIndex, isFirstStep, goToStep]);

  const completeStep = useCallback(async () => {
    // Validate current step
    if (validate) {
      const isValid = await validate(currentStepIndex);
      if (!isValid) {
        setErrorSteps((prev) => new Set(prev).add(currentStepIndex));
        return;
      }
    }

    // Mark as completed
    setCompletedSteps((prev) => new Set(prev).add(currentStepIndex));

    // Clear error if exists
    setErrorSteps((prev) => {
      const next = new Set(prev);
      next.delete(currentStepIndex);
      return next;
    });

    // If last step, call onComplete
    if (isLastStep) {
      onComplete?.();
    } else {
      // Go to next step
      goToStep(currentStepIndex + 1);
    }
  }, [currentStepIndex, isLastStep, validate, onComplete, goToStep]);

  const setStepError = useCallback(
    (error?: string) => {
      setErrorSteps((prev) => new Set(prev).add(currentStepIndex));

      // Optionally update step description with error
      if (error && typeof stepsProp[currentStepIndex] === 'object') {
        // This would require modifying the steps array
        // For now, just mark as error
      }
    },
    [currentStepIndex, stepsProp]
  );

  const reset = useCallback(() => {
    setCurrentStepIndex(initialStep);
    setCompletedSteps(new Set());
    setErrorSteps(new Set());
  }, [initialStep]);

  return {
    steps,
    currentStepIndex,
    currentStep,
    isFirstStep,
    isLastStep,
    isCompleted,
    goToNext,
    goToPrevious,
    goToStep,
    completeStep,
    setStepError,
    reset,
  };
}
