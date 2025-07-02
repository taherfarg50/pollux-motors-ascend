// Removed circular import: import { perf } from './performance';

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

type LogData = Record<string, unknown> | unknown[] | string | number | boolean | null | undefined;

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: LogData;
  context?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private currentLevel = LogLevel.INFO;
  
  setLevel(level: LogLevel) {
    this.currentLevel = level;
  }
  
  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }
  
  private addLog(level: LogLevel, message: string, data?: LogData, context?: string) {
    if (!this.shouldLog(level)) return;
    
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context
    };
    
    this.logs.push(logEntry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(logEntry);
    }
  }
  
  debug(message: string, data?: LogData, context?: string) {
    this.addLog(LogLevel.DEBUG, message, data, context);
  }
  
  info(message: string, data?: LogData, context?: string) {
    this.addLog(LogLevel.INFO, message, data, context);
  }
  
  warn(message: string, data?: LogData, context?: string) {
    this.addLog(LogLevel.WARN, message, data, context);
  }
  
  error(message: string, data?: LogData, context?: string) {
    this.addLog(LogLevel.ERROR, message, data, context);
    
    // Track performance for errors using lazy import to avoid circular dependency
    try {
      import('./performance').then(({ perf }) => {
        perf.trackInteraction('error', context || 'unknown', {
          message,
          timestamp: Date.now()
        });
      }).catch(() => {
        // Silently ignore if performance module fails to load
      });
    } catch {
      // Silently ignore if dynamic import is not available
    }
  }
  
  private logToConsole(entry: LogEntry) {
    const prefix = `[${entry.timestamp}] ${LogLevel[entry.level]}${entry.context ? ` [${entry.context}]` : ''}:`;
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.data);
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.data);
        break;
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.data);
        break;
    }
  }
  
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }
  
  getLogsByContext(context: string): LogEntry[] {
    return this.logs.filter(log => log.context === context);
  }
  
  clearLogs() {
    this.logs = [];
  }
  
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
  
  // Performance logging helpers
  startTimer(name: string, context?: string): () => void {
    const startTime = performance.now();
    this.debug(`Timer started: ${name}`, { startTime }, context);
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.info(`Timer completed: ${name}`, { 
        startTime, 
        endTime, 
        duration: `${duration.toFixed(2)}ms` 
      }, context);
      
      // Track in performance monitor using lazy import
      try {
        import('./performance').then(({ perf }) => {
          perf.trackInteraction('timer', name, { duration });
        }).catch(() => {
          // Silently ignore if performance module fails to load
        });
      } catch {
        // Silently ignore if dynamic import is not available
      }
    };
  }
  
  // Error boundary logging
  logErrorBoundary(error: Error, errorInfo: React.ErrorInfo, context?: string) {
    this.error('React Error Boundary caught error', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      }
    }, context || 'ErrorBoundary');
  }
  
  // API request logging
  logApiRequest(method: string, url: string, data?: LogData, context?: string) {
    this.debug(`API Request: ${method} ${url}`, data, context || 'API');
  }
  
  logApiResponse(method: string, url: string, status: number, data?: LogData, duration?: number, context?: string) {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.DEBUG;
    this.addLog(level, `API Response: ${method} ${url} - ${status}`, {
      status,
      data,
      duration: duration ? `${duration.toFixed(2)}ms` : undefined
    }, context || 'API');
  }
}

// Create singleton instance
export const log = new Logger();

// Set appropriate log level based on environment
if (process.env.NODE_ENV === 'development') {
  log.setLevel(LogLevel.DEBUG);
} else {
  log.setLevel(LogLevel.WARN);
} 