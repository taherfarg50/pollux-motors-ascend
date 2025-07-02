import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Fuel, Star, Zap, Gauge } from 'lucide-react';
import type { Car } from '@/lib/supabase';
import { SmartCarImage } from '@/components/SmartCarImage';

interface OptimizedCarCardProps {
  car: Car;
  onViewDetails: (car: Car) => void;
  className?: string;
  showFeaturedBadge?: boolean;
}

export const OptimizedCarCard: React.FC<OptimizedCarCardProps> = ({
  car,
  onViewDetails,
  className = '',
  showFeaturedBadge = true
}) => {
  return (
    <Card className={`group hover:shadow-2xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 ${className}`}>
      <CardHeader className="p-0 relative">
        {/* Car Image using SmartCarImage with Supabase URLs */}
        <SmartCarImage
          carName={car.name}
          supabaseImageUrl={car.image}
          supabaseGallery={car.gallery}
          context="listing"
          className="rounded-t-lg h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={`${car.name} - ${car.year}`}
        />
        
        {/* Featured Badge */}
        {showFeaturedBadge && car.featured && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-medium shadow-lg">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        
        {/* Price Badge */}
        <Badge className="absolute bottom-3 left-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-sm shadow-lg backdrop-blur-sm">
          {car.price}
        </Badge>
        
        {/* Year Badge */}
        <Badge className="absolute top-3 left-3 bg-black/70 text-white font-medium text-xs backdrop-blur-sm">
          {car.year}
        </Badge>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Car Title */}
        <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
          {car.name}
        </h3>
        
        {/* Car Model */}
        {car.model && (
          <p className="text-gray-400 text-sm font-medium line-clamp-1">
            Model: {car.model}
          </p>
        )}
        
        {/* Car Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="font-medium">{car.year}</span>
            </div>
            <Badge variant="outline" className="text-xs border-gray-600 text-gray-300 bg-gray-800/50">
              {car.category}
            </Badge>
          </div>
          
          {/* Enhanced Specs Display */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-300 bg-gray-800/30 rounded-lg p-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <div>
                <div className="text-xs text-gray-400">Power</div>
                <div className="font-medium">{car.specs?.power || 'N/A'}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300 bg-gray-800/30 rounded-lg p-2">
              <Gauge className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-xs text-gray-400">Speed</div>
                <div className="font-medium">{car.specs?.speed || 'N/A'}</div>
              </div>
            </div>
            
            {car.specs?.acceleration && car.specs.acceleration !== 'N/A' && (
              <div className="flex items-center gap-2 text-gray-300 bg-gray-800/30 rounded-lg p-2 col-span-2">
                <Fuel className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-xs text-gray-400">Acceleration</div>
                  <div className="font-medium">{car.specs.acceleration}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Description */}
        {car.description && (
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
            {car.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button 
          onClick={() => onViewDetails(car)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 font-medium py-2.5 shadow-lg hover:shadow-xl"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}; 