
import React, { useEffect, useState } from 'react';
import { useScroll } from '@/context/ScrollContext';
import { cn } from '@/lib/utils';

interface ScrollIndicatorProps {
  className?: string;
  barClassName?: string;
  fillClassName?: string;
  smoothing?: number; // Value between 0-1, higher = smoother
}

export function ScrollIndicator({ 
  className, 
  barClassName,
  fillClassName,
  smoothing = 0.1
}: ScrollIndicatorProps) {
  const { scrollProgress } = useScroll();
  const [smoothProgress, setSmoothProgress] = useState(0);
  
  useEffect(() => {
    // Apply smoothing to the scroll progress
    let animationFrameId: number;
    
    const animate = () => {
      setSmoothProgress(prev => {
        // Apply smoothing factor - closer to 1 is smoother but slower to respond
        return prev + (scrollProgress - prev) * smoothing;
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollProgress, smoothing]);
  
  return (
    <div className={cn("fixed top-0 left-0 right-0 h-1 z-50", className)}>
      <div className={cn("h-full bg-black/10", barClassName)}>
        <div 
          className={cn("h-full bg-pollux-red transition-transform", fillClassName)} 
          style={{ transform: `translateX(${smoothProgress * 100 - 100}%)` }}
        />
      </div>
    </div>
  );
}
