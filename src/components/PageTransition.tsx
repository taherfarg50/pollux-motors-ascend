import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/animation';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const PageTransition = ({ children, className }: PageTransitionProps) => {
  const location = useLocation();
  const [isInitialRender, setIsInitialRender] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  
  // Set initial render to false after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialRender(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
      
  // For users who prefer reduced motion, use a simpler transition
  if (prefersReducedMotion) {
    return (
      <div 
        className={cn("page-content min-h-screen", className)}
        key={location.pathname}
      >
        {children}
      </div>
    );
  }
  
  // Regular page transition for users without reduced motion preference
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className={cn("page-content overflow-hidden", className)}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={{
          initial: { opacity: 0 },
          enter: { opacity: 1 },
          exit: { opacity: 0 },
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Loading bar animation */}
        {!isInitialRender && (
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pollux-blue to-pollux-blue z-[9999]"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={{ 
              scaleX: [0, 0.3, 0.7, 0.9, 1],
              opacity: [1, 1, 1, 1, 0], 
            }}
            transition={{ 
              times: [0, 0.3, 0.6, 0.9, 1],
              duration: 1.2, 
              ease: [0.22, 1, 0.36, 1] 
        }}
      />
        )}
      
        {/* Page reveal effect - slides up from bottom */}
        <motion.div
          className="relative z-10 min-h-screen"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{
            type: "tween",
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
        {children}
        </motion.div>
        
        {/* Page transition overlay - slides in from bottom */}
        {!isInitialRender && (
          <motion.div
            className="fixed inset-0 z-[9998] pointer-events-none"
            initial={{ transform: "translateY(100%)" }}
            animate={{ transform: "translateY(-100%)" }}
            exit={{ transform: "translateY(-200%)" }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="absolute inset-0 bg-black"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-pollux-blue/30 to-transparent opacity-50"></div>
          </motion.div>
        )}
        
        {/* Glassmorphic overlay effect */}
        <motion.div
          className="fixed inset-0 z-[9997] pointer-events-none backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{
            duration: 0.8,
            times: [0, 0.5, 1],
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition; 