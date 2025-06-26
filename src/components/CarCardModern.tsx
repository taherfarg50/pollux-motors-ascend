import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  Heart, 
  Eye, 
  ArrowRight, 
  Fuel, 
  Users, 
  Calendar,
  Star,
  Badge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import FavoriteButton from '@/components/FavoriteButton';

interface CarCardProps {
  car: {
    id: string;
    name: string;
    brand: string;
    price: number;
    year: number;
    fuel_type: string;
    transmission: string;
    seating_capacity: number;
    image_url: string;
    gallery?: string[];
    is_featured?: boolean;
    rating?: number;
    reviews_count?: number;
    availability_status?: string;
  };
  variant?: 'default' | 'featured' | 'compact';
  showQuickActions?: boolean;
}

const CarCardModern: React.FC<CarCardProps> = ({ 
  car, 
  variant = 'default',
  showQuickActions = true 
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const images = car.gallery && car.gallery.length > 0 ? car.gallery : [car.image_url];
  const isAvailable = car.availability_status === 'available';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite logic with backend
  };

  const handleImageError = () => {
    setIsImageLoaded(false);
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'featured':
        return "md:col-span-2 lg:col-span-2";
      case 'compact':
        return "max-w-sm";
      default:
        return "";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(
        "group relative overflow-hidden",
        getVariantClasses()
      )}
    >
      <Link to={`/cars/${car.id}`} className="block">
        <div className="card h-full transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-gray-900">
            {/* Image */}
            <img
              src={images[currentImageIndex]}
              alt={`${car.brand} ${car.name}`}
              className={cn(
                "w-full h-full object-cover transition-all duration-700",
                isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
              )}
              onLoad={() => setIsImageLoaded(true)}
              onError={handleImageError}
              loading="eager"
            />

            {/* Loading Skeleton */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {car.is_featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-medium">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </span>
              )}
              
              {!isAvailable && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-600 text-white text-xs font-medium">
                  Sold
                </span>
              )}
              
              {car.year >= 2024 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white text-xs font-medium">
                  New
                </span>
              )}
            </div>

            {/* Quick Actions */}
            {showQuickActions && (
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <button
                  onClick={handleFavoriteToggle}
                  className={cn(
                    "p-2 rounded-full backdrop-blur-md border border-white/20 transition-colors",
                    isFavorite 
                      ? "bg-red-500 text-white" 
                      : "bg-white/10 text-white hover:bg-white/20"
                  )}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                </button>
                
                <button
                  className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
                  aria-label="Quick view"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Image Navigation Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex(index);
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      index === currentImageIndex 
                        ? "bg-white w-4" 
                        : "bg-white/50 hover:bg-white/80"
                    )}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Favorite button */}
            <FavoriteButton 
              carId={car.id} 
              className="absolute top-2 right-2 z-10" 
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="heading-5 text-lg group-hover:text-blue-400 transition-colors">
                    {car.brand} {car.name}
                  </h3>
                  <p className="text-caption text-gray-400">
                    {car.year} • {car.fuel_type}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="heading-6 text-lg text-gradient-primary">
                    {formatPrice(car.price)}
                  </div>
                  {car.rating && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{car.rating}</span>
                      {car.reviews_count && (
                        <span>({car.reviews_count})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Fuel className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xs text-gray-400">Fuel</div>
                <div className="text-sm font-medium text-white">{car.fuel_type}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-xs text-gray-400">Seats</div>
                <div className="text-sm font-medium text-white">{car.seating_capacity}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Calendar className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs text-gray-400">Year</div>
                <div className="text-sm font-medium text-white">{car.year}</div>
              </div>
            </div>

            {/* Action Button */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Button 
                className="w-full btn-primary group/btn"
                disabled={!isAvailable}
              >
                {isAvailable ? 'View Details' : 'Sold Out'}
                {isAvailable && (
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CarCardModern; 