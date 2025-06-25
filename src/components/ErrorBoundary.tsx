import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { log } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  isolate?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  copied: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 2;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
      copied: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.generateErrorId();
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Log the error
    log.error('Component Error Boundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId
    }, 'ErrorBoundary');

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to error tracking service in production
    this.reportError(error, errorInfo, errorId);
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private reportError(error: Error, errorInfo: ErrorInfo, errorId: string) {
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry, LogRocket, etc.
      const errorReport = {
        errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      // You would send this to your error tracking service
      log.info('Error reported to tracking service', errorReport, 'ErrorBoundary');
    }
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: this.generateErrorId()
      });
      log.info(`Retry attempt ${this.retryCount}`, undefined, 'ErrorBoundary');
    } else {
      // Force page reload after max retries
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private copyErrorDetails = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2000);
      })
      .catch(() => {
        log.warn('Failed to copy error details to clipboard', undefined, 'ErrorBoundary');
      });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, errorId } = this.state;
      const isIsolated = this.props.isolate;

      return (
        <div className={`${isIsolated ? 'p-4' : 'min-h-screen'} bg-gradient-to-br from-red-950/20 to-black flex items-center justify-center`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto p-6"
          >
            <Card className="bg-black/80 border-red-500/30 backdrop-blur-xl">
              <div className="p-8 text-center">
                {/* Error Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6"
                >
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                </motion.div>

                {/* Error Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-3xl font-bold text-white mb-4">
                    Oops! Something went wrong
                  </h1>
                  <p className="text-gray-400 mb-6 text-lg">
                    We encountered an unexpected error. Our team has been notified and is working on a fix.
                  </p>
                </motion.div>

                {/* Error ID */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-900/50 rounded-lg p-3 mb-6 border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Error ID: {errorId}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={this.copyErrorDetails}
                      className="text-gray-400 hover:text-white"
                    >
                      {this.state.copied ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy Details
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>

                {/* Error Details (Development only) */}
                {this.props.showErrorDetails && process.env.NODE_ENV === 'development' && error && (
                  <motion.details
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-900/50 rounded-lg p-4 mb-6 text-left border border-gray-700"
                  >
                    <summary className="cursor-pointer text-red-400 font-medium mb-3 flex items-center">
                      <Bug className="w-4 h-4 mr-2" />
                      Technical Details (Development)
                    </summary>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">Error Message:</h4>
                        <code className="text-xs text-red-300 bg-red-950/30 p-2 rounded block overflow-auto">
                          {error.message}
                        </code>
                      </div>
                      {error.stack && (
                        <div>
                          <h4 className="text-sm font-medium text-white mb-1">Stack Trace:</h4>
                          <code className="text-xs text-gray-300 bg-gray-800/50 p-2 rounded block overflow-auto max-h-32">
                            {error.stack}
                          </code>
                        </div>
                      )}
                      {errorInfo?.componentStack && (
                        <div>
                          <h4 className="text-sm font-medium text-white mb-1">Component Stack:</h4>
                          <code className="text-xs text-gray-300 bg-gray-800/50 p-2 rounded block overflow-auto max-h-32">
                            {errorInfo.componentStack}
                          </code>
                        </div>
                      )}
                    </div>
                  </motion.details>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    onClick={this.handleRetry}
                    className="btn-primary"
                    disabled={this.retryCount >= this.maxRetries}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {this.retryCount >= this.maxRetries ? 'Reload Page' : 'Try Again'}
                  </Button>
                  
                  {!isIsolated && (
                    <Button
                      onClick={this.handleGoHome}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:text-white hover:border-white"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Go Home
                    </Button>
                  )}
                </motion.div>

                {/* Support Information */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8 pt-6 border-t border-gray-700"
                >
                  <p className="text-sm text-gray-500">
                    If this problem persists, please contact our support team with the error ID above.
                  </p>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 