import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp, RotateCcw } from 'lucide-react';
import { useScroll } from '@/context/ScrollContext';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollBlocked, setScrollBlocked] = useState(false);
  const { scrollTo, enableNativeScroll, enableSmoothScroll, lenis } = useScroll();
  const location = useLocation();

  // Check if scroll is working
  useEffect(() => {
    const checkScrollFunction = () => {
      const canScroll = document.documentElement.scrollHeight > window.innerHeight;
      if (!canScroll) return;

      const currentScroll = window.scrollY;
      
      // Try to scroll 1px down
      window.scrollTo(0, currentScroll + 1);
      
      setTimeout(() => {
        const newScroll = window.scrollY;
        const scrollWorking = newScroll !== currentScroll;
        
        if (!scrollWorking) {
          console.warn('Scroll appears to be blocked');
          setScrollBlocked(true);
        } else {
          setScrollBlocked(false);
          // Restore original position
          window.scrollTo(0, currentScroll);
        }
      }, 100);
    };

    // Check scroll function after page loads
    const timer = setTimeout(checkScrollFunction, 2000);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Show/hide button based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const handleScrollToTop = () => {
    try {
      scrollTo(0, { immediate: false });
    } catch (error) {
      console.warn('Scroll to top failed, using fallback:', error);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Emergency scroll fix
  const handleEmergencyScrollFix = () => {
    console.log('Applying emergency scroll fix...');
    
    // Force enable scrolling on all elements
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
    
    // Add emergency class
    document.body.classList.add('force-scroll-enabled');
    document.documentElement.classList.add('force-scroll-enabled');
    
    // Enable native scroll
    enableNativeScroll();
    
    // Reset scroll blocked state
    setScrollBlocked(false);
    
    // Force a scroll test
    setTimeout(() => {
      window.scrollTo(0, 1);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }, 200);
  };

  // Auto-scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!isVisible && !scrollBlocked) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {/* Emergency scroll fix button */}
      {scrollBlocked && (
        <button
          onClick={handleEmergencyScrollFix}
          className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
          title="Fix scroll functionality"
          aria-label="Emergency scroll fix"
        >
          <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      )}
      
      {/* Regular scroll to top button */}
      {isVisible && (
        <button
          onClick={handleScrollToTop}
          className="p-3 bg-pollux-blue hover:bg-pollux-blue/90 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      )}
      
      {/* Scroll mode indicator */}
      {!lenis && (
        <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded text-center">
          Native Scroll
        </div>
      )}
    </div>
  );
};

export default ScrollToTop; 