
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { initSmoothScroll } from '@/lib/animation';

interface ScrollContextValue {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number, immediate?: boolean }) => void;
  scrollProgress: number;
  isScrolling: boolean;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within ScrollProvider');
  }
  return context;
};

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis with optimized settings
    const lenisInstance = initSmoothScroll();
    setLenis(lenisInstance);
    
    // Track scroll progress
    const handleScroll = (e: { scroll: number, limit: number }) => {
      setScrollProgress(e.scroll / e.limit);
      
      // Track scrolling state with debounce
      setIsScrolling(true);
      
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    
    lenisInstance.on('scroll', handleScroll);

    return () => {
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current);
      }
      lenisInstance.destroy();
    };
  }, []);

  // When route changes, scroll to top with smooth animation
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname, lenis]);

  const scrollTo = (
    target: string | number | HTMLElement, 
    options = { offset: -100, immediate: false }
  ) => {
    if (!lenis) return;
    
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        lenis.scrollTo(element as HTMLElement, options);
      }
    } else {
      lenis.scrollTo(target, options);
    }
  };

  return (
    <ScrollContext.Provider value={{ lenis, scrollTo, scrollProgress, isScrolling }}>
      {children}
    </ScrollContext.Provider>
  );
};
