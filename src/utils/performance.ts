import React from 'react';
import { log } from './logger';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  id?: string;
}

interface NavigationMetrics {
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observer: PerformanceObserver | null = null;
  private isSupported = typeof window !== 'undefined' && 'PerformanceObserver' in window;

  constructor() {
    if (this.isSupported) {
      this.initializeObserver();
      this.trackNavigationMetrics();
    }
  }

  private initializeObserver() {
    try {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordMetric({
            name: entry.name,
            value: entry.duration || entry.startTime,
            timestamp: Date.now(),
            id: entry.entryType
          });
        });
      });

      // Observe different types of performance entries
      this.observer.observe({ entryTypes: ['measure', 'navigation', 'paint', 'largest-contentful-paint'] });
      
      // Web Vitals observer
      if ('web-vitals' in window) {
        this.trackWebVitals();
      }
    } catch (error) {
      log.error('Failed to initialize performance observer', error, 'PerformanceMonitor');
    }
  }

  private trackNavigationMetrics() {
    if (!this.isSupported) return;

    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navTiming) {
          const metrics = {
            domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.fetchStart,
            firstContentfulPaint: this.getFirstContentfulPaint(),
            largestContentfulPaint: this.getLargestContentfulPaint(),
            firstInputDelay: this.getFirstInputDelay(),
            cumulativeLayoutShift: this.getCumulativeLayoutShift(),
            timeToInteractive: this.getTimeToInteractive()
          };

          this.recordNavigationMetrics(metrics);
          log.info('Navigation metrics collected', metrics, 'PerformanceMonitor');
        }
      }, 1000);
    });
  }

  private getFirstContentfulPaint(): number {
    const entries = performance.getEntriesByType('paint');
    const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : 0;
  }

  private getLargestContentfulPaint(): number {
    const entries = performance.getEntriesByType('largest-contentful-paint');
    return entries.length > 0 ? entries[entries.length - 1].startTime : 0;
  }

  private getFirstInputDelay(): number {
    // This requires the web-vitals library for accurate measurement
    return 0;
  }

  private getCumulativeLayoutShift(): number {
    // This requires the web-vitals library for accurate measurement
    return 0;
  }

  private getTimeToInteractive(): number {
    // Simplified TTI calculation
    const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navTiming ? navTiming.domInteractive - navTiming.fetchStart : 0;
  }

  private trackWebVitals() {
    // This would integrate with the web-vitals library if installed
    // For now, we'll use basic performance API measurements
    log.debug('Web vitals tracking initialized', undefined, 'PerformanceMonitor');
  }

  private recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only recent metrics (last 100)
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  private recordNavigationMetrics(metrics: NavigationMetrics) {
    Object.entries(metrics).forEach(([name, value]) => {
      this.recordMetric({
        name,
        value,
        timestamp: Date.now(),
        id: 'navigation'
      });
    });
  }

  // Public methods for manual tracking
  startMeasure(name: string) {
    if (this.isSupported) {
      performance.mark(`${name}-start`);
      log.debug(`Started measuring: ${name}`, undefined, 'PerformanceMonitor');
    }
  }

  endMeasure(name: string) {
    if (this.isSupported) {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        const measure = performance.getEntriesByName(name, 'measure')[0];
        if (measure) {
          log.info(`Measurement completed: ${name}`, { duration: measure.duration }, 'PerformanceMonitor');
          return measure.duration;
        }
      } catch (error) {
        log.error(`Failed to end measure: ${name}`, error, 'PerformanceMonitor');
      }
    }
    return 0;
  }

  // Track user interactions
  trackUserInteraction(action: string, target?: string, metadata?: any) {
    const metric: PerformanceMetric = {
      name: `user-interaction-${action}`,
      value: Date.now(),
      timestamp: Date.now(),
      id: target
    };

    this.recordMetric(metric);
    log.debug(`User interaction tracked: ${action}`, { target, metadata }, 'PerformanceMonitor');
  }

  // Track resource loading
  trackResourceLoad(resourceName: string, loadTime: number) {
    this.recordMetric({
      name: `resource-load-${resourceName}`,
      value: loadTime,
      timestamp: Date.now(),
      id: 'resource'
    });
  }

  // Get performance summary
  getPerformanceSummary() {
    const navigationMetrics = this.metrics.filter(m => m.id === 'navigation');
    const userInteractions = this.metrics.filter(m => m.name.startsWith('user-interaction'));
    const resourceLoads = this.metrics.filter(m => m.id === 'resource');

    return {
      navigation: navigationMetrics,
      interactions: userInteractions.length,
      resources: resourceLoads.length,
      totalMetrics: this.metrics.length,
      lastUpdated: Date.now()
    };
  }

  // Clean up
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.metrics = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Helper functions for common measurements
export const perf = {
  startMeasure: (name: string) => performanceMonitor.startMeasure(name),
  endMeasure: (name: string) => performanceMonitor.endMeasure(name),
  trackInteraction: (action: string, target?: string, metadata?: any) => 
    performanceMonitor.trackUserInteraction(action, target, metadata),
  trackResourceLoad: (resourceName: string, loadTime: number) => 
    performanceMonitor.trackResourceLoad(resourceName, loadTime),
  getSummary: () => performanceMonitor.getPerformanceSummary()
};

// High-order component for measuring component render time
export function withPerformanceTracking<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceTrackedComponent(props: T) {
    React.useEffect(() => {
      perf.startMeasure(`${componentName}-render`);
      return () => {
        perf.endMeasure(`${componentName}-render`);
      };
    }, []);

    return React.createElement(WrappedComponent, props);
  };
}

export default performanceMonitor; 