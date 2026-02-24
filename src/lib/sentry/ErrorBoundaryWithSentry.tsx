/**
 * Enhanced Error Boundary with Sentry Integration
 * Wraps the existing ErrorBoundary and automatically reports errors to Sentry
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { captureException, addBreadcrumb } from './errorReporting';

interface ErrorBoundaryWithSentryProps {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryWithSentryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Enhanced ErrorBoundary that captures errors and sends to Sentry
 * Extends the basic error boundary with automatic error reporting
 */
class ErrorBoundaryWithSentry extends Component<
  ErrorBoundaryWithSentryProps,
  ErrorBoundaryWithSentryState
> {
  constructor(props: ErrorBoundaryWithSentryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryWithSentryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Add breadcrumb for error context
    addBreadcrumb({
      category: 'error-boundary',
      message: `React Error Boundary caught: ${error.toString()}`,
      level: 'error',
      data: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Capture the exception to Sentry
    captureException(error, {
      context: 'error-boundary',
      componentStack: errorInfo.componentStack,
      type: 'react_error_boundary',
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    console.error('[ErrorBoundaryWithSentry]', error, errorInfo);
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex items-center justify-center py-20 px-4 bg-black text-white font-mono">
          <div className="text-center max-w-md">
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-2">⚠️ Erro Detectado</h1>
              <p className="text-sm text-gray-400">
                Algo deu errado ao carregar esta seção. Nossos sistemas foram notificados.
              </p>
            </div>

            {this.props.showDetails && this.state.error && (
              <div className="bg-gray-900 rounded p-3 mb-4 text-left text-xs">
                <p className="font-semibold text-red-400 mb-2">Detalhes do erro:</p>
                <p className="text-gray-300 break-words">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2 text-gray-400">
                    <summary className="cursor-pointer hover:text-white">
                      Component Stack
                    </summary>
                    <pre className="mt-2 text-xs overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.resetError}
                className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors text-sm font-medium"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-6 py-2 border border-gray-600 text-gray-300 hover:border-white hover:text-white transition-colors text-sm"
              >
                Ir para Home
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              ID do erro: {this.state.error ? this.state.error.message.slice(0, 8) : 'unknown'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWithSentry;

/**
 * React 18 Hook-based error boundary wrapper
 * Usage: Use this when you need to wrap specific components
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<
    ErrorBoundaryWithSentryProps,
    'children'
  >
) {
  const Wrapped = (props: P) => (
    <ErrorBoundaryWithSentry {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundaryWithSentry>
  );

  Wrapped.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return Wrapped;
}
