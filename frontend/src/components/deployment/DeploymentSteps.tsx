/**
 * DeploymentSteps - Step-by-step deployment progress UI
 * Feature: 006-themes-and-deploy (US3)
 *
 * Displays vertical timeline of deployment steps with:
 * - Idle, in_progress, success, error states
 * - Icons for each state
 * - Live status text updates
 */

import React from 'react';
import type { StepStatus } from '../../types';
import './DeploymentSteps.css';

interface DeploymentStepsProps {
  steps: StepStatus[];
  currentStep: string;
}

export const DeploymentSteps: React.FC<DeploymentStepsProps> = ({ steps, currentStep }) => {
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'in_progress':
        return '●';
      default:
        return '○';
    }
  };

  const getStepLabel = (name: string) => {
    const labels: Record<string, string> = {
      detecting_stack: 'Detecting tech stack',
      preparing_env: 'Preparing build environment',
      building: 'Building your site',
      deploying: 'Deploying to PMC Engine',
      done: 'Done',
    };
    return labels[name] || name;
  };

  return (
    <div className="deployment-steps" role="region" aria-label="Deployment progress">
      <h3 className="deployment-steps__title">Deployment Progress</h3>

      <div className="deployment-steps__timeline" role="list">
        {steps.map((step, index) => (
          <div
            key={step.name}
            className={`deployment-step deployment-step--${step.status}`}
            data-current={step.name === currentStep}
            role="listitem"
            aria-label={`${getStepLabel(step.name)}: ${step.status}`}
            aria-current={step.name === currentStep ? 'step' : undefined}
          >
            <div className="deployment-step__indicator">
              <span className="deployment-step__icon">{getStepIcon(step.status)}</span>
              {index < steps.length - 1 && <div className="deployment-step__connector" />}
            </div>

            <div className="deployment-step__content">
              <div className="deployment-step__label">{getStepLabel(step.name)}</div>
              {step.message && step.status !== 'idle' && (
                <div className="deployment-step__message">{step.message}</div>
              )}
              {step.durationMs && (
                <div className="deployment-step__duration">
                  {(step.durationMs / 1000).toFixed(1)}s
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
