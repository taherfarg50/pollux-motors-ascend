import { useEffect, useState } from 'react';

// Define a type for the scroll callback function
type ScrollCallback = (params: { scroll: number; velocity: number; direction: string }) => void;

/**
 * Mock Lenis class to avoid dependency issues
 * This provides the same interface as Lenis but uses native scrolling
 */
class MockLenis {
  private callbacks: Record<string, Array<ScrollCallback>> = {
    scroll: [],
  };
  
  constructor() {
    // Add scroll event listener to window
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }
  
  private handleScroll() {
    const scrollY = window.scrollY;
    // Call all registered scroll callbacks
    this.callbacks.scroll.forEach(callback => 
      callback({ scroll: scrollY, velocity: 0, direction: 'vertical' })
    );
  }
  
  // Mock Lenis API methods
  on(event: string, callback: ScrollCallback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }
  
  off(event: string, callback: ScrollCallback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }
  
  scrollTo(target: number | string | HTMLElement, options = {}) {
    if (typeof target === 'number') {
      window.scrollTo({
        top: target,
        behavior: 'smooth',
        ...options
      });
    } else if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          ...options
        });
      }
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({
        behavior: 'smooth',
        ...options
      });
    }
  }
  
  raf(time: number) {
    // No-op in mock version
  }
  
  destroy() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
    this.callbacks = { scroll: [] };
  }
}

/**
 * Creates and provides a singleton mock Lenis scroll instance
 * for compatibility while fixing dependency issues
 */
export function useLenisInstance() {
  const [lenis, setLenis] = useState<MockLenis | null>(null);
  
  useEffect(() => {
    // Only create instance once and in browser environment
    if (!lenis && typeof window !== 'undefined') {
      console.log("Creating mock smooth scroll instance");
      const mockInstance = new MockLenis();
      
      // Add a class to document when scrolling
      mockInstance.on('scroll', () => {
        document.documentElement.classList.add('scrolling-active');
      });
      
      // Remove the scrolling class when stopped
      const removeScrollingClass = () => {
        document.documentElement.classList.remove('scrolling-active');
      };
      
      let scrollTimeout: number;
      mockInstance.on('scroll', () => {
        window.clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(removeScrollingClass, 150);
      });
      
      // Save the instance to state
      setLenis(mockInstance);
    }
    
    // Cleanup: destroy instance on unmount
    return () => {
      if (lenis) {
        lenis.destroy();
        setLenis(null);
      }
    };
  }, []); // Empty dependency array means this runs once on mount
  
  return lenis;
} 