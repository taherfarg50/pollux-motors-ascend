
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
  smoothing = 0.06 // Reduced from 0.1 for snappier response
}: ScrollIndicatorProps) {
  const { scrollProgress } = useScroll();
  const [smoothProgress, setSmoothProgress] = useState(0);
  
  useEffect(() => {
    // Apply optimized smoothing to the scroll progress
    let animationFrameId: number;
    let previousTime = 0;
    
    const animate = (time: number) => {
      // Calculate delta time for consistent animation regardless of frame rate
      const deltaTime = previousTime ? Math.min(1, (time - previousTime) / 16) : 1;
      previousTime = time;
      
      setSmoothProgress(prev => {
        // Apply improved smoothing with delta time compensation
        const factor = Math.min(1, smoothing * deltaTime * 60);
        return prev + (scrollProgress - prev) * factor;
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
          style={{ 
            transform: `translateX(${smoothProgress * 100 - 100}%)`,
            willChange: 'transform' // Hint to browser to optimize this animation
          }}
        />
      </div>
    </div>
  );
}
