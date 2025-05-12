
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/animation';
import { useFeaturedCars } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedCars = () => {
  const [currentCar, setCurrentCar] = useState(0);
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carsTitleRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const { data: cars = [], isLoading } = useFeaturedCars();
  
  // Initialize carousel and section animations
  useEffect(() => {
    if (!sectionRef.current || !carsTitleRef.current || prefersReducedMotion) return;
    
    // Title reveal animation
    gsap.fromTo(
      carsTitleRef.current.children,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: carsTitleRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none"
        }
      }
    );
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [prefersReducedMotion]);
  
  // Car change animation
  useEffect(() => {
    if (!carouselRef.current || prefersReducedMotion || cars.length === 0) return;
    
    gsap.to(carouselRef.current, {
      x: `-${currentCar * 100}%`,
      duration: 0.7,
      ease: "power2.out"
    });
  }, [currentCar, prefersReducedMotion, cars.length]);
  
  const nextCar = () => {
    if (cars.length === 0) return;
    setCurrentCar((prev) => (prev + 1) % cars.length);
  };

  const prevCar = () => {
    if (cars.length === 0) return;
    setCurrentCar((prev) => (prev - 1 + cars.length) % cars.length);
  };

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={carsTitleRef} className="text-center mb-16">
          <h2 className="text-sm font-medium tracking-wider text-pollux-red uppercase">
            Our Premium Selection
          </h2>
          <h3 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-gradient">
            Featured Models
          </h3>
        </div>

        <div className="relative">
          {isLoading ? (
            // Skeleton loader for loading state
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
          ) : cars.length > 0 ? (
            <>
              <div 
                ref={carouselRef}
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentCar * 100}%)` }}
              >
                {cars.map((car) => (
                  <div key={car.id} className="min-w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="order-2 lg:order-1">
                        <div className="max-w-lg mx-auto lg:mx-0">
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                            {car.name}
                            <span className="block text-xl md:text-2xl text-gray-400 font-normal mt-1">
                              {car.model || "Latest Model"}
                            </span>
                          </h2>
                          
                          <div className="mt-8 grid grid-cols-3 gap-4">
                            <div className="border-l-2 pl-4" style={{ borderColor: car.color || "#E31937" }}>
                              <p className="text-sm text-gray-400">Top Speed</p>
                              <p className="text-xl font-medium">{car.specs.speed}</p>
                            </div>
                            <div className="border-l-2 pl-4" style={{ borderColor: car.color || "#E31937" }}>
                              <p className="text-sm text-gray-400">0-100 km/h</p>
                              <p className="text-xl font-medium">{car.specs.acceleration}</p>
                            </div>
                            <div className="border-l-2 pl-4" style={{ borderColor: car.color || "#E31937" }}>
                              <p className="text-sm text-gray-400">Power</p>
                              <p className="text-xl font-medium">{car.specs.power}</p>
                            </div>
                          </div>
                          
                          <div className="mt-12 flex items-center">
                            <span className="text-xl md:text-2xl font-medium">{car.price}</span>
                            <Button 
                              asChild
                              className="ml-6 px-6 py-3 bg-pollux-red hover:bg-red-700 text-white rounded-md font-medium transition-colors"
                            >
                              <Link to={`/cars/${car.id}`}>
                                Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="order-1 lg:order-2 mb-8 lg:mb-0">
                        <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gradient-to-br from-black/10 to-black/30">
                          <img 
                            src={car.image} 
                            alt={`${car.name} ${car.model || ''}`} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation controls */}
              <div className="flex justify-center lg:justify-start space-x-4 mt-8">
                <button
                  onClick={prevCar}
                  className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:text-white hover:border-white transition-colors"
                  aria-label="Previous car"
                  disabled={cars.length <= 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex space-x-2">
                  {cars.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentCar(idx)}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-colors",
                        currentCar === idx ? "bg-pollux-red" : "bg-gray-600"
                      )}
                      aria-label={`Go to slide ${idx + 1}`}
                    ></button>
                  ))}
                </div>
                <button
                  onClick={nextCar}
                  className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:text-white hover:border-white transition-colors"
                  aria-label="Next car"
                  disabled={cars.length <= 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No featured cars available at the moment.</p>
              <Button asChild className="mt-4 bg-pollux-red hover:bg-red-700">
                <Link to="/cars">View All Cars</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default FeaturedCars;
