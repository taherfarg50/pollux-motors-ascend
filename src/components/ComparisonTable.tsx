import { useEffect, useState, useMemo } from "react";
import { Car } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OptimizedCarImage from "@/components/OptimizedCarImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check, Minus, ArrowLeft, ArrowRight, ChevronDown, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  cars: Car[];
  onRemoveCar: (carId: number) => void;
}

// Utility function to determine if values differ
const valuesAreDifferent = (values: string[]): boolean => {
  if (values.length <= 1) return false;
  const firstValue = values[0];
  return values.some(value => value !== firstValue);
};

// Function to get a highlight class based on value comparison
const getHighlightClass = (values: string[], currentValue: string, type: 'higher' | 'lower' = 'higher'): string => {
  if (values.length <= 1) return '';
  
  // Clean values and convert to numbers where possible
  const numericValues = values.map(v => {
    const cleaned = v.replace(/[^\d.-]/g, '');
    return isNaN(Number(cleaned)) ? cleaned : Number(cleaned);
  });
  
  const currentNumeric = currentValue.replace(/[^\d.-]/g, '');
  const currentNum = isNaN(Number(currentNumeric)) ? currentNumeric : Number(currentNumeric);
  
  // If not all values are numbers, don't highlight
  if (numericValues.some(v => typeof v !== 'number') || typeof currentNum !== 'number') {
    return '';
  }

  // Check if this value is best (highest or lowest depending on type)
  const isBest = type === 'higher' 
    ? currentNum === Math.max(...numericValues as number[])
    : currentNum === Math.min(...numericValues as number[]);

  // For acceleration, lower is better
  if (isBest) {
    return 'text-green-400 font-semibold';
  }
  
  // Check if this value is worst
  const isWorst = type === 'higher'
    ? currentNum === Math.min(...numericValues as number[])
    : currentNum === Math.max(...numericValues as number[]);
    
  if (isWorst && numericValues.length > 2) {
    return 'text-red-400';
  }
  
  return '';
};

const ComparisonTable = ({ cars, onRemoveCar }: ComparisonTableProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Define property groups for tabs
  const tabs = [
    { id: 'all', label: 'All Specs' },
    { id: 'basic', label: 'Basic' },
    { id: 'performance', label: 'Performance' },
    { id: 'highlights', label: 'Highlights' },
  ];

  // Define which properties belong to which category
  const propertyGroups = {
    basic: ['name', 'price', 'category', 'year'],
    performance: ['speed', 'acceleration', 'power', 'range'],
    highlights: ['price', 'speed', 'acceleration', 'power'],
  };

  // Determine which rows to show based on active tab
  const getVisibleRows = (tab: string) => {
    if (tab === 'all') return ['image', 'price', 'category', 'year', 'speed', 'acceleration', 'power', 'range'];
    return propertyGroups[tab as keyof typeof propertyGroups] || [];
  };

  const visibleRows = getVisibleRows(activeTab);

  // Memoize difference detection to avoid recalculation on every render
  const differences = useMemo(() => {
    const result: Record<string, boolean> = {};

    // Check basic properties
    ['category', 'year'].forEach(prop => {
      const values = cars.map(car => car[prop as keyof Car] as string);
      result[prop] = valuesAreDifferent(values);
    });

    // Check specs properties
    ['speed', 'acceleration', 'power', 'range'].forEach(prop => {
      const values = cars.map(car => car.specs[prop as keyof typeof car.specs] as string);
      result[prop] = valuesAreDifferent(values);
    });

    // Price is special case
    const priceValues = cars.map(car => car.price);
    result.price = valuesAreDifferent(priceValues);

    return result;
  }, [cars]);

  useEffect(() => {
    const tableContainer = document.getElementById('comparison-table-container');
    if (tableContainer) {
      const handleScroll = () => {
        setHasScrolled(tableContainer.scrollLeft > 0);
      };
      
      tableContainer.addEventListener('scroll', handleScroll);
      return () => tableContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!cars.length) {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-medium">No cars selected for comparison</p>
        <p className="text-muted-foreground mt-2">
          Add cars to compare their specifications side by side
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Tab Navigation */}
      <div className="mb-4 md:mb-6 overflow-x-auto hide-scrollbar">
        <div className="flex space-x-1 border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors relative",
                activeTab === tab.id && "text-white"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-pollux-red"
                  layoutId="activeTab"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicators */}
      <div 
        id="comparison-table-container" 
        className="overflow-x-auto max-w-full pb-4"
      >
        <AnimatePresence>
          {hasScrolled && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-1/2 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 flex items-center justify-center"
            >
              <div className="bg-black/50 rounded-full h-8 w-8 flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Table className="w-full">
          <TableHeader className="bg-secondary/50 sticky top-0">
            <TableRow>
              <TableHead className="min-w-[160px] w-[160px]">
                <span className="font-semibold">Specifications</span>
              </TableHead>
              {cars.map((car) => (
                <TableHead key={car.id} className="min-w-[220px] w-[220px] bg-secondary/80">
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start justify-between"
                  >
                    <div>
                      <h3 className="font-medium text-base">{car.name}</h3>
                      <Badge variant="outline" className="mt-1 text-xs font-normal">
                        {car.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-6 w-6 hover:bg-red-500/20 hover:text-red-400 -mt-1 -mr-1"
                      onClick={() => onRemoveCar(car.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Image Row - always visible */}
            {(activeTab === 'all' || activeTab === 'basic') && (
              <TableRow className="border-b border-gray-800">
                <TableCell className="font-medium bg-secondary/20">Image</TableCell>
                {cars.map((car) => (
                  <TableCell key={`img-${car.id}`} className="p-2">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="h-32 sm:h-36 md:h-40 w-full rounded-md overflow-hidden"
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <OptimizedCarImage
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </motion.div>
                  </TableCell>
                ))}
              </TableRow>
            )}

            {/* Price Row */}
            {visibleRows.includes('price') && (
              <TableRow className={cn(
                "border-b border-gray-800",
                differences.price && activeTab === 'highlights' && "bg-secondary/10" 
              )}>
                <TableCell className="font-medium bg-secondary/20 flex items-center">
                  <span>Price</span>
                  {activeTab === 'highlights' && differences.price && (
                    <Badge variant="outline" className="ml-2 text-xs">Compare</Badge>
                  )}
                </TableCell>
                {cars.map((car) => {
                  const priceValues = cars.map(c => c.price);
                  const highlightClass = getHighlightClass(priceValues, car.price, 'lower');
                  
                  return (
                    <TableCell 
                      key={`price-${car.id}`} 
                      className={cn(
                        "text-lg font-medium transition-colors",
                        highlightClass
                      )}
                    >
                      {highlightClass.includes('text-green-400') && (
                        <Trophy className="w-4 h-4 inline-block mr-1 text-yellow-500" />
                      )}
                      {car.price}
                    </TableCell>
                  );
                })}
              </TableRow>
            )}

            {/* Category Row */}
            {visibleRows.includes('category') && (
              <TableRow className={differences.category ? "bg-secondary/10 border-b border-gray-800" : "border-b border-gray-800"}>
                <TableCell className="font-medium bg-secondary/20">Category</TableCell>
                {cars.map((car) => (
                  <TableCell key={`cat-${car.id}`}>
                    <Badge 
                      variant="secondary" 
                      className="font-normal"
                    >
                      {car.category}
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>
            )}

            {/* Year Row */}
            {visibleRows.includes('year') && (
              <TableRow className={differences.year ? "bg-secondary/10 border-b border-gray-800" : "border-b border-gray-800"}>
                <TableCell className="font-medium bg-secondary/20">Year</TableCell>
                {cars.map((car) => (
                  <TableCell key={`year-${car.id}`}>{car.year}</TableCell>
                ))}
              </TableRow>
            )}

            {/* Speed Row */}
            {visibleRows.includes('speed') && (
              <TableRow className={cn(
                "border-b border-gray-800", 
                differences.speed && activeTab === 'highlights' && "bg-secondary/10"
              )}>
                <TableCell className="font-medium bg-secondary/20 flex items-center">
                  <span>Top Speed</span>
                  {activeTab === 'highlights' && differences.speed && (
                    <Badge variant="outline" className="ml-2 text-xs">Compare</Badge>
                  )}
                </TableCell>
                {cars.map((car) => {
                  const speedValues = cars.map(c => c.specs.speed);
                  const highlightClass = getHighlightClass(speedValues, car.specs.speed, 'higher');
                  
                  return (
                    <TableCell 
                      key={`speed-${car.id}`}
                      className={cn(
                        "transition-colors", 
                        highlightClass
                      )}
                    >
                      {highlightClass.includes('text-green-400') && (
                        <Trophy className="w-4 h-4 inline-block mr-1 text-yellow-500" />
                      )}
                      {car.specs.speed}
                    </TableCell>
                  );
                })}
              </TableRow>
            )}

            {/* Acceleration Row */}
            {visibleRows.includes('acceleration') && (
              <TableRow className={cn(
                "border-b border-gray-800",
                differences.acceleration && activeTab === 'highlights' && "bg-secondary/10"
              )}>
                <TableCell className="font-medium bg-secondary/20 flex items-center">
                  <span>0-100 km/h</span>
                  {activeTab === 'highlights' && differences.acceleration && (
                    <Badge variant="outline" className="ml-2 text-xs">Compare</Badge>
                  )}
                </TableCell>
                {cars.map((car) => {
                  const accelerationValues = cars.map(c => c.specs.acceleration);
                  // For acceleration, lower is better
                  const highlightClass = getHighlightClass(accelerationValues, car.specs.acceleration, 'lower');
                  
                  return (
                    <TableCell 
                      key={`accel-${car.id}`}
                      className={cn(
                        "transition-colors", 
                        highlightClass
                      )}
                    >
                      {highlightClass.includes('text-green-400') && (
                        <Trophy className="w-4 h-4 inline-block mr-1 text-yellow-500" />
                      )}
                      {car.specs.acceleration}
                    </TableCell>
                  );
                })}
              </TableRow>
            )}

            {/* Power Row */}
            {visibleRows.includes('power') && (
              <TableRow className={cn(
                "border-b border-gray-800",
                differences.power && activeTab === 'highlights' && "bg-secondary/10"
              )}>
                <TableCell className="font-medium bg-secondary/20 flex items-center">
                  <span>Power</span>
                  {activeTab === 'highlights' && differences.power && (
                    <Badge variant="outline" className="ml-2 text-xs">Compare</Badge>
                  )}
                </TableCell>
                {cars.map((car) => {
                  const powerValues = cars.map(c => c.specs.power);
                  const highlightClass = getHighlightClass(powerValues, car.specs.power, 'higher');
                  
                  return (
                    <TableCell 
                      key={`power-${car.id}`}
                      className={cn(
                        "transition-colors", 
                        highlightClass
                      )}
                    >
                      {highlightClass.includes('text-green-400') && (
                        <Trophy className="w-4 h-4 inline-block mr-1 text-yellow-500" />
                      )}
                      {car.specs.power}
                    </TableCell>
                  );
                })}
              </TableRow>
            )}

            {/* Range Row */}
            {visibleRows.includes('range') && (
              <TableRow className={differences.range ? "bg-secondary/10" : ""}>
                <TableCell className="font-medium bg-secondary/20">Range</TableCell>
                {cars.map((car) => {
                  const rangeValues = cars.map(c => c.specs.range);
                  const highlightClass = getHighlightClass(rangeValues, car.specs.range, 'higher');
                  
                  return (
                    <TableCell 
                      key={`range-${car.id}`}
                      className={cn(
                        "transition-colors", 
                        highlightClass
                      )}
                    >
                      {highlightClass.includes('text-green-400') && (
                        <Trophy className="w-4 h-4 inline-block mr-1 text-yellow-500" />
                      )}
                      {car.specs.range}
                    </TableCell>
                  );
                })}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="absolute right-0 top-1/2 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10 flex items-center justify-center">
        {cars.length > 1 && (
          <div className="bg-black/50 rounded-full h-8 w-8 flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonTable;
