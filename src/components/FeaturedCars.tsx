
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface Car {
  id: number;
  name: string;
  model: string;
  price: string;
  specs: {
    speed: string;
    acceleration: string;
    power: string;
  };
  image: string;
  color: string;
}

const cars: Car[] = [
  {
    id: 1,
    name: "Astra",
    model: "GT-X 2025",
    price: "$125,000",
    specs: {
      speed: "320 km/h",
      acceleration: "2.8s",
      power: "750 hp"
    },
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2825&auto=format&fit=crop&ixlib=rb-4.0.3",
    color: "#E31937"
  },
  {
    id: 2,
    name: "Celestial",
    model: "S-500 2025",
    price: "$180,000",
    specs: {
      speed: "350 km/h",
      acceleration: "2.3s",
      power: "900 hp"
    },
    image: "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    color: "#2C3E50"
  },
  {
    id: 3,
    name: "Solari",
    model: "Quantum E",
    price: "$145,000",
    specs: {
      speed: "310 km/h",
      acceleration: "3.0s",
      power: "680 hp"
    },
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    color: "#34495E"
  }
];

const FeaturedCars = () => {
  const [currentCar, setCurrentCar] = useState(0);
  const isMobile = useIsMobile();
  
  const nextCar = () => {
    setCurrentCar((prev) => (prev + 1) % cars.length);
  };

  const prevCar = () => {
    setCurrentCar((prev) => (prev - 1 + cars.length) % cars.length);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-medium tracking-wider text-pollux-red uppercase">
            Our Premium Selection
          </h2>
          <h3 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-gradient">
            Featured Models
          </h3>
        </div>

        <div className="relative">
          <div 
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
                          {car.model}
                        </span>
                      </h2>
                      
                      <div className="mt-8 grid grid-cols-3 gap-4">
                        <div className="border-l-2 pl-4" style={{ borderColor: car.color }}>
                          <p className="text-sm text-gray-400">Top Speed</p>
                          <p className="text-xl font-medium">{car.specs.speed}</p>
                        </div>
                        <div className="border-l-2 pl-4" style={{ borderColor: car.color }}>
                          <p className="text-sm text-gray-400">0-100 km/h</p>
                          <p className="text-xl font-medium">{car.specs.acceleration}</p>
                        </div>
                        <div className="border-l-2 pl-4" style={{ borderColor: car.color }}>
                          <p className="text-sm text-gray-400">Power</p>
                          <p className="text-xl font-medium">{car.specs.power}</p>
                        </div>
                      </div>
                      
                      <div className="mt-12 flex items-center">
                        <span className="text-xl md:text-2xl font-medium">{car.price}</span>
                        <a 
                          href="#" 
                          className="ml-6 px-6 py-3 bg-pollux-red hover:bg-red-700 text-white rounded-md font-medium transition-colors"
                        >
                          Details
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="order-1 lg:order-2 mb-8 lg:mb-0">
                    <div className="aspect-[16/9] overflow-hidden rounded-lg">
                      <img 
                        src={car.image} 
                        alt={`${car.name} ${car.model}`} 
                        className="w-full h-full object-cover"
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
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
