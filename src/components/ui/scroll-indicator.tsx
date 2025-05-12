
import React from 'react';
import { useScroll } from '@/context/ScrollContext';
import { cn } from '@/lib/utils';

interface ScrollIndicatorProps {
  className?: string;
  barClassName?: string;
  fillClassName?: string;
}

export function ScrollIndicator({ 
  className, 
  barClassName,
  fillClassName 
}: ScrollIndicatorProps) {
  const { scrollProgress } = useScroll();
  
  return (
    <div className={cn("fixed top-0 left-0 right-0 h-1 z-50", className)}>
      <div className={cn("h-full bg-black/10", barClassName)}>
        <div 
          className={cn("h-full bg-pollux-red transition-transform duration-150", fillClassName)} 
          style={{ transform: `translateX(${scrollProgress * 100 - 100}%)` }}
        />
      </div>
    </div>
  );
}
