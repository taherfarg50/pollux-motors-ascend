import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with Tailwind CSS class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price with currency symbol and thousands separators
 */
export function formatPrice(price: number, currency: string = "USD", locale: string = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate a slug from a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get a random item from an array
 */
export function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Truncate a string to a specific length and add ellipsis
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Animation delay utility for staggered animations
 */
export function getAnimationDelay(index: number, baseDelay: number = 0.1): string {
  return `${baseDelay * index}s`;
}

/**
 * Check if a value is an object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Deep merge two objects
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>) as T[Extract<keyof T, string>];
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * Generate responsive image srcset for better performance
 */
export function generateSrcSet(
  imagePath: string,
  sizes: number[] = [640, 768, 1024, 1280, 1536, 1920]
): string {
  // Check if the image is external (starts with http)
  if (imagePath.startsWith('http')) {
    // For external images, we can't generate srcset
    return imagePath;
  }
  
  // Check if image path includes file extension
  const hasExtension = /\.(jpg|jpeg|png|webp|avif|gif)$/.test(imagePath);
  
  // Generate srcset string
  return sizes
    .map(size => {
      const width = size;
      // If the image has an extension, insert the width before the extension
      const responsiveImagePath = hasExtension
        ? imagePath.replace(/\.(jpg|jpeg|png|webp|avif|gif)$/, `-${width}w.$1`)
        : `${imagePath}-${width}w`;
      
      return `${responsiveImagePath} ${width}w`;
    })
    .join(', ');
}

/**
 * Get appropriate image size based on viewport
 */
export function getResponsiveImageSize(
  viewportWidth: number
): { width: number; quality: number } {
  // Default quality
  let quality = 90;
  
  // Determine appropriate width based on viewport
  let width: number;
  if (viewportWidth < 640) {
    width = 640;
    quality = 85; // Lower quality for mobile to save bandwidth
  } else if (viewportWidth < 768) {
    width = 768;
  } else if (viewportWidth < 1024) {
    width = 1024;
  } else if (viewportWidth < 1280) {
    width = 1280;
  } else if (viewportWidth < 1536) {
    width = 1536;
  } else {
    width = 1920;
  }
  
  return { width, quality };
}

/**
 * Detect if the connection is slow
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  // Check if the browser supports the Network Information API
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    
    // Check if user has enabled data saver
    if (connection.saveData) return true;
    
    // Check connection type
    if (connection.effectiveType && ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Optimize image loading based on connection speed
 */
export function getOptimizedImageProps(
  src: string,
  width: number,
  height: number,
  priority: boolean = false
): {
  src: string;
  width: number;
  height: number;
  loading: "eager" | "lazy";
  decoding: "async" | "sync";
  fetchPriority: "high" | "auto";
} {
  const slow = isSlowConnection();
  
  return {
    src,
    width,
    height,
    loading: priority || !slow ? "eager" : "lazy",
    decoding: priority ? "sync" : "async",
    fetchPriority: priority ? "high" : "auto",
  };
}

/**
 * Detect WebP support for image optimization
 */
export function supportsWebP(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }
  
  // If we've already checked, return the cached result
  if ('_supportsWebP' in window) {
    return Promise.resolve((window as any)._supportsWebP);
  }
  
  return new Promise(resolve => {
    const image = new Image();
    
    image.onload = function() {
      const result = image.width > 0 && image.height > 0;
      (window as any)._supportsWebP = result;
      resolve(result);
    };
    
    image.onerror = function() {
      (window as any)._supportsWebP = false;
      resolve(false);
    };
    
    image.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  });
}
