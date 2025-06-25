import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  X, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Zap, 
  Fuel, 
  Users, 
  Shield,
  Star,
  BarChart3,
  Eye,
  Heart,
  Share2,
  Download
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Car, useCars } from '@/lib/supabase';
import OptimizedCarImage from '@/components/OptimizedCarImage';
import { log } from '@/utils/logger';

interface ComparisonMetric {
  label: string;
  key: string;
  unit?: string;
  icon: React.ReactNode;
  category: 'performance' | 'efficiency' | 'luxury' | 'safety';
  higher_is_better: boolean;
  format?: (value: any) => string;
}

interface CompareCarGridProps {
  selectedCars?: Car[];
  onSelectionChange?: (cars: Car[]) => void;
  maxComparisons?: number;
}

const CompareCarGrid: React.FC<CompareCarGridProps> = ({ 
  selectedCars = [], 
  onSelectionChange,
  maxComparisons = 4 
}) => {
  const [comparisonCars, setComparisonCars] = useState<Car[]>(selectedCars);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [highlightCategory, setHighlightCategory] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { data: allCars = [] } = useCars();

  // Comparison metrics
  const comparisonMetrics: ComparisonMetric[] = [
    {
      label: 'Top Speed',
      key: 'speed',
      unit: 'mph',
      icon: <Zap className="w-4 h-4" />,
      category: 'performance',
      higher_is_better: true,
      format: (value) => value ? `${value}` : 'N/A'
    },
    {
      label: 'Acceleration (0-60)',
      key: 'acceleration',
      unit: 'sec',
      icon: <TrendingUp className="w-4 h-4" />,
      category: 'performance',
      higher_is_better: false,
      format: (value) => value ? `${value}s` : 'N/A'
    },
    {
      label: 'Engine Power',
      key: 'power',
      unit: 'HP',
      icon: <Zap className="w-4 h-4" />,
      category: 'performance',
      higher_is_better: true,
      format: (value) => value ? `${value} HP` : 'N/A'
    },
    {
      label: 'Electric Range',
      key: 'range',
      unit: 'miles',
      icon: <Fuel className="w-4 h-4" />,
      category: 'efficiency',
      higher_is_better: true,
      format: (value) => value ? `${value} mi` : 'N/A'
    }
  ];

  const categories = [
    { id: 'performance', label: 'Performance', color: 'text-red-400', bgColor: 'bg-red-500/10' },
    { id: 'efficiency', label: 'Efficiency', color: 'text-green-400', bgColor: 'bg-green-500/10' },
    { id: 'luxury', label: 'Luxury', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { id: 'safety', label: 'Safety', color: 'text-blue-400', bgColor: 'bg-blue-500/10' }
  ];

  useEffect(() => {
    setComparisonCars(selectedCars);
  }, [selectedCars]);

  const addCar = (car: Car) => {
    if (comparisonCars.length < maxComparisons && !comparisonCars.some(c => c.id === car.id)) {
      const updated = [...comparisonCars, car];
      setComparisonCars(updated);
      onSelectionChange?.(updated);
      log.info('Car added to comparison', { carId: car.id, carName: car.name }, 'CompareCarGrid');
    }
  };

  const removeCar = (carId: number) => {
    const updated = comparisonCars.filter(car => car.id !== carId);
    setComparisonCars(updated);
    onSelectionChange?.(updated);
    log.info('Car removed from comparison', { carId }, 'CompareCarGrid');
  };

  const clearAll = () => {
    setComparisonCars([]);
    onSelectionChange?.([]);
  };

  const getMetricValue = (car: Car, metric: ComparisonMetric) => {
    return car.specs?.[metric.key as keyof typeof car.specs] || null;
  };

  const getBestPerformer = (metric: ComparisonMetric) => {
    if (comparisonCars.length === 0) return null;
    
    const values = comparisonCars.map(car => {
      const value = getMetricValue(car, metric);
      return { car, value: parseFloat(value?.toString().replace(/[^0-9.]/g, '') || '0') };
    }).filter(item => item.value > 0);

    if (values.length === 0) return null;

    const best = metric.higher_is_better 
      ? values.reduce((max, current) => current.value > max.value ? current : max)
      : values.reduce((min, current) => current.value < min.value ? current : min);
    
    return best.car.id;
  };

  const getScoreColor = (carId: number, metric: ComparisonMetric) => {
    const bestId = getBestPerformer(metric);
    if (bestId === carId) return 'text-green-400';
    return 'text-gray-300';
  };

  const shareComparison = async () => {
    const carNames = comparisonCars.map(car => car.name).join(' vs ');
    const url = `${window.location.origin}/compare?cars=${comparisonCars.map(c => c.id).join(',')}`;
    
    try {
      await navigator.share({
        title: `Car Comparison: ${carNames}`,
        text: `Compare ${carNames} - See detailed specifications and performance metrics`,
        url
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(url);
      log.info('Comparison shared', { carIds: comparisonCars.map(c => c.id) }, 'CompareCarGrid');
    }
  };

  const exportComparison = () => {
    const data = comparisonCars.map(car => ({
      name: car.name,
      price: car.price,
      year: car.year,
      category: car.category,
      ...comparisonMetrics.reduce((acc, metric) => ({
        ...acc,
        [metric.label]: getMetricValue(car, metric) || 'N/A'
      }), {})
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'car-comparison.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (comparisonCars.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="max-w-md mx-auto">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
          >
            <BarChart3 className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">Start Comparing Vehicles</h3>
          <p className="text-gray-400 mb-6">
            Select up to {maxComparisons} vehicles to see a detailed side-by-side comparison
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {allCars.slice(0, 4).map(car => (
              <motion.button
                key={car.id}
                onClick={() => addCar(car)}
                className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-sm font-medium truncate">{car.name}</div>
                <div className="text-xs text-gray-400">{car.price}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Vehicle Comparison</h2>
          <p className="text-gray-400">
            Comparing {comparisonCars.length} of {maxComparisons} vehicles
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Category filters */}
          <div className="flex gap-1">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setHighlightCategory(
                  highlightCategory === category.id ? null : category.id
                )}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  highlightCategory === category.id 
                    ? `${category.bgColor} ${category.color}` 
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Advanced toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Advanced</span>
            <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={shareComparison}>
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={exportComparison}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Comparison grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {comparisonCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-black/40 border-gray-700 backdrop-blur-md hover:border-purple-500/50 transition-all group relative">
                {/* Remove button */}
                <button
                  onClick={() => removeCar(car.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>

                {/* Car image */}
                <div className="relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                  <OptimizedCarImage
                    src={car.image}
                    alt={car.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-semibold text-white text-lg">{car.name}</h3>
                    <p className="text-blue-400 font-medium">{car.price}</p>
                  </div>
                </div>

                {/* Basic info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Year</span>
                    <span className="font-medium">{car.year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Category</span>
                    <Badge variant="outline" className="text-xs">
                      {car.category}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Metrics */}
                <div className="space-y-4">
                  {comparisonMetrics
                    .filter(metric => !highlightCategory || metric.category === highlightCategory)
                    .map((metric) => {
                      const value = getMetricValue(car, metric);
                      const isWinner = getBestPerformer(metric) === car.id;
                      
                      return (
                        <div key={metric.key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${
                                categories.find(c => c.id === metric.category)?.bgColor || 'bg-gray-700'
                              }`}>
                                {metric.icon}
                              </div>
                              <span className="text-sm text-gray-300">{metric.label}</span>
                              {isWinner && (
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              )}
                            </div>
                            <span className={`font-medium ${getScoreColor(car.id, metric)}`}>
                              {metric.format ? metric.format(value) : (value || 'N/A')}
                            </span>
                          </div>
                          
                          {showAdvanced && value && (
                            <div className="relative">
                              <Progress
                                value={
                                  Math.min(100, 
                                    (parseFloat(value.toString().replace(/[^0-9.]/g, '') || '0') / 300) * 100
                                  )
                                }
                                className="h-1"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>

                {showAdvanced && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Performance Score</h4>
                      <div className="flex items-center gap-2">
                        <Progress value={75} className="flex-1" />
                        <span className="text-sm font-medium">7.5/10</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 mt-6">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add more cars */}
        {comparisonCars.length < maxComparisons && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[400px]"
          >
            <Card className="h-full border-2 border-dashed border-gray-600 bg-transparent hover:border-blue-500 transition-colors cursor-pointer group">
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                  className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Plus className="w-8 h-8 text-blue-400" />
                </motion.div>
                <h3 className="font-medium mb-2">Add Another Vehicle</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Compare up to {maxComparisons} vehicles
                </p>
                <div className="space-y-2 w-full">
                  {allCars
                    .filter(car => !comparisonCars.some(c => c.id === car.id))
                    .slice(0, 3)
                    .map(car => (
                      <button
                        key={car.id}
                        onClick={() => addCar(car)}
                        className="w-full p-2 bg-gray-800/50 rounded hover:bg-gray-700/50 transition-colors text-left"
                      >
                        <div className="text-sm font-medium truncate">{car.name}</div>
                        <div className="text-xs text-gray-400">{car.price}</div>
                      </button>
                    ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Summary insights */}
      {showAdvanced && comparisonCars.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Comparison Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {comparisonMetrics.map(metric => {
                const winnerId = getBestPerformer(metric);
                const winner = comparisonCars.find(car => car.id === winnerId);
                
                if (!winner) return null;
                
                return (
                  <div key={metric.key} className="text-center">
                    <div className="text-sm text-gray-400 mb-1">{metric.label} Leader</div>
                    <div className="font-semibold text-white">{winner.name}</div>
                    <div className="text-sm text-blue-400">
                      {metric.format ? metric.format(getMetricValue(winner, metric)) : getMetricValue(winner, metric)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default CompareCarGrid; 