/**
 * Sentry Integration Barrel Export
 * Main entry point for all Sentry-related functionality
 */

// Configuration
export { SENTRY_DSN, SENTRY_ENVIRONMENT, SENTRY_ENABLED, sentryConfig } from './config';

// Initialization
export { initSentry, isSentryEnabled, getSentryConfig } from './init';

// Error Reporting
export {
  captureException,
  captureMessage,
  setUser,
  addBreadcrumb,
  setContext,
  setTag,
  captureHttpError,
  captureNetworkError,
  type ErrorSeverity,
  type Breadcrumb,
  type UserContext,
} from './errorReporting';

// Enhanced Error Boundary
export { default as ErrorBoundaryWithSentry, withErrorBoundary } from './ErrorBoundaryWithSentry';
