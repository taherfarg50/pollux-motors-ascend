import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useReducedMotion } from '@/lib/animation';
import { Car, useFeaturedCars } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DataRefreshIndicator } from '@/components/ui/DataRefreshIndicator';
import OptimizedCarImage from '@/components/OptimizedCarImage';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FeaturedCars = () => {
  const [currentCar, setCurrentCar] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [dragDirection, setDragDirection] = useState<null | 'left' | 'right'>(null);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carsTitleRef = useRef<HTMLDivElement>(null);
  const carImageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();
  const location = useLocation();
  
  // Motion values for car image hover effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform mouse position for parallax effect
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);
  
  // Optimize data fetching with better performance settings
  // Reduce limit to 6 for faster loading, increase to 8 only if needed
  const { data: cars = [], isLoading, isRefetching, refetch } = useFeaturedCars(6);
  
  // Clean up all GSAP animations and ScrollTrigger instances when unmounting or route changes
  useEffect(() => {
    return () => {
      if (ScrollTrigger) {
        // Kill all ScrollTrigger instances to prevent memory leaks
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        ScrollTrigger.refresh();
      }
    };
  }, [location.pathname]);
  
  // Initialize carousel and section animations with better error handling
  useEffect(() => {
    if (!sectionRef.current || !carsTitleRef.current || prefersReducedMotion) return;
    
    const carsTitleNode = carsTitleRef.current; // Fix: stable reference
    try {
      // Title reveal animation with explicit scope to prevent leaks
      const titleElements = carsTitleNode.children;
      const animation = gsap.fromTo(
        titleElements,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: carsTitleNode,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
      
      return () => {
        // Clean up the specific animation
        animation.kill();
        
        // Also clean up any ScrollTrigger instances related to this component
        if (ScrollTrigger) {
          ScrollTrigger.getAll().forEach(st => {
            if (st.vars.trigger === carsTitleNode) {
              st.kill();
            }
          });
        }
      };
    } catch (error) {
      console.error("Error setting up animations:", error);
    }
  }, [prefersReducedMotion]);
  
  const nextCar = () => {
    if (cars.length === 0) return;
    setCurrentCar((prev) => (prev + 1) % cars.length);
  };

  const prevCar = () => {
    if (cars.length === 0) return;
    setCurrentCar((prev) => (prev - 1 + cars.length) % cars.length);
  };
  
  // Handle mouse move for 3D hover effect - optimized to prevent rerenders
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (index !== currentCar || prefersReducedMotion) return;
    
    const { currentTarget, clientX, clientY } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    mouseX.set(clientX - left - width / 2);
    mouseY.set(clientY - top - height / 2);
  };
  
  // Reset mouse position on mouse leave
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Animation variants
  const carInfoVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }),
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } }
  };
  
  const carImageVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: -30,
      transition: { duration: 0.3 } 
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.3 }
    }
  };
  
  const navigationButtonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  // Grid item animation variants
  const gridItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }),
    hover: {
      y: -10,
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  // Handle drag gesture for mobile swipe
  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { offset, velocity } = info;
    const swipeThreshold = 50; // Minimum swipe distance
    
    if (offset.x < -swipeThreshold || velocity.x < -0.5) {
      setDragDirection('left');
      nextCar();
    } else if (offset.x > swipeThreshold || velocity.x > 0.5) {
      setDragDirection('right');
      prevCar();
    }
    
    // Reset direction after animation completes
    setTimeout(() => setDragDirection(null), 300);
  };

  // If we're in a loading state, show a simpler skeleton without animations
  if (isLoading) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <Skeleton className="h-4 w-32 mx-auto mb-4" />
            <Skeleton className="h-8 w-64 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div className="max-w-lg mx-auto lg:mx-0">
                <Skeleton className="h-12 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2 mb-8" />
                
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-l-2 pl-4 border-gray-600">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 flex items-center">
                  <Skeleton className="h-8 w-24 mr-6" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 mb-8 lg:mb-0">
              <div className="aspect-[16/9] overflow-hidden rounded-lg">
                <Skeleton className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Function to render the grid view of featured cars
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cars.map((car, index) => (
          <motion.div
            key={car.id}
            custom={index}
            variants={gridItemVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, margin: "-50px" }}
            className="group relative overflow-hidden rounded-lg modern-glass border border-white/5 shadow-lg transform-gpu will-change-transform"
          >
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="secondary" className="bg-pollux-blue/20 text-pollux-blue border border-pollux-blue/10 backdrop-blur-sm">
                <Star className="w-3 h-3 mr-1 fill-current" /> Featured
              </Badge>
            </div>
            
            <div className="aspect-[3/2] overflow-hidden">
              <motion.div
                className="w-full h-full"
                initial={{ scale: 1.1 }}
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.6 }}
              >
                <OptimizedCarImage
                  src={car.image}
                  alt={`${car.name} ${car.model || ''}`}
                  className="w-full h-full object-cover transition-transform"
                />
              </motion.div>
              
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"
                initial={{ opacity: 0.5 }}
                whileHover={{ opacity: 0.7 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="text-lg font-bold text-white">
                {car.name} {car.model || ''}
              </h3>
              
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-white/80">
                  {car.year} • {car.category}
                </p>
                
                <p className="text-pollux-blue font-bold">
                  {car.price || 'Contact for price'}
                </p>
              </div>
              
              <Link 
                to={`/cars/${car.id}`}
                className="mt-3 w-full py-2 px-4 bg-pollux-blue/10 hover:bg-pollux-blue/20 border border-pollux-blue/20 text-pollux-blue rounded-md flex items-center justify-center transition-all group-hover:bg-pollux-blue group-hover:text-white"
              >
                <span>View Details</span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Function to render the carousel view of featured cars
  const renderCarouselView = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="order-2 lg:order-1">
          <AnimatePresence mode="wait">
            {cars.length > 0 && (
              <motion.div
                key={`car-info-${currentCar}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="max-w-lg mx-auto lg:mx-0"
              >
                <motion.div custom={0} variants={carInfoVariants} className="space-y-2">
                  <Badge className="bg-pollux-blue/20 text-pollux-blue border border-pollux-blue/10 backdrop-blur-sm">
                    Featured Vehicle
                  </Badge>
                  <h3 className="text-3xl md:text-4xl font-bold text-white">
                    {cars[currentCar].name} {cars[currentCar].model || ''}
                  </h3>
                </motion.div>
                
                <motion.p 
                  custom={1} 
                  variants={carInfoVariants} 
                  className="mt-4 text-gray-300"
                >
                  {cars[currentCar].description || 'Experience unparalleled luxury and performance in this exceptional vehicle.'}
                </motion.p>
                
                <motion.div 
                  custom={2} 
                  variants={carInfoVariants}
                  className="mt-8 grid grid-cols-3 gap-4"
                >
                  <div className="border-l-2 pl-4 border-pollux-blue/50">
                    <p className="text-sm text-gray-400">Power</p>
                    <p className="text-white font-medium">{cars[currentCar].specs?.power || "500 HP"}</p>
                  </div>
                  <div className="border-l-2 pl-4 border-pollux-blue/50">
                    <p className="text-sm text-gray-400">Year</p>
                    <p className="text-white font-medium">{cars[currentCar].year || "2023"}</p>
                  </div>
                  <div className="border-l-2 pl-4 border-pollux-blue/50">
                    <p className="text-sm text-gray-400">Color</p>
                    <p className="text-white font-medium">{cars[currentCar].color || "Pearl White"}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  custom={3} 
                  variants={carInfoVariants}
                  className="mt-12 flex flex-col sm:flex-row gap-4 items-center"
                >
                  <p className="text-xl font-bold text-gray-200 flex items-baseline">
                    <span className="text-sm text-gray-400 mr-1">From</span>
                    <span className="text-gradient-subtle">{cars[currentCar].price || 'Contact for price'}</span>
                  </p>
                  
                  <Link to={`/cars/${cars[currentCar].id}`}>
                    <Button 
                      variant="default" 
                      className="bg-gradient-to-r from-pollux-blue to-pollux-blue-light hover:shadow-lg hover:shadow-pollux-blue/20 text-white group"
                    >
                      <span>Explore Now</span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-12 flex items-center gap-4">
            <motion.button
              onClick={prevCar}
              variants={navigationButtonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-pollux-blue/20 hover:border-pollux-blue/40 transition-all"
              aria-label="Previous car"
            >
              <ChevronLeft size={20} />
            </motion.button>
            
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-pollux-blue to-pollux-blue-light"
                initial={{ width: `${(currentCar / (cars.length - 1)) * 100}%` }}
                animate={{ width: `${(currentCar / (cars.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <motion.button
              onClick={nextCar}
              variants={navigationButtonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-pollux-blue/20 hover:border-pollux-blue/40 transition-all"
              aria-label="Next car"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
        
        <div className="order-1 lg:order-2 mb-8 lg:mb-0">
          <div className="relative">
            {/* Background circle decoration */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-pollux-blue/20 to-transparent blur-2xl opacity-30" />
            
            <AnimatePresence mode="wait">
              {cars.length > 0 && (
                <motion.div
                  key={`car-image-${currentCar}`}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={carImageVariants}
                  className="relative aspect-square md:aspect-[16/9] w-full"
                  style={{ 
                    perspective: 1000,
                    transformStyle: 'preserve-3d'
                  }}
                  onMouseMove={(e) => handleMouseMove(e, currentCar)}
                  onMouseLeave={handleMouseLeave}
                  drag={isMobile ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
                  custom={dragDirection}
                >
                  <motion.div
                    className="w-full h-full rounded-2xl overflow-hidden border border-white/10"
                    style={{
                      rotateX: rotateX,
                      rotateY: rotateY,
                      transformStyle: 'preserve-3d'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <OptimizedCarImage
                      src={cars[currentCar].image}
                      alt={`${cars[currentCar].name} ${cars[currentCar].model || ''}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70" />
                    
                    {/* Shine effect */}
                    <motion.div 
                      className="absolute inset-0 opacity-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                      animate={{ 
                        opacity: [0, 0.5, 0],
                        left: ["-100%", "100%", "100%"]
                      }}
                      transition={{ 
                        duration: 2.5, 
                        repeat: Infinity, 
                        repeatDelay: 5
                      }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Car thumbnails navigation */}
            <div className="mt-8 flex justify-center gap-3">
              {cars.map((car, index) => (
                <motion.button
                  key={car.id}
                  onClick={() => setCurrentCar(index)}
                  className={cn(
                    "relative flex items-center justify-center transition-all",
                    "h-12 touch-manipulation"
                  )}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`View ${car.name} ${car.model || ''}`}
                >
                  <span 
                    className={cn(
                      "block h-3 rounded-full transition-all duration-300 ease-out",
                      currentCar === index 
                        ? "w-12 bg-gradient-to-r from-pollux-blue to-pollux-blue-light shadow-md shadow-pollux-blue/30" 
                        : "w-3 bg-white/30 hover:bg-white/50"
                    )}
                  />
                  {currentCar === index && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-pollux-blue/20 opacity-70"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 1] }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden" id="featured-cars">
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={carsTitleRef} className="text-center mb-16">
          <motion.span 
            className="inline-block py-1 px-3 rounded-full bg-pollux-blue/20 text-pollux-blue backdrop-blur-sm border border-pollux-blue/10 text-sm font-medium mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Exceptional Collection
          </motion.span>
          
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Featured Vehicles
          </motion.h2>
          
          <motion.p 
            className="mt-4 text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover our handpicked selection of premium vehicles that represent the pinnacle of automotive excellence.
          </motion.p>
          
          {/* Data refresh indicator */}
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <DataRefreshIndicator 
              isRefetching={isRefetching} 
              refetch={refetch}
              label="Featured vehicles" 
            />
          </motion.div>
        </div>

        <Tabs defaultValue="carousel" className="mb-10" onValueChange={(value) => setViewMode(value as 'carousel' | 'grid')}>
          <div className="flex justify-center">
            <TabsList className="bg-pollux-dark-gray/50 backdrop-blur-md border border-white/5 p-1">
              <TabsTrigger value="carousel" className="data-[state=active]:bg-pollux-blue/20 data-[state=active]:text-pollux-blue rounded-md">
                Showcase View
              </TabsTrigger>
              <TabsTrigger value="grid" className="data-[state=active]:bg-pollux-blue/20 data-[state=active]:text-pollux-blue rounded-md">
                Grid View
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="carousel" className="mt-8">
            {renderCarouselView()}
          </TabsContent>
          
          <TabsContent value="grid" className="mt-8">
            {renderGridView()}
          </TabsContent>
        </Tabs>
        
        <div className="mt-16 text-center">
          <Link to="/cars">
            <Button 
              variant="outline"
              className="border-pollux-blue/30 text-pollux-blue hover:bg-pollux-blue/10 hover:border-pollux-blue"
            >
              View All Vehicles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
