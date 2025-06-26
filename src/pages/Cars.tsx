import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Car as CarIcon, 
  Filter, 
  SlidersHorizontal, 
  Search, 
  ArrowUpRight, 
  Sparkles, 
  Grid, 
  List, 
  ArrowUpDown,
  Eye,
  Heart,
  Share2,
  Clock,
  Zap,
  Users,
  Gauge,
  Settings,
  X,
  RefreshCw,
  TrendingUp,
  Star,
  Plus,
  Phone
} from 'lucide-react';
import FavoriteButton from '@/components/FavoriteButton';
import CarFilter from '@/components/CarFilter';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Car, useCars } from '@/lib/supabase';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { DataRefreshIndicator } from '@/components/ui/DataRefreshIndicator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import OptimizedCarImage from '@/components/OptimizedCarImage';

// Enhanced Car Card with Quick Actions
const EnhancedCarCard = ({ car, index, compareList, handleToggleCompare, viewMode, onQuickView }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.2 });
  const [isHovered, setIsHovered] = useState(false);
  
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
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <motion.div 
      ref={cardRef}
      className="group relative luxury-card rounded-2xl overflow-hidden transform-gpu"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Enhanced Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl"></div>
      
      {/* Animated Border Glow */}
      <motion.div 
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(25, 55, 227, 0.3) 50%, transparent 70%)',
          opacity: isHovered ? 1 : 0,
        }}
        animate={{
          background: isHovered 
            ? 'linear-gradient(45deg, transparent 30%, rgba(25, 55, 227, 0.6) 50%, transparent 70%)'
            : 'linear-gradient(45deg, transparent 30%, rgba(25, 55, 227, 0.1) 50%, transparent 70%)'
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Car Image with Enhanced Effects */}
      <div className="relative h-64 overflow-hidden rounded-t-2xl">
        <motion.div
          className="w-full h-full"
          animate={{
            scale: isHovered ? 1.1 : 1,
            filter: isHovered ? 'brightness(1.1) saturate(1.2)' : 'brightness(1) saturate(1)'
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <OptimizedCarImage 
            src={car.image} 
            alt={car.name} 
            className="w-full h-full object-cover"
            loading="eager"
            priority={index < 6}
          />
        </motion.div>

        {/* Quick Action Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="sm"
                variant="outline"
                className="glass-card border-white/30 hover:bg-white/20"
                onClick={() => onQuickView(car)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Quick View
              </Button>
              <Button
                size="sm"
                className="bg-pollux-blue hover:bg-pollux-blue-dark"
                asChild
              >
                <Link to={`/cars/${car.id}`}>
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Details
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {car.specs?.featured && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
          {car.isNew && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              New
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <FavoriteButton carId={car.id} />
          </motion.div>
          <Button
            size="sm"
            variant="outline"
            className={`glass-card border-white/30 ${compareList.includes(car.id) ? 'bg-pollux-blue text-white' : ''}`}
            onClick={() => handleToggleCompare(car.id)}
          >
            {compareList.includes(car.id) ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Enhanced Car Info */}
      <div className="relative p-6 z-10">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-pollux-blue transition-colors line-clamp-1">
              {car.name}
            </h3>
            <p className="text-gray-400 text-sm">{car.category} • {car.year}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gradient-blue">{car.price}</p>
            <p className="text-xs text-gray-500">Starting from</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="h-4 w-4 text-pollux-blue" />
            <span className="text-gray-300">{car.specs?.speed || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-pollux-blue" />
            <span className="text-gray-300">{car.specs?.power || 'N/A'}</span>
          </div>
        </div>

        {/* Rating and Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < 4 ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} 
              />
            ))}
            <span className="text-sm text-gray-400 ml-1">(4.8)</span>
          </div>
          <Button size="sm" variant="ghost" className="text-pollux-blue hover:bg-pollux-blue/10">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Quick View Modal Component
const QuickViewModal = ({ car, isOpen, onClose }) => {
  if (!car) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-pollux-glass-border">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-video rounded-xl overflow-hidden">
              <OptimizedCarImage 
                src={car.image} 
                alt={car.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3].map(i => (
                <div key={i} className="aspect-video rounded-lg bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">View {i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{car.name}</h2>
              <div className="flex items-center gap-4 text-gray-400">
                <span>{car.category}</span>
                <span>•</span>
                <span>{car.year}</span>
                <span>•</span>
                <Badge variant="outline" className="border-pollux-blue text-pollux-blue">
                  Available
                </Badge>
              </div>
            </div>

            <div className="text-3xl font-bold text-gradient-blue">{car.price}</div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Gauge className="h-5 w-5" />, label: 'Top Speed', value: car.specs?.speed },
                { icon: <Zap className="h-5 w-5" />, label: 'Power', value: car.specs?.power },
                { icon: <Clock className="h-5 w-5" />, label: '0-100 km/h', value: car.specs?.acceleration },
                { icon: <Users className="h-5 w-5" />, label: 'Seats', value: '5' }
              ].map((spec, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-pollux-blue mb-1">
                    {spec.icon}
                    <span className="text-sm text-gray-400">{spec.label}</span>
                  </div>
                  <p className="font-semibold text-white">{spec.value || 'N/A'}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-pollux-blue hover:bg-pollux-blue-dark" asChild>
                <Link to={`/cars/${car.id}`}>
                  View Full Details
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="icon" className="border-white/20">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-white/20">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-pollux-blue/10 to-pollux-blue-dark/10 rounded-lg p-4 border border-pollux-blue/20">
              <h3 className="font-semibold text-white mb-2">Interested in this vehicle?</h3>
              <p className="text-sm text-gray-300 mb-3">Contact our sales team for more information</p>
              <Button variant="outline" className="w-full border-pollux-blue text-pollux-blue hover:bg-pollux-blue hover:text-white">
                <Phone className="h-4 w-4 mr-2" />
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Statistics Section Component
const CarsStatistics = ({ cars, filteredCount }) => {
  const stats = useMemo(() => {
    if (!cars.length) return [];
    
    const categories = cars.reduce((acc, car) => {
      acc[car.category] = (acc[car.category] || 0) + 1;
      return acc;
    }, {});
    
    const avgPrice = cars.reduce((sum, car) => {
      const price = parseInt(car.price.replace(/[^0-9]/g, ''));
      return sum + (isNaN(price) ? 0 : price);
    }, 0) / cars.length;
    
    return [
      { label: 'Total Vehicles', value: cars.length, icon: <CarIcon className="h-5 w-5" /> },
      { label: 'Filtered Results', value: filteredCount, icon: <Filter className="h-5 w-5" /> },
      { label: 'Categories', value: Object.keys(categories).length, icon: <Settings className="h-5 w-5" /> },
      { label: 'Avg Price', value: `$${Math.round(avgPrice/1000)}K`, icon: <TrendingUp className="h-5 w-5" /> }
    ];
  }, [cars, filteredCount]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="glass-card border-pollux-glass-border rounded-xl p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-center mb-2 text-pollux-blue">
            {stat.icon}
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

const Cars = () => {
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<string>('default');
  const [currentPage, setCurrentPage] = useState(0);
  const [quickViewCar, setQuickViewCar] = useState<Car | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const carsPerPage = 12;
  
  const { data: carsData, isLoading, isRefetching, refetch } = useCars({
    limit: carsPerPage,
    offset: currentPage * carsPerPage
  });
  
  const allCars = carsData?.cars || [];
  const totalCars = carsData?.total || 0;
  
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (allCars.length > 0) {
      setFilteredCars(allCars);
    }
  }, [allCars]);

  const totalPages = Math.ceil(totalCars / carsPerPage);

  // Handle quick view
  const handleQuickView = (car: Car) => {
    setQuickViewCar(car);
    setShowQuickView(true);
  };

  // Handle compare toggle
  const handleToggleCompare = (carId: number) => {
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
  };

  // Handle filter changes
  const handleFilterChange = (filtered: Car[]) => {
    setFilteredCars(filtered);
    setCurrentPage(0); // Reset to first page when filtering
  };

  // Handle sorting
  const handleSortChange = (order: string) => {
    setSortOrder(order);
    const sorted = [...filteredCars];
    
    switch (order) {
      case 'price-low-high':
        sorted.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
          return priceA - priceB;
        });
        break;
      case 'price-high-low':
        sorted.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
          return priceB - priceA;
        });
        break;
      case 'year-new-old':
        sorted.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        break;
      case 'year-old-new':
        sorted.sort((a, b) => parseInt(a.year) - parseInt(b.year));
        break;
      case 'name-a-z':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredCars(sorted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-pollux-blue/10 to-pollux-blue-dark/5 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-pollux-gold/10 to-orange-500/5 blur-3xl"></div>
      <div className="absolute top-1/3 right-20 w-80 h-80 rounded-full bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-3xl"></div>
      
      <main className="pt-28 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <motion.div 
            ref={titleRef}
            className="text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge className="bg-gradient-to-r from-pollux-blue to-pollux-blue-dark text-white mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                Premium Collection
              </Badge>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-6">
              Discover Your
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-pollux-blue to-pollux-blue-light">
                Perfect Vehicle
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our carefully curated collection of luxury and performance vehicles. 
              Each car represents excellence in engineering, design, and innovation.
            </p>
            
            <div className="flex items-center justify-center gap-2 mt-6">
              <DataRefreshIndicator
                isRefetching={isRefetching}
                refetch={refetch}
                label="Vehicle collection"
              />
            </div>
          </motion.div>

          {/* Statistics Section */}
          <CarsStatistics cars={allCars} filteredCount={filteredCars.length} />

          {/* Enhanced Search and Filter Bar */}
          <motion.div 
            className="glass-card rounded-2xl p-6 border border-pollux-glass-border mb-8 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Section */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pollux-blue h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search by name, brand, model, or category..."
                    className="pl-12 pr-4 py-3 glass-card border-pollux-glass-border focus:border-pollux-blue/50 transition-all text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                className="glass-card border-pollux-glass-border hover:bg-pollux-blue/10 px-6"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
                {showFilters && <ChevronRight className="h-4 w-4 ml-2 rotate-90 transition-transform" />}
              </Button>
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 border-t border-white/10 mt-6">
                    <CarFilter onFilterChange={handleFilterChange} cars={allCars} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Compare Bar */}
          <AnimatePresence>
            {compareList.length > 0 && (
              <motion.div 
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="glass-card border-pollux-glass-border rounded-2xl p-4 backdrop-blur-xl flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-pollux-blue" />
                    <span className="font-medium text-white">{compareList.length} vehicle{compareList.length > 1 ? 's' : ''} selected</span>
                  </div>
                  <Button
                    className="bg-pollux-blue hover:bg-pollux-blue-dark text-white"
                    asChild
                  >
                    <Link to={`/compare?cars=${compareList.join(',')}`}>
                      Compare Now
                      <ArrowUpRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCompareList([])}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Controls and Sorting */}
          <motion.div 
            className="flex flex-wrap justify-between items-center mb-8 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <span className="text-gray-400">View:</span>
              <div className="glass-card border border-pollux-glass-border rounded-lg p-1 flex">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-md px-3 ${viewMode === 'grid' ? 'bg-pollux-blue text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4 mr-1" />
                  Grid
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-md px-3 ${viewMode === 'list' ? 'bg-pollux-blue text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-400">Sort by:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="gap-2 glass-card border-pollux-glass-border hover:bg-pollux-blue/10 hover:border-pollux-blue/30 transition-all"
                  >
                    {sortOrder === 'default' && 'Default Order'}
                    {sortOrder === 'price-low-high' && 'Price: Low to High'}
                    {sortOrder === 'price-high-low' && 'Price: High to Low'}
                    {sortOrder === 'year-new-old' && 'Year: Newest First'}
                    {sortOrder === 'year-old-new' && 'Year: Oldest First'}
                    {sortOrder === 'name-a-z' && 'Name: A to Z'}
                    {sortOrder === 'name-z-a' && 'Name: Z to A'}
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-card border-pollux-glass-border backdrop-blur-md">
                  <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSortChange('default')}>
                    Default Order
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('price-low-high')}>
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('price-high-low')}>
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('year-new-old')}>
                    Year: Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('year-old-new')}>
                    Year: Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('name-a-z')}>
                    Name: A to Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('name-z-a')}>
                    Name: Z to A
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>

          {/* Cars Grid/List */}
          {isLoading ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="glass-card rounded-2xl overflow-hidden h-[500px] relative border border-pollux-glass-border">
                  <Skeleton className="h-64 w-full bg-white/5" />
                  <div className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-3 bg-white/5" />
                    <Skeleton className="h-6 w-1/2 mb-4 bg-white/5" />
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <Skeleton className="h-6 w-full bg-white/5" />
                      <Skeleton className="h-6 w-full bg-white/5" />
                    </div>
                    <Skeleton className="h-6 w-full bg-white/5" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : filteredCars.length > 0 ? (
            <motion.div 
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                : "flex flex-col gap-6"
              }
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.1 }}
            >
              {filteredCars.map((car, index) => (
                <EnhancedCarCard
                  key={car.id}
                  car={car}
                  index={index}
                  compareList={compareList}
                  handleToggleCompare={handleToggleCompare}
                  viewMode={viewMode}
                  onQuickView={handleQuickView}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="glass-card rounded-2xl p-16 text-center border border-pollux-glass-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <CarIcon className="mx-auto h-24 w-24 text-pollux-blue/50 mb-6" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">No vehicles found</h2>
              <p className="text-gray-400 text-lg mb-6">
                Try adjusting your search criteria or filters to find the perfect vehicle.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setShowFilters(false);
                  // Reset filters logic would go here
                }}
                className="bg-pollux-blue hover:bg-pollux-blue-dark"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div 
              className="flex justify-center items-center gap-2 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button
                variant="outline"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                className="glass-card border-pollux-glass-border"
              >
                Previous
              </Button>
              
              <div className="flex gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = currentPage < 3 ? i : currentPage - 2 + i;
                  if (pageNum >= totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={pageNum === currentPage 
                        ? "bg-pollux-blue hover:bg-pollux-blue-dark" 
                        : "glass-card border-pollux-glass-border hover:bg-pollux-blue/10"
                      }
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                className="glass-card border-pollux-glass-border"
              >
                Next
              </Button>
            </motion.div>
          )}

          {/* Quick View Modal */}
          {quickViewCar && (
            <QuickViewModal
              car={quickViewCar}
              isOpen={showQuickView}
              onClose={() => setShowQuickView(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Cars; 