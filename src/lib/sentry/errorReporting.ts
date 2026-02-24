/**
 * Error Reporting Module
 * Wrapper functions for reporting errors to Sentry
 * Falls back to console logging when Sentry is not available
 */

/**
 * Error severity levels
 */
export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info' | 'debug';

/**
 * Breadcrumb types for tracking user actions
 */
export interface Breadcrumb {
  category: string;
  message: string;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  data?: Record<string, any>;
  timestamp?: number;
}

/**
 * User context for error attribution
 */
export interface UserContext {
  id: string;
  email?: string;
  username?: string;
  ip_address?: string;
  [key: string]: any;
}

/**
 * Capture an exception and send to Sentry
 * Falls back to console.error if Sentry is unavailable
 */
export function captureException(
  error: Error | string,
  context?: Record<string, any>
): void {
  const errorObj =
    typeof error === 'string' ? new Error(error) : error;

  console.error('[ErrorReporting] Captured exception:', errorObj, context);

  // TODO: Uncomment after @sentry/react is installed
  // const Sentry = window.__SENTRY__;
  // if (Sentry) {
  //   Sentry.captureException(errorObj, { extra: context });
  // }
}

/**
 * Capture a message and send to Sentry
 * Useful for non-error events that should be tracked
 */
export function captureMessage(
  message: string,
  level: ErrorSeverity = 'info'
): void {
  const logLevel = level === 'fatal' ? 'error' : level;
  console[logLevel as any](`[ErrorReporting] ${message}`);

  // TODO: Uncomment after @sentry/react is installed
  // const Sentry = window.__SENTRY__;
  // if (Sentry) {
  //   Sentry.captureMessage(message, level);
  // }
}

/**
 * Set the current user context for error attribution
 * Helps identify which users are affected by errors
 */
export function setUser(user: UserContext | null): void {
  if (user) {
    console.log('[ErrorReporting] User context set:', {
      id: user.id,
      email: user.email,
    });
  } else {
    console.log('[ErrorReporting] User context cleared');
  }

  // TODO: Uncomment after @sentry/react is installed
  // const Sentry = window.__SENTRY__;
  // if (Sentry) {
  //   Sentry.setUser(user);
  // }
}

/**
 * Add a breadcrumb to track user actions
 * Breadcrumbs appear in error reports to show what led to the error
 */
export function addBreadcrumb(breadcrumb: Breadcrumb): void {
  console.log(
    `[ErrorReporting] Breadcrumb: ${breadcrumb.category} - ${breadcrumb.message}`
  );

  // TODO: Uncomment after @sentry/react is installed
  // const Sentry = window.__SENTRY__;
  // if (Sentry) {
  //   Sentry.addBreadcrumb({
  //     category: breadcrumb.category,
  //     message: breadcrumb.message,
  //     level: breadcrumb.level || 'info',
  //     data: breadcrumb.data,
  //     timestamp: breadcrumb.timestamp || Date.now() / 1000,
  //   });
  // }
}

/**
 * Set additional context that will be attached to all future events
 */
export function setContext(
  name: string,
  context: Record<string, any>
): void {
  console.log(`[ErrorReporting] Context set: ${name}`, context);

  // TODO: Uncomment after @sentry/react is installed
  // const Sentry = window.__SENTRY__;
  // if (Sentry) {
  //   Sentry.setContext(name, context);
  // }
}

/**
 * Set a tag that will be attached to all future events
 * Useful for filtering and grouping errors in Sentry dashboard
 */
export function setTag(key: string, value: string): void {
  console.log(`[ErrorReporting] Tag: ${key} = ${value}`);

  // TODO: Uncomment after @sentry/react is installed
  // const Sentry = window.__SENTRY__;
  // if (Sentry) {
  //   Sentry.setTag(key, value);
  // }
}

/**
 * Capture a failed HTTP request
 */
export function captureHttpError(
  status: number,
  url: string,
  error?: Error
): void {
  const message = `HTTP ${status} - ${url}`;
  console.error('[ErrorReporting] HTTP Error:', message, error);

  captureException(error || new Error(message), {
    httpStatus: status,
    url,
    type: 'http_error',
  });
}

/**
 * Capture a network error
 */
export function captureNetworkError(error: Error, url?: string): void {
  console.error('[ErrorReporting] Network Error:', error);

  captureException(error, {
    url,
    type: 'network_error',
  });
}
