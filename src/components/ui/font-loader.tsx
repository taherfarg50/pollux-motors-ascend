import React, { useEffect } from 'react';

export function FontLoader() {
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined' || !document || !document.head) {
      return;
    }
    
    // Helper function to safely add a font
    const addFont = (href: string) => {
      try {
        // Check if this font is already loaded
        const existingLinks = document.querySelectorAll(`link[href="${href}"]`);
        if (existingLinks.length > 0) {
          return existingLinks[0]; // Font already loaded
        }
        
        // Create new link
        const link = document.createElement('link');
        link.href = href;
        link.rel = 'stylesheet';
        
        // Safety check before appending
        if (document.head) {
          document.head.appendChild(link);
          return link;
        }
        return null;
      } catch (error) {
        console.error('Error loading font:', href, error);
        return null;
      }
    };
    
    // Load all fonts
    const fontLinks = [
      // Load Playfair Display - luxury serif font
      'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
      // Improve existing Inter font with variable support
      'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
      // Add Lexend font with variable support
      'https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap'
    ];
    
    // Track added links for cleanup
    const addedLinks = fontLinks.map(href => addFont(href)).filter(Boolean);
    
    // Cleanup function
    return () => {
      if (!document || !document.head) return;
      
      // Only remove links that we added (not ones that were already there)
      addedLinks.forEach(link => {
        if (link && document.head.contains(link)) {
          try {
            document.head.removeChild(link);
          } catch (error) {
            console.error('Error removing font link:', error);
          }
        }
      });
    };
  }, []);

  return null; // This component doesn't render anything
}

export default FontLoader; 