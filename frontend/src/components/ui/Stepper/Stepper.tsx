/**
 * Stepper Component
 *
 * Visual stepper for multi-step workflows with status indicators.
 * Supports horizontal and vertical orientations.
 *
 * @component
 * @example
 * ```tsx
 * const steps = [
 *   { id: '1', label: 'Detecting tech stack', status: 'completed' },
 *   { id: '2', label: 'Building site', status: 'in-progress' },
 *   { id: '3', label: 'Deploying', status: 'idle' },
 * ];
 *
 * <Stepper steps={steps} orientation="vertical" />
 * ```
 */

import React from 'react';
import './Stepper.css';

export type StepStatus = 'idle' | 'in-progress' | 'completed' | 'error';

export interface Step {
  /**
   * Unique step identifier
   */
  id: string;

  /**
   * Step label/title
   */
  label: string;

  /**
   * Step status
   */
  status: StepStatus;

  /**
   * Optional step description
   */
  description?: string;
}

export interface StepperProps {
  /**
   * Array of steps
   */
  steps: Step[];

  /**
   * Current active step index
   */
  currentStep?: number;

  /**
   * Stepper orientation
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Test ID for testing
   */
  'data-testid'?: string;
}

/**
 * Stepper component for multi-step workflows
 */
export function Stepper({
  steps,
  currentStep,
  orientation = 'vertical',
  className = '',
  'data-testid': testId,
}: StepperProps) {
  const containerClasses = [
    'stepper',
    `stepper--${orientation}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getStepIcon = (status: StepStatus, index: number) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return <div className="stepper__spinner" />;
      case 'error':
        return '✕';
      default:
        return index + 1;
    }
  };

  return (
    <div className={containerClasses} role="list" aria-label="Progress steps" data-testid={testId}>
      {steps.map((step, index) => {
        const isActive = currentStep !== undefined && index === currentStep;
        const stepClasses = [
          'stepper__step',
          `stepper__step--${step.status}`,
          isActive ? 'stepper__step--active' : '',
        ]
          .filter(Boolean)
          .join(' ');

        const iconClasses = [
          'stepper__icon',
          `stepper__icon--${step.status}`,
        ].join(' ');

        return (
          <div key={step.id} className={stepClasses} role="listitem">
            <div className="stepper__step-content">
              <div className={iconClasses} aria-hidden="true">
                {getStepIcon(step.status, index)}
              </div>

              <div className="stepper__step-text">
                <div className="stepper__label">{step.label}</div>
                {step.description && (
                  <div className="stepper__description">{step.description}</div>
                )}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="stepper__connector" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}
