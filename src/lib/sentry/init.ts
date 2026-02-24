/**
 * Sentry Initialization Module
 * Conditionally initializes Sentry for error tracking
 * Requires @sentry/react to be installed for actual functionality
 */

import { SENTRY_DSN, SENTRY_ENABLED, sentryConfig, logSentryStatus } from './config';

/**
 * Initialize Sentry for error tracking and performance monitoring
 * Safe to call in development - automatically disabled if not configured
 */
export async function initSentry(): Promise<void> {
  try {
    logSentryStatus();

    if (!SENTRY_ENABLED) {
      console.log('[Sentry] Initialization skipped - not enabled in this environment');
      return;
    }

    // TODO: Uncomment after running: npm install @sentry/react
    // This dynamic import allows the app to function without Sentry installed
    // while maintaining proper TypeScript types and IDE support
    // 
    // const Sentry = await import('@sentry/react');
    // Sentry.init(sentryConfig);
    // console.log('[Sentry] Successfully initialized');

    console.log(
      '[Sentry] Configuration prepared (awaiting package installation)'
    );
  } catch (error) {
    console.error('[Sentry] Initialization failed:', error);
    // Don't throw - allow app to continue without Sentry
  }
}

/**
 * Check if Sentry is currently active
 */
export function isSentryEnabled(): boolean {
  return SENTRY_ENABLED;
}

/**
 * Get Sentry configuration (useful for testing and debugging)
 */
export function getSentryConfig() {
  return sentryConfig;
}
