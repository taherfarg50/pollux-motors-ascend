import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ComparisonTable from '@/components/ComparisonTable';
import CompareCarGrid from '@/components/CompareCarGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { ScrollIndicator } from '@/components/ui/scroll-indicator';
import { Car, useCars, useCar } from '@/lib/supabase';
import { ChevronLeft, PlusCircle, Share2, Info, XCircle, LayoutGrid, Table2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Category colors mapping
const categoryColors: Record<string, string> = {
  'SUV': 'bg-blue-500',
  'Sedan': 'bg-green-500',
  'Sports': 'bg-red-500',
  'Luxury': 'bg-purple-500',
  'Electric': 'bg-teal-500',
  'Compact': 'bg-orange-500',
  'Truck': 'bg-amber-500',
};

// Get category color or default
const getCategoryColor = (category: string) => {
  return categoryColors[category] || 'bg-gray-500';
};

const CarComparison = () => {
  const { data: allCars = [], isLoading: isLoadingAllCars } = useCars();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const comparisonRef = useRef<HTMLDivElement>(null);
  
  // Extract car IDs from URL query params using useMemo to avoid dependency issues
  const carIds = useMemo(() => {
    return searchParams.get('cars')?.split(',').map(Number).filter(Boolean) || [];
  }, [searchParams]);
  
  // State for selected cars and available cars
  const [selectedCars, setSelectedCars] = useState<Car[]>([]);
  const [availableForComparison, setAvailableForComparison] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [newCarId, setNewCarId] = useState<string>('');
  const [isLoadingCars, setIsLoadingCars] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showInfoTip, setShowInfoTip] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Extract unique categories
  const categories = ['all', ...new Set(allCars.map(car => car.category))];

  // Fetch data for each car ID
  useEffect(() => {
    if (carIds.length === 0) {
      setSelectedCars([]);
      return;
    }

    // Load cars in parallel
    const loadCars = async () => {
      setIsLoadingCars(true);
      try {
        const carsPromises = carIds.map(id => {
          return import('@/lib/supabase').then(module => {
            return module.fetchCarById(id).catch(error => {
              console.error(`Error loading car with ID ${id}:`, error);
              toast({
                title: `Error loading car #${id}`,
                description: "This car couldn't be loaded and will be skipped.",
                variant: "destructive",
              });
              return null; // Return null for failed car loads
            });
          });
        });
        
        const cars = await Promise.all(carsPromises);
        const validCars = cars.filter(Boolean) as Car[]; // Filter out null values
        
        // Update URL to remove any invalid car IDs
        if (validCars.length !== carIds.length) {
          const validIds = validCars.map(car => car.id);
          setSearchParams({ cars: validIds.join(',') });
        }
        
        setSelectedCars(validCars);
      } catch (error) {
        console.error("Error loading cars for comparison:", error);
        toast({
          title: "Error loading cars",
          description: "There was a problem loading the selected cars for comparison.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCars(false);
      }
    };

    loadCars();
  }, [carIds, toast, setSearchParams]);

  // Update available cars when all cars or selected cars change
  useEffect(() => {
    if (allCars.length > 0) {
      const selectedIds = new Set(selectedCars.map(car => car.id));
      const available = allCars.filter(car => !selectedIds.has(car.id));
      setAvailableForComparison(available);
      
      // Apply category filter
      filterCarsByCategory(available, categoryFilter);
    }
  }, [allCars, selectedCars, categoryFilter]);
  
  // Filter cars by category
  const filterCarsByCategory = (cars: Car[], category: string) => {
    if (category === 'all') {
      setFilteredCars(cars);
    } else {
      setFilteredCars(cars.filter(car => car.category === category));
    }
  };
  
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };

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
    if (!newCarId) {
      toast({
        title: "No car selected",
        description: "Please select a car to add to comparison",
        variant: "destructive"
      });
      return;
    }
    
    const carIdNumber = parseInt(newCarId);
    if (selectedCars.length >= 4) {
      toast({
        title: "Maximum cars reached",
        description: "You can compare up to 4 cars at once. Please remove a car before adding another.",
        variant: "destructive"
      });
      return;
    }
    
    if (carIds.includes(carIdNumber)) {
      toast({
        title: "Already in comparison",
        description: "This car is already in your comparison list.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedCarIds = [...carIds, carIdNumber];
    setSearchParams({ cars: updatedCarIds.join(',') });
    setNewCarId('');
    
    toast({
      title: "Car added to comparison",
      description: "The car has been added to your comparison list.",
    });
    
    // Auto scroll to comparison table
    setTimeout(() => {
      comparisonRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 300);
  };

  // Remove a car from comparison
  const handleRemoveCar = (carId: number) => {
    const updatedCars = selectedCars.filter(car => car.id !== carId);
    updateUrlParams(updatedCars);
    
    toast({
      title: "Car removed",
      description: "The car has been removed from your comparison list.",
    });
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
  
  // Handle dismiss info tip
  const handleDismissInfoTip = () => {
    setShowInfoTip(false);
    localStorage.setItem('comparison_info_dismissed', 'true');
  };
  
  // Check local storage for info tip on mount
  useEffect(() => {
    const dismissed = localStorage.getItem('comparison_info_dismissed');
    if (dismissed === 'true') {
      setShowInfoTip(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollIndicator />
      <main className="pt-24 pb-16 px-4">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
          
          <AnimatePresence>
            {showInfoTip && (
              <motion.div 
                className="glass-card p-4 mb-6 border-l-4 border-blue-500 flex items-start justify-between"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-sm mb-1">Quick Comparison Tips</h3>
                    <ul className="text-sm text-gray-300 list-disc ml-5 space-y-1">
                      <li>You can compare up to 4 vehicles at once</li>
                      <li>Filter by category to find similar cars</li>
                      <li>Share your comparison with others using the share button</li>
                    </ul>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDismissInfoTip}
                  className="mt-1 h-6 w-6"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div 
            className="glass-card p-6 mb-8 rounded-xl border border-gray-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="w-full md:w-64">
                <label htmlFor="category-select" className="block text-sm font-medium mb-1">
                  Filter by Category
                </label>
                <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                  <SelectTrigger id="category-select" className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : (
                          <div className="flex items-center">
                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getCategoryColor(category)}`}></span>
                            {category}
                          </div>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-64">
                <label htmlFor="car-select" className="block text-sm font-medium mb-1">
                  Select a Car to Compare
                </label>
                <Select value={newCarId} onValueChange={setNewCarId}>
                  <SelectTrigger id="car-select" className="w-full">
                    <SelectValue placeholder="Select a car" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCars.length > 0 ? (
                      <ScrollArea className="h-[300px]">
                        {filteredCars.map((car) => (
                          <SelectItem key={car.id} value={car.id.toString()} className="py-2">
                            <div className="flex flex-col">
                              <span>{car.name}</span>
                              <div className="flex items-center mt-1">
                                <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${getCategoryColor(car.category)}`}></span>
                                <span className="text-xs text-gray-400">{car.category}</span>
                                <span className="mx-1.5 text-gray-500">•</span>
                                <span className="text-xs text-gray-400">{car.year}</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    ) : (
                      <div className="p-2 text-center text-sm text-gray-400">
                        No cars available in this category
                      </div>
                    )}
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
                <div className="flex gap-2 ml-auto">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="ml-auto"
                          onClick={handleShareComparison}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy comparison link to share</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <div className="flex border border-gray-700 rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-none ${viewMode === 'grid' ? 'bg-pollux-blue/20' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-none ${viewMode === 'table' ? 'bg-pollux-blue/20' : ''}`}
                      onClick={() => setViewMode('table')}
                    >
                      <Table2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {selectedCars.length > 0 && (
              <div className="flex items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-white">{selectedCars.length}</span>
                  <span className="mx-1">/</span>
                  <span>4</span>
                  <span className="ml-1">cars selected</span>
                </div>
                
                <div className="ml-4 flex space-x-1">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-6 h-1.5 rounded-full transition-colors ${
                        i < selectedCars.length ? 'bg-pollux-red' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          
          <motion.div 
            ref={comparisonRef}
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {viewMode === 'grid' ? 'Compare Cars' : 'Comparison Table'}
              </h2>
              
              {selectedCars.length > 0 && (
                <div className="flex gap-1 overflow-x-auto hide-scrollbar">
                  {selectedCars.map((car) => (
                    <motion.div 
                      key={car.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center"
                    >
                      <Badge 
                        className={`${getCategoryColor(car.category)} bg-opacity-20 text-white border-0 px-2 py-0.5`}
                      >
                        {car.name}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="glass-card rounded-xl border border-gray-800 overflow-hidden p-4">
              <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                  <motion.div
                    key="grid-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CompareCarGrid cars={selectedCars} onRemoveCar={handleRemoveCar} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="table-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ComparisonTable cars={selectedCars} onRemoveCar={handleRemoveCar} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
          <AnimatePresence>
            {selectedCars.length === 0 && !isLoadingAllCars && (
              <motion.div 
                className="text-center py-16 bg-secondary/20 rounded-lg border border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-medium">No cars selected for comparison</h3>
                  <p className="text-gray-400 mt-2 mb-6">Add cars to compare their specifications side by side</p>
                  <Button 
                    onClick={() => navigate('/cars')}
                    className="bg-pollux-red hover:bg-red-700"
                  >
                    Browse Cars
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default CarComparison;
