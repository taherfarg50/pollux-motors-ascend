import { AnimatePresence, motion, useTransform, MotionValue } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface ParallaxBackgroundProps {
  images: string[];
  mousePosition: { x: number; y: number };
  scrollProgress: {
    scale: MotionValue<number>;
  };
  parallaxX?: MotionValue<number>;
  parallaxY?: MotionValue<number>;
  glowX?: MotionValue<string>;
  glowY?: MotionValue<string>;
}

const ParallaxBackground = ({ 
  images, 
  mousePosition, 
  scrollProgress,
  parallaxX,
  parallaxY,
  glowX,
  glowY
}: ParallaxBackgroundProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [imageLoadError, setImageLoadError] = useState<boolean[]>([]);
  const scale = scrollProgress ? scrollProgress.scale : 1;
  
  // Initialize image error tracking
  useEffect(() => {
    setImageLoadError(Array(images.length).fill(false));
  }, [images.length]);
  
  // Handle image load error
  const handleImageError = (index: number) => {
    const newErrors = [...imageLoadError];
    newErrors[index] = true;
    setImageLoadError(newErrors);
    
    // If current image fails, move to next
    if (index === currentImage) {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }
  };
  
  // Get valid images (not errored)
  const validImages = images.filter((_, index) => !imageLoadError[index]);
  
  // If all images fail, provide a fallback
  const currentImageUrl = validImages.length > 0 
    ? images[currentImage] 
    : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwRDExMTciLz48L3N2Zz4=';
  
  // Change background image every 6 seconds with smoother transition
  useEffect(() => {
    if (validImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImage((prev) => {
        // Find next valid image index
        let nextIndex = (prev + 1) % images.length;
        let count = 0;
        
        // Loop until we find a valid image or tried all
        while (imageLoadError[nextIndex] && count < images.length) {
          nextIndex = (nextIndex + 1) % images.length;
          count++;
        }
        
        return nextIndex;
      });
    }, 6000);
    
    return () => clearInterval(interval);
  }, [validImages.length, imageLoadError, images.length]);
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Black background to prevent flashing */}
      <div className="absolute inset-0 bg-pollux-midnight" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          className="absolute inset-0 bg-cover bg-center transform-gpu"
          style={{ 
            backgroundImage: `url(${currentImageUrl})`,
            backgroundPosition: parallaxX && parallaxY ? 
            `calc(50% + ${parallaxX}px) calc(50% + ${parallaxY}px)` : 
            `${50 + mousePosition.x * 8}% ${50 + mousePosition.y * 8}%`,
            scale: scale * 1.05, // Slightly larger scale to prevent edge visibility
            transformOrigin: 'center',
          }}
          initial={{ opacity: 0, filter: "brightness(0.7) contrast(1.1) saturate(1.2)" }}
          animate={{ opacity: 0.9, filter: "brightness(0.85) contrast(1.15) saturate(1.25)" }}
          exit={{ opacity: 0, filter: "brightness(0.7) contrast(1) saturate(1)" }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          {/* Preload images to detect errors */}
          {images.map((src, index) => (
            <img 
              key={src}
              src={src}
              alt=""
              className="hidden"
              onError={() => handleImageError(index)}
              aria-hidden="true"
            />
          ))}
        </motion.div>
      </AnimatePresence>
      
      {/* Enhanced Base Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-pollux-midnight via-pollux-midnight/60 to-transparent z-10" 
        animate={{
          opacity: [0.85, 0.9, 0.85],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        aria-hidden="true" 
      />
      
      {/* Enhanced Dynamic Gradient Overlay that moves with mouse */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-pollux-blue/15 via-transparent to-pollux-gold/10 backdrop-blur-[2px] z-10" 
        style={{
          backgroundPosition: glowX && glowY ? 
            `${glowX} ${glowY}` : 
            `${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%`,
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        aria-hidden="true" 
      />
      
      {/* Luxury color tint overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-pollux-blue-dark/5 via-transparent to-pollux-gold/5 mix-blend-overlay z-10" 
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        aria-hidden="true" 
      />
      
      {/* Enhanced vignette effect */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-10" aria-hidden="true" />
      
      {/* Improved noise texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMjAwdjIwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-15 mix-blend-overlay z-10" aria-hidden="true" />
      
      {/* Luxury accent lines */}
      <div className="absolute bottom-[28%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pollux-gold/30 to-transparent z-10" aria-hidden="true" />
      <div className="absolute bottom-[28.5%] left-0 right-0 h-[0.5px] bg-gradient-to-r from-transparent via-pollux-blue/20 to-transparent z-10" aria-hidden="true" />
      
      {/* Floating light particles */}
      <div className="absolute inset-0 overflow-hidden z-10" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/80 shadow-[0_0_10px_2px_rgba(255,255,255,0.4)]"
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i * 10)}%`,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 10 + (i * 5),
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ParallaxBackground;