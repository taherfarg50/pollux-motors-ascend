
import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Car as CarIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCar } from '@/lib/supabase';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/animation';

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

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: car, isLoading, error } = useCar(parseInt(id || "0"));
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { toast } = useToast();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Mock multiple images for the car (in a real app, these would come from the database)
  const carImages = [
    car?.image || fallbackCar.image,
    "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
  ];

  // Handle image navigation
  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % carImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + carImages.length) % carImages.length);
  };
  
  // Book test drive handler
  const handleBookTestDrive = () => {
    toast({
      title: "Test Drive Scheduled",
      description: `Your test drive for the ${car?.name || 'vehicle'} has been scheduled. We'll contact you shortly to confirm details.`,
    });
  };

  // Initialize animations
  useEffect(() => {
    if (prefersReducedMotion || !contentRef.current) return;
    
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    if (imageRef.current) {
      tl.fromTo(
        imageRef.current, 
        { scale: 1.1, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1 }
      );
    }
    
    if (contentRef.current) {
      tl.fromTo(
        contentRef.current.children, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.7 },
        "-=0.5"
      );
    }
    
    if (specRef.current) {
      gsap.fromTo(
        specRef.current.children, 
        { y: 20, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.5,
          scrollTrigger: {
            trigger: specRef.current,
            start: "top bottom-=100"
          }
        }
      );
    }
    
    return () => {
      tl.kill();
    };
  }, [car, prefersReducedMotion]);

  // Display error if car not found
  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Car Not Found</h1>
            <p className="mb-8">We couldn't find the car you're looking for.</p>
            <Button asChild>
              <Link to="/cars">Back to Cars</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayCar = car || fallbackCar;
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Hero Section with Car Image */}
        <div 
          ref={heroRef}
          className="pt-24 relative overflow-hidden bg-gradient-to-b from-black via-background to-background"
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
                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-secondary">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <CarIcon className="w-12 h-12 text-muted-foreground animate-pulse" />
                    </div>
                  ) : (
                    <img 
                      ref={imageRef}
                      src={carImages[activeImageIndex]} 
                      alt={displayCar.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                {/* Image Navigation */}
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between">
                  <button 
                    onClick={prevImage}
                    className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Image Indicators */}
                <div className="flex justify-center space-x-2 mt-4">
                  {carImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === activeImageIndex ? "bg-pollux-red w-6" : "bg-white/30"
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    ></button>
                  ))}
                </div>
              </div>
              
              {/* Car Info */}
              <div ref={contentRef}>
                <div className={`${isLoading ? "animate-pulse" : ""}`}>
                  <h1 className="text-4xl font-bold mb-2">
                    {displayCar.name}
                  </h1>
                  
                  <div className="flex items-center mt-2 mb-4">
                    <span className="px-2 py-1 bg-pollux-red/80 text-white text-xs rounded-full">
                      {displayCar.category}
                    </span>
                    <span className="ml-2 text-gray-400">{displayCar.year}</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-6 text-pollux-red">
                    {displayCar.price}
                  </h2>
                  
                  <p className="text-gray-300 mb-8">
                    {displayCar.description || "Experience the pinnacle of automotive excellence with this meticulously crafted vehicle. Featuring state-of-the-art technology, unparalleled performance, and luxurious comfort, this model sets a new standard in its class."}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-8">
                    <Button 
                      className="bg-pollux-red hover:bg-red-700 px-8 py-6"
                      onClick={handleBookTestDrive}
                    >
                      Book a Test Drive
                    </Button>
                    <Button variant="outline" className="px-8 py-6">
                      Customize & Order
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Specifications */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Specifications</h2>
            
            <div 
              ref={specRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              <div className="bg-secondary p-6 rounded-lg">
                <h3 className="text-sm text-gray-400 mb-1">Top Speed</h3>
                <p className="text-xl font-medium">{displayCar.specs.speed}</p>
              </div>
              <div className="bg-secondary p-6 rounded-lg">
                <h3 className="text-sm text-gray-400 mb-1">0-100 km/h</h3>
                <p className="text-xl font-medium">{displayCar.specs.acceleration}</p>
              </div>
              <div className="bg-secondary p-6 rounded-lg">
                <h3 className="text-sm text-gray-400 mb-1">Power</h3>
                <p className="text-xl font-medium">{displayCar.specs.power}</p>
              </div>
              <div className="bg-secondary p-6 rounded-lg">
                <h3 className="text-sm text-gray-400 mb-1">Range</h3>
                <p className="text-xl font-medium">{displayCar.specs.range}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Similar Cars */}
        <section className="py-16 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Link 
                  key={i}
                  to={`/cars/${i + 1}`} 
                  className="block bg-background rounded-lg overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <div className="h-48 bg-secondary relative">
                    <img 
                      src={`https://images.unsplash.com/photo-${i === 1 ? '1580414057403-c5f451f30e1c' : i === 2 ? '1618843479313-40f8afb4b4d8' : '1552519507-da3b142c6e3d'}?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3`} 
                      alt="Similar Car" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold">{i === 1 ? 'Celestial S-500' : i === 2 ? 'Solari Quantum E' : 'Phoenix GT'}</h3>
                    <p className="text-sm text-gray-400">{i === 1 ? '$180,000' : i === 2 ? '$145,000' : '$210,000'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-pollux-red/10 backdrop-blur-sm"></div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <h2 className="text-3xl font-bold mb-4">Ready for the Ultimate Driving Experience?</h2>
            <p className="text-lg mb-8 text-gray-300">Schedule your personalized test drive today and feel the power of {displayCar.name} firsthand.</p>
            <Button 
              size="lg" 
              className="bg-pollux-red hover:bg-red-700"
              onClick={handleBookTestDrive}
            >
              Book a Test Drive
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CarDetail;
