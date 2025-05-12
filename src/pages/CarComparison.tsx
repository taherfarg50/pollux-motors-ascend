
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComparisonTable from '@/components/ComparisonTable';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Car, useCars, useCar } from '@/lib/supabase';
import { ChevronLeft, PlusCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CarComparison = () => {
  const { data: allCars = [], isLoading: isLoadingAllCars } = useCars();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Extract car IDs from URL query params
  const carIds = searchParams.get('cars')?.split(',').map(Number).filter(Boolean) || [];
  
  // State for selected cars and available cars
  const [selectedCars, setSelectedCars] = useState<Car[]>([]);
  const [availableForComparison, setAvailableForComparison] = useState<Car[]>([]);
  const [newCarId, setNewCarId] = useState<string>('');

  // Fetch data for each car ID
  useEffect(() => {
    if (carIds.length === 0) {
      setSelectedCars([]);
      return;
    }

    // Load cars in parallel
    const loadCars = async () => {
      try {
        const carsPromises = carIds.map(id => fetch(`https://gjsektwcdvontsnyqobx.supabase.co/rest/v1/cars?id=eq.${id}&select=*,specs:car_specs(*)`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqc2VrdHdjZHZvbnRzbnlxb2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5ODM1ODcsImV4cCI6MjA2MjU1OTU4N30.GCOueFVU9bWOXriqGrekpsyhvJ70SFg6l9j5BnEVRzo',
            'Content-Type': 'application/json'
          }
        }).then(res => res.json()));
        
        const carsData = await Promise.all(carsPromises);
        
        const cars = carsData
          .flat()
          .filter(car => car) // Remove any null results
          .map(car => ({
            ...car,
            specs: {
              speed: car.specs[0]?.speed || 'N/A',
              acceleration: car.specs[0]?.acceleration || 'N/A',
              power: car.specs[0]?.power || 'N/A',
              range: car.specs[0]?.range || 'N/A'
            }
          }));

        setSelectedCars(cars);

      } catch (error) {
        console.error("Error loading cars for comparison:", error);
        toast({
          title: "Error loading cars",
          description: "There was a problem loading the selected cars for comparison.",
          variant: "destructive",
        });
      }
    };

    loadCars();
  }, [carIds, toast]);

  // Update available cars when all cars or selected cars change
  useEffect(() => {
    if (allCars.length > 0) {
      const selectedIds = new Set(selectedCars.map(car => car.id));
      const available = allCars.filter(car => !selectedIds.has(car.id));
      setAvailableForComparison(available);
    }
  }, [allCars, selectedCars]);

  // Update URL when selected cars change
  const updateUrlParams = (cars: Car[]) => {
    if (cars.length > 0) {
      const carIdsParam = cars.map(car => car.id).join(',');
      setSearchParams({ cars: carIdsParam });
    } else {
      setSearchParams({});
    }
  };

  // Add a car to comparison
  const handleAddCar = () => {
    if (!newCarId) return;
    
    const carIdNumber = parseInt(newCarId);
    if (selectedCars.length >= 4) {
      toast({
        title: "Maximum cars reached",
        description: "You can compare up to 4 cars at once.",
      });
      return;
    }
    
    if (carIds.includes(carIdNumber)) {
      toast({
        description: "This car is already in your comparison.",
      });
      return;
    }
    
    const updatedCarIds = [...carIds, carIdNumber];
    setSearchParams({ cars: updatedCarIds.join(',') });
    setNewCarId('');
  };

  // Remove a car from comparison
  const handleRemoveCar = (carId: number) => {
    const updatedCars = selectedCars.filter(car => car.id !== carId);
    updateUrlParams(updatedCars);
  };

  // Share comparison
  const handleShareComparison = () => {
    const url = `${window.location.origin}${window.location.pathname}?cars=${carIds.join(',')}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Car Comparison - Pollux Motors',
        text: 'Check out this car comparison from Pollux Motors',
        url: url,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Comparison link copied",
          description: "Share this link with others to show them your comparison.",
        });
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              className="mr-4 p-0"
              onClick={() => navigate('/cars')}
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Cars
            </Button>
            <h1 className="text-3xl font-bold">Car Comparison</h1>
          </div>
          
          <div className="glass-card p-6 mb-8">
            <div className="flex flex-wrap items-end gap-4">
              <div className="w-full md:w-64">
                <label htmlFor="car-select" className="block text-sm font-medium mb-1">
                  Add a car to compare
                </label>
                <Select value={newCarId} onValueChange={setNewCarId}>
                  <SelectTrigger id="car-select" className="w-full">
                    <SelectValue placeholder="Select a car" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableForComparison.map((car) => (
                      <SelectItem key={car.id} value={car.id.toString()}>
                        {car.name} {car.model || ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleAddCar} 
                disabled={!newCarId || selectedCars.length >= 4}
                className="bg-pollux-red hover:bg-red-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add to Comparison
              </Button>
              
              {selectedCars.length > 0 && (
                <Button 
                  variant="outline" 
                  className="ml-auto"
                  onClick={handleShareComparison}
                >
                  Share Comparison
                </Button>
              )}
            </div>
            
            {selectedCars.length > 0 && (
              <div className="text-sm text-muted-foreground mt-2">
                {selectedCars.length}/4 cars selected
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4">Comparison Table</h2>
            <ComparisonTable cars={selectedCars} onRemoveCar={handleRemoveCar} />
          </div>
          
          {selectedCars.length === 0 && !isLoadingAllCars && (
            <div className="text-center py-16 bg-secondary/20 rounded-lg">
              <h3 className="text-xl font-medium">No cars selected for comparison</h3>
              <p className="text-gray-400 mt-2 mb-6">Add cars to compare their specifications side by side</p>
              <Button onClick={() => navigate('/cars')}>Browse Cars</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CarComparison;
