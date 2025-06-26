import React, { useState, useEffect } from 'react';
import { Car, ImageOff, Loader2 } from 'lucide-react';
import { log } from '@/utils/logger';

interface OptimizedCarImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onError?: () => void;
  onLoad?: () => void;
  priority?: boolean; // For above-the-fold images
}

const OptimizedCarImage: React.FC<OptimizedCarImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  onError,
  onLoad,
  priority = false
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState<string>(src);

  // Fallback images in order of preference
  const fallbackImages = [
    '/media/images/hero.jpg', // Local fallback
    '/placeholder.svg', // SVG placeholder
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMUUxRTFFIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE2MCA5MEwyNDAgOTBMMjAwIDE1MFoiIGZpbGw9IiM0QTRBNEEiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDEwQzE0LjQ3NzIgMTAgMTAgMTQuNDc3MiAxMCAyMEMxMCAyNS41MjI4IDE0LjQ3NzIgMzAgMjAgMzBDMjUuNTIyOCAzMCAzMCAyNS41MjI4IDMwIDIwQzMwIDE0LjQ3NzIgMjUuNTIyOCAxMCAyMCAxMFpNMjAgMTJDMjQuNDE4MyAxMiAyOCAxNS41ODE3IDI4IDIwQzI4IDI0LjQxODMgMjQuNDE4MyAyOCAyMCAyOEMxNS41ODE3IDI4IDEyIDI0LjQxODMgMTIgMjBDMTIgMTUuNTgxNyAxNS41ODE3IDEyIDIwIDEyWiIgZmlsbD0iIzRBNEE0QSIvPgo8L3N2Zz4KPC9zdmc+' // Base64 encoded SVG
  ];

  const [fallbackIndex, setFallbackIndex] = useState(-1);

  // Determine loading behavior - prioritize important images
  const effectiveLoading = priority || loading === 'eager' ? 'eager' : 'lazy';

  useEffect(() => {
    setImageState('loading');
    setCurrentSrc(src);
    setFallbackIndex(-1);
  }, [src]);

  const handleImageError = () => {
    log.warn('Image failed to load', { src: currentSrc, alt }, 'OptimizedCarImage');
    
    const nextFallbackIndex = fallbackIndex + 1;
    
    if (nextFallbackIndex < fallbackImages.length) {
      setFallbackIndex(nextFallbackIndex);
      setCurrentSrc(fallbackImages[nextFallbackIndex]);
      log.debug('Trying fallback image', { fallback: fallbackImages[nextFallbackIndex] }, 'OptimizedCarImage');
    } else {
      setImageState('error');
      log.error('All fallback images failed', { originalSrc: src, alt }, 'OptimizedCarImage');
    }
    
    onError?.();
  };

  const handleImageLoad = () => {
    setImageState('loaded');
    log.debug('Image loaded successfully', { src: currentSrc, alt }, 'OptimizedCarImage');
    onLoad?.();
  };

  // Always render the image, but control visibility through opacity
  return (
    <div className={`${className} relative overflow-hidden`}>
      {/* Actual image - always present */}
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
        loading={effectiveLoading}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {/* Loading state overlay */}
      {imageState === 'loading' && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs">Loading...</span>
          </div>
        </div>
      )}

      {/* Error state overlay */}
      {imageState === 'error' && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3 text-gray-500">
            <div className="p-4 bg-gray-800 rounded-full">
              <Car className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-400">{alt}</p>
              <p className="text-xs text-gray-500 mt-1">Image not available</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedCarImage; 