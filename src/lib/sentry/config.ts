/**
 * Sentry Configuration
 * Prepares Sentry configuration without requiring @sentry/react installation
 * Conditional initialization based on environment variables and build mode
 */

export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || '';
export const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENV || 'development';
export const SENTRY_ENABLED = !!SENTRY_DSN && import.meta.env.PROD;

/**
 * Sentry SDK configuration object
 * Used when Sentry is initialized (after package installation)
 */
export const sentryConfig = {
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,
  
  // Performance Monitoring
  tracesSampleRate: 0.1,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Release tracking (optional - will be populated at build time)
  release: import.meta.env.VITE_APP_VERSION || undefined,
  
  // Normalized breadcrumbs for console, DOM, fetch, and XMLHttpRequest
  integrations: [
    // Will be extended with actual Sentry integrations after package installation
  ],
};

/**
 * Logger function for Sentry initialization status
 */
export function logSentryStatus(): void {
  if (SENTRY_ENABLED) {
    console.log(
      '[Sentry] Ready to initialize. DSN: ' + SENTRY_DSN.slice(0, 20) + '...'
    );
  } else {
    const reason = !SENTRY_DSN
      ? 'DSN not configured'
      : !import.meta.env.PROD
        ? 'Not in production mode'
        : 'Unknown';
    console.log(`[Sentry] Disabled (${reason})`);
  }
}
