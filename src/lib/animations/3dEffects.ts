/**
 * 3D Animation Effects for Pollux Motors
 * These utilities help create modern 3D effects on the website
 */

import { RefObject } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  
  // Register custom luxury easing
  CustomEase.create("luxuryEaseOut", "0.25, 0.1, 0.25, 1");
  CustomEase.create("luxuryEaseIn", "0.42, 0, 0.58, 1");
}

/**
 * Apply 3D tilt effect to an element
 * @param element Element to apply the tilt effect to
 * @param intensity Intensity of the tilt effect
 * @returns Cleanup function
 */
export const apply3DTilt = (
  element: HTMLElement,
  intensity = 20
) => {
  if (!element || typeof window === 'undefined') return;
  
  // Set initial styles
  element.style.transition = 'transform 0.3s ease';
  element.style.transformStyle = 'preserve-3d';
  element.style.willChange = 'transform';
  
  // Add event listeners
  const onMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation based on mouse position
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * intensity;
    const rotateX = ((centerY - mouseY) / (rect.height / 2)) * intensity;
    
    // Apply transform with smooth animation
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };
  
  const onMouseLeave = () => {
    // Reset to initial state with animation
    element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  };
  
  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseleave', onMouseLeave);
  };
};

/**
 * Apply 3D tilt effect to an element
 * @param ref Element reference
 * @param options Configuration options
 */
export const apply3DTiltEffect = (
  ref: RefObject<HTMLElement>, 
  options = {
    perspective: 1000,
    max: 15,
    scale: 1.05,
    speed: 1000,
    easing: 'cubicBezier(.03,.98,.52,.99)',
    glare: true,
    glareMax: 0.2,
    gyroscope: false
  }
) => {
  if (!ref.current || typeof window === 'undefined') return;
  
  const element = ref.current;
  
  // Create glare element if enabled
  let glareElement: HTMLDivElement | null = null;
  if (options.glare) {
    glareElement = document.createElement('div');
    glareElement.className = 'js-tilt-glare';
    glareElement.style.position = 'absolute';
    glareElement.style.top = '0';
    glareElement.style.left = '0';
    glareElement.style.width = '100%';
    glareElement.style.height = '100%';
    glareElement.style.overflow = 'hidden';
    glareElement.style.pointerEvents = 'none';
    glareElement.style.borderRadius = 'inherit';
    glareElement.style.zIndex = '2';
    
    const glareInner = document.createElement('div');
    glareInner.className = 'js-tilt-glare-inner';
    glareInner.style.position = 'absolute';
    glareInner.style.top = '50%';
    glareInner.style.left = '50%';
    glareInner.style.transform = 'translate(-50%, -50%)';
    glareInner.style.width = `${element.offsetWidth * 2}px`;
    glareInner.style.height = `${element.offsetWidth * 2}px`;
    glareInner.style.backgroundImage = 'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)';
    glareInner.style.transform = 'rotate(180deg) translate(-50%, -50%)';
    glareInner.style.transformOrigin = '0% 0%';
    glareInner.style.opacity = '0';
    
    glareElement.appendChild(glareInner);
    element.appendChild(glareElement);
    
    // Make sure the element can have a 3D perspective
    element.style.overflow = 'visible';
    element.style.transformStyle = 'preserve-3d';
  }
  
  // Set initial styles
  element.style.transition = `transform ${options.speed}ms ${options.easing}`;
  element.style.transformStyle = 'preserve-3d';
  element.style.transform = 'perspective(1000px)';
  
  // Add event listeners
  const onMouseEnter = () => {
    element.style.transition = 'initial';
    // Scale up slightly on hover
    gsap.to(element, {
      scale: options.scale,
      duration: 0.5,
      ease: "luxuryEaseOut"
    });
  };
  
  const onMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation based on mouse position
    const rotateX = ((mouseY - centerY) / (rect.height / 2)) * -options.max;
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * options.max;
    
    // Apply transform with smooth animation
    gsap.to(element, {
      rotateX: `${rotateX}deg`,
      rotateY: `${rotateY}deg`,
      duration: 0.1,
      ease: "power1.out"
    });
    
    // Update glare effect
    if (options.glare && glareElement) {
      const glareSize = element.offsetWidth * 2;
      const glareInner = glareElement.querySelector('.js-tilt-glare-inner') as HTMLElement;
      
      // Calculate glare position
      const offsetX = (mouseX - centerX) / rect.width;
      const offsetY = (mouseY - centerY) / rect.height;
      
      // Adjust glare position and opacity
      glareInner.style.transform = `rotate(${Math.atan2(offsetY, offsetX) * (180 / Math.PI)}deg) translate(-50%, -50%)`;
      glareInner.style.opacity = `${Math.min(
        Math.max(Math.abs(offsetX) + Math.abs(offsetY), 0),
        1
      ) * options.glareMax}`;
    }
  };
  
  const onMouseLeave = () => {
    // Reset to initial state with animation
    gsap.to(element, {
      rotateX: '0deg',
      rotateY: '0deg',
      scale: 1,
      duration: 0.5,
      ease: "luxuryEaseOut"
    });
    
    if (options.glare && glareElement) {
      const glareInner = glareElement.querySelector('.js-tilt-glare-inner') as HTMLElement;
      glareInner.style.opacity = '0';
    }
  };
  
  element.addEventListener('mouseenter', onMouseEnter);
  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);
  
  // Handle gyroscope movement if enabled
  if (options.gyroscope && window.DeviceOrientationEvent) {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta ? event.beta : 0; // -90 to 90 (front/back tilt)
      const gamma = event.gamma ? event.gamma : 0; // -90 to 90 (left/right tilt)
      
      // Limit beta range
      const normalizedBeta = Math.min(Math.max(beta, -45), 45);
      const normalizedGamma = Math.min(Math.max(gamma, -45), 45);
      
      // Calculate tilt
      const tiltY = (normalizedBeta / 45) * options.max; 
      const tiltX = (normalizedGamma / 45) * options.max;
      
      gsap.to(element, {
        rotateX: `${tiltY}deg`,
        rotateY: `${-tiltX}deg`,
        duration: 0.2,
        ease: "power1.out"
      });
    };
    
    window.addEventListener('deviceorientation', handleOrientation);
    
    // Return cleanup function
    return () => {
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }
  
  // Return cleanup function
  return () => {
    element.removeEventListener('mouseenter', onMouseEnter);
    element.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseleave', onMouseLeave);
  };
};

/**
 * Apply a floating animation to an element
 * @param element Element reference
 * @param options Animation options
 */
export const applyFloatingAnimation = (
  ref: RefObject<HTMLElement>,
  options = {
    duration: 3,
    distance: 10, // pixels
    delay: 0,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
  }
) => {
  if (!ref.current || typeof window === 'undefined') return;
  
  const element = ref.current;
  
  // Create animation
  const animation = gsap.timeline({ repeat: options.repeat, yoyo: options.yoyo })
    .fromTo(
      element,
      { y: 0 },
      { 
        y: options.distance, 
        duration: options.duration, 
        delay: options.delay,
        ease: options.ease 
      }
    );
  
  // Return cleanup function
  return () => {
    animation.kill();
  };
};

/**
 * Apply a luxury hover effect to car cards
 * @param cardRef Reference to the card element
 * @param imageRef Reference to the image inside card
 */
export const applyLuxuryCardEffect = (
  cardRef: RefObject<HTMLElement>,
  imageRef: RefObject<HTMLElement>
) => {
  if (!cardRef.current || !imageRef.current) return;
  
  const card = cardRef.current;
  const image = imageRef.current;
  
  const handleMouseEnter = () => {
    gsap.to(card, {
      y: -15,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
      duration: 0.5,
      ease: "luxuryEaseOut"
    });
    
    gsap.to(image, {
      scale: 1.1,
      duration: 0.5,
      ease: "luxuryEaseOut"
    });
  };
  
  const handleMouseLeave = () => {
    gsap.to(card, {
      y: 0,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
      duration: 0.5,
      ease: "luxuryEaseIn"
    });
    
    gsap.to(image, {
      scale: 1,
      duration: 0.5,
      ease: "luxuryEaseIn"
    });
  };
  
  card.addEventListener('mouseenter', handleMouseEnter);
  card.addEventListener('mouseleave', handleMouseLeave);
  
  // Return cleanup function
  return () => {
    card.removeEventListener('mouseenter', handleMouseEnter);
    card.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Create a smooth rotating animation for 3D objects
 * @param ref Element reference
 * @param options Animation options
 */
export const applyRotatingAnimation = (
  ref: RefObject<HTMLElement>,
  options = {
    rotationX: 0,
    rotationY: 360,
    rotationZ: 0,
    duration: 20,
    ease: "none",
    repeat: -1
  }
) => {
  if (!ref.current) return;
  
  const element = ref.current;
  
  // Create animation
  const animation = gsap.to(element, {
    rotateX: options.rotationX,
    rotateY: options.rotationY,
    rotateZ: options.rotationZ,
    duration: options.duration,
    ease: options.ease,
    repeat: options.repeat,
    transformOrigin: "center center"
  });
  
  // Return cleanup function
  return () => {
    animation.kill();
  };
};

/**
 * Apply a reveal animation on scroll
 * @param ref Element reference
 * @param options Animation options
 */
export const applyScrollRevealAnimation = (
  ref: RefObject<HTMLElement>,
  options = {
    y: 50,
    opacity: 0,
    duration: 0.8,
    delay: 0, 
    stagger: 0.1,
    ease: "luxuryEaseOut",
    threshold: 0.2
  }
) => {
  if (!ref.current) return;
  
  const element = ref.current;
  
  // Set initial state
  gsap.set(element, {
    y: options.y,
    opacity: options.opacity
  });
  
  // Create scroll trigger
  const scrollTrigger = ScrollTrigger.create({
    trigger: element,
    start: `top bottom-=${options.threshold * 100}%`,
    onEnter: () => {
      gsap.to(element, {
        y: 0,
        opacity: 1,
        duration: options.duration,
        delay: options.delay,
        ease: options.ease
      });
    },
    once: true
  });
  
  // Return cleanup function
  return () => {
    scrollTrigger.kill();
  };
};

/**
 * Apply a shine animation that sweeps across an element
 * @param ref Element reference
 * @param options Animation options
 */
export const applyShineEffect = (
  ref: RefObject<HTMLElement>,
  options = {
    duration: 3,
    delay: 2,
    repeat: -1
  }
) => {
  if (!ref.current) return;
  
  const element = ref.current;
  
  // Create shine overlay element
  const shineElement = document.createElement('div');
  shineElement.className = 'shine-effect';
  shineElement.style.position = 'absolute';
  shineElement.style.top = '0';
  shineElement.style.left = '0';
  shineElement.style.width = '200%';
  shineElement.style.height = '200%';
  shineElement.style.backgroundImage = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)';
  shineElement.style.transform = 'rotate(30deg) translateX(-100%)';
  shineElement.style.pointerEvents = 'none';
  
  // Make sure parent has position relative
  if (window.getComputedStyle(element).position === 'static') {
    element.style.position = 'relative';
  }
  element.style.overflow = 'hidden';
  element.appendChild(shineElement);
  
  // Create animation
  const animation = gsap.to(shineElement, {
    x: '100%',
    duration: options.duration,
    delay: options.delay,
    repeat: options.repeat,
    repeatDelay: options.delay,
    ease: "power1.inOut"
  });
  
  // Return cleanup function
  return () => {
    animation.kill();
    if (element.contains(shineElement)) {
      element.removeChild(shineElement);
    }
  };
};

// Apply 3D hover effect to multiple elements
export function apply3DHoverToCollection(selector: string, intensity = 15) {
  try {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (!elements || elements.length === 0) return () => {};
    
    const cleanupFunctions: Array<() => void> = [];
    
    elements.forEach(el => {
      const cleanup = apply3DTilt(el, intensity);
      if (cleanup) cleanupFunctions.push(cleanup);
    });
    
    // Return combined cleanup function
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  } catch (error) {
    console.error('Error in apply3DHoverToCollection:', error);
    return () => {};
  }
}

// Apply 3D depth layers effect to create parallax scrolling
export function applyParallaxLayers(container: HTMLElement) {
  if (!container) return;
  
  const layers = container.querySelectorAll<HTMLElement>('[data-depth]');
  let ticking = false;
  
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollPosition = window.scrollY;
        
        layers.forEach(layer => {
          const depth = parseFloat(layer.getAttribute('data-depth') || '0');
          const movement = -(scrollPosition * depth);
          
          layer.style.transform = `translate3d(0, ${movement}px, 0)`;
        });
        
        ticking = false;
      });
      
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  
  // Call once to initialize
  handleScroll();
  
  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

// Create a 3D card flip effect
export function createCardFlipEffect(cardSelector: string, frontSelector: string, backSelector: string) {
  try {
    const cards = document.querySelectorAll<HTMLElement>(cardSelector);
    if (!cards || cards.length === 0) return;
    
    cards.forEach(card => {
      const front = card.querySelector<HTMLElement>(frontSelector);
      const back = card.querySelector<HTMLElement>(backSelector);
      
      if (!front || !back) return;
      
      // Setup initial styles
      card.style.perspective = '1000px';
      card.style.transformStyle = 'preserve-3d';
      
      front.style.backfaceVisibility = 'hidden';
      front.style.position = 'absolute';
      front.style.width = '100%';
      front.style.height = '100%';
      front.style.transformStyle = 'preserve-3d';
      front.style.transition = 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
      
      back.style.backfaceVisibility = 'hidden';
      back.style.position = 'absolute';
      back.style.width = '100%';
      back.style.height = '100%';
      back.style.transform = 'rotateY(180deg)';
      back.style.transformStyle = 'preserve-3d';
      back.style.transition = 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
      
      // Add flip logic
      card.addEventListener('click', () => {
        if (card.classList.contains('flipped')) {
          front.style.transform = 'rotateY(0deg)';
          back.style.transform = 'rotateY(180deg)';
          card.classList.remove('flipped');
        } else {
          front.style.transform = 'rotateY(-180deg)';
          back.style.transform = 'rotateY(0deg)';
          card.classList.add('flipped');
        }
      });
    });
  } catch (error) {
    console.error('Error in createCardFlipEffect:', error);
  }
}

// Apply 3D rotate on scroll effect to an element
export function applyRotateOnScroll(selector: string, options = { maxRotate: 25 }) {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  const { maxRotate } = options;
  
  const handleScroll = () => {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the element is from the center of the viewport
      const elementCenter = rect.top + rect.height/2;
      const viewportCenter = windowHeight/2;
      const distanceFromCenter = elementCenter - viewportCenter;
      
      // Calculate rotation based on distance from center
      const rotationPercentage = (distanceFromCenter / (windowHeight/2)) * maxRotate;
      const rotation = Math.max(-maxRotate, Math.min(maxRotate, rotationPercentage));
      
      // Apply rotation
      el.style.transform = `perspective(1000px) rotateY(${rotation}deg)`;
    });
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Call once to initialize
  
  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

// Scale and transform effect for hero sections
export function apply3DHeroEffect(heroSelector: string, contentSelector: string) {
  try {
    const hero = document.querySelector<HTMLElement>(heroSelector);
    const content = document.querySelector<HTMLElement>(contentSelector);
    
    if (!hero || !content) {
      console.warn('Hero or content elements not found for 3D hero effect');
      return;
    }
    
    let scrollTimeout: number | null = null;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;
      const scrollPercent = Math.min(scrollY / heroHeight, 1);
      
      // Scale and transform the hero section based on scroll
      hero.style.transform = `scale(${1 + scrollPercent * 0.05}) translateY(${scrollPercent * -50}px)`;
      
      // Add parallax effect to content
      content.style.transform = `translateY(${scrollPercent * 100}px)`;
      
      // Add opacity effect
      content.style.opacity = `${1 - scrollPercent * 1.5}`;
    };
    
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      
      scrollTimeout = window.requestAnimationFrame(handleScroll);
    });
    
    // Call once to initialize
    handleScroll();
    
    // Return cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
    };
  } catch (error) {
    console.error('Error in apply3DHeroEffect:', error);
  }
} 