import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  /**
   * The threshold in pixels after which the button appears
   */
  threshold?: number;
  
  /**
   * Position of the button
   */
  position?: 'bottom-right' | 'bottom-left';
  
  /**
   * Custom classes to apply to the button
   */
  className?: string;
  
  /**
   * Whether to use a glass effect
   */
  glass?: boolean;
}

/**
 * ScrollToTop button that appears when the user scrolls down the page
 * and allows them to smoothly scroll back to the top.
 */
export function ScrollToTop({
  threshold = 300,
  position = 'bottom-right',
  className = '',
  glass = true,
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Track scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    
    // Initial check
    toggleVisibility();
    
    // Clean up
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);
  
  // Smooth scroll to top function
  const scrollToTop = () => {
    // Check if browser supports smooth scrolling
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Fallback for browsers that don't support smooth scrolling
      const scrollStep = -window.scrollY / 20;
      const scrollInterval = setInterval(() => {
        if (window.scrollY !== 0) {
          window.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
        }
      }, 15);
    }
  };
  
  // Determine position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className={`
            fixed z-50 p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-pollux-blue focus:ring-opacity-50
            ${glass ? 'backdrop-blur-md bg-black/30 border border-white/10' : 'bg-pollux-blue'}
            ${positionClasses[position]}
            ${className}
          `}
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUp className="h-5 w-5 text-white" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
} 