import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useCars, Car } from '@/lib/supabase';
import { OptimizedCarCard } from '@/components/OptimizedCarCard';
import FavoriteButton from '@/components/FavoriteButton';
import { DataRefreshIndicator } from '@/components/ui/DataRefreshIndicator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChevronRight, 
  Car as CarIcon, 
  Search, 
  ArrowUpRight, 
  Sparkles, 
  Grid, 
  List, 
  ArrowUpDown, 
  Database, 
  RefreshCw, 
  Upload, 
  AlertCircle,
  Filter,
  SlidersHorizontal,
  X,
  Calendar,
  Fuel,
  Zap,
  Eye,
  Heart,
  Share2,
  TrendingUp,
  Award,
  Clock,
  MapPin
} from 'lucide-react';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Enhanced filter interface
interface FilterState {
  search: string;
  category: string;
  yearRange: [number, number];
  priceRange: [number, number];
  featured: boolean;
  sortBy: string;
  viewMode: 'grid' | 'list';
}

// Advanced car card component with enhanced features
const EnhancedCarCard = ({ car, index, compareList, handleToggleCompare, viewMode, onViewDetails }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.2 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.1
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.div 
      ref={cardRef}
      className={`relative group luxury-card rounded-2xl overflow-hidden transform-gpu ${viewMode === 'list' ? 'w-full' : ''} bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/30`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Enhanced hover overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-purple-600/10 z-0"
        variants={overlayVariants}
        initial="hidden"
        animate={isHovered ? "visible" : "hidden"}
      />
      
      {/* Glow effect */}
      <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
      <div className="relative z-10">
        <OptimizedCarCard
          car={car}
          onViewDetails={onViewDetails}
          showFeaturedBadge={true}
          className="bg-transparent border-0 shadow-none"
        />
      </div>
      
      {/* Enhanced action buttons */}
      <motion.div 
        className="absolute top-4 left-4 z-20 flex flex-col gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Button
          variant="outline"
          size="sm"
          className={`glass-card border-white/20 backdrop-blur-md hover:bg-blue-500/20 hover:border-blue-400/50 transition-all text-white ${compareList.includes(car.id) ? 'border-blue-400 bg-blue-500/20' : ''}`}
          onClick={() => handleToggleCompare(car.id)}
        >
          {compareList.includes(car.id) ? (
            <>
              <X className="h-3 w-3 mr-1" />
              Remove
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Compare
            </>
          )}
        </Button>
        
        {car.featured && (
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-medium text-xs">
            <Award className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
      </motion.div>
      
      {/* Enhanced favorite button */}
      <motion.div 
        className="absolute top-4 right-4 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <FavoriteButton carId={car.id} />
      </motion.div>
      
      {/* Enhanced quick actions overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bottom-4 left-4 right-4 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-2 justify-between">
              <Button
                size="sm"
                onClick={() => onViewDetails(car)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Eye className="h-3 w-3 mr-1" />
                View Details
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="glass-card border-white/20 text-white hover:bg-white/10"
              >
                <Share2 className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced specs preview */}
      <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="glass-card p-3 rounded-lg border border-white/10">
          <div className="grid grid-cols-3 gap-2 text-xs text-white">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-yellow-400" />
              <span>{car.specs?.power || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span>{car.specs?.acceleration || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="h-3 w-3 text-blue-400" />
              <span>{car.specs?.range || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced filter component
const AdvancedFilter = ({ filters, onFilterChange, cars }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const categories = useMemo(() => {
    return Array.from(new Set(cars.map(car => car.category))).sort();
  }, [cars]);
  
  const years = useMemo(() => {
    const carYears = cars.map(car => parseInt(car.year)).filter(year => !isNaN(year));
    return {
      min: Math.min(...carYears),
      max: Math.max(...carYears)
    };
  }, [cars]);
  
  const prices = useMemo(() => {
    const carPrices = cars.map(car => {
      const price = parseInt(car.price.replace(/[^0-9]/g, ""));
      return isNaN(price) ? 0 : price;
    });
    return {
      min: Math.min(...carPrices),
      max: Math.max(...carPrices)
    };
  }, [cars]);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search vehicles by name, model, or category..."
          className="pl-10 glass-card border-gray-600/50 focus:border-blue-400/50 transition-colors bg-gray-900/30 text-white placeholder-gray-400"
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-3">
                 <Select
           value={filters.category || "all"}
           onValueChange={(value) => onFilterChange({ ...filters, category: value === "all" ? "" : value })}
         >
           <SelectTrigger className="w-48 glass-card border-gray-600/50 text-white">
             <SelectValue placeholder="All Categories" />
           </SelectTrigger>
           <SelectContent className="glass-card border-gray-600/50 bg-gray-900/95 backdrop-blur-md">
             <SelectItem value="all">All Categories</SelectItem>
             {categories.map((category: string) => (
               <SelectItem key={category} value={category}>
                 {category}
               </SelectItem>
             ))}
           </SelectContent>
         </Select>

                 <Select
           value={filters.sortBy || "default"}
           onValueChange={(value) => onFilterChange({ ...filters, sortBy: value })}
         >
           <SelectTrigger className="w-48 glass-card border-gray-600/50 text-white">
             <SelectValue placeholder="Sort By" />
           </SelectTrigger>
           <SelectContent className="glass-card border-gray-600/50 bg-gray-900/95 backdrop-blur-md">
             <SelectItem value="default">Default Order</SelectItem>
             <SelectItem value="price-low-high">Price: Low to High</SelectItem>
             <SelectItem value="price-high-low">Price: High to Low</SelectItem>
             <SelectItem value="year-new-old">Year: Newest First</SelectItem>
             <SelectItem value="year-old-new">Year: Oldest First</SelectItem>
             <SelectItem value="name-a-z">Name: A to Z</SelectItem>
             <SelectItem value="featured-first">Featured First</SelectItem>
           </SelectContent>
         </Select>

        <Button
          variant="outline"
          className={`glass-card border-gray-600/50 text-white hover:bg-blue-500/20 ${filters.featured ? 'bg-blue-500/20 border-blue-400/50' : ''}`}
          onClick={() => onFilterChange({ ...filters, featured: !filters.featured })}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          Featured Only
        </Button>
      </div>
    </div>
  );
};

const Cars = () => {
  const [compareList, setCompareList] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    yearRange: [2020, 2024],
    priceRange: [0, 1000000],
    featured: false,
    sortBy: 'default',
    viewMode: 'grid'
  });
  
  const carsPerPage = 12;
  
  // Enhanced data fetching with better error handling
  const { data: carsData, isLoading, isRefetching, refetch, error } = useCars({
    limit: carsPerPage,
    offset: currentPage * carsPerPage
  });
  
  const allCars = carsData?.cars || [];
  const totalCars = carsData?.total || 0;
  
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Enhanced filtering and sorting logic
  const filteredAndSortedCars = useMemo(() => {
    let filtered = [...allCars];
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(car => 
        car.name.toLowerCase().includes(searchTerm) ||
        car.category.toLowerCase().includes(searchTerm) ||
        (car.model && car.model.toLowerCase().includes(searchTerm)) ||
        (car.description && car.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(car => car.category === filters.category);
    }
    
    // Apply featured filter
    if (filters.featured) {
      filtered = filtered.filter(car => car.featured);
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, "")) || 0;
          const priceB = parseInt(b.price.replace(/[^0-9]/g, "")) || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high-low':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, "")) || 0;
          const priceB = parseInt(b.price.replace(/[^0-9]/g, "")) || 0;
          return priceB - priceA;
        });
        break;
      case 'year-new-old':
        filtered.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        break;
      case 'year-old-new':
        filtered.sort((a, b) => parseInt(a.year) - parseInt(b.year));
        break;
      case 'name-a-z':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured-first':
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
      default:
        // Keep original order
        break;
    }
    
    return filtered;
  }, [allCars, filters]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Enhanced title animation
  useEffect(() => {
    if (!titleRef.current) return;
    
    if (titleRef.current && titleRef.current.children && titleRef.current.children.length > 0) {
      try {
        gsap.fromTo(
          titleRef.current.children,
          { y: 50, opacity: 0, filter: "blur(10px)", scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            stagger: 0.15,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top bottom-=100",
              toggleActions: "play none none none"
            }
          }
        );
        
        return () => {
          if (titleRef.current) {
            gsap.killTweensOf(titleRef.current.children);
          }
        };
      } catch (error) {
        console.error("GSAP animation error:", error);
      }
    }
  }, []);

  // Enhanced pagination
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const totalPages = Math.ceil(totalCars / carsPerPage);
  
  const handleToggleCompare = useCallback((carId: number) => {
    setCompareList(prev => {
      if (prev.includes(carId)) {
        return prev.filter(id => id !== carId);
      } else {
        if (prev.length >= 4) {
          return prev;
        }
        return [...prev, carId];
      }
    });
  }, []);

  const handleViewDetails = useCallback((car: Car) => {
    window.location.href = `/cars/${car.id}`;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Enhanced decorative elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl animate-pulse" />
      <div className="absolute top-1/3 right-20 w-72 h-72 rounded-full bg-gradient-to-r from-cyan-500/5 to-blue-500/5 blur-3xl" />
      
      <main className="pt-28 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced hero section */}
          <div ref={titleRef} className="text-center py-12 md:py-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2 rounded-full border border-blue-500/20 mb-6">
              <CarIcon className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">Premium Collection</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-100">
                Our Vehicle
              </h1>
              <DataRefreshIndicator
                isRefetching={isRefetching}
                refetch={refetch}
                label="Vehicle collection"
              />
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
              Collection
            </h2>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover our handpicked selection of luxury vehicles. Each car represents the pinnacle of 
              performance, innovation, and prestige, carefully curated for discerning customers.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
              <div className="glass-card p-6 rounded-xl border border-gray-700/30">
                <div className="text-3xl font-bold text-blue-400 mb-2">{totalCars}+</div>
                <div className="text-gray-300">Vehicles Available</div>
              </div>
              <div className="glass-card p-6 rounded-xl border border-gray-700/30">
                <div className="text-3xl font-bold text-purple-400 mb-2">15+</div>
                <div className="text-gray-300">Premium Brands</div>
              </div>
              <div className="glass-card p-6 rounded-xl border border-gray-700/30">
                <div className="text-3xl font-bold text-pink-400 mb-2">24/7</div>
                <div className="text-gray-300">Customer Support</div>
              </div>
            </div>
          </div>

          {/* Enhanced compare section */}
          <AnimatePresence>
            {compareList.length > 0 && (
              <motion.div 
                className="glass-card rounded-2xl p-6 border border-blue-500/30 mb-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full">
                      <Eye className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">
                        {compareList.length} vehicle{compareList.length > 1 ? 's' : ''} selected for comparison
                      </span>
                    </div>
                    <Badge variant="outline" className="border-gray-500/50 text-gray-300">
                      Max 4 vehicles
                    </Badge>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setCompareList([])}
                      className="border-gray-500/50 text-gray-300 hover:bg-red-500/10 hover:border-red-400/50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white relative overflow-hidden group"
                    >
                      <Link to={`/compare?cars=${compareList.join(',')}`}>
                        <span className="relative z-10">Compare Vehicles</span>
                        <motion.div
                          className="absolute right-3 inline-flex z-10"
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </motion.div>
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced filter section */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <AdvancedFilter
              filters={filters}
              onFilterChange={setFilters}
              cars={allCars}
            />
          </motion.div>

          {/* Enhanced view controls */}
          <motion.div 
            className="flex flex-wrap justify-between items-center mb-8 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <span className="text-gray-400">
                Showing {filteredAndSortedCars.length} of {totalCars} vehicles
              </span>
              
              {filters.search && (
                <Badge variant="outline" className="border-blue-500/50 text-blue-300">
                  Search: "{filters.search}"
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer hover:text-white"
                    onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  />
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-400">View:</span>
              <div className="glass-card border border-gray-600/50 rounded-lg p-1 flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-md transition-all ${filters.viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                  onClick={() => setFilters(prev => ({ ...prev, viewMode: 'grid' }))}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-md transition-all ${filters.viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                  onClick={() => setFilters(prev => ({ ...prev, viewMode: 'list' }))}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Enhanced content section */}
          {isLoading ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {Array.from({ length: 6 }, (_, idx) => (
                <div key={idx} className="glass-card rounded-2xl overflow-hidden h-[500px] relative border border-gray-700/30">
                  <Skeleton className="h-[250px] w-full bg-gray-700/30" />
                  <div className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-3 bg-gray-700/30" />
                    <Skeleton className="h-6 w-1/2 mb-4 bg-gray-700/30" />
                    <Skeleton className="h-4 w-full mb-3 bg-gray-700/30" />
                    <Skeleton className="h-4 w-5/6 bg-gray-700/30" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : filteredAndSortedCars.length > 0 ? (
            <motion.div 
              ref={gridRef}
              className={filters.viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "flex flex-col gap-6"
              }
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {filteredAndSortedCars.map((car, index) => (
                <EnhancedCarCard
                  key={car.id}
                  car={car}
                  index={index}
                  compareList={compareList}
                  handleToggleCompare={handleToggleCompare}
                  viewMode={filters.viewMode}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="glass-card rounded-2xl p-16 text-center border border-gray-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <CarIcon className="mx-auto h-24 w-24 text-blue-400/50 mb-8" />
              </motion.div>
              
              <motion.h2 
                className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                No vehicles found
              </motion.h2>
              
              <motion.p 
                className="text-gray-400 mb-8 max-w-md mx-auto text-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                We couldn't find any vehicles matching your criteria. Try adjusting your filters or search terms.
              </motion.p>

              {error && (
                <motion.div
                  className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                    <h3 className="text-red-400 font-semibold text-lg">Connection Error</h3>
                  </div>
                  <p className="text-red-300 mb-6">
                    Unable to load vehicles. Please check your connection and try again.
                  </p>
                  <Button
                    onClick={() => refetch()}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </motion.div>
              )}
              
              {!error && (
                <motion.div
                  className="flex gap-3 justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Button
                    onClick={() => setFilters({
                      search: '',
                      category: '',
                      yearRange: [2020, 2024],
                      priceRange: [0, 1000000],
                      featured: false,
                      sortBy: 'default',
                      viewMode: 'grid'
                    })}
                    variant="outline"
                    className="border-gray-500/50 text-gray-300 hover:bg-gray-700/50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                  <Button
                    onClick={() => refetch()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        
          {/* Enhanced pagination */}
          {totalPages > 1 && (
            <motion.div 
              className="flex justify-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="border-gray-500/50 text-gray-300 hover:bg-gray-700/50 disabled:opacity-50"
                >
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = currentPage < 3 ? i : currentPage - 2 + i;
                  if (page >= totalPages) return null;
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      className={`w-12 h-12 ${currentPage === page 
                        ? 'bg-blue-600 text-white' 
                        : 'border-gray-500/50 text-gray-300 hover:bg-gray-700/50'
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page + 1}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="border-gray-500/50 text-gray-300 hover:bg-gray-700/50 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cars; 