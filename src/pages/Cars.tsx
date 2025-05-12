
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Car as CarIcon, Filter, SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CarCard from '@/components/CarCard';
import FavoriteButton from '@/components/FavoriteButton';
import CarFilter from '@/components/CarFilter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Car, useCars } from '@/lib/supabase';
import gsap from 'gsap';

const Cars = () => {
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const { data: allCars = [], isLoading } = useCars();
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (allCars.length > 0) {
      setFilteredCars(allCars);
    }
  }, [allCars]);
  
  // Title animation
  useEffect(() => {
    if (!titleRef.current) return;
    
    gsap.fromTo(
      titleRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none"
        }
      }
    );
    
    return () => {
      gsap.killTweensOf(titleRef.current.children);
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={titleRef} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-4">
              Explore Our Vehicles
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover the perfect combination of luxury, performance and sustainability in our exclusive lineup.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="w-full md:w-auto">
              <CarFilter onFilterChange={handleFilterChange} cars={allCars} />
            </div>
            
            {compareList.length > 0 && (
              <div className="w-full md:w-auto md:ml-auto flex items-center justify-between gap-4">
                <div className="text-sm">
                  <span className="font-medium">{compareList.length}</span> cars selected
                </div>
                <Button
                  asChild
                  className="bg-pollux-red hover:bg-red-700"
                >
                  <Link to={`/compare?cars=${compareList.join(',')}`}>
                    Compare Selected
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((_, idx) => (
                <div key={idx} className="bg-secondary rounded-lg overflow-hidden h-[400px] relative">
                  <Skeleton className="h-[250px] w-full" />
                  <div className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-6 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car, index) => (
                <div key={car.id} className="relative group">
                  <CarCard
                    id={car.id}
                    name={car.name}
                    category={car.category}
                    year={car.year}
                    price={car.price}
                    image={car.image}
                    specs={car.specs}
                    index={index}
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`bg-black/50 border-white/20 backdrop-blur-sm hover:bg-black/70 transition-colors ${compareList.includes(car.id) ? 'border-pollux-red text-pollux-red' : 'text-white'}`}
                      onClick={() => handleToggleCompare(car.id)}
                    >
                      {compareList.includes(car.id) ? 'Remove from Compare' : 'Add to Compare'}
                    </Button>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <FavoriteButton carId={car.id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <CarIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-medium mb-2">No cars found</h2>
              <p className="text-gray-400 mb-6">Try adjusting your filters for different results</p>
              <Button
                onClick={() => setFilteredCars(allCars)}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cars;
