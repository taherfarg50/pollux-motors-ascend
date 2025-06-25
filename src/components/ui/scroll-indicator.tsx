import React, { useEffect, useState } from 'react';
import { useScroll } from '@/context/ScrollContext';
import { cn } from '@/lib/utils';
import { motion, useSpring, animate } from 'framer-motion';

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
  smoothing = 0.03 // Even snappier response
}: ScrollIndicatorProps) {
  const { scrollProgress } = useScroll();
  const springConfig = { stiffness: 300, damping: 30, mass: 0.5 };
  const smoothProgress = useSpring(scrollProgress, springConfig);
  
  return (
    <motion.div 
      className={cn(
        "fixed top-0 left-0 right-0 h-1.5 z-50 backdrop-blur-sm shadow-lg", 
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className={cn("h-full bg-black/5 dark:bg-white/5", barClassName)}>
        <motion.div 
          className={cn(
            "h-full bg-gradient-to-r from-pollux-red via-pollux-red to-red-500", 
            "relative overflow-hidden",
            fillClassName
          )} 
          style={{ 
            scaleX: smoothProgress,
            transformOrigin: "left",
            willChange: 'transform' // Hint to browser to optimize this animation
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrollProgress }}
          transition={{ type: "spring", ...springConfig }}
        >
          {/* Add subtle glow effect */}
          <div className="absolute inset-0 glow-effect">
            <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-white/30 to-transparent" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
