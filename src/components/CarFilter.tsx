import { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal, X, Check, ChevronDown, Car as CarIcon, PanelLeft, BadgeCheck, Fuel, Gauge } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Slider,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Car } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface FilterValues {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  year: string;
  onlyFeatured: boolean;  
  powerRange: [number, number];
  color: string;
  transmission: string;
  fuelType: string;
}

interface CarFilterProps {
  onFilterChange: (filteredCars: Car[]) => void;
  cars: Car[];
}

const CarFilter = ({ onFilterChange, cars }: CarFilterProps) => {
  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: "",
    category: "",
    minPrice: 0,
    maxPrice: 500000,
    year: "",
    onlyFeatured: false,
    powerRange: [0, 1000],
    color: "",
    transmission: "",
    fuelType: "",
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [powerRange, setPowerRange] = useState<[number, number]>([0, 1000]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  // Common transmission types
  const transmissionTypes = ["Automatic", "Manual", "Semi-Automatic", "CVT", "DCT"];
  
  // Common fuel types
  const fuelTypes = ["Gasoline", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];

  // Get unique categories, years, and colors from cars
  useEffect(() => {
    if (cars && cars.length) {
      const categories = Array.from(new Set(cars.map((car) => car.category)));
      const years = Array.from(new Set(cars.map((car) => car.year)));
      const colors = Array.from(new Set(cars.map((car) => car.color || "").filter(Boolean)));
      
      setAvailableCategories(categories);
      setAvailableYears(years.sort((a, b) => parseInt(b) - parseInt(a)));
      setAvailableColors(colors);
    }
  }, [cars]);

  // Apply filters when any filter value changes
  useEffect(() => {
    const filtered = cars.filter(car => {
      const matchesCategory = !filterValues.category || filterValues.category === "all" || car.category.toLowerCase().includes(filterValues.category.toLowerCase());
      const matchesYear = !filterValues.year || filterValues.year === "all" || car.year === filterValues.year;
      const matchesColor = !filterValues.color || filterValues.color === "all" || (car.color && car.color.toLowerCase() === filterValues.color.toLowerCase());
      const matchesTransmission = !filterValues.transmission || filterValues.transmission === "all";
      const matchesFuelType = !filterValues.fuelType || filterValues.fuelType === "all";
      const matchesSearch = !filterValues.search || 
          car.name.toLowerCase().includes(filterValues.search.toLowerCase()) ||
          car.category.toLowerCase().includes(filterValues.search.toLowerCase());

      const carPrice = parseInt(car.price.replace(/[^0-9]/g, ""));
      const matchesPrice = carPrice >= filterValues.minPrice && carPrice <= filterValues.maxPrice;
      
      const matchesFeatured = !filterValues.onlyFeatured || car.featured;

      return matchesCategory && matchesYear && matchesColor && matchesTransmission && matchesFuelType && matchesSearch && matchesPrice && matchesFeatured;
      });

      onFilterChange(filtered);
  }, [cars, filterValues, onFilterChange]);

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    setFilterValues((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }));
  };
  
  const handlePowerRangeChange = (value: [number, number]) => {
    setPowerRange(value);
    setFilterValues((prev) => ({
      ...prev,
      powerRange: value,
    }));
  };

  const filterItemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const activeFiltersCount = [
    filterValues.category !== "",
    filterValues.year !== "",
    filterValues.minPrice > 0 || filterValues.maxPrice < 500000,
    filterValues.onlyFeatured,
    filterValues.powerRange[0] > 0 || filterValues.powerRange[1] < 1000,
    filterValues.color !== "",
    filterValues.transmission !== "",
    filterValues.fuelType !== ""
  ].filter(Boolean).length;

  // Reset all filters
  const resetFilters = () => {
    setFilterValues({
      search: "",
      category: "",
      minPrice: 0,
      maxPrice: 500000,
      year: "",
      onlyFeatured: false,
      powerRange: [0, 1000],
      color: "",
      transmission: "",
      fuelType: "",
    });
    setPriceRange([0, 500000]);
    setPowerRange([0, 1000]);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pollux-blue" />
        <Input
          type="text"
          placeholder="Search by name, model, or category..."
          className="pl-10 glass-card border-pollux-glass-border focus:border-pollux-blue/30 transition-colors bg-transparent"
          value={filterValues.search}
          onChange={(e) =>
            setFilterValues({ ...filterValues, search: e.target.value })
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Popover open={isAdvancedFilterOpen} onOpenChange={setIsAdvancedFilterOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="gap-2 glass-card border-pollux-glass-border hover:bg-pollux-blue/10 hover:border-pollux-blue/30 transition-all relative group"
            >
              <SlidersHorizontal className="h-4 w-4 text-pollux-blue" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-pollux-blue text-white text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 glass-card border-pollux-glass-border p-5 backdrop-blur-md">
            <div className="grid gap-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filter Vehicles</h3>
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20"
                    onClick={resetFilters}
                  >
                    Reset All
                  </Button>
                )}
              </div>
              
              <Separator className="bg-white/10" />
              
              <div className="space-y-2">
                <h4 className="font-medium text-gradient-subtle">Category</h4>
                <Select
                  value={filterValues.category || "all"}
                  onValueChange={(value) =>
                    setFilterValues({ ...filterValues, category: value === "all" ? "" : value })
                  }
                >
                  <SelectTrigger className="glass-card border-pollux-glass-border hover:border-pollux-blue/30 transition-colors">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-pollux-glass-border backdrop-blur-md">
                    <SelectItem value="all">All categories</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gradient-subtle">Year</h4>
                <Select
                  value={filterValues.year || "all"}
                  onValueChange={(value) =>
                    setFilterValues({ ...filterValues, year: value === "all" ? "" : value })
                  }
                >
                  <SelectTrigger className="glass-card border-pollux-glass-border hover:border-pollux-blue/30 transition-colors">
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-pollux-glass-border backdrop-blur-md">
                    <SelectItem value="all">All years</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gradient-subtle">Price Range</h4>
                  <span className="text-sm bg-pollux-blue/10 px-2 py-1 rounded-md text-white">
                    ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={500000}
                  step={5000}
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  className="py-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gradient-subtle">Featured Vehicles</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured" 
                    checked={filterValues.onlyFeatured}
                    onCheckedChange={(checked) => 
                      setFilterValues({...filterValues, onlyFeatured: checked === true})
                    }
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show only featured vehicles
                  </label>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gradient-subtle">Power (HP)</h4>
                  <span className="text-sm bg-pollux-blue/10 px-2 py-1 rounded-md text-white">
                    {powerRange[0]} - {powerRange[1]} hp
                  </span>
                </div>
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={powerRange}
                  onValueChange={handlePowerRangeChange}
                  className="py-2"
                />
              </div>
              
              <Separator className="bg-white/10" />
              
              {/* New color filter */}
              <div className="space-y-2">
                <h4 className="font-medium text-gradient-subtle flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
                  Color
                </h4>
                <Select
                  value={filterValues.color || "all"}
                  onValueChange={(value) =>
                    setFilterValues({ ...filterValues, color: value === "all" ? "" : value })
                  }
                >
                  <SelectTrigger className="glass-card border-pollux-glass-border hover:border-pollux-blue/30 transition-colors">
                    <SelectValue placeholder="All colors" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-pollux-glass-border backdrop-blur-md">
                    <SelectItem value="all">All colors</SelectItem>
                    {availableColors.map((color) => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color.toLowerCase() }}></span>
                          {color}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* New transmission filter */}
              <div className="space-y-2">
                <h4 className="font-medium text-gradient-subtle flex items-center gap-2">
                  <Gauge className="h-3 w-3" />
                  Transmission
                </h4>
                <Select
                  value={filterValues.transmission || "all"}
                  onValueChange={(value) =>
                    setFilterValues({ ...filterValues, transmission: value === "all" ? "" : value })
                  }
                >
                  <SelectTrigger className="glass-card border-pollux-glass-border hover:border-pollux-blue/30 transition-colors">
                    <SelectValue placeholder="All transmissions" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-pollux-glass-border backdrop-blur-md">
                    <SelectItem value="all">All transmissions</SelectItem>
                    {transmissionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* New fuel type filter */}
              <div className="space-y-2">
                <h4 className="font-medium text-gradient-subtle flex items-center gap-2">
                  <Fuel className="h-3 w-3" />
                  Fuel Type
                </h4>
                <Select
                  value={filterValues.fuelType || "all"}
                  onValueChange={(value) =>
                    setFilterValues({ ...filterValues, fuelType: value === "all" ? "" : value })
                  }
              >
                  <SelectTrigger className="glass-card border-pollux-glass-border hover:border-pollux-blue/30 transition-colors">
                    <SelectValue placeholder="All fuel types" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-pollux-glass-border backdrop-blur-md">
                    <SelectItem value="all">All fuel types</SelectItem>
                    {fuelTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Active filters display */}
        <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {filterValues.category && (
            <motion.div
                variants={filterItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
                <Badge variant="outline" className="glass-card border-pollux-glass-border bg-pollux-blue/10 text-white">
                  Category: {filterValues.category}
                <X 
                    className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => setFilterValues({ ...filterValues, category: "" })}
                />
              </Badge>
            </motion.div>
          )}

          {filterValues.year && (
            <motion.div
                variants={filterItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
                <Badge variant="outline" className="glass-card border-pollux-glass-border bg-pollux-blue/10 text-white">
                  Year: {filterValues.year}
                <X 
                    className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => setFilterValues({ ...filterValues, year: "" })}
                />
              </Badge>
            </motion.div>
          )}

            {filterValues.onlyFeatured && (
            <motion.div
                variants={filterItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              >
                <Badge variant="outline" className="glass-card border-pollux-glass-border bg-pollux-blue/10 text-white">
                  Featured Only
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setFilterValues({ ...filterValues, onlyFeatured: false })}
                  />
                </Badge>
              </motion.div>
            )}
            
            {filterValues.color && (
              <motion.div
              variants={filterItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <Badge variant="outline" className="glass-card border-pollux-glass-border bg-pollux-blue/10 text-white">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: filterValues.color.toLowerCase() }}></span>
                    Color: {filterValues.color}
                  </span>
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setFilterValues({ ...filterValues, color: "" })}
                  />
                </Badge>
              </motion.div>
            )}
            
            {filterValues.transmission && (
              <motion.div
                variants={filterItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Badge variant="outline" className="glass-card border-pollux-glass-border bg-pollux-blue/10 text-white">
                  Transmission: {filterValues.transmission}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setFilterValues({ ...filterValues, transmission: "" })}
                />
              </Badge>
            </motion.div>
          )}
          
            {filterValues.fuelType && (
            <motion.div
                variants={filterItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
                <Badge variant="outline" className="glass-card border-pollux-glass-border bg-pollux-blue/10 text-white">
                  Fuel: {filterValues.fuelType}
                <X 
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setFilterValues({ ...filterValues, fuelType: "" })}
                />
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CarFilter;
