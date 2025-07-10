import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    skip: priority // Skip intersection observer for priority images
  });

  // Generate responsive srcSet for WebP support
  const generateSrcSet = (baseSrc: string) => {
    const ext = baseSrc.split('.').pop()?.toLowerCase();
    const basePath = baseSrc.replace(/\.[^/.]+$/, '');
    
    // Generate WebP versions if supported
    const supportsWebP = typeof window !== 'undefined' && 
      document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    if (supportsWebP && ext !== 'webp') {
      return `${basePath}.webp 1x, ${basePath}@2x.webp 2x`;
    }
    
    return `${baseSrc} 1x, ${basePath}@2x.${ext} 2x`;
  };

  // Load image when in view or priority
  useEffect(() => {
    if (priority || inView) {
      setImageSrc(src);
    }
  }, [inView, priority, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Placeholder component
  const Placeholder = () => (
    <div 
              className={`bg-gray-800 animate-pulse ${className}`}
      style={{ width, height }}
    >
      {placeholder === 'blur' && blurDataURL && (
        <img
          src={blurDataURL}
          alt=""
          className="w-full h-full object-cover opacity-30 blur-sm"
        />
      )}
    </div>
  );

  // Error fallback
  const ErrorFallback = () => (
    <div 
              className={`bg-gray-900 flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <div className="text-gray-400 text-center">
        <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
        <span className="text-xs">Image unavailable</span>
      </div>
    </div>
  );

  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <div ref={ref} className="relative">
      {!isLoaded && <Placeholder />}
      
      {imageSrc && (
        <img
          ref={imgRef}
          src={imageSrc}
          srcSet={generateSrcSet(imageSrc)}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </div>
  );
};

export default OptimizedImage; 