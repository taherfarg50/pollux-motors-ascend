import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Car as CarIcon, Filter, SlidersHorizontal, Search, ArrowUpRight, Sparkles, Grid, List, ArrowUpDown } from 'lucide-react';
import CarCard from '@/components/CarCard';
import FavoriteButton from '@/components/FavoriteButton';
import CarFilter from '@/components/CarFilter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Car, useCars } from '@/lib/supabase';
import gsap from 'gsap';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { DataRefreshIndicator } from '@/components/ui/DataRefreshIndicator';
import ImageTester from '@/components/ImageTester';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebounce } from '@/hooks/useDebounce';
import { log } from '@/utils/logger';
import { perf } from '@/utils/performance';

// Card component with intersection observer for lazy loading
const LazyCarCard = ({ car, index, compareList, handleToggleCompare, viewMode }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.2 });
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };
  
  return (
    <motion.div 
      ref={cardRef}
      className={`relative group luxury-card rounded-xl overflow-hidden transform-gpu ${viewMode === 'list' ? 'w-full' : ''}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover="hover"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-pollux-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
      
      <CarCard
        id={car.id}
        name={car.name}
        category={car.category}
        year={car.year}
        price={car.price}
        image={car.image}
        specs={car.specs}
        index={index}
        hideNameAndPrice={compareList.includes(car.id)}
        viewMode={viewMode}
      />
      
      <motion.div 
        className="absolute top-4 left-4 z-10 car-action-buttons"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -10 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Button
          variant="outline"
          size="sm"
          className={`glass-card border-pollux-glass-border backdrop-blur-md hover:bg-pollux-blue/10 hover:border-pollux-blue/30 transition-all ${compareList.includes(car.id) ? 'border-pollux-blue bg-pollux-blue/10 text-white' : 'text-white'}`}
          onClick={() => handleToggleCompare(car.id)}
        >
          {compareList.includes(car.id) ? (
            <>
              <span className="relative">Remove</span>
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-pollux-blue animate-ping"></span>
            </>
          ) : 'Compare'}
        </Button>
      </motion.div>
      
      <motion.div 
        className="absolute top-4 right-4 z-10 car-action-buttons"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <FavoriteButton carId={car.id} />
      </motion.div>
      
      {car.specs && 'featured' in car.specs && car.specs.featured && (
        <motion.div 
          className="absolute bottom-4 right-4 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Badge className="bg-gradient-to-r from-pollux-gold to-pollux-gold-light text-black font-medium">
            <Sparkles className="h-3 w-3 mr-1" /> Featured
          </Badge>
        </motion.div>
      )}
    </motion.div>
  );
};

const Cars = () => {
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<string>('default');
  const [currentPage, setCurrentPage] = useState(0);
  const carsPerPage = 12;
  
  // Use optimized hook with pagination for better performance
  const { data: carsData, isLoading, isRefetching, refetch } = useCars({
    limit: carsPerPage,
    offset: currentPage * carsPerPage
  });
  
  const allCars = carsData?.cars || [];
  const totalCars = carsData?.total || 0;
  
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (allCars.length > 0) {
      setFilteredCars(allCars);
    }
  }, [allCars]);
  
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * custom,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }),
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  // Title animation
  useEffect(() => {
    if (!titleRef.current) return;
    
    // Check if ScrollTrigger is available and if the DOM element exists and has children
    if (titleRef.current && titleRef.current.children && titleRef.current.children.length > 0) {
      try {
        gsap.fromTo(
          titleRef.current.children,
          { y: 30, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.2,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top bottom-=100",
              toggleActions: "play none none none"
            }
          }
        );
        
        return () => {
          // Check if titleRef is still valid before cleanup
          if (titleRef.current) {
            gsap.killTweensOf(titleRef.current.children);
          }
        };
      } catch (error) {
        console.error("GSAP animation error:", error);
      }
    }
  }, []);

  // Add pagination controls
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const totalPages = Math.ceil(totalCars / carsPerPage);

  // Update filter function to work with current page data
  const handleFilterChange = (filtered: Car[]) => {
    setFilteredCars(filtered);
  };
  
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
      default:
        // Keep original order
        break;
    }
    
    setFilteredCars(sorted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pollux-dark-gray to-black text-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-pollux-blue/5 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-pollux-gold/5 blur-3xl"></div>
      <div className="absolute top-1/3 right-20 w-60 h-60 rounded-full bg-pollux-blue-dark/5 blur-3xl"></div>
      
      <main className="pt-28 pb-20 relative z-10 main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={titleRef} className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-10 md:py-16">
            <span className="block text-pollux-blue text-sm font-medium mb-4 px-3 py-1.5 bg-pollux-blue/10 rounded-full inline-block">Extensive Selection</span>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Our Vehicles Collection
              </h1>
              <DataRefreshIndicator
                isRefetching={isRefetching}
                refetch={refetch}
                label="Vehicle collection"
              />
            </div>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              Explore our handpicked selection of luxury vehicles. Each car represents the pinnacle of performance, innovation, and prestige.
            </p>
          </div>

          <motion.div 
            className="glass-card rounded-xl p-6 border border-pollux-glass-border mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="w-full md:w-auto flex items-center gap-3">
                <div className="p-2 rounded-full bg-pollux-blue/10 text-gradient-subtle">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-medium text-white">Find Your Perfect Match</h3>
              </div>
              
              <div className="w-full md:flex-1">
                <CarFilter onFilterChange={handleFilterChange} cars={allCars} />
              </div>
              
              <AnimatePresence>
                {compareList.length > 0 && (
                  <motion.div 
                    className="w-full md:w-auto flex items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="flex items-center gap-2 bg-pollux-blue/10 px-3 py-1.5 rounded-full">
                      <Sparkles className="h-4 w-4 text-pollux-blue" />
                      <span className="text-sm font-medium text-white">{compareList.length} selected</span>
                    </div>
                    <Button
                      asChild
                      className="btn-luxury relative overflow-hidden group"
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
                        <motion.span 
                          className="absolute inset-0 bg-gradient-to-r from-pollux-blue-dark to-pollux-blue-light z-0"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        />
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* View controls and sorting */}
          <motion.div 
            className="flex flex-wrap justify-between items-center mb-8 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-400">View:</span>
              <div className="glass-card border border-pollux-glass-border rounded-lg p-1 flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-md ${viewMode === 'grid' ? 'bg-pollux-blue text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-md ${viewMode === 'list' ? 'bg-pollux-blue text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400">Sort by:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="gap-2 glass-card border-pollux-glass-border hover:bg-pollux-blue/10 hover:border-pollux-blue/30 transition-all"
                  >
                    {sortOrder === 'default' && 'Default'}
                    {sortOrder === 'price-low-high' && 'Price: Low to High'}
                    {sortOrder === 'price-high-low' && 'Price: High to Low'}
                    {sortOrder === 'year-new-old' && 'Year: Newest First'}
                    {sortOrder === 'year-old-new' && 'Year: Oldest First'}
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-card border-pollux-glass-border backdrop-blur-md">
                  <DropdownMenuItem onClick={() => handleSortChange('default')}>
                    Default
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>

          {isLoading ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {[1, 2, 3, 4, 5, 6].map((_, idx) => (
                <div key={idx} className="glass-card rounded-xl overflow-hidden h-[450px] relative border border-pollux-glass-border">
                  <Skeleton className="h-[250px] w-full bg-white/5" />
                  <div className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-3 bg-white/5" />
                    <Skeleton className="h-6 w-1/2 mb-4 bg-white/5" />
                    <Skeleton className="h-4 w-full mb-3 bg-white/5" />
                    <Skeleton className="h-4 w-5/6 bg-white/5" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : filteredCars.length > 0 ? (
            <motion.div 
              ref={gridRef}
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
                : "flex flex-col gap-6"
              }
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {filteredCars.map((car, index) => (
                <LazyCarCard
                  key={car.id}
                  car={car}
                  index={index}
                  compareList={compareList}
                  handleToggleCompare={handleToggleCompare}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="glass-card rounded-xl p-12 text-center border border-pollux-glass-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <CarIcon className="mx-auto h-20 w-20 text-pollux-blue/50 mb-6" />
              </motion.div>
              <motion.h2 
                className="text-2xl font-medium mb-3 text-gradient-subtle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                No vehicles match your criteria
              </motion.h2>
              <motion.p 
                className="text-gray-400 mb-8 max-w-md mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                We couldn't find any vehicles matching your current filters. Try adjusting your criteria for different results.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button
                  className="btn-luxury"
                  onClick={() => setFilteredCars(allCars)}
                >
                  Reset All Filters
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div 
            className="mt-12 flex justify-center items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
              className="glass-card border-pollux-glass-border hover:bg-pollux-blue/10 hover:border-pollux-blue/30"
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageIndex = currentPage <= 2 ? i : 
                                 currentPage >= totalPages - 3 ? totalPages - 5 + i :
                                 currentPage - 2 + i;
                
                return (
                  <Button
                    key={pageIndex}
                    variant={pageIndex === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageIndex)}
                    className={pageIndex === currentPage ? 
                      "bg-pollux-blue text-white" : 
                      "glass-card border-pollux-glass-border hover:bg-pollux-blue/10"
                    }
                  >
                    {pageIndex + 1}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              disabled={currentPage === totalPages - 1}
              onClick={() => handlePageChange(currentPage + 1)}
              className="glass-card border-pollux-glass-border hover:bg-pollux-blue/10 hover:border-pollux-blue/30"
            >
              Next
            </Button>
          </motion.div>
        )}

        {/* Loading indicator for pagination */}
        {isLoading && (
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-pollux-blue/10 text-pollux-blue">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-pollux-blue"></div>
              <span>Loading vehicles...</span>
            </div>
          </motion.div>
        )}

        {/* Development Tools (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-24 border-t border-gray-800/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 text-gradient-subtle">Development Tools</h2>
                <p className="text-gray-400 text-sm">Image diagnostics and data monitoring for vehicle images</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="glass-card p-6 border border-pollux-glass-border rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Vehicle Stats
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Vehicles:</span>
                      <span className="text-white font-medium">{totalCars}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Filtered Results:</span>
                      <span className="text-white font-medium">{filteredCars.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">View Mode:</span>
                      <span className="text-white font-medium capitalize">{viewMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sort Order:</span>
                      <span className="text-white font-medium">{sortOrder === 'default' ? 'Default' : sortOrder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Compare Selection:</span>
                      <span className="text-white font-medium">{compareList.length}/4</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <ImageTester />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cars; 