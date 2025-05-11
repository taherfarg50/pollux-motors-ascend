
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { initSmoothScroll } from '@/lib/animation';

interface ScrollContextValue {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement) => void;
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
  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis
    const lenisInstance = initSmoothScroll();
    setLenis(lenisInstance);

    return () => {
      lenisInstance.destroy();
    };
  }, []);

  // When route changes, scroll to top
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname, lenis]);

  const scrollTo = (target: string | number | HTMLElement) => {
    if (!lenis) return;
    
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        lenis.scrollTo(element as HTMLElement, { offset: -100 });
      }
    } else {
      lenis.scrollTo(target, { offset: -100 });
    }
  };

  return (
    <ScrollContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </ScrollContext.Provider>
  );
};
