import { useEffect, useRef } from 'react';
import { 
  apply3DTilt, 
  apply3DHoverToCollection, 
  applyParallaxLayers,
  createCardFlipEffect,
  applyFloatingAnimation,
  applyRotateOnScroll,
  apply3DHeroEffect
} from '../lib/animations/3dEffects';

/**
 * Hook to apply 3D tilt effect to an element
 * @param intensity - The intensity of the tilt effect (default: 20)
 * @returns ref to attach to the element
 */
export function use3DTilt(intensity = 20) {
  const elementRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const cleanup = apply3DTilt(element, intensity);
    return cleanup;
  }, [intensity]);
  
  return elementRef;
}

/**
 * Hook to apply 3D hover effect to multiple elements
 * @param selector - CSS selector for the elements
 * @param intensity - The intensity of the tilt effect (default: 15)
 */
export function use3DHoverCollection(selector: string, intensity = 15) {
  useEffect(() => {
    const cleanup = apply3DHoverToCollection(selector, intensity);
    return cleanup;
  }, [selector, intensity]);
}

/**
 * Hook to apply parallax scrolling effects to layers
 * @param containerRef - Reference to the container element
 */
export function useParallaxLayers(containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!containerRef.current) return;
    
    const cleanup = applyParallaxLayers(containerRef.current);
    return cleanup;
  }, [containerRef]);
}

/**
 * Hook to create card flip effects
 * @param cardSelector - CSS selector for the card elements
 * @param frontSelector - CSS selector for the front elements
 * @param backSelector - CSS selector for the back elements
 */
export function useCardFlipEffect(
  cardSelector: string,
  frontSelector: string,
  backSelector: string
) {
  useEffect(() => {
    createCardFlipEffect(cardSelector, frontSelector, backSelector);
    // No cleanup needed as this just sets up event handlers
  }, [cardSelector, frontSelector, backSelector]);
}

/**
 * Hook to apply floating animation to elements
 * @param selector - CSS selector for the elements
 * @param options - Animation options (duration, distance, delay)
 */
export function useFloatingAnimation(
  selector: string,
  options = { duration: 3, distance: 15, delay: 0 }
) {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    const cleanupFunctions: Array<() => void> = [];
    
    elements.forEach((element, index) => {
      const cleanup = applyFloatingAnimation({ current: element }, {
        duration: options.duration,
        distance: options.distance,
        delay: index * 0.2
      });
      
      if (cleanup) cleanupFunctions.push(cleanup);
    });
    
    // Return combined cleanup
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [selector, options.duration, options.distance, options.delay]);
}

/**
 * Hook to apply rotation effect on scroll
 * @param selector - CSS selector for the elements
 * @param options - Animation options (maxRotate)
 */
export function useRotateOnScroll(
  selector: string,
  options = { maxRotate: 25 }
) {
  useEffect(() => {
    const cleanup = applyRotateOnScroll(selector, options);
    return cleanup;
  }, [selector, options.maxRotate]);
}

/**
 * Hook to apply 3D hero section effect
 * @param heroSelector - CSS selector for the hero element
 * @param contentSelector - CSS selector for the content element
 */
export function use3DHeroEffect(
  heroSelector: string,
  contentSelector: string
) {
  useEffect(() => {
    const cleanup = apply3DHeroEffect(heroSelector, contentSelector);
    return cleanup;
  }, [heroSelector, contentSelector]);
}

/**
 * Combined hook that adds various 3D effects to a page
 * @param options - Configuration for all 3D effects
 */
export function usePagewide3DEffects(options = {
  tiltSelectors: ['.card', '.feature-box', '.testimonial'],
  parallaxContainer: '.hero-section',
  cardFlip: {
    card: '.flip-card',
    front: '.flip-card-front',
    back: '.flip-card-back'
  },
  floating: '.floating-element',
  rotateOnScroll: '.rotate-on-scroll',
  heroEffect: {
    hero: '.hero-section',
    content: '.hero-content'
  }
}) {
  // Apply 3D hover effects
  useEffect(() => {
    const cleanupFunctions: Array<() => void> = [];
    
    options.tiltSelectors.forEach(selector => {
      const cleanup = apply3DHoverToCollection(selector);
      if (cleanup) cleanupFunctions.push(cleanup);
    });
    
    // Apply parallax layers if container exists
    const parallaxContainer = document.querySelector<HTMLElement>(options.parallaxContainer);
    if (parallaxContainer) {
      const cleanup = applyParallaxLayers(parallaxContainer);
      if (cleanup) cleanupFunctions.push(cleanup);
    }
    
    // Setup card flip effects
    createCardFlipEffect(
      options.cardFlip.card,
      options.cardFlip.front,
      options.cardFlip.back
    );
    
    // Apply floating animations
    const floatingElements = document.querySelectorAll<HTMLElement>(options.floating);
    floatingElements.forEach((element, index) => {
      if (element) {
        const cleanup = applyFloatingAnimation({ current: element }, {
          duration: 3 + (index % 3),
          distance: 10 + (index % 5),
          delay: index * 0.2
        });
        if (cleanup) cleanupFunctions.push(cleanup);
      }
    });
    
    // Apply rotate on scroll
    const rotateCleanup = applyRotateOnScroll(options.rotateOnScroll);
    if (rotateCleanup) cleanupFunctions.push(rotateCleanup);
    
    // Apply hero effect
    const heroCleanup = apply3DHeroEffect(
      options.heroEffect.hero, 
      options.heroEffect.content
    );
    if (heroCleanup) cleanupFunctions.push(heroCleanup);
    
    // Return combined cleanup
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [
    options.tiltSelectors,
    options.parallaxContainer,
    options.cardFlip.card,
    options.cardFlip.front,
    options.cardFlip.back,
    options.floating,
    options.rotateOnScroll,
    options.heroEffect.hero,
    options.heroEffect.content
  ]);
} 