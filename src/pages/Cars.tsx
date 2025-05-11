
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Filter, Car as CarIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CarCard from '@/components/CarCard';
import FilterSidebar, { FilterOptions } from '@/components/FilterSidebar';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';
import { useCars, Car } from '@/lib/supabase';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/animation';

const Cars = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    priceRange: [50000, 200000],
    categories: [],
    features: [],
    years: []
  });

  const { data: cars, isLoading, error } = useCars();
  const { toast } = useToast();
  
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Filter cars based on current filters
  const filteredCars = cars?.filter(car => {
    // Filter by search query
    if (searchQuery && !car.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (activeFilter !== 'all' && car.category.toLowerCase() !== activeFilter.toLowerCase()) {
      return false;
    }
    
    // Filter by category selection in sidebar
    if (currentFilters.categories.length > 0 && 
        !currentFilters.categories.includes(car.category)) {
      return false;
    }
    
    // Filter by year
    if (currentFilters.years.length > 0 && 
        !currentFilters.years.includes(car.year)) {
      return false;
    }
    
    // Filter by price range
    const price = parseInt(car.price.replace(/[$,]/g, ''));
    if (price < currentFilters.priceRange[0] || price > currentFilters.priceRange[1]) {
      return false;
    }
    
    return true;
  }) || [];

  // Apply filters from sidebar
  const handleApplyFilters = (filters: FilterOptions) => {
    setCurrentFilters(filters);
    toast({
      title: "Filters Applied",
      description: `Showing ${filteredCars.length} vehicles matching your criteria.`,
    });
  };

  // Initialize animations
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    // Hero section animations
    if (titleRef.current && subtitleRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.fromTo(
        titleRef.current, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.5"
      );
    }
    
    // Filters animations
    if (filtersRef.current) {
      gsap.fromTo(
        filtersRef.current,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: filtersRef.current,
            start: "top bottom-=50",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    // CTA section animation
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [prefersReducedMotion]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Hero Section for Cars page */}
        <section ref={heroRef} className="relative h-[40vh] overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <img 
              src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2000&auto=format&fit=crop" 
              alt="Cars Collection Hero" 
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center">
            <h1 ref={titleRef} className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4 text-center">
              Our Collection
            </h1>
            <p ref={subtitleRef} className="text-gray-300 max-w-xl text-center px-4">
              Discover the pinnacle of automotive excellence with our curated selection of luxury vehicles.
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section ref={filtersRef} className="section-container py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="search"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-border rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-pollux-red"
              />
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={16} />
                Filters
                <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              <div className="hidden md:flex items-center gap-2 border border-border rounded-full p-1">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-1.5 rounded-full transition-colors ${activeFilter === 'all' ? 'bg-pollux-red text-white' : 'hover:bg-white/10'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveFilter('sedan')}
                  className={`px-4 py-1.5 rounded-full transition-colors ${activeFilter === 'sedan' ? 'bg-pollux-red text-white' : 'hover:bg-white/10'}`}
                >
                  Sedan
                </button>
                <button 
                  onClick={() => setActiveFilter('suv')}
                  className={`px-4 py-1.5 rounded-full transition-colors ${activeFilter === 'suv' ? 'bg-pollux-red text-white' : 'hover:bg-white/10'}`}
                >
                  SUV
                </button>
                <button 
                  onClick={() => setActiveFilter('sport')}
                  className={`px-4 py-1.5 rounded-full transition-colors ${activeFilter === 'sport' ? 'bg-pollux-red text-white' : 'hover:bg-white/10'}`}
                >
                  Sport
                </button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-secondary rounded-lg h-[400px] animate-pulse">
                  <div className="h-[250px] bg-secondary/50 rounded-t-lg flex items-center justify-center">
                    <CarIcon className="w-16 h-16 text-secondary/30" />
                  </div>
                  <div className="p-6">
                    <div className="h-6 bg-secondary/50 rounded-full w-2/3 mb-2"></div>
                    <div className="h-4 bg-secondary/50 rounded-full w-1/3 mb-8"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-8 bg-secondary/50 rounded"></div>
                      <div className="h-8 bg-secondary/50 rounded"></div>
                      <div className="h-8 bg-secondary/50 rounded"></div>
                      <div className="h-8 bg-secondary/50 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCars?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car, index) => (
                <Link key={car.id} to={`/cars/${car.id}`}>
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
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <CarIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">No Cars Found</h3>
              <p className="text-gray-400 mb-8">
                We couldn't find any cars matching your current filters. Try adjusting your search criteria.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                setCurrentFilters({
                  priceRange: [50000, 200000],
                  categories: [],
                  features: [],
                  years: []
                });
              }}>
                Clear All Filters
              </Button>
            </div>
          )}
          
          {filteredCars?.length > 0 && (
            <Pagination className="mt-16">
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="h-full w-full">
              <img 
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="Luxury Car Interior" 
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="glass-card p-8 md:p-12 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Experience the Extraordinary
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Schedule a test drive today and discover why Pollux Motors is redefining luxury automotive excellence.
              </p>
              <Button asChild size="lg" className="bg-pollux-red hover:bg-red-700 text-white px-8 py-6 text-lg">
                <Link to="/contact">Book a Test Drive</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Filter Sidebar */}
      <FilterSidebar 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={currentFilters}
      />
    </div>
  );
};

import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default Cars;
