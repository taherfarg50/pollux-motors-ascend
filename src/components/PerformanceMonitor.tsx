import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Clock, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const calculateMetrics = () => {
      if (!window.performance || !window.performance.timing) return;

      const timing = window.performance.timing;
      const navigation = window.performance.navigation;

      // Calculate basic timing metrics
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;

      // Get paint timing
      let firstPaint = 0;
      let firstContentfulPaint = 0;
      
      if ('PerformanceObserver' in window) {
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach((entry) => {
          if (entry.name === 'first-paint') {
            firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            firstContentfulPaint = entry.startTime;
          }
        });
      }

      // Get Web Vitals
      let largestContentfulPaint = 0;
      let cumulativeLayoutShift = 0;
      const firstInputDelay = 0;
      const timeToInteractive = timing.domInteractive - timing.navigationStart;

      // Observe LCP
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            largestContentfulPaint = lastEntry.startTime;
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // Observe CLS
          const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              const layoutShiftEntry = entry as PerformanceEntry & { 
                hadRecentInput?: boolean; 
                value?: number 
              };
              if (!layoutShiftEntry.hadRecentInput) {
                cumulativeLayoutShift += layoutShiftEntry.value || 0;
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.error('Performance Observer error:', e);
        }
      }

      setMetrics({
        pageLoadTime,
        domContentLoaded,
        firstPaint,
        firstContentfulPaint,
        largestContentfulPaint,
        cumulativeLayoutShift,
        firstInputDelay,
        timeToInteractive,
      });
    };

    // Wait for page load
    if (document.readyState === 'complete') {
      calculateMetrics();
    } else {
      window.addEventListener('load', calculateMetrics);
    }

    // Keyboard shortcut to toggle visibility (Ctrl + Shift + P)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('load', calculateMetrics);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible || !metrics) {
    return null;
  }

  const getPerformanceScore = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'good';
    if (value <= thresholds[1]) return 'needs-improvement';
    return 'poor';
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <Card className="fixed bottom-4 right-4 z-50 p-4 bg-background/95 backdrop-blur-sm shadow-xl max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Performance Monitor
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Page Load
          </span>
          <Badge
            variant={
              getPerformanceScore(metrics.pageLoadTime, [1000, 3000]) === 'good'
                ? 'default'
                : getPerformanceScore(metrics.pageLoadTime, [1000, 3000]) === 'needs-improvement'
                ? 'secondary'
                : 'destructive'
            }
          >
            {formatTime(metrics.pageLoadTime)}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            DOM Ready
          </span>
          <Badge variant="outline">{formatTime(metrics.domContentLoaded)}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">FCP</span>
          <Badge
            variant={
              getPerformanceScore(metrics.firstContentfulPaint, [1800, 3000]) === 'good'
                ? 'default'
                : getPerformanceScore(metrics.firstContentfulPaint, [1800, 3000]) === 'needs-improvement'
                ? 'secondary'
                : 'destructive'
            }
          >
            {formatTime(metrics.firstContentfulPaint)}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">TTI</span>
          <Badge variant="outline">{formatTime(metrics.timeToInteractive)}</Badge>
        </div>

        {metrics.largestContentfulPaint > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">LCP</span>
            <Badge
              variant={
                getPerformanceScore(metrics.largestContentfulPaint, [2500, 4000]) === 'good'
                  ? 'default'
                  : getPerformanceScore(metrics.largestContentfulPaint, [2500, 4000]) === 'needs-improvement'
                  ? 'secondary'
                  : 'destructive'
              }
            >
              {formatTime(metrics.largestContentfulPaint)}
            </Badge>
          </div>
        )}

        {metrics.cumulativeLayoutShift > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">CLS</span>
            <Badge
              variant={
                getPerformanceScore(metrics.cumulativeLayoutShift, [0.1, 0.25]) === 'good'
                  ? 'default'
                  : getPerformanceScore(metrics.cumulativeLayoutShift, [0.1, 0.25]) === 'needs-improvement'
                  ? 'secondary'
                  : 'destructive'
              }
            >
              {metrics.cumulativeLayoutShift.toFixed(3)}
            </Badge>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t">
        <p className="text-xs text-muted-foreground">
          Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl</kbd> +{' '}
          <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Shift</kbd> +{' '}
          <kbd className="px-1 py-0.5 text-xs bg-muted rounded">P</kbd> to toggle
        </p>
      </div>
    </Card>
  );
};

export default PerformanceMonitor; 