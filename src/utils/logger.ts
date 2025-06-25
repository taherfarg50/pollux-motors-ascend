type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
  context?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    return `[${timestamp}] ${level.toUpperCase()}${contextStr}: ${message}`;
  }

  private addLog(level: LogLevel, message: string, data?: any, context?: string) {
    const logEntry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
      context
    };

    this.logs.push(logEntry);
    
    // Keep only the latest logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  debug(message: string, data?: any, context?: string) {
    this.addLog('debug', message, data, context);
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context), data || '');
    }
  }

  info(message: string, data?: any, context?: string) {
    this.addLog('info', message, data, context);
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, context), data || '');
    }
  }

  warn(message: string, data?: any, context?: string) {
    this.addLog('warn', message, data, context);
    console.warn(this.formatMessage('warn', message, context), data || '');
  }

  error(message: string, error?: Error | any, context?: string) {
    this.addLog('error', message, error, context);
    console.error(this.formatMessage('error', message, context), error || '');
    
    // In production, you might want to send this to an error tracking service
    if (!this.isDevelopment && typeof window !== 'undefined') {
      // Example: Send to error tracking service
      // trackError(message, error, context);
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  // Performance logging
  time(label: string, context?: string) {
    if (this.isDevelopment) {
      console.time(label);
    }
    this.debug(`Timer started: ${label}`, undefined, context);
  }

  timeEnd(label: string, context?: string) {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
    this.debug(`Timer ended: ${label}`, undefined, context);
  }

  // Group logging for complex operations
  group(label: string, context?: string) {
    if (this.isDevelopment) {
      console.group(label);
    }
    this.debug(`Group started: ${label}`, undefined, context);
  }

  groupEnd(context?: string) {
    if (this.isDevelopment) {
      console.groupEnd();
    }
    this.debug('Group ended', undefined, context);
  }
}

// Create singleton instance
export const logger = new Logger();

// Helper functions for quick access
export const log = {
  debug: (message: string, data?: any, context?: string) => logger.debug(message, data, context),
  info: (message: string, data?: any, context?: string) => logger.info(message, data, context),
  warn: (message: string, data?: any, context?: string) => logger.warn(message, data, context),
  error: (message: string, error?: Error | any, context?: string) => logger.error(message, error, context),
  time: (label: string, context?: string) => logger.time(label, context),
  timeEnd: (label: string, context?: string) => logger.timeEnd(label, context),
  group: (label: string, context?: string) => logger.group(label, context),
  groupEnd: (context?: string) => logger.groupEnd(context)
};

export default logger; 