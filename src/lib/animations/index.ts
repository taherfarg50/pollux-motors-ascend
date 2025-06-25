/**
 * Animations index file for Pollux Motors
 * Exports animation utilities and initialization functions
 */

import { 
  apply3DTiltEffect, 
  applyFloatingAnimation, 
  applyLuxuryCardEffect, 
  applyRotatingAnimation,
  applyScrollRevealAnimation,
  applyShineEffect,
  apply3DHoverToCollection,
  applyParallaxLayers,
  createCardFlipEffect,
  applyRotateOnScroll,
  apply3DHeroEffect
} from './3dEffects';

/**
 * Initialize all global animations on the site
 * This function should be called once when the application loads
 */
export const initAnimations = () => {
  // Only run in browser environment
  if (typeof window === 'undefined') return;

  try {
    // Apply 3D hover effects to luxury cards
    const luxuryCards = document.querySelectorAll('.luxury-card');
    luxuryCards.forEach(card => {
      const imageEl = card.querySelector('.card-image');
      if (card instanceof HTMLElement && imageEl instanceof HTMLElement) {
        applyLuxuryCardEffect({ current: card }, { current: imageEl });
      }
    });

    // Apply 3D tilt to showcased elements
    const showcaseElements = document.querySelectorAll('.showcase-element');
    showcaseElements.forEach(element => {
      if (element instanceof HTMLElement) {
        apply3DTiltEffect({ current: element });
      }
    });

    // Apply floating animations to floating elements
    const floatingElements = document.querySelectorAll('.float-element');
    floatingElements.forEach((element, index) => {
      if (element instanceof HTMLElement) {
        applyFloatingAnimation({ current: element }, {
          duration: 3 + (index % 3),
          distance: 10 + (index % 5),
          delay: index * 0.2
        });
      }
    });

    // Initialize card hovering for grid items
    apply3DHoverToCollection('.card-3d', 15);

    // Apply shine effects to buttons and interactive elements
    const shineElements = document.querySelectorAll('.shine-element');
    shineElements.forEach(element => {
      if (element instanceof HTMLElement) {
        applyShineEffect({ current: element });
      }
    });

    console.log('✨ Pollux animations initialized');
    
  } catch (error) {
    console.error('Error initializing animations:', error);
  }
};

// Export all animation utilities
export {
  apply3DTiltEffect,
  applyFloatingAnimation,
  applyLuxuryCardEffect,
  applyRotatingAnimation,
  applyScrollRevealAnimation,
  applyShineEffect,
  apply3DHoverToCollection,
  applyParallaxLayers,
  createCardFlipEffect,
  applyRotateOnScroll,
  apply3DHeroEffect
}; 