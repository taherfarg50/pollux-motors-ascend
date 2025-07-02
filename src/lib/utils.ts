import { type ClassValue, clsx } from "clsx"
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
export function formatPrice(price: string | number, currency: string = "AED"): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]/g, '')) : price;
  
  if (isNaN(numericPrice)) {
    return "Price on request";
  }
  
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
}

/**
 * Formats a number with commas
 */
export function formatNumber(num: number | string): string {
  const numericValue = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(numericValue)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US').format(numericValue);
}

/**
 * Truncates text to a specified length and adds ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 */
export function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  wait: number
): (...args: T) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttles a function to ensure it is called at most once in a given time period
 */
export function throttle<T extends unknown[]>(
  func: (...args: T) => void,
  limit: number
): (...args: T) => void {
  let inThrottle: boolean;
  
  return (...args: T) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  if (typeof obj === "object") {
    const clonedObj = {} as { [K in keyof T]: T[K] };
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj as T;
  }
  
  return obj;
}

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Checks if a string is a valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if a string is a valid phone number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Converts a file size to a human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Gets a relative time string
 */
export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return targetDate.toLocaleDateString();
  }
}

/**
 * Extracts the domain from a URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * Safely parses a JSON string
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
}

/**
 * Generates a slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Converts a hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Converts RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

/**
 * Local storage utilities with error handling
 */
export function setLocalStorage(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function removeLocalStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
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
          (output as Record<string, unknown>)[key] = deepMerge(
            target[key] as Record<string, unknown>, 
            source[key] as Record<string, unknown>
          );
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
    interface NetworkInformation {
      saveData?: boolean;
      effectiveType?: string;
    }
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    
    if (connection) {
      // Check if user has enabled data saver
      if (connection.saveData) return true;
      
      // Check connection type
      if (connection.effectiveType && ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) {
        return true;
      }
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
    return Promise.resolve((window as Window & { _supportsWebP?: boolean })._supportsWebP ?? false);
  }
  
  return new Promise(resolve => {
    const image = new Image();
    
    image.onload = function() {
      const result = image.width > 0 && image.height > 0;
      (window as Window & { _supportsWebP?: boolean })._supportsWebP = result;
      resolve(result);
    };
    
    image.onerror = function() {
      (window as Window & { _supportsWebP?: boolean })._supportsWebP = false;
      resolve(false);
    };
    
    image.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  });
}
