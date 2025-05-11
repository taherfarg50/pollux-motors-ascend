
import { useState } from 'react';
import { Search, ChevronDown, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CarCard from '@/components/CarCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';

const Cars = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Hero Section for Cars page */}
        <section className="relative h-[40vh] overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <img 
              src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2000&auto=format&fit=crop" 
              alt="Cars Collection Hero" 
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-4 text-center">
              Our Collection
            </h1>
            <p className="text-gray-300 max-w-xl text-center px-4">
              Discover the pinnacle of automotive excellence with our curated selection of luxury vehicles.
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="section-container py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="search"
                placeholder="Search models..."
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CarCard 
              id={1}
              name="Astra GT-X"
              category="sport"
              year="2025"
              price="$125,000"
              image="https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2825&auto=format&fit=crop&ixlib=rb-4.0.3"
              specs={{
                speed: "320 km/h",
                acceleration: "2.8s",
                power: "750 hp",
                range: "Electric + Gas"
              }}
            />
            <CarCard 
              id={2}
              name="Celestial S-500"
              category="sedan"
              year="2025"
              price="$180,000"
              image="https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3"
              specs={{
                speed: "350 km/h",
                acceleration: "2.3s",
                power: "900 hp",
                range: "Electric"
              }}
            />
            <CarCard 
              id={3}
              name="Solari Quantum E"
              category="sport"
              year="2025"
              price="$145,000"
              image="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
              specs={{
                speed: "310 km/h",
                acceleration: "3.0s",
                power: "680 hp",
                range: "Hybrid"
              }}
            />
            <CarCard 
              id={4}
              name="Atlas SUV-X"
              category="suv"
              year="2025"
              price="$95,000"
              image="https://images.unsplash.com/photo-1661956602944-249bcd04b63f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
              specs={{
                speed: "240 km/h",
                acceleration: "4.2s",
                power: "520 hp",
                range: "Electric"
              }}
            />
            <CarCard 
              id={5}
              name="Phoenix GT"
              category="sport"
              year="2025"
              price="$210,000"
              image="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
              specs={{
                speed: "370 km/h",
                acceleration: "2.1s",
                power: "1100 hp",
                range: "Gas"
              }}
            />
            <CarCard 
              id={6}
              name="Nova Sedan"
              category="sedan"
              year="2025"
              price="$85,000"
              image="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
              specs={{
                speed: "280 km/h",
                acceleration: "3.5s",
                power: "450 hp",
                range: "Electric"
              }}
            />
          </div>
          
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
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
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
              <Button className="bg-pollux-red hover:bg-red-700 text-white px-8 py-6 text-lg">
                Book a Test Drive
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cars;
