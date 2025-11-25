// Deployment Service - Mock theme deployment orchestration
// Feature: 006-themes-and-deploy (US3)

import type { DeploymentSession, StepStatus } from '../types';

/**
 * Mock Deployment Service
 * Simulates step-by-step theme deployment for MVP
 */
export class DeploymentService {
  /**
   * Mock deployment with simulated step progression
   * In production, this would orchestrate real build/deploy via backend API
   *
   * @param themeId - Theme to deploy
   * @param siteId - Target site
   * @param userId - User initiating deployment
   * @param onProgress - Progress callback called on each step update
   * @returns Final deployment session
   */
  async mockDeployment(
    themeId: string,
    siteId: string,
    userId: string,
    onProgress: (session: DeploymentSession) => void
  ): Promise<DeploymentSession> {
    console.log('[DeploymentService] Starting deployment for theme:', themeId);

    // Special handling: trigger failure for demo theme
    if (themeId === 'theme-fail-demo') {
      console.log('[DeploymentService] Theme will fail - triggering mockDeploymentFailure');
      return this.mockDeploymentFailure(themeId, siteId, userId, onProgress);
    }

    console.log('[DeploymentService] Theme will succeed - running normal deployment');
    const sessionId = crypto.randomUUID();

    // Initialize all steps as idle
    const steps: StepStatus[] = [
      { name: 'detecting_stack', status: 'idle', message: 'Detecting tech stack...' },
      { name: 'preparing_env', status: 'idle', message: 'Preparing environment...' },
      { name: 'building', status: 'idle', message: 'Building your site...' },
      { name: 'deploying', status: 'idle', message: 'Deploying to PMC Engine...' },
      { name: 'done', status: 'idle', message: 'Done!' },
    ];

    const session: DeploymentSession = {
      id: sessionId,
      themeId,
      siteId,
      userId,
      currentStep: 'detecting_stack',
      steps,
      buildLogs: [],
      finalState: 'in_progress',
      startedAt: new Date().toISOString(),
    };

    // Send initial session state
    onProgress(session);

    // Step configurations: name, duration (ms), tech stack detection, mock logs
    // Fast deployment: 4 seconds total
    const stepConfigs = [
      {
        name: 'detecting_stack' as const,
        duration: 200,
        techStack: 'Next.js 13.4',
        logs: [
          '[detecting_stack] Analyzing package.json...',
          '[detecting_stack] Found framework: Next.js',
          '[detecting_stack] Detected version: 13.4',
        ],
      },
      {
        name: 'preparing_env' as const,
        duration: 300,
        logs: [
          '[preparing_env] Installing dependencies...',
          '[preparing_env] npm install --production',
          '[preparing_env]  Dependencies installed',
          '[preparing_env] Environment variables configured',
        ],
      },
      {
        name: 'building' as const,
        duration: 400,
        logs: [
          '[building] Running build command...',
          '[building] > npm run build',
          '[building] Compiling TypeScript...',
          '[building] Bundling assets...',
          '[building] Optimizing images...',
          '[building] Generating static pages...',
          '[building]  Build completed successfully',
        ],
      },
      {
        name: 'deploying' as const,
        duration: 300,
        logs: [
          '[deploying] Uploading build artifacts...',
          '[deploying] Configuring CDN...',
          '[deploying] Deploying to preview environment...',
          '[deploying]  Deployment successful',
        ],
      },
    ];

    // Execute each step sequentially
    for (const stepConfig of stepConfigs) {
      const stepIndex = steps.findIndex((s) => s.name === stepConfig.name);

      // Mark step as in_progress
      steps[stepIndex] = {
        ...steps[stepIndex],
        status: 'in_progress',
        startedAt: new Date().toISOString(),
      };
      session.currentStep = stepConfig.name;
      session.steps = [...steps];

      // Set tech stack on first step
      if (stepConfig.techStack) {
        session.techStackDetected = stepConfig.techStack;
      }

      onProgress(session);

      // Simulate logs appearing progressively
      for (const log of stepConfig.logs) {
        await this.sleep(stepConfig.duration / stepConfig.logs.length);
        session.buildLogs.push(log);
        onProgress(session);
      }

      // Mark step as success
      const completedAt = new Date().toISOString();
      steps[stepIndex] = {
        ...steps[stepIndex],
        status: 'success',
        message: stepConfig.logs[stepConfig.logs.length - 1], // Last log as message
        completedAt,
        durationMs: stepConfig.duration,
      };
      session.steps = [...steps];
      onProgress(session);
    }

    // Final step
    steps[4].status = 'success';
    session.currentStep = 'done';
    session.finalState = 'success';
    session.deployedUrl = '/preview';
    session.completedAt = new Date().toISOString();
    session.durationMs = stepConfigs.reduce((acc, s) => acc + s.duration, 0);
    onProgress(session);

    return session;
  }

  /**
   * Mock deployment failure for testing error handling
   */
  async mockDeploymentFailure(
    themeId: string,
    siteId: string,
    userId: string,
    onProgress: (session: DeploymentSession) => void
  ): Promise<DeploymentSession> {
    // Similar to mockDeployment but fails at build step
    const sessionId = crypto.randomUUID();

    const steps: StepStatus[] = [
      { name: 'detecting_stack', status: 'idle', message: 'Detecting tech stack...' },
      { name: 'preparing_env', status: 'idle', message: 'Preparing environment...' },
      { name: 'building', status: 'idle', message: 'Building your site...' },
      { name: 'deploying', status: 'idle', message: 'Deploying to PMC Engine...' },
      { name: 'done', status: 'idle', message: 'Done!' },
    ];

    const session: DeploymentSession = {
      id: sessionId,
      themeId,
      siteId,
      userId,
      currentStep: 'detecting_stack',
      steps,
      buildLogs: [],
      finalState: 'in_progress',
      startedAt: new Date().toISOString(),
    };

    onProgress(session);

    // Complete first two steps successfully (fast)
    for (let i = 0; i < 2; i++) {
      steps[i].status = 'in_progress';
      session.currentStep = steps[i].name as any;
      onProgress(session);

      await this.sleep(700);

      steps[i].status = 'success';
      session.buildLogs.push(`[${steps[i].name}] Completed`);
      onProgress(session);
    }

    // Fail at build step
    steps[2].status = 'in_progress';
    session.currentStep = 'building';
    onProgress(session);

    await this.sleep(1200);

    session.buildLogs.push('[building] Running build command...');
    session.buildLogs.push('[building] > npm run build');
    session.buildLogs.push('[building] ERROR: Build failed');
    session.buildLogs.push('[building] Module not found: Cannot resolve \'./missing-file\'');

    steps[2].status = 'error';
    session.finalState = 'failed';
    session.errorDetails = {
      failingStep: 'building',
      errorMessage: 'Build failed due to missing module',
      errorSnippet: session.buildLogs.slice(-4).join('\n'),
      errorCode: 'BUILD_FAILED',
      suggestedAction: 'Check that all required files are included in your theme package',
    };
    session.completedAt = new Date().toISOString();
    onProgress(session);

    return session;
  }

  /**
   * Utility: Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const deploymentService = new DeploymentService();
