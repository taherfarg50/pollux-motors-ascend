import React, { useState, useEffect } from 'react';
import { getCarHeroImage } from '@/utils/carImageUtils';

interface SmartCarImageProps {
  carName: string;
  supabaseImageUrl?: string; // Primary Supabase image URL
  supabaseGallery?: string[]; // Supabase gallery URLs
  context?: 'hero' | 'listing' | 'detail' | 'thumbnail';
  imageIndex?: number;
  className?: string;
  alt?: string;
  lazy?: boolean;
  onError?: () => void;
  onLoad?: () => void;
}

/**
 * SmartCarImage component that automatically finds the correct image
 * for a car by trying different local media URLs and extensions
 */
export const SmartCarImage: React.FC<SmartCarImageProps> = ({
  carName,
  supabaseImageUrl,
  supabaseGallery,
  context = 'listing',
  imageIndex = 0,
  className = '',
  alt = `${carName} image`,
  lazy = true,
  onError,
  onLoad
}) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fallbackAttempts, setFallbackAttempts] = useState(0);

  // Generate fallback URLs for local images
  const fallbackUrls = React.useMemo(() => {
    const localUrls = [];
    
    // Try to get local images as fallback
    const heroImage = getCarHeroImage(carName);
    if (heroImage) {
      localUrls.push(heroImage);
    }
    
    // Add placeholder as final fallback
    localUrls.push('/media/images/placeholder-car.jpg');
    localUrls.push('/media/images/placeholder-car.svg');
    
    return localUrls;
  }, [carName, context]);

  // Prioritize Supabase images
  const imageUrls = React.useMemo(() => {
    const urls: string[] = [];
    
    // 1. Primary: Use specific Supabase image URL if provided
    if (supabaseImageUrl) {
      urls.push(supabaseImageUrl);
    }
    
    // 2. Secondary: Use gallery images from Supabase
    if (supabaseGallery && supabaseGallery.length > 0) {
      // Add the requested index first, then others
      if (supabaseGallery[imageIndex]) {
        urls.push(supabaseGallery[imageIndex]);
      }
      
      // Add other gallery images as backup
      supabaseGallery.forEach((url, idx) => {
        if (idx !== imageIndex && !urls.includes(url)) {
          urls.push(url);
        }
      });
    }
    
    // 3. Fallback: Local images and placeholders
    urls.push(...fallbackUrls);
    
    return [...new Set(urls)]; // Remove duplicates
  }, [supabaseImageUrl, supabaseGallery, imageIndex, fallbackUrls]);

  // Reset state when props change
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setFallbackAttempts(0);
    
    if (imageUrls.length > 0) {
      setCurrentImageUrl(imageUrls[0]);
    }
  }, [carName, supabaseImageUrl, supabaseGallery, imageIndex]);

  const handleImageError = () => {
    const nextAttempt = fallbackAttempts + 1;
    
    if (nextAttempt < imageUrls.length) {
      setFallbackAttempts(nextAttempt);
      setCurrentImageUrl(imageUrls[nextAttempt]);
      console.log(`Image failed, trying fallback ${nextAttempt}:`, imageUrls[nextAttempt]);
    } else {
      setHasError(true);
      setIsLoading(false);
      console.warn(`All image sources failed for ${carName}`);
      onError?.();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const getImageSizeClasses = () => {
    switch (context) {
      case 'hero':
        return 'w-full h-96 md:h-[500px]';
      case 'detail':
        return 'w-full h-64 md:h-80';
      case 'thumbnail':
        return 'w-16 h-16';
      case 'listing':
      default:
        return 'w-full h-48 md:h-56';
    }
  };

  return (
    <div className={`relative overflow-hidden ${getImageSizeClasses()} ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">🚗</div>
            <div className="text-sm">{carName}</div>
          </div>
        </div>
      ) : (
        <img
          src={currentImageUrl}
          alt={alt}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isLoading ? 0 : 1 }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={lazy ? 'lazy' : 'eager'}
        />
      )}
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs p-1 rounded">
          {fallbackAttempts > 0 ? `Fallback ${fallbackAttempts}` : 'Primary'}
        </div>
      )}
    </div>
  );
}; 