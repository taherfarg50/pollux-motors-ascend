import React from 'react';

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

// Performance monitoring utility
interface PerformanceMeasure {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

interface InteractionData {
  [key: string]: unknown;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observer: PerformanceObserver | null = null;
  private isSupported = typeof window !== 'undefined' && 'PerformanceObserver' in window;
  private measures: Map<string, PerformanceMeasure> = new Map();
  private interactions: Array<{
    type: string;
    name: string;
    timestamp: number;
    data?: InteractionData;
  }> = [];

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
      console.error('Failed to initialize performance observer', error);
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
          if (process.env.NODE_ENV === 'development') {
            console.info('Navigation metrics collected', metrics);
          }
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
    if (process.env.NODE_ENV === 'development') {
      console.debug('Web vitals tracking initialized');
    }
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
  startMeasure(name: string): void {
    const startTime = performance.now();
    this.measures.set(name, {
      name,
      startTime
    });
  }

  endMeasure(name: string): number | null {
    const measure = this.measures.get(name);
    if (!measure) {
      console.warn(`Performance measure "${name}" not found`);
      return null;
    }
    
    const endTime = performance.now();
    const duration = endTime - measure.startTime;
    
    measure.endTime = endTime;
    measure.duration = duration;
    
    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ Performance: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  // Track user interactions and custom metrics
  trackInteraction(type: string, name: string, data?: InteractionData): void {
    this.interactions.push({
      type,
      name,
      timestamp: Date.now(),
      data
    });
    
    // Keep only last 100 interactions to prevent memory leaks
    if (this.interactions.length > 100) {
      this.interactions = this.interactions.slice(-100);
    }
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

  // Get all measurements
  getAllMeasures(): PerformanceMeasure[] {
    return Array.from(this.measures.values());
  }
  
  // Get specific measurement
  getMeasure(name: string): PerformanceMeasure | undefined {
    return this.measures.get(name);
  }
  
  // Get interactions by type
  getInteractionsByType(type: string): Array<{
    type: string;
    name: string;
    timestamp: number;
    data?: InteractionData;
  }> {
    return this.interactions.filter(interaction => interaction.type === type);
  }

  // Get performance summary
  getSummary() {
    const completedMeasures = Array.from(this.measures.values())
      .filter(measure => measure.duration !== undefined);
    
    const totalDuration = completedMeasures.reduce((sum, measure) => 
      sum + (measure.duration || 0), 0);
    
    const averageDuration = completedMeasures.length > 0 
      ? totalDuration / completedMeasures.length 
      : 0;
    
    return {
      totalMeasures: this.measures.size,
      completedMeasures: completedMeasures.length,
      totalDuration: totalDuration.toFixed(2),
      averageDuration: averageDuration.toFixed(2),
      totalInteractions: this.interactions.length,
      interactionTypes: [...new Set(this.interactions.map(i => i.type))]
    };
  }

  // Clean up
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.metrics = [];
    this.measures.clear();
    this.interactions = [];
  }

  // Report Core Web Vitals
  reportWebVitals(): void {
    // Check if browser supports the API
    if (typeof window === 'undefined' || !('performance' in window)) {
      return;
    }

    // Get FCP (First Contentful Paint)
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.trackInteraction('web-vital', 'FCP', {
          value: navigation.loadEventEnd - navigation.fetchStart,
          rating: navigation.loadEventEnd - navigation.fetchStart < 1800 ? 'good' : 'poor'
        });
      }
    } catch (error) {
      console.warn('Error measuring FCP:', error);
    }

    // Track LCP (Largest Contentful Paint) if supported
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            this.trackInteraction('web-vital', 'LCP', {
              value: lastEntry.startTime,
              rating: lastEntry.startTime < 2500 ? 'good' : 'poor'
            });
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('Error measuring LCP:', error);
      }
    }
  }
  
  // Monitor memory usage (if available)
  getMemoryUsage(): { used: number; total: number } | null {
    if ('memory' in performance) {
      const memory = (performance as unknown as { memory: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024) // MB
      };
    }
    return null;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Helper functions for common measurements
export const perf = {
  startMeasure: (name: string) => performanceMonitor.startMeasure(name),
  endMeasure: (name: string) => performanceMonitor.endMeasure(name),
  trackInteraction: (type: string, name: string, data?: InteractionData) => 
    performanceMonitor.trackInteraction(type, name, data),
  trackResourceLoad: (resourceName: string, loadTime: number) => 
    performanceMonitor.trackResourceLoad(resourceName, loadTime),
  getSummary: () => performanceMonitor.getSummary()
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