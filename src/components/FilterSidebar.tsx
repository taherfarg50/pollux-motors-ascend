
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  features: string[];
  years: string[];
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  onApplyFilters,
  initialFilters 
}: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters?.priceRange || [50000, 200000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters?.categories || []);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialFilters?.features || []);
  const [selectedYears, setSelectedYears] = useState<string[]>(initialFilters?.years || []);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => 
      prev.includes(category) 
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) => 
      prev.includes(feature) 
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleYearToggle = (year: string) => {
    setSelectedYears((prev) => 
      prev.includes(year) 
        ? prev.filter((y) => y !== year)
        : [...prev, year]
    );
  };

  const handleClearAll = () => {
    setPriceRange([50000, 200000]);
    setSelectedCategories([]);
    setSelectedFeatures([]);
    setSelectedYears([]);
  };

  const handleApply = () => {
    onApplyFilters({
      priceRange,
      categories: selectedCategories,
      features: selectedFeatures,
      years: selectedYears
    });
    onClose();
  };

  const categories = ['Sedan', 'SUV', 'Sport', 'Electric', 'Hybrid'];
  const features = [
    'Leather Seats', 
    'Navigation System', 
    'Panoramic Roof', 
    'Driver Assistance', 
    'Premium Sound',
    'Heated Seats',
    'Carbon Fiber Package',
    'Autonomous Driving',
    'Performance Package'
  ];
  const years = ['2025', '2024', '2023', '2022', '2021'];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 w-80 max-w-full bg-background/95 backdrop-blur-xl border-l border-border z-50 transition-transform duration-300 ease-in-out overflow-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Filters</h3>
            <Button
              variant="ghost"
              size="icon" 
              onClick={onClose}
              className="rounded-full hover:bg-white/10"
              aria-label="Close filters"
            >
              <X size={20} />
            </Button>
          </div>
          
          {/* Price Range */}
          <div className="mb-8">
            <h4 className="text-sm font-medium mb-4">Price Range</h4>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">${priceRange[0].toLocaleString()}</span>
              <span className="text-sm font-medium">${priceRange[1].toLocaleString()}</span>
            </div>
            <Slider 
              defaultValue={[priceRange[1]]} 
              max={500000}
              min={50000} 
              step={10000}
              onValueChange={(value) => setPriceRange([priceRange[0], value[0]])}
              className="mb-6"
            />
            <Slider 
              defaultValue={[priceRange[0]]} 
              max={priceRange[1]}
              min={50000} 
              step={10000}
              onValueChange={(value) => setPriceRange([value[0], priceRange[1]])}
            />
          </div>
          
          {/* Categories */}
          <div className="mb-8">
            <h4 className="text-sm font-medium mb-4">Categories</h4>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Years */}
          <div className="mb-8">
            <h4 className="text-sm font-medium mb-4">Year</h4>
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <Button
                  key={year}
                  variant={selectedYears.includes(year) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleYearToggle(year)}
                  className={cn(
                    "rounded-full",
                    selectedYears.includes(year) && "bg-pollux-red hover:bg-red-700"
                  )}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Features */}
          <div className="mb-8">
            <h4 className="text-sm font-medium mb-4">Features</h4>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`feature-${feature}`}
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={`feature-${feature}`} className="text-sm cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4 mt-12">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
            <Button 
              className="flex-1 bg-pollux-red hover:bg-red-700"
              onClick={handleApply}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
