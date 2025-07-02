import { useState, useRef, useEffect, lazy, Suspense, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Car as CarIcon, Gauge, Clock3, Zap, Route, Menu, View, Box, Heart, Share2, MapPin, Calendar, Fuel, Eye, Phone, MessageCircle } from 'lucide-react';
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
import { SmartCarImage } from '@/components/SmartCarImage';
import { OptimizedCarCard } from '@/components/OptimizedCarCard';
import { Badge } from '@/components/ui/badge';

// Lazy load the 3D viewer component for better performance
const CarViewer3D = lazy(() => import('@/components/CarViewer3D'));

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Enhanced fallback car data
const fallbackCar = {
  id: 0,
  name: "Loading Vehicle Details...",
  category: "Loading...",
  year: "2024",
  price: "Loading...",
  image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=600&fit=crop",
  gallery: [],
  specs: {
    speed: "Loading...",
    acceleration: "Loading...",
    power: "Loading...",
    range: "Loading..."
  },
  description: "Loading comprehensive vehicle information and specifications...",
  featured: false,
  color: "Unknown"
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
  
  // Map common car makes to 3D model paths
  const modelMap: Record<string, string> = {
    'mercedes': '/media/models/luxury_sedan.glb',
    'bmw': '/media/models/luxury_sedan.glb',
    'audi': '/media/models/luxury_sedan.glb',
    'porsche': '/media/models/luxury_sedan.glb',
    'lamborghini': '/media/models/luxury_sedan.glb',
    'ferrari': '/media/models/luxury_sedan.glb',
    'toyota': '/media/models/luxury_sedan.glb',
    'lexus': '/media/models/luxury_sedan.glb',
    'default': '/media/models/luxury_sedan.glb'
  };
  
  return modelMap[make] || modelMap['default'];
};

// Convert car color to hex code
const getCarColor = (car: any | null): string => {
  const colorMap: Record<string, string> = {
    'black': '#1a1a1a',
    'white': '#f5f5f5',
    'silver': '#c0c0c0',
    'gray': '#808080',
    'grey': '#808080',
    'red': '#D32F2F',
    'blue': '#1976D2',
    'green': '#388E3C',
    'yellow': '#FBC02D',
    'orange': '#F57C00',
    'purple': '#7B1FA2',
    'brown': '#795548',
    'navy': '#0f3460',
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
                  className="h-0.5 bg-blue-500 mt-1" 
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Image Gallery Component
const ImageGallery = ({ 
  car,
  activeImageIndex, 
  setActiveImageIndex, 
  nextImage, 
  prevImage,
  imageRef 
}: { 
  car: any,
  activeImageIndex: number,
  setActiveImageIndex: (index: number) => void,
  nextImage: () => void,
  prevImage: () => void,
  imageRef: React.RefObject<HTMLImageElement>
}) => {
  const carImages = useMemo(() => {
    const images: string[] = [];
    
    // Add main image first
    if (car?.image) {
      images.push(car.image);
    }
    
    // Add gallery images
    if (car?.gallery && Array.isArray(car.gallery)) {
      car.gallery.forEach((img: string) => {
        if (img && !images.includes(img)) {
          images.push(img);
        }
      });
    }
    
    // Fallback to placeholder if no images
    if (images.length === 0) {
      images.push(fallbackCar.image);
    }
    
    return images;
  }, [car?.image, car?.gallery]);

  const currentImage = carImages[activeImageIndex] || carImages[0];

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Main Image Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeImageIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <SmartCarImage
            carName={car?.name || "Car"}
            supabaseImageUrl={currentImage}
            supabaseGallery={carImages}
            context="detail"
            className="w-full h-full object-cover"
            alt={`${car?.name || 'Car'} - Image ${activeImageIndex + 1}`}
            lazy={false}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>
      
      {/* Gallery Navigation */}
      {carImages.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4 z-10">
            <Button
              variant="secondary"
              size="icon"
              onClick={prevImage}
              className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={nextImage}
              className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
          
          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex space-x-2 bg-black/30 rounded-full backdrop-blur-md px-4 py-2 border border-white/20">
              {carImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeImageIndex ? "bg-white scale-110" : "bg-white/40 hover:bg-white/60"
                  }`}
                  onClick={() => setActiveImageIndex(idx)}
                />
              ))}
            </div>
          </div>
          
          {/* Image Counter */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-black/30 backdrop-blur-md rounded-full px-3 py-1 text-white text-sm border border-white/20">
              {activeImageIndex + 1} / {carImages.length}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Enhanced Specifications Component
const DetailedSpecifications = ({ car }: { car: any }) => {
  if (!car) return null;
  
  const specCategories = [
    {
      title: "Engine & Performance",
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      specs: [
        { label: "Engine Type", value: car.specs?.engineType || "Not specified" },
        { label: "Power Output", value: car.specs?.power || "Not specified" },
        { label: "Torque", value: car.specs?.torque || "Not specified" },
        { label: "Top Speed", value: car.specs?.speed || "Not specified" },
        { label: "0-100 km/h", value: car.specs?.acceleration || "Not specified" }
      ]
    },
    {
      title: "Drivetrain & Efficiency",
      icon: <Gauge className="h-5 w-5 text-blue-500" />,
      specs: [
        { label: "Transmission", value: car.specs?.transmission || "Not specified" },
        { label: "Drive Type", value: car.specs?.driveType || "Not specified" },
        { label: "Fuel Type", value: car.specs?.fuelType || "Not specified" },
        { label: "Fuel Economy", value: car.specs?.fuelEconomy || "Not specified" },
        { label: "Range", value: car.specs?.range || "Not specified" }
      ]
    },
    {
      title: "Dimensions & Weight",
      icon: <Box className="h-5 w-5 text-blue-500" />,
      specs: [
        { label: "Length", value: car.specs?.length || "Not specified" },
        { label: "Width", value: car.specs?.width || "Not specified" },
        { label: "Height", value: car.specs?.height || "Not specified" },
        { label: "Wheelbase", value: car.specs?.wheelbase || "Not specified" },
        { label: "Curb Weight", value: car.specs?.weight || "Not specified" }
      ]
    },
    {
      title: "Features & Technology",
      icon: <Menu className="h-5 w-5 text-blue-500" />,
      specs: [
        { label: "Infotainment", value: car.specs?.infotainment || "Not specified" },
        { label: "Safety Rating", value: car.specs?.safetyRating || "Not specified" },
        { label: "Driver Assistance", value: car.specs?.driverAssistance || "Not specified" },
        { label: "Seating", value: car.specs?.seating || "Not specified" }
      ]
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {specCategories.map((category, index) => (
        <motion.div 
          key={index} 
          className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            {category.icon}
            <h3 className="text-lg font-semibold text-white">{category.title}</h3>
          </div>
          
          <div className="space-y-4">
            {category.specs.map((spec, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-700/30 last:border-0">
                <span className="text-gray-400 text-sm">{spec.label}</span>
                <span className="font-medium text-white text-sm">{spec.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Enhanced Vehicle History Component
const VehicleHistory = ({ car }: { car: any }) => {
  if (!car) return null;
  
  const historyItems = [
    { 
      icon: <Clock3 className="h-5 w-5 text-blue-500" />,
      label: "Previous Owners", 
      value: car.specs?.previousOwners || "Single owner",
      status: "good"
    },
    { 
      icon: <Eye className="h-5 w-5 text-green-500" />,
      label: "Service History", 
      value: car.specs?.serviceHistory || "Complete service records",
      status: "excellent"
    },
    { 
      icon: <MapPin className="h-5 w-5 text-blue-500" />,
      label: "Accident History", 
      value: car.specs?.accidentHistory || "No accidents reported",
      status: "excellent"
    },
    { 
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
      label: "Warranty Status", 
      value: car.specs?.warranty || "Active manufacturer warranty",
      status: "good"
    }
  ];
  
  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
        <Clock3 className="h-6 w-6 text-blue-500" />
        Vehicle History
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historyItems.map((item, i) => (
          <motion.div 
            key={i} 
            className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/20"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex-shrink-0 mt-1">
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className="text-gray-400 text-sm font-medium">{item.label}</span>
                <Badge 
                  variant={item.status === 'excellent' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {item.status}
                </Badge>
              </div>
              <span className="text-white text-sm">{item.value}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: car, isLoading, error } = useCar(parseInt(id || "0"));
  const { data: similarCars = [], isLoading: isLoadingSimilarCars } = useSimilarCars(
    car?.category || '', 
    parseInt(id || "0"),
    4
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
    { id: "similar", label: "Similar Vehicles" },
  ];
  
  // Enhanced car images handling with gallery support
  const carImages = useMemo(() => {
    const images: string[] = [];
    
    // Add main image first
    if (car?.image) {
      images.push(car.image);
    }
    
    // Add gallery images
    if (car?.gallery && Array.isArray(car.gallery)) {
      car.gallery.forEach((img: string) => {
        if (img && !images.includes(img)) {
          images.push(img);
        }
      });
    }
    
    // Fallback to placeholder if no images
    if (images.length === 0) {
      images.push(fallbackCar.image);
    }
    
    return images;
  }, [car?.image, car?.gallery]);

  // Debug output for development
  useEffect(() => {
    if (car && process.env.NODE_ENV === 'development') {
      console.log('Car data:', car);
      console.log('Gallery images:', car.gallery);
      console.log('Total images available:', carImages.length);
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

  // Share functionality
  const handleShare = async () => {
    if (navigator.share && car) {
      try {
        await navigator.share({
          title: car.name,
          text: `Check out this ${car.name} - ${car.price}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Vehicle URL copied to clipboard",
        });
      }
    } else if (car) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Vehicle URL copied to clipboard",
      });
    }
  };

  // Initialize animations
  useEffect(() => {
    if (prefersReducedMotion || !contentRef.current) return;
    
    const masterTl = gsap.timeline({ defaults: { ease: "power2.out" } });
    
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
        "-=0.4"
      );
    }
    
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
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [car, prefersReducedMotion]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Loading skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="w-full h-[600px] rounded-xl" />
              <div className="space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-24 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold mb-4 text-white">Vehicle Not Found</h2>
            <p className="text-gray-400 mb-6">Sorry, we couldn't find the vehicle you're looking for. It might have been moved or deleted.</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/cars')} className="bg-blue-600 hover:bg-blue-700">
                Browse All Vehicles
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Go Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  // Use car data or fallback
  const displayCar = car || fallbackCar;
  
  // Performance stats for StatsCounter
  const performanceStats = [
    {
      label: "Top Speed",
      value: parseInt(displayCar.specs.speed?.replace(/[^\d]/g, '') || '0') || 250,
      suffix: " km/h"
    },
    {
      label: "0-100 km/h",
      value: parseFloat(displayCar.specs.acceleration?.replace(/[^\d.]/g, '') || '0') || 4.5,
      suffix: "s",
      decimals: 1
    },
    {
      label: "Power",
      value: parseInt(displayCar.specs.power?.replace(/[^\d]/g, '') || '0') || 400,
      suffix: " hp"
    },
    {
      label: "Range",
      value: parseInt(displayCar.specs.range?.replace(/[^\d]/g, '') || '0') || 600,
      suffix: " km"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <ScrollIndicator />
      
      {/* Quick Navigation */}
      <QuickNav sections={sections} />
      
      <main>
        {/* Hero Section with Enhanced Car Image Gallery */}
        <section 
          id="overview"
          ref={heroRef}
          className="pt-20 relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Navigation */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link 
                to="/cars"
                className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors group"
              >
                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to Vehicle Listings
              </Link>
            </motion.div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Enhanced Car Images with Gallery */}
              <div className="relative">
                <Tabs 
                  defaultValue="gallery" 
                  className="mb-6"
                  onValueChange={(value) => setViewMode(value as 'gallery' | '3d')}
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800/50 backdrop-blur-md border border-gray-700">
                    <TabsTrigger 
                      value="gallery" 
                      className="flex items-center gap-2 data-[state=active]:bg-blue-600"
                    >
                      <Eye size={16} />
                      <span>Gallery ({carImages.length})</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="3d" 
                      className="flex items-center gap-2 data-[state=active]:bg-blue-600"
                    >
                      <Box size={16} />
                      <span>3D View</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="gallery" className="m-0">
                    <ImageGallery 
                      car={displayCar}
                      activeImageIndex={activeImageIndex}
                      setActiveImageIndex={setActiveImageIndex}
                      nextImage={nextImage}
                      prevImage={prevImage}
                      imageRef={imageRef}
                    />
                  </TabsContent>
                  
                  <TabsContent value="3d" className="m-0">
                    <Suspense fallback={
                      <div className="w-full h-[600px] flex items-center justify-center bg-gray-800/30 backdrop-blur-md rounded-xl border border-gray-700">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                          <p className="mt-4 text-sm text-gray-400">Loading 3D viewer...</p>
                        </div>
                      </div>
                    }>
                      <div className="w-full h-[600px] rounded-xl overflow-hidden">
                        <CarViewer3D 
                          modelPath={getModelPath(car)}
                          initialColor={{
                            name: car?.color || "Black",
                            hex: getCarColor(car),
                            metalness: 0.8,
                            roughness: 0.2
                          }}
                          models3D={car?.models_3d || []}
                        />
                      </div>
                    </Suspense>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Enhanced Car Info */}
              <div ref={contentRef} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Header with Favorite and Share */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h1 className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {displayCar.name}
                      </h1>
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                          {displayCar.category}
                        </Badge>
                        <span className="text-gray-400 text-lg">{displayCar.year}</span>
                        {displayCar.featured && (
                          <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 border-yellow-400/30">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {!isLoading && <FavoriteButton carId={displayCar.id} />}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleShare}
                        className="border-gray-600 hover:border-gray-500"
                      >
                        <Share2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-blue-400">
                      {displayCar.price}
                    </h2>
                  </motion.div>
                  
                  {/* Description */}
                  <motion.p 
                    className="text-gray-300 text-lg leading-relaxed mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {displayCar.description || "Experience unparalleled luxury and performance with this exceptional vehicle. Meticulously engineered and crafted to the highest standards, featuring cutting-edge technology and premium materials throughout."}
                  </motion.p>
                  
                  {/* Quick Stats */}
                  <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {performanceStats.map((stat, index) => (
                      <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                        <div className="text-2xl font-bold text-blue-400">
                          {stat.value}{stat.suffix}
                        </div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>
                  
                  {/* Action Buttons */}
                  <motion.div 
                    className="flex flex-wrap gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg font-semibold group"
                      onClick={navigateToContact}
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Contact Dealer
                      <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="px-8 py-6 text-lg border-gray-600 hover:border-gray-500 hover:bg-gray-800"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Schedule Test Drive
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Performance Stats Section */}
        <section className="py-16 bg-gradient-to-r from-gray-900/50 to-black/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              ref={statsRef}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-12 text-white">Performance Highlights</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                 {performanceStats.map((stat, index) => (
                   <div key={index} className="text-center">
                     <div className="text-4xl lg:text-5xl font-bold text-blue-400 mb-2">
                       {stat.value}{stat.suffix}
                     </div>
                     <p className="text-gray-400 text-lg">{stat.label}</p>
                   </div>
                 ))}
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Enhanced Specifications Section */}
        <section id="specs" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              ref={specsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={specsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">Technical Specifications</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Discover the engineering excellence and advanced technology that powers this exceptional vehicle.
                </p>
              </div>
              
              <DetailedSpecifications car={car} />
            </motion.div>
          </div>
        </section>
        
        {/* Vehicle History Section */}
        <section id="history" className="py-16 bg-gradient-to-r from-black/50 to-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">Vehicle History & Condition</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Transparency and trust through comprehensive vehicle documentation and history.
                </p>
              </div>
              <VehicleHistory car={car} />
            </motion.div>
          </div>
        </section>

        {/* Similar Cars Section */}
        <section id="similar" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">You Might Also Like</h2>
              <p className="text-gray-400 text-lg">Explore similar vehicles that match your preferences</p>
              <Separator className="mx-auto w-24 mt-6 bg-gradient-to-r from-blue-500 to-purple-500" />
            </div>
            
            <div 
              ref={similarRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {isLoadingSimilarCars ? (
                // Loading placeholders
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-800/50 rounded-xl h-[280px] border border-gray-700/50"></div>
                  </div>
                ))
              ) : similarCars.length > 0 ? (
                // Real similar cars
                similarCars.map((similarCar, index) => (
                  <motion.div
                    key={similarCar.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <OptimizedCarCard
                      car={similarCar}
                      onViewDetails={(car) => navigate(`/cars/${car.id}`)}
                      className="h-full"
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🚗</div>
                  <p className="text-gray-400">No similar vehicles found at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
                Ready to Drive Your Dream Car?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Contact our expert team today to schedule a test drive or get personalized financing options for your {displayCar.name}.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg font-semibold"
                  onClick={navigateToContact}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Dealer
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-4 text-lg border-gray-600 hover:border-gray-500 hover:bg-gray-800"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Test Drive
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CarDetail;
