import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';

// Global type extension
declare global {
  interface Window {
    __LENIS?: Lenis;
    scrollActiveTimeout?: number;
    __SCROLL_DISABLED?: boolean;
  }
}

// Define Lenis scroll event type
interface LenisScrollEvent {
  scroll: number;
  limit: number;
  velocity: number;
  direction: number;
  progress: number;
}

interface ScrollContextValue {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number, immediate?: boolean }) => void;
  scrollProgress: number;
  isScrolling: boolean;
  enableNativeScroll: () => void;
  enableSmoothScroll: () => void;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    // Provide emergency fallback instead of throwing error
    return {
      lenis: null,
      scrollTo: (target: string | number | HTMLElement) => {
        if (typeof target === 'string') {
          const element = document.querySelector(target);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        } else if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' });
        } else if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      },
      scrollProgress: 0,
      isScrolling: false,
      enableNativeScroll: () => {},
      enableSmoothScroll: () => {}
    };
  }
  return context;
};

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [useNativeScroll, setUseNativeScroll] = useState(false);
  const scrollTimeout = useRef<number | null>(null);
  const location = useLocation();
  const rafRef = useRef<number | null>(null);

  // Emergency native scroll enabler
  const enableNativeScroll = useCallback(() => {
    console.log('Enabling native scroll as fallback...');
    setUseNativeScroll(true);
    window.__SCROLL_DISABLED = false;
    
    // Use current lenis instance without dependency
    setLenis((currentLenis) => {
      if (currentLenis) {
        try {
          currentLenis.destroy();
        } catch (error) {
          console.warn('Error destroying Lenis:', error);
        }
      }
      return null;
    });
    
    // Ensure body can scroll
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
  }, []); // Removed lenis dependency

  // Detect if we're on mobile or problematic browser
  const shouldUseNativeScroll = useCallback(() => {
    if (typeof window === 'undefined') return true;
    
    const isMobile = window.innerWidth < 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const isProblematicBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    return isMobile || isProblematicBrowser;
  }, []);

  // Setup Lenis with better error handling
  const setupLenis = useCallback(() => {
    // Don't setup if native scroll is preferred
    if (useNativeScroll || shouldUseNativeScroll()) {
      enableNativeScroll();
      return null;
    }

    try {
      // Clean up existing instance using functional update to avoid dependency
      setLenis((currentLenis) => {
        if (currentLenis) {
          try {
            currentLenis.destroy();
          } catch (error) {
            console.warn('Error destroying previous Lenis instance:', error);
          }
        }
        return currentLenis; // Return current to avoid changing state yet
      });

      // Create new Lenis instance with conservative settings
      const lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      // RAF loop with error handling
      const raf = (time: number) => {
        try {
          lenisInstance.raf(time);
          rafRef.current = requestAnimationFrame(raf);
        } catch (error) {
          console.error('Lenis RAF error, falling back to native scroll:', error);
          enableNativeScroll();
        }
      };

      rafRef.current = requestAnimationFrame(raf);

      // Scroll progress tracking
      lenisInstance.on('scroll', (e: LenisScrollEvent) => {
        try {
          requestAnimationFrame(() => {
            const progress = e.limit > 0 ? e.scroll / e.limit : 0;
            setScrollProgress(Math.max(0, Math.min(1, progress)));
            
            setIsScrolling(true);
            if (scrollTimeout.current) {
              clearTimeout(scrollTimeout.current);
            }
            scrollTimeout.current = window.setTimeout(() => {
              setIsScrolling(false);
            }, 150);
          });
        } catch (error) {
          console.error('Scroll tracking error:', error);
        }
      });

      // Test scroll functionality after a brief delay
      setTimeout(() => {
        try {
          const testScroll = window.scrollY;
          lenisInstance.scrollTo(testScroll + 1, { immediate: true });
          lenisInstance.scrollTo(testScroll, { immediate: true });
        } catch (error) {
          console.warn('Lenis test failed, using native scroll:', error);
          enableNativeScroll();
        }
      }, 100);

      setLenis(lenisInstance);
      return lenisInstance;

    } catch (error) {
      console.error('Failed to setup Lenis, using native scroll:', error);
      enableNativeScroll();
      return null;
    }
  }, [useNativeScroll, shouldUseNativeScroll, enableNativeScroll]); // Removed 'lenis' to break circular dependency

  // Re-enable smooth scroll
  const enableSmoothScroll = useCallback(() => {
    console.log('Re-enabling smooth scroll...');
    setUseNativeScroll(false);
    setupLenis();
  }, [setupLenis]);

  // Native scroll progress tracking
  useEffect(() => {
    if (!useNativeScroll) return;

    const handleNativeScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      
      setScrollProgress(Math.max(0, Math.min(1, progress)));
      
      setIsScrolling(true);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleNativeScroll);
  }, [useNativeScroll]);

  // Initialize on mount
  useEffect(() => {
    // Ensure scroll is never disabled
    window.__SCROLL_DISABLED = false;
    
    // Force enable scrolling on body
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Setup scroll system
    const instance = setupLenis();
    
    // Emergency scroll check
    const emergencyCheck = setTimeout(() => {
      const canScroll = document.documentElement.scrollHeight > window.innerHeight;
      const currentScroll = window.scrollY;
      
      if (canScroll) {
        // Test if scrolling works
        window.scrollTo(0, currentScroll + 1);
        setTimeout(() => {
          const newScroll = window.scrollY;
          if (newScroll === currentScroll && !useNativeScroll) {
            console.warn('Scroll appears to be blocked, enabling native scroll');
            enableNativeScroll();
          } else {
            // Restore original position
            window.scrollTo(0, currentScroll);
          }
        }, 100);
      }
    }, 2000);

    return () => {
      clearTimeout(emergencyCheck);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (instance) {
        try {
          instance.destroy();
        } catch (error) {
          console.warn('Error destroying Lenis on cleanup:', error);
        }
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [setupLenis, enableNativeScroll, useNativeScroll]);

  // Route change handling
  useEffect(() => {
    // Always scroll to top on route change
    window.scrollTo(0, 0);
    
    if (lenis && !useNativeScroll) {
      try {
        lenis.scrollTo(0, { immediate: true });
      } catch (error) {
        console.warn('Error scrolling to top with Lenis:', error);
        window.scrollTo(0, 0);
      }
    }
  }, [location.pathname, lenis, useNativeScroll]);

  // Enhanced scrollTo function
  const scrollTo = (
    target: string | number | HTMLElement, 
    options = { offset: -60, immediate: false }
  ) => {
    try {
      if (useNativeScroll || !lenis) {
        // Native scroll fallback
        if (typeof target === 'string') {
          const element = document.querySelector(target);
          if (element) {
            const rect = element.getBoundingClientRect();
            const offsetTop = rect.top + window.pageYOffset + (options.offset || 0);
            window.scrollTo({
              top: offsetTop,
              behavior: options.immediate ? 'auto' : 'smooth'
            });
          }
        } else if (typeof target === 'number') {
          window.scrollTo({
            top: target,
            behavior: options.immediate ? 'auto' : 'smooth'
          });
        } else if (target instanceof HTMLElement) {
          const rect = target.getBoundingClientRect();
          const offsetTop = rect.top + window.pageYOffset + (options.offset || 0);
          window.scrollTo({
            top: offsetTop,
            behavior: options.immediate ? 'auto' : 'smooth'
          });
        }
        return;
      }

      // Lenis scroll
      if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (element) {
          lenis.scrollTo(element as HTMLElement, options);
        }
      } else {
        lenis.scrollTo(target, options);
      }
    } catch (error) {
      console.error('ScrollTo error, using fallback:', error);
      // Fallback to native scroll
      if (typeof target === 'number') {
        window.scrollTo(0, target);
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <ScrollContext.Provider value={{ 
      lenis: useNativeScroll ? null : lenis, 
      scrollTo, 
      scrollProgress, 
      isScrolling,
      enableNativeScroll,
      enableSmoothScroll
    }}>
      {children}
    </ScrollContext.Provider>
  );
};
