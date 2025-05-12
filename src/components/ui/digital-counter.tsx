
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/animation';

interface DigitalCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function DigitalCounter({
  value,
  duration = 2000,
  className,
  prefix = '',
  suffix = '',
  decimals = 0
}: DigitalCounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    // Skip animation for users who prefer reduced motion
    if (prefersReducedMotion) {
      setCount(value);
      return;
    }
    
    const startTime = Date.now();
    const startValue = countRef.current;
    const endValue = value;
    const change = endValue - startValue;
    
    if (change === 0) return;
    
    const animateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);
      const easedProgress = easeOutQuart(progress);
      
      const currentValue = startValue + change * easedProgress;
      countRef.current = currentValue;
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    
    requestAnimationFrame(animateCount);
  }, [value, duration, prefersReducedMotion]);
  
  const formattedValue = count.toFixed(decimals);
  
  return (
    <span className={cn('font-mono tabular-nums', className)}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}
