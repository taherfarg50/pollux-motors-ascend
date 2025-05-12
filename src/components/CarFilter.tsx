
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Car } from "@/lib/supabase";

interface FilterValues {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  year: string;
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
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  // Get unique categories and years from cars
  useEffect(() => {
    if (cars && cars.length) {
      const categories = Array.from(new Set(cars.map((car) => car.category)));
      const years = Array.from(new Set(cars.map((car) => car.year)));
      setAvailableCategories(categories);
      setAvailableYears(years.sort((a, b) => parseInt(b) - parseInt(a)));
    }
  }, [cars]);

  // Apply filters
  useEffect(() => {
    if (!cars) return;

    const filtered = cars.filter((car) => {
      // Search filter
      const searchMatch =
        filterValues.search === "" ||
        car.name.toLowerCase().includes(filterValues.search.toLowerCase()) ||
        (car.model?.toLowerCase().includes(filterValues.search.toLowerCase()) ?? false) ||
        car.category.toLowerCase().includes(filterValues.search.toLowerCase());

      // Category filter
      const categoryMatch =
        filterValues.category === "" || car.category === filterValues.category;

      // Price filter (convert string price to number)
      const carPrice = parseInt(car.price.replace(/[^0-9]/g, ""));
      const priceMatch =
        carPrice >= filterValues.minPrice && carPrice <= filterValues.maxPrice;

      // Year filter
      const yearMatch = filterValues.year === "" || car.year === filterValues.year;

      return searchMatch && categoryMatch && priceMatch && yearMatch;
    });

    onFilterChange(filtered);
  }, [filterValues, cars, onFilterChange]);

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    setFilterValues((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by name, model, or category..."
          className="pl-10 bg-secondary border-none"
          value={filterValues.search}
          onChange={(e) =>
            setFilterValues({ ...filterValues, search: e.target.value })
          }
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Category</h4>
                <Select
                  value={filterValues.category}
                  onValueChange={(value) =>
                    setFilterValues({ ...filterValues, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Year</h4>
                <Select
                  value={filterValues.year}
                  onValueChange={(value) =>
                    setFilterValues({ ...filterValues, year: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All years</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Price Range</h4>
                  <span className="text-sm text-muted-foreground">
                    ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={500000}
                  step={5000}
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                />
              </div>
              
              <Separator />
              
              <Button
                variant="outline"
                onClick={() => {
                  setFilterValues({
                    search: "",
                    category: "",
                    minPrice: 0,
                    maxPrice: 500000,
                    year: "",
                  });
                  setPriceRange([0, 500000]);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {filterValues.category && (
          <Button
            variant="secondary"
            size="sm"
            className="gap-1"
            onClick={() => setFilterValues({ ...filterValues, category: "" })}
          >
            {filterValues.category}
            <span className="text-xs">✕</span>
          </Button>
        )}

        {filterValues.year && (
          <Button
            variant="secondary"
            size="sm"
            className="gap-1"
            onClick={() => setFilterValues({ ...filterValues, year: "" })}
          >
            {filterValues.year}
            <span className="text-xs">✕</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CarFilter;
