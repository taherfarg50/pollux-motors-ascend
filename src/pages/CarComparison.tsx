
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCars, Car } from '@/lib/supabase';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const CarComparison = () => {
  const [selectedCars, setSelectedCars] = useState<Car[]>([]);
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  const [addToPosition, setAddToPosition] = useState(0);
  const { data: cars } = useCars();

  const maxCarsToCompare = 3;

  const addCar = (position: number) => {
    setAddToPosition(position);
    setIsSelectDialogOpen(true);
  };

  const selectCar = (car: Car) => {
    const newSelectedCars = [...selectedCars];
    
    if (addToPosition >= selectedCars.length) {
      newSelectedCars.push(car);
    } else {
      newSelectedCars[addToPosition] = car;
    }
    
    setSelectedCars(newSelectedCars);
    setIsSelectDialogOpen(false);
  };

  const removeCar = (index: number) => {
    setSelectedCars(selectedCars.filter((_, i) => i !== index));
  };

  // Initialize with at least one car if available
  useEffect(() => {
    if (cars && cars.length > 0 && selectedCars.length === 0) {
      setSelectedCars([cars[0]]);
    }
  }, [cars]);

  // Comparison specs
  const comparisonCategories = [
    { name: "Performance", specs: ["speed", "acceleration", "power"] },
    { name: "General", specs: ["range", "price", "year"] },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/cars"
              className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Cars
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">Compare Models</h1>
            <p className="text-gray-400 mt-2">Compare up to {maxCarsToCompare} vehicles side by side</p>
          </div>

          {/* Comparison Table */}
          <div className="bg-secondary/30 rounded-lg overflow-hidden border border-border">
            {/* Car Selection Header */}
            <div className="grid grid-cols-4 border-b border-border">
              <div className="p-6 font-medium">
                <span className="text-gray-400">Models</span>
              </div>
              
              {Array(maxCarsToCompare).fill(0).map((_, index) => {
                const car = selectedCars[index];
                
                return (
                  <div key={index} className="p-4 border-l border-border">
                    {car ? (
                      <div className="flex flex-col items-center">
                        <div className="relative w-full">
                          <img 
                            src={car.image} 
                            alt={car.name} 
                            className="w-full aspect-[16/9] object-cover rounded-md"
                          />
                          <button
                            onClick={() => removeCar(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <h3 className="mt-3 font-medium text-center">{car.name}</h3>
                        <p className="text-sm text-gray-400">{car.year}</p>
                      </div>
                    ) : (
                      <div 
                        className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => addCar(index)}
                      >
                        <Plus size={24} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-400">Add Vehicle</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Comparison Data */}
            {comparisonCategories.map(category => (
              <div key={category.name}>
                {/* Category Header */}
                <div className="grid grid-cols-4 border-b border-border bg-secondary/50">
                  <div className="p-4 font-medium">
                    {category.name}
                  </div>
                  <div className="col-span-3"></div>
                </div>
                
                {/* Category Specs */}
                {category.specs.map(spec => (
                  <div key={spec} className="grid grid-cols-4 border-b border-border">
                    <div className="p-4 capitalize text-gray-300">
                      {spec === 'speed' ? 'Top Speed' : 
                       spec === 'acceleration' ? '0-100 km/h' :
                       spec === 'power' ? 'Horsepower' : spec}
                    </div>
                    
                    {Array(maxCarsToCompare).fill(0).map((_, index) => {
                      const car = selectedCars[index];
                      let value = "—";
                      
                      if (car) {
                        if (spec === 'price') {
                          value = car.price;
                        } else if (spec === 'year') {
                          value = car.year;
                        } else if (Object.prototype.hasOwnProperty.call(car.specs, spec)) {
                          value = car.specs[spec as keyof typeof car.specs];
                        }
                      }
                      
                      return (
                        <div key={index} className="p-4 border-l border-border font-medium text-center">
                          {value}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Car Selection Dialog */}
      <Dialog open={isSelectDialogOpen} onOpenChange={setIsSelectDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>Select a Vehicle</DialogTitle>
          <DialogDescription>
            Choose a vehicle to add to your comparison
          </DialogDescription>
          
          <ScrollArea className="h-[60vh] my-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
              {cars?.map(car => (
                <button
                  key={car.id}
                  className="flex gap-4 p-3 rounded-lg hover:bg-secondary/60 transition-colors text-left"
                  onClick={() => selectCar(car)}
                  disabled={selectedCars.some(c => c.id === car.id)}
                >
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="w-20 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium">{car.name}</h4>
                    <p className="text-sm text-gray-400">{car.year} • {car.price}</p>
                    <p className="text-xs text-gray-500 mt-1">{car.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarComparison;
