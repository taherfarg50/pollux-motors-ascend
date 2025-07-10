import React, { useState, useEffect } from 'react';
import { getOptimizedImageProps, generateSrcSet, isSlowConnection } from '@/lib/utils';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fallbackSrc?: string;
  aspectRatio?: string;
  objectFit?: React.CSSProperties['objectFit'];
  sizes?: string;
  blur?: boolean;
  className?: string;
}

/**
 * OptimizedImage component for better image loading performance
 * 
 * Features:
 * - Responsive image loading with srcset
 * - Lazy loading for non-priority images
 * - Blur-up placeholder effect
 * - Fallback image for errors
 * - Accessibility improvements
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  fallbackSrc = '/media/images/placeholder.jpg',
  aspectRatio = 'auto',
  objectFit = 'cover',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  blur = false,
  className = '',
  ...props
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  
  // Check connection speed on mount
  useEffect(() => {
    setIsLowBandwidth(isSlowConnection());
  }, []);
  
  // Generate responsive image properties
  const imageProps = getOptimizedImageProps(
    error ? fallbackSrc : src,
    width || 0,
    height || 0,
    priority
  );
  
  // Generate srcset for responsive images
  const srcSet = !isLowBandwidth && !error ? generateSrcSet(src) : undefined;
  
  // Handle image load success
  const handleLoad = () => {
    setLoaded(true);
  };
  
  // Handle image load error
  const handleError = () => {
    setError(true);
    console.warn(`Failed to load image: ${src}`);
  };
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio, width: width ? `${width}px` : 'auto' }}
    >
      {/* Low quality placeholder for blur-up effect */}
      {blur && !loaded && !error && (
        <div 
                      className="absolute inset-0 bg-gray-800 animate-pulse"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      <img
        {...props}
        src={imageProps.src}
        alt={alt}
        width={width}
        height={height}
        loading={imageProps.loading}
        decoding={imageProps.decoding}
        fetchPriority={imageProps.fetchPriority}
        srcSet={srcSet}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          objectFit,
          ...(!loaded && { filter: 'blur(10px)' })
        }}
      />
      
      {/* Fallback for errors */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <span className="text-gray-500 text-sm">Image not available</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 