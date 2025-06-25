import { useState, useEffect } from 'react';

/**
 * Hook that detects when a specific key is pressed
 * 
 * @param targetKey - The key to detect (e.g., 'Escape', 'ArrowLeft')
 * @returns boolean indicating if the key is currently pressed
 * 
 * @example
 * ```tsx
 * const escapePressed = useKeyPress('Escape');
 * 
 * useEffect(() => {
 *   if (escapePressed) {
 *     // Do something when Escape is pressed
 *   }
 * }, [escapePressed]);
 * ```
 */
export function useKeyPress(targetKey: string): boolean {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);
  
  // Add event listeners
  useEffect(() => {
    // If pressed key is our target key then set to true
    const downHandler = (event: KeyboardEvent): void => {
      if (event.key === targetKey) {
        setKeyPressed(true);
        
        // Prevent default behavior for certain keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(targetKey)) {
          event.preventDefault();
        }
      }
    };
    
    // If released key is our target key then set to false
    const upHandler = (event: KeyboardEvent): void => {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', downHandler, { passive: false });
    window.addEventListener('keyup', upHandler);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]); // Only re-run if targetKey changes
  
  return keyPressed;
}

/**
 * Hook that detects when a combination of keys is pressed
 * 
 * @param targetKeys - Array of keys that should be pressed together
 * @returns boolean indicating if all the keys are currently pressed
 * 
 * @example
 * ```tsx
 * const ctrlSPressed = useKeyCombination(['Control', 's']);
 * 
 * useEffect(() => {
 *   if (ctrlSPressed) {
 *     // Do something when Ctrl+S is pressed
 *   }
 * }, [ctrlSPressed]);
 * ```
 */
export function useKeyCombination(targetKeys: string[]): boolean {
  // State for tracking pressed keys
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    // Handler for keydown
    const downHandler = (event: KeyboardEvent): void => {
      setPressedKeys((prevKeys) => {
        const newKeys = new Set(prevKeys);
        newKeys.add(event.key);
        return newKeys;
      });
      
      // Check if all target keys are pressed
      const allTargetKeysPressed = targetKeys.every(key => 
        key === event.key || pressedKeys.has(key)
      );
      
      // Prevent default for certain combinations
      if (allTargetKeysPressed) {
        event.preventDefault();
      }
    };
    
    // Handler for keyup
    const upHandler = (event: KeyboardEvent): void => {
      setPressedKeys((prevKeys) => {
        const newKeys = new Set(prevKeys);
        newKeys.delete(event.key);
        return newKeys;
      });
    };
    
    // Add event listeners
    window.addEventListener('keydown', downHandler, { passive: false });
    window.addEventListener('keyup', upHandler);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKeys, pressedKeys]);
  
  // Check if all target keys are currently pressed
  return targetKeys.every(key => pressedKeys.has(key));
} 