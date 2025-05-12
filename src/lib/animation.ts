import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { useState } from 'react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize smooth scroll with optimized performance settings
export const initSmoothScroll = () => {
  const lenis = new Lenis({
    duration: 0.8, // Reduced from 1.2 for faster scrolling
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.5, // Reduced for better responsiveness
    wheelMultiplier: 1.2, // Added for faster wheel scrolling
    lerp: 0.08, // Lower lerp for snappier response
    syncTouch: true, // Better touch synchronization
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Connect GSAP ScrollTrigger to Lenis with optimized performance
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.lagSmoothing(0); // Disable lagSmoothing for better performance
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  return lenis;
};

// Create a hook for tracking if an element should reduce motion based on user preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  return prefersReducedMotion;
};

// Animation helper functions

// Reveal on scroll with improved performance
export const useRevealAnimation = (
  elementRef: React.RefObject<HTMLElement>,
  options = {
    threshold: 0.1,
    y: 50,
    delay: 0,
    duration: 0.6, // Faster animation
    stagger: 0,
    once: true,
  }
) => {
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    if (!elementRef.current || prefersReducedMotion) return;
    
    const element = elementRef.current;
    let childElements = options.stagger 
      ? Array.from(element.children) 
      : [element];
      
    const animation = gsap.fromTo(
      childElements,
      { 
        y: options.y, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1, 
        duration: options.duration, 
        delay: options.delay,
        stagger: options.stagger,
        ease: 'power2.out', // Changed to power2 for snappier animations
        scrollTrigger: {
          trigger: element,
          start: 'top bottom-=50', // Trigger earlier
          toggleActions: options.once ? 'play none none none' : 'play reverse play reverse',
        }
      }
    );
    
    return () => {
      animation.kill();
    };
  }, [elementRef, options, prefersReducedMotion]);
};

// Pinning section animation
export const usePinningAnimation = (
  sectionRef: React.RefObject<HTMLElement>,
  { duration = 2, pin = true } = {}
) => {
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;
    
    const section = sectionRef.current;
    
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${duration * 100}%`,
      pin: pin,
      pinSpacing: true,
    });
    
    return () => {
      st.kill();
    };
  }, [sectionRef, duration, pin, prefersReducedMotion]);
};

// Parallax animation
export const useParallaxAnimation = (
  elementRef: React.RefObject<HTMLElement>,
  { speed = 0.5, direction = 'y' } = {}
) => {
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    if (!elementRef.current || prefersReducedMotion) return;
    
    const element = elementRef.current;
    const distance = direction === 'y' ? '100%' : '50%';
    
    const parallax = gsap.fromTo(
      element,
      { [direction]: 0 },
      {
        [direction]: direction === 'y' ? `-${distance}` : `${distance}`,
        ease: 'none',
        scrollTrigger: {
          trigger: element.parentElement || element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );
    
    return () => {
      parallax.kill();
    };
  }, [elementRef, speed, direction, prefersReducedMotion]);
};

// Hero section animation with improved performance
export const useHeroAnimation = (refs: {
  container: React.RefObject<HTMLElement>;
  title: React.RefObject<HTMLElement>;
  subtitle: React.RefObject<HTMLElement>;
  cta: React.RefObject<HTMLElement>;
  image?: React.RefObject<HTMLElement>;
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    if (
      !refs.container.current || 
      !refs.title.current || 
      !refs.subtitle.current || 
      !refs.cta.current ||
      prefersReducedMotion
    ) return;
    
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } }); // Changed to power2 for better performance
    
    // Initial state - opacity 0 for all elements
    gsap.set([refs.title.current, refs.subtitle.current, refs.cta.current], { opacity: 0 });
    
    // If there's an image, set its initial state
    if (refs.image?.current) {
      gsap.set(refs.image.current, { opacity: 0, scale: 0.95 });
    }
    
    // Animation timeline with faster timings
    tl.fromTo(
      refs.title.current,
      { y: 40 },
      { y: 0, opacity: 1, duration: 0.6 }
    )
    .fromTo(
      refs.subtitle.current,
      { y: 20 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.4'
    )
    .fromTo(
      refs.cta.current,
      { y: 10 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.3,
        onComplete: () => {
          // Small bounce effect on the CTA
          gsap.to(refs.cta.current, {
            y: -3,
            duration: 0.15,
            repeat: 1,
            yoyo: true,
            ease: 'power2.inOut'
          });
        }
      },
      '-=0.3'
    );
    
    // If there's an image, animate it faster
    if (refs.image?.current) {
      tl.fromTo(
        refs.image.current,
        { scale: 0.97 },
        { scale: 1, opacity: 1, duration: 0.8 },
        '-=0.6'
      );
    }
    
    return () => {
      tl.kill();
    };
  }, [refs, prefersReducedMotion]);
};

// Navbar animation with improved performance
export const useNavbarAnimation = (navbarRef: React.RefObject<HTMLElement>) => {
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    if (!navbarRef.current || prefersReducedMotion) return;
    
    const navbar = navbarRef.current;
    let lastScrollTop = 0;
    
    const showNav = gsap.timeline({ paused: true });
    showNav.to(navbar, { 
      y: 0, 
      duration: 0.2,  // Faster animation
      ease: 'power1.out',
      onStart: () => {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
      }
    });
    
    const hideNav = gsap.timeline({ paused: true });
    hideNav.to(navbar, { 
      y: '-100%', 
      duration: 0.3,  // Faster animation
      ease: 'power1.inOut',
      onComplete: () => {
        navbar.style.boxShadow = 'none';
      }
    });
    
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // Show/hide based on scroll direction with improved logic
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down and not at the top
        hideNav.play();
      } else {
        // Scrolling up or at the top
        showNav.play();
      }
      
      lastScrollTop = scrollTop;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true }); // Added passive for better performance
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      showNav.kill();
      hideNav.kill();
    };
  }, [navbarRef, prefersReducedMotion]);
};
