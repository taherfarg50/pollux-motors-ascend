
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
  easing?: 'linear' | 'easeOut' | 'easeInOut' | 'bounce';
}

export function DigitalCounter({
  value,
  duration = 2000,
  className,
  prefix = '',
  suffix = '',
  decimals = 0,
  easing = 'easeOut'
}: DigitalCounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();
  const frameRef = useRef<number>();
  
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
    
    // Different easing functions
    const easingFunctions = {
      linear: (x: number): number => x,
      easeOut: (x: number): number => 1 - Math.pow(1 - x, 4),
      easeInOut: (x: number): number => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
      bounce: (x: number): number => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (x < 1 / d1) {
          return n1 * x * x;
        } else if (x < 2 / d1) {
          return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
          return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
          return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
      }
    };
    
    const animateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apply selected easing function
      const easedProgress = easingFunctions[easing](progress);
      
      const currentValue = startValue + change * easedProgress;
      countRef.current = currentValue;
      setCount(currentValue);
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animateCount);
      }
    };
    
    frameRef.current = requestAnimationFrame(animateCount);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration, prefersReducedMotion, easing]);
  
  const formattedValue = count.toFixed(decimals);
  
  return (
    <span className={cn('font-mono tabular-nums', className)}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}
