import { useState, useRef, useEffect, lazy, Suspense, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Car as CarIcon, Gauge, Clock3, Zap, Route, Menu, View, Box } from 'lucide-react';
import FavoriteButton from '@/components/FavoriteButton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCar, useSimilarCars } from '@/lib/supabase';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/animation';
import { ScrollIndicator } from '@/components/ui/scroll-indicator';
import { Skeleton } from '@/components/ui/skeleton';
import StatsCounter from '@/components/StatsCounter';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useScroll } from '@/context/ScrollContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OptimizedCarImage from '@/components/OptimizedCarImage';

// Lazy load the 3D viewer component for better performance
const CarViewer3D = lazy(() => import('@/components/CarViewer3D'));

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Sample car data to use when real data is loading
const fallbackCar = {
  id: 1,
  name: "Loading...",
  category: "...",
  year: "...",
  price: "...",
  image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d",
  specs: {
    speed: "...",
    acceleration: "...",
    power: "...",
    range: "..."
  },
  description: "Loading car details..."
};

// Helper function to get model path based on car make and model
const getModelPath = (car: any | null): string => {
  // Check if the car has 3D models from Supabase
  if (car?.models_3d && car.models_3d.length > 0) {
    // Find the default model or use the first one
    const defaultModel = car.models_3d.find((model: any) => model.is_default) || car.models_3d[0];
    return defaultModel.model_path;
  }
  
  // Fallback to local models
  const make = car?.name?.split(' ')[0]?.toLowerCase() || '';
  const model = car?.model?.toLowerCase() || '';
  
  // Map common car makes to 3D model paths
  const modelMap: Record<string, Record<string, string>> = {
    'mercedes': {
      'default': '/media/models/luxury_sedan.glb',
    },
    'bmw': {
      'default': '/media/models/luxury_sedan.glb',
    },
    'audi': {
      'default': '/media/models/luxury_sedan.glb',
    },
    'porsche': {
      'default': '/media/models/luxury_sedan.glb',
    },
    'lamborghini': {
      'default': '/media/models/luxury_sedan.glb',
    },
    'ferrari': {
      'default': '/media/models/luxury_sedan.glb',
    },
    'default': '/media/models/luxury_sedan.glb'
  };
  
  // Try to find a specific model
  if (modelMap[make] && modelMap[make][model]) {
    return modelMap[make][model];
  }
  
  // Fall back to make default
  if (modelMap[make] && modelMap[make]['default']) {
    return modelMap[make]['default'];
  }
  
  // Final fallback
  return modelMap['default'];
};

// Convert car color to hex code
const getCarColor = (car: Car | null): string => {
  const colorMap: Record<string, string> = {
    'black': '#1a1a1a',
    'white': '#f5f5f5',
    'silver': '#c0c0c0',
    'gray': '#808080',
    'red': '#D32F2F',
    'blue': '#1976D2',
    'green': '#388E3C',
    'yellow': '#FBC02D',
    'orange': '#F57C00',
    'purple': '#7B1FA2',
    'brown': '#795548',
  };
  
  const color = car?.color?.toLowerCase() || '';
  return colorMap[color] || '#1a1a1a'; // Default to black
};

// Quick scroll navigation bar
const QuickNav = ({ sections }: { sections: { id: string; label: string }[] }) => {
  const { scrollTo } = useScroll();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px 0px 0px',
      threshold: 0.3,
    };
    
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    
    return () => observer.disconnect();
  }, [sections]);
  
  const handleNavigate = (id: string) => {
    scrollTo(`#${id}`, { offset: -80 });
  };
  
  return (
    <motion.div 
      className="sticky top-0 z-40 backdrop-blur-md bg-black/50 border-b border-gray-800 py-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto hide-scrollbar">
        <div className="flex items-center space-x-4">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNavigate(id)}
              className={`px-3 py-1 whitespace-nowrap text-sm transition-all ${
                activeSection === id 
                ? "text-white font-medium" 
                : "text-gray-400 hover:text-white"
              }`}
            >
              {label}
              {activeSection === id && (
                <motion.div 
                  layoutId="activeSection"
                  className="h-0.5 bg-pollux-blue mt-1" 
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Component for the image gallery
const ImageGallery = ({ 
  carImages, 
  activeImageIndex, 
  setActiveImageIndex, 
  nextImage, 
  prevImage,
  imageRef 
}: { 
  carImages: string[],
  activeImageIndex: number,
  setActiveImageIndex: (index: number) => void,
  nextImage: () => void,
  prevImage: () => void,
  imageRef: React.RefObject<HTMLImageElement>
}) => {
  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            ref={imageRef}
            src={carImages[activeImageIndex]}
            alt="Car"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Gallery navigation */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 flex justify-between">
        <Button
          variant="secondary"
          size="icon"
          onClick={prevImage}
          className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50"
          disabled={carImages.length <= 1}
        >
          <ChevronLeft size={20} />
        </Button>
        <div className="flex space-x-2 bg-black/30 rounded-full backdrop-blur-md px-3 py-1">
          {carImages.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === activeImageIndex ? "bg-white" : "bg-white/30"
              }`}
              onClick={() => setActiveImageIndex(idx)}
            />
          ))}
        </div>
        <Button
          variant="secondary"
          size="icon"
          onClick={nextImage}
          className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50"
          disabled={carImages.length <= 1}
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};

// New component for detailed specifications
const DetailedSpecifications = ({ car }: { car: Car | null }) => {
  if (!car) return null;
  
  // Group specifications by category
  const specCategories = [
    {
      title: "Performance",
      icon: <Zap className="h-5 w-5 text-pollux-blue" />,
      specs: [
        { label: "Engine", value: car.specs?.engine || "N/A" },
        { label: "Power", value: car.specs?.power || "N/A" },
        { label: "Torque", value: car.specs?.torque || "N/A" },
        { label: "Top Speed", value: car.specs?.speed || "N/A" },
        { label: "Acceleration (0-60)", value: car.specs?.acceleration || "N/A" }
      ]
    },
    {
      title: "Drivetrain",
      icon: <Gauge className="h-5 w-5 text-pollux-blue" />,
      specs: [
        { label: "Transmission", value: car.specs?.transmission || "N/A" },
        { label: "Drive Type", value: car.specs?.driveType || "N/A" },
        { label: "Fuel Type", value: car.specs?.fuelType || "N/A" },
        { label: "Fuel Economy", value: car.specs?.fuelEconomy || "N/A" }
      ]
    },
    {
      title: "Dimensions",
      icon: <Box className="h-5 w-5 text-pollux-blue" />,
      specs: [
        { label: "Length", value: car.specs?.length || "N/A" },
        { label: "Width", value: car.specs?.width || "N/A" },
        { label: "Height", value: car.specs?.height || "N/A" },
        { label: "Wheelbase", value: car.specs?.wheelbase || "N/A" },
        { label: "Weight", value: car.specs?.weight || "N/A" },
        { label: "Cargo Space", value: car.specs?.cargoSpace || "N/A" }
      ]
    },
    {
      title: "Features",
      icon: <Menu className="h-5 w-5 text-pollux-blue" />,
      specs: [
        { label: "Infotainment", value: car.specs?.infotainment || "N/A" },
        { label: "Safety Features", value: car.specs?.safetyFeatures || "N/A" },
        { label: "Driver Assistance", value: car.specs?.driverAssistance || "N/A" },
        { label: "Interior", value: car.specs?.interior || "N/A" }
      ]
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {specCategories.map((category, index) => (
        <div 
          key={index} 
          className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            {category.icon}
            <h3 className="text-lg font-semibold">{category.title}</h3>
          </div>
          
          <div className="space-y-3">
            {category.specs.map((spec, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-gray-400">{spec.label}</span>
                <span className="font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// New component for vehicle history
const VehicleHistory = ({ car }: { car: Car | null }) => {
  if (!car) return null;
  
  const historyPoints = [
    { label: "Previous Owners", value: car.specs?.previousOwners || "N/A" },
    { label: "Service History", value: car.specs?.serviceHistory || "Complete" },
    { label: "Accident History", value: car.specs?.accidentHistory || "None" },
    { label: "Warranty", value: car.specs?.warranty || "N/A" }
  ];
  
  return (
    <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock3 className="h-5 w-5 text-pollux-blue" />
        Vehicle History
      </h3>
      
      <div className="space-y-4">
        {historyPoints.map((point, i) => (
          <div key={i} className="flex justify-between items-center border-b border-gray-800 pb-3">
            <span className="text-gray-400">{point.label}</span>
            <span className="font-medium">{point.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: carData, isLoading, error } = useCar(parseInt(id || "0"));
  const car = carData?.car;
  const { data: similarCars = [], isLoading: isLoadingSimilarCars } = useSimilarCars(
    car?.category || '', 
    parseInt(id || "0"),
    3
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'gallery' | '3d'>('gallery');
  
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const similarRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Add specsInView state using useInView hook
  const specsInView = useInView(specsRef, { once: true, amount: 0.2 });
  
  // Update the sections array to include new sections
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "gallery", label: "Gallery" },
    { id: "specs", label: "Specifications" },
    { id: "features", label: "Features" },
    { id: "history", label: "Vehicle History" },
    { id: "similar", label: "Similar Cars" },
  ];
  
  // Use the main car image (gallery feature to be implemented later)
  const carImages = useMemo(() => {
    return [car?.image || fallbackCar.image];
  }, [car?.image, fallbackCar.image]);

  // Debug output to check the car data (development only)
  useEffect(() => {
    if (car && process.env.NODE_ENV === 'development') {
      console.log('Car data:', car);
      console.log('Active image URL:', carImages[activeImageIndex]);
    }
  }, [car, carImages, activeImageIndex]);

  // Handle image navigation
  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % carImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + carImages.length) % carImages.length);
  };
  
  // Navigate to contact page for purchase
  const navigateToContact = () => {
    navigate('/contact', { 
      state: { 
        carInfo: car?.name,
        requestType: 'purchase'
      } 
    });
  };

  // Initialize animations
  useEffect(() => {
    if (prefersReducedMotion || !contentRef.current) return;
    
    // Create a master timeline for better coordination
    const masterTl = gsap.timeline({ defaults: { ease: "power2.out" } });
    
    // Initial hero section animation
    if (imageRef.current) {
      masterTl.fromTo(
        imageRef.current, 
        { scale: 1.05, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8 }
      );
    }
    
    if (contentRef.current) {
      masterTl.fromTo(
        contentRef.current.children, 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5 },
        "-=0.4" // Start slightly earlier
      );
    }
    
    // Setup animations for scrolling sections
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
    
    return () => {
      // Clean up animations
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [car, prefersReducedMotion]);
  
  // If there's an error, show an error message
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load car details</h2>
          <p className="text-gray-400 mb-6">There was an error loading the car information. Please try again later.</p>
          <Button onClick={() => navigate('/cars')}>
            Back to Cars
          </Button>
        </div>
      </div>
    );
  }
  
  // Use car data if available, otherwise use fallback
  const displayCar = car || fallbackCar;
  
  // Performance stats for StatsCounter
  const performanceStats = [
    {
      label: "Top Speed",
      value: parseInt(displayCar.specs.speed) || 250,
      suffix: " km/h"
    },
    {
      label: "0-100 km/h",
      value: parseFloat(displayCar.specs.acceleration) || 3.2,
      suffix: "s",
      decimals: 1
    },
    {
      label: "Horsepower",
      value: parseInt(displayCar.specs.power) || 450,
      suffix: " hp"
    },
    {
      label: "Range",
      value: parseInt(displayCar.specs.range) || 550,
      suffix: " km"
    }
  ];
  
  return (
    <div className="min-h-screen pb-16">
      <ScrollIndicator />
      
      {/* Quick Navigation */}
      <QuickNav sections={sections} />
      
      <main>
        {/* Hero Section with Car Image */}
        <section 
          id="overview"
          ref={heroRef}
          className="pt-20 relative overflow-hidden bg-gradient-to-b from-black via-background to-background"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Navigation */}
            <div className="mb-4">
              <Link 
                to="/cars"
                className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Cars
              </Link>
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Car Images */}
              <div className="relative">
                <Tabs 
                  defaultValue="gallery" 
                  className="mb-6"
                  onValueChange={(value) => setViewMode(value as 'gallery' | '3d')}
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/20 backdrop-blur-md">
                    <TabsTrigger 
                      value="gallery" 
                      className="flex items-center gap-2"
                    >
                      <View size={16} />
                      <span>Gallery</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="3d" 
                      className="flex items-center gap-2"
                    >
                      <Box size={16} />
                      <span>3D View</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="gallery" className="m-0">
                    <ImageGallery 
                      carImages={carImages}
                      activeImageIndex={activeImageIndex}
                      setActiveImageIndex={setActiveImageIndex}
                      nextImage={nextImage}
                      prevImage={prevImage}
                      imageRef={imageRef}
                    />
                  </TabsContent>
                  
                  <TabsContent value="3d" className="m-0">
                    <Suspense fallback={
                      <div className="w-full h-[500px] flex items-center justify-center bg-black/20 backdrop-blur-md rounded-xl">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 border-4 border-t-transparent border-pollux-blue rounded-full animate-spin"></div>
                          <p className="mt-4 text-sm text-white/70">Loading 3D viewer...</p>
                        </div>
                      </div>
                    }>
                      <CarViewer3D 
                        modelPath={getModelPath(car?.car)}
                        color={getCarColor(car?.car)}
                        backgroundColor="#0A0A0A"
                        autoRotate={true}
                        models3D={car?.car?.models_3d || []}
                      />
                    </Suspense>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Car Info */}
              <div ref={contentRef}>
                <div className={`${isLoading ? "animate-pulse" : ""}`}>
                  <div className="flex justify-between items-start">
                    <motion.h1 
                      className="text-4xl font-bold mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {displayCar.name}
                    </motion.h1>
                    {!isLoading && <FavoriteButton carId={displayCar.id} />}
                  </div>
                  
                  <motion.div 
                    className="flex items-center mt-2 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <span className="px-2 py-1 bg-pollux-red/80 text-white text-xs rounded-full shine">
                      {displayCar.category}
                    </span>
                    <span className="ml-2 text-gray-400">{displayCar.year}</span>
                  </motion.div>
                  
                  <motion.h2 
                    className="text-3xl font-bold mb-6 text-pollux-red digital-readout"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {displayCar.price}
                  </motion.h2>
                  
                  <motion.p 
                    className="text-gray-300 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {displayCar.description || "Experience the pinnacle of automotive excellence with this meticulously crafted vehicle. Featuring state-of-the-art technology, unparalleled performance, and luxurious comfort, this model sets a new standard in its class."}
                  </motion.p>
                  
                  <motion.div 
                    className="flex flex-wrap gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Button 
                      className="bg-pollux-red hover:bg-red-700 px-8 py-6 group"
                      onClick={navigateToContact}
                    >
                      Buy a Car
                      <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
                    </Button>
                    <Button variant="outline" className="px-8 py-6 hover-glow">
                      Customize & Order
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Specifications Section - Enhanced */}
        <section id="specs" className="py-16 bg-gradient-to-b from-transparent to-black/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              ref={specsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={specsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h2 className="text-3xl font-bold mb-8">Detailed Specifications</h2>
              
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-6 bg-black/30 border border-gray-800">
                  <TabsTrigger value="details">Technical Details</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-0">
                  <DetailedSpecifications car={car} />
                </TabsContent>
                
                <TabsContent value="performance" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
                      <h3 className="text-lg font-semibold mb-4">Engine & Performance</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Engine Type</span>
                          <span className="font-medium">{car?.specs?.engineType || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Displacement</span>
                          <span className="font-medium">{car?.specs?.displacement || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Cylinders</span>
                          <span className="font-medium">{car?.specs?.cylinders || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Compression Ratio</span>
                          <span className="font-medium">{car?.specs?.compressionRatio || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Valvetrain</span>
                          <span className="font-medium">{car?.specs?.valvetrain || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
                      <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Quarter Mile</span>
                          <span className="font-medium">{car?.specs?.quarterMile || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Braking (60-0)</span>
                          <span className="font-medium">{car?.specs?.braking || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Top Track Speed</span>
                          <span className="font-medium">{car?.specs?.topTrackSpeed || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Lateral Acceleration</span>
                          <span className="font-medium">{car?.specs?.lateralAcceleration || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="dimensions" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
                      <h3 className="text-lg font-semibold mb-4">Exterior Dimensions</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Length</span>
                          <span className="font-medium">{car?.specs?.length || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Width</span>
                          <span className="font-medium">{car?.specs?.width || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Height</span>
                          <span className="font-medium">{car?.specs?.height || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Wheelbase</span>
                          <span className="font-medium">{car?.specs?.wheelbase || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Ground Clearance</span>
                          <span className="font-medium">{car?.specs?.groundClearance || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
                      <h3 className="text-lg font-semibold mb-4">Interior & Capacity</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Seating Capacity</span>
                          <span className="font-medium">{car?.specs?.seatingCapacity || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Cargo Volume</span>
                          <span className="font-medium">{car?.specs?.cargoVolume || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Fuel Tank Capacity</span>
                          <span className="font-medium">{car?.specs?.fuelTankCapacity || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Curb Weight</span>
                          <span className="font-medium">{car?.specs?.curbWeight || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
                      <h3 className="text-lg font-semibold mb-4">Comfort & Convenience</h3>
                      <ul className="space-y-2">
                        {(car?.specs?.comfortFeatures || "N/A,N/A").split(',').map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-pollux-blue"></div>
                            <span>{feature.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
                      <h3 className="text-lg font-semibold mb-4">Safety & Technology</h3>
                      <ul className="space-y-2">
                        {(car?.specs?.safetyFeatures || "N/A,N/A").split(',').map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-pollux-blue"></div>
                            <span>{feature.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </section>
        
        {/* Vehicle History Section - New */}
        <section id="history" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h2 className="text-3xl font-bold mb-8">Vehicle History</h2>
              <VehicleHistory car={car} />
            </motion.div>
          </div>
        </section>

        {/* Similar Cars */}
        <section id="similar" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1">You Might Also Like</h2>
              <Separator className="separator-glow w-24" />
            </div>
            
            <div 
              ref={similarRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {isLoadingSimilarCars ? (
                // Loading placeholders
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="block bg-secondary/30 rounded-lg overflow-hidden shine glass-card animate-pulse h-[280px]"></div>
                ))
              ) : similarCars.length > 0 ? (
                // Real similar cars from database
                similarCars.map((similarCar) => (
                  <motion.div
                    key={similarCar.id}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <Link 
                      to={`/cars/${similarCar.id}`} 
                      className="block bg-secondary/30 rounded-lg overflow-hidden shine glass-card h-full"
                    >
                      <div className="h-48 bg-secondary/50 relative">
                        <OptimizedCarImage 
                          src={similarCar.image}
                          alt={similarCar.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        {similarCar.featured && (
                          <div className="absolute bottom-3 right-3 px-2 py-1 bg-pollux-red/90 text-white text-xs rounded-full">
                            Featured
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold">{similarCar.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">{similarCar.price}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-xs text-gray-400">Available</span>
                          </div>
                          <span className="text-xs text-pollux-red">View Details →</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                // Fallback when no similar cars are found
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-400">No similar cars available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-pollux-red/10 backdrop-blur-sm"></div>
          <div className="absolute inset-0 smoke opacity-30"></div>
          <motion.div 
            ref={ctaRef}
            className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative"
          >
            <h2 className="text-3xl font-bold mb-4">Ready for the Ultimate Driving Experience?</h2>
            <p className="text-lg mb-8 text-gray-300">Purchase your {displayCar.name} today and experience luxury without compromise.</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                size="lg" 
                className="bg-pollux-red hover:bg-red-700"
                onClick={navigateToContact}
              >
                Buy a Car
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default CarDetail;
