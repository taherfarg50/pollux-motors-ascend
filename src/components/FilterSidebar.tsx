
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar = ({ isOpen, onClose }: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState([50000, 200000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

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

  const handleClearAll = () => {
    setPriceRange([50000, 200000]);
    setSelectedCategories([]);
    setSelectedFeatures([]);
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-80 max-w-full bg-black/95 backdrop-blur-xl border-l border-border z-50 transition-transform duration-300 ease-in-out overflow-auto ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold">Filters</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            <span className="sr-only">Close</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" />
            </svg>
          </button>
        </div>
        
        {/* Price Range */}
        <div className="mb-8">
          <h4 className="text-sm font-medium mb-4">Price Range</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">${priceRange[0].toLocaleString()}</span>
            <span className="text-sm text-gray-400">${priceRange[1].toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="50000" 
            max="500000" 
            step="10000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
          />
        </div>
        
        {/* Categories */}
        <div className="mb-8">
          <h4 className="text-sm font-medium mb-4">Categories</h4>
          <div className="space-y-2">
            {['Sedan', 'SUV', 'Sport', 'Electric', 'Hybrid'].map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="w-4 h-4 accent-pollux-red"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Features */}
        <div className="mb-8">
          <h4 className="text-sm font-medium mb-4">Features</h4>
          <div className="space-y-2">
            {[
              'Leather Seats', 
              'Navigation System', 
              'Panoramic Roof', 
              'Driver Assistance', 
              'Premium Sound',
              'Heated Seats'
            ].map((feature) => (
              <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="w-4 h-4 accent-pollux-red"
                />
                <span>{feature}</span>
              </label>
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
            onClick={onClose}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
